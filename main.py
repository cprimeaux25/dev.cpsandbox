"""Bid Management Agent — FastAPI backend with chatbot and n8n webhook integration."""

import json
import os
import uuid
from datetime import datetime
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from bid_extractor import BidExtraction, BidExtractor
from document_generator import generate_bid_document

load_dotenv()

app = FastAPI(title="Bid Management Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory session store (replace with Redis/DB for production) ────────────
sessions: dict[str, dict] = {}
extractor = BidExtractor()

SUPPORTED_MEDIA_TYPES = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".doc": "application/msword",
    ".txt": "text/plain",
}

N8N_WEBHOOK_URL = os.environ.get("N8N_WEBHOOK_URL", "")


# ── Request / Response Models ─────────────────────────────────────────────────

class ChatMessage(BaseModel):
    session_id: str
    message: str


class SessionResponse(BaseModel):
    session_id: str
    message: str


class UploadResponse(BaseModel):
    session_id: str
    filename: str
    status: str
    bid_title: Optional[str] = None
    due_date: Optional[str] = None
    due_time: Optional[str] = None
    message: str


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_or_create_session(session_id: Optional[str] = None) -> tuple[str, dict]:
    if session_id and session_id in sessions:
        return session_id, sessions[session_id]
    new_id = str(uuid.uuid4())
    sessions[new_id] = {
        "created_at": datetime.utcnow().isoformat(),
        "bid_data": None,
        "file_id": None,
        "filename": None,
        "conversation": [],
    }
    return new_id, sessions[new_id]


async def trigger_n8n_webhook(payload: dict) -> bool:
    """Trigger n8n workflow webhook with bid event data."""
    if not N8N_WEBHOOK_URL:
        return False
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(N8N_WEBHOOK_URL, json=payload)
            return resp.status_code < 400
    except Exception:
        return False


def _media_type_for(filename: str) -> str:
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return SUPPORTED_MEDIA_TYPES.get(ext, "application/octet-stream")


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
async def index():
    from fastapi.responses import FileResponse
    return FileResponse("static/index.html")


@app.post("/api/session", response_model=SessionResponse)
async def create_session():
    """Create a new chat session."""
    session_id, _ = get_or_create_session()
    return SessionResponse(
        session_id=session_id,
        message="New bid management session started. Upload an RFP or bid document to begin analysis.",
    )


@app.post("/api/upload", response_model=UploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    session_id: str = Form(default=""),
):
    """Upload a bid/RFP document, extract info, and trigger n8n workflow."""
    filename = file.filename or "document"
    ext = ("." + filename.rsplit(".", 1)[-1].lower()) if "." in filename else ""
    if ext not in SUPPORTED_MEDIA_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Supported: {', '.join(SUPPORTED_MEDIA_TYPES)}",
        )

    session_id, session = get_or_create_session(session_id or None)
    content = await file.read()
    media_type = _media_type_for(filename)

    # Clean up previous file if any
    if session.get("file_id"):
        extractor.delete_document(session["file_id"])

    try:
        # Upload to Claude Files API
        file_id = extractor.upload_document(content, filename, media_type)
        session["file_id"] = file_id
        session["filename"] = filename

        # Extract bid information
        bid_data: BidExtraction = extractor.extract_bid_info(file_id, filename)
        session["bid_data"] = bid_data

        # Add a system message to conversation history
        session["conversation"].append({
            "role": "user",
            "content": f"I've uploaded a bid document: {filename}",
        })
        session["conversation"].append({
            "role": "assistant",
            "content": (
                f"I've analyzed '{filename}' and extracted the bid information. "
                f"The RFP title is: **{bid_data.rfp_title}**. "
                f"Due date: {bid_data.due_date or 'not specified'}"
                + (f" at {bid_data.due_time}" if bid_data.due_time else "")
                + ". Ask me anything about the submission requirements, or download the Word document checklist."
            ),
        })

        # Trigger n8n webhook asynchronously
        await trigger_n8n_webhook({
            "event": "bid_document_uploaded",
            "session_id": session_id,
            "filename": filename,
            "timestamp": datetime.utcnow().isoformat(),
            "bid_title": bid_data.rfp_title,
            "bid_number": bid_data.bid_number,
            "due_date": bid_data.due_date,
            "due_time": bid_data.due_time,
            "engineer_name": bid_data.engineer_name,
            "owner_agency": bid_data.owner_agency,
            "forms_count": len(bid_data.forms_required),
            "has_water_meters": len(bid_data.water_meter_specs) > 0,
        })

        return UploadResponse(
            session_id=session_id,
            filename=filename,
            status="success",
            bid_title=bid_data.rfp_title,
            due_date=bid_data.due_date,
            due_time=bid_data.due_time,
            message=f"Document analyzed successfully. Found {len(bid_data.forms_required)} required forms and {len(bid_data.water_meter_specs)} water meter specification(s).",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")


@app.post("/api/chat")
async def chat(body: ChatMessage):
    """Stream a chat response about the current bid document."""
    session_id = body.session_id
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found. Please start a new session.")

    session = sessions[session_id]
    bid_data: Optional[BidExtraction] = session.get("bid_data")

    def generate():
        full_response = ""
        for chunk in extractor.chat_about_bid(
            message=body.message,
            bid_data=bid_data,
            conversation_history=session["conversation"],
        ):
            full_response += chunk
            yield f"data: {json.dumps({'text': chunk})}\n\n"

        # Persist conversation turn
        session["conversation"].append({"role": "user", "content": body.message})
        session["conversation"].append({"role": "assistant", "content": full_response})

        # Keep conversation history manageable (last 20 turns)
        if len(session["conversation"]) > 40:
            session["conversation"] = session["conversation"][-40:]

        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.get("/api/download/{session_id}")
async def download_document(session_id: str):
    """Generate and download the bid checklist Word document."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found.")

    session = sessions[session_id]
    bid_data: Optional[BidExtraction] = session.get("bid_data")
    if not bid_data:
        raise HTTPException(status_code=400, detail="No bid document has been analyzed in this session.")

    try:
        doc_bytes = generate_bid_document(bid_data)
        safe_title = "".join(c if c.isalnum() or c in " -_" else "_" for c in bid_data.rfp_title)
        filename = f"Bid_Checklist_{safe_title[:50]}_{datetime.now().strftime('%Y%m%d')}.docx"

        return Response(
            content=doc_bytes,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate document: {str(e)}")


@app.get("/api/bid-data/{session_id}")
async def get_bid_data(session_id: str):
    """Return the extracted bid data as JSON."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found.")
    bid_data = sessions[session_id].get("bid_data")
    if not bid_data:
        raise HTTPException(status_code=400, detail="No bid data available.")
    return bid_data.model_dump()


@app.post("/webhook/n8n")
async def n8n_incoming_webhook(payload: dict):
    """Receive callbacks or triggers from n8n workflows."""
    event = payload.get("event", "unknown")
    session_id = payload.get("session_id")

    if session_id and session_id in sessions:
        session = sessions[session_id]
        session["conversation"].append({
            "role": "assistant",
            "content": f"[n8n workflow update] Event received: {event}",
        })

    return {"status": "received", "event": event}


@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


# ── Static files (after all routes) ──────────────────────────────────────────
app.mount("/static", StaticFiles(directory="static"), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
