# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Application

```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set ANTHROPIC_API_KEY (required) and N8N_WEBHOOK_URL (optional)

# Start the server (with auto-reload)
python main.py
# → http://localhost:8000
```

The app serves the chatbot UI at `/` and the API at `/api/*`.

## Architecture

Three Python modules plus a single-page frontend:

**`bid_extractor.py`** — All Claude API interaction lives here. `BidExtraction` is the central Pydantic model (30+ fields) that represents a fully parsed bid document. `BidExtractor` has three methods:
- `upload_document` — pushes file bytes to Claude's Files API (beta), returns a `file_id`
- `extract_bid_info` — calls `claude-opus-4-7` with `tool_choice` forced to `extract_bid_information`, which guarantees the response is parsed into `BidExtraction`. Uses adaptive thinking and the `files-api-2025-04-14` beta header.
- `chat_about_bid` — streaming generator; injects the full `BidExtraction` JSON into the system prompt so the model can answer questions about the loaded document.

**`document_generator.py`** — Pure python-docx logic. `generate_bid_document(bid: BidExtraction) -> bytes` renders a 12-section Word checklist and returns raw bytes (no file I/O). Uses direct OOXML manipulation (`OxmlElement`, `qn`) for table cell shading and paragraph borders because python-docx's high-level API doesn't expose those.

**`main.py`** — FastAPI app. Session state is an in-memory dict keyed by UUID; each session holds `bid_data: BidExtraction | None`, the uploaded `file_id`, and `conversation: list[dict]` (trimmed to last 40 messages). Key routes:
- `POST /api/upload` — receives `multipart/form-data`, delegates to `BidExtractor`, fires n8n webhook, returns `UploadResponse`
- `POST /api/chat` — returns `StreamingResponse` with `text/event-stream`; each SSE event is `data: {"text": "..."}`, terminated by `data: [DONE]`
- `GET /api/download/{session_id}` — calls `generate_bid_document` and streams the `.docx` bytes as an attachment
- `POST /webhook/n8n` — receives callbacks from n8n and appends them to the session conversation

**`static/index.html`** — Self-contained single-page app (no build step). Manages its own session lifecycle, consumes the SSE stream with `ReadableStream`, and renders a minimal Markdown subset inline.

## Key Design Decisions

- **Files API over base64**: documents are uploaded once and referenced by `file_id` rather than re-sent on every extraction call. The previous file is deleted when a new document is uploaded to the same session.
- **Forced tool use for extraction**: `tool_choice: {type: "tool", name: "extract_bid_information"}` guarantees structured output rather than free text, avoiding any parsing layer.
- **Bid data in system prompt for chat**: rather than re-uploading the file on every chat turn, the extracted `BidExtraction` JSON is serialized into the chat system prompt. This keeps chat calls cheap and fast.
- **In-memory sessions**: intentional for simplicity. For production, replace the `sessions` dict in `main.py` with Redis or a database.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key |
| `N8N_WEBHOOK_URL` | No | Full URL of the n8n webhook to trigger on document upload |
