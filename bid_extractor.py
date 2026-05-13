"""Bid/RFP document analysis and structured extraction using Claude API."""

import os
from typing import Optional
import anthropic
from pydantic import BaseModel, Field


class SubmissionItem(BaseModel):
    category: str
    description: str
    required: bool = True
    notes: Optional[str] = None


class WaterMeterSpec(BaseModel):
    size: str
    quantity: Optional[str] = None
    notes: Optional[str] = None


class BidExtraction(BaseModel):
    rfp_title: str = Field(description="Full title of the RFP or bid document")
    bid_number: Optional[str] = Field(default=None, description="Bid or RFP number/identifier")
    due_date: Optional[str] = Field(default=None, description="Bid submission due date")
    due_time: Optional[str] = Field(default=None, description="Bid submission due time with timezone")
    due_date_notes: Optional[str] = Field(default=None, description="Additional notes about submission deadline")
    engineer_name: Optional[str] = Field(default=None, description="Engineer of record or project engineer name")
    engineer_firm: Optional[str] = Field(default=None, description="Engineering firm name")
    owner_agency: Optional[str] = Field(default=None, description="Owner or issuing agency name")
    project_location: Optional[str] = Field(default=None, description="Project location or address")
    scope_of_work: Optional[str] = Field(default=None, description="Full scope of work description")
    project_timeline: Optional[str] = Field(default=None, description="Project timeline, schedule, or completion dates")
    forms_required: list[str] = Field(default_factory=list, description="Required forms for submission")
    licenses_required: list[str] = Field(default_factory=list, description="Required licenses or certifications")
    references_required: Optional[str] = Field(default=None, description="Reference requirements (number, type)")
    bonding_requirements: Optional[str] = Field(default=None, description="Bonding requirements (bid bond, performance bond, payment bond)")
    notary_requirements: list[str] = Field(default_factory=list, description="Documents requiring notarization")
    qualifications: list[str] = Field(default_factory=list, description="Qualification requirements for bidders")
    technical_information: list[str] = Field(default_factory=list, description="Technical specifications or information required")
    approved_products: list[str] = Field(default_factory=list, description="Approved products, manufacturers, or equals")
    equipment_specifications: list[str] = Field(default_factory=list, description="Equipment or product specifications")
    water_meter_specs: list[WaterMeterSpec] = Field(default_factory=list, description="Water meter sizes and quantities")
    additional_submission_items: list[SubmissionItem] = Field(default_factory=list, description="All other required submission items")
    insurance_requirements: Optional[str] = Field(default=None, description="Insurance requirements and limits")
    prevailing_wage: Optional[bool] = Field(default=None, description="Whether prevailing wage applies")
    minority_requirements: Optional[str] = Field(default=None, description="DBE/MBE/WBE or other minority participation requirements")
    pre_bid_meeting: Optional[str] = Field(default=None, description="Pre-bid meeting details if applicable")
    questions_deadline: Optional[str] = Field(default=None, description="Deadline for submitting questions")
    submission_method: Optional[str] = Field(default=None, description="How bids must be submitted (electronic, physical, etc.)")
    submission_address: Optional[str] = Field(default=None, description="Where to submit bids")
    number_of_copies: Optional[str] = Field(default=None, description="Number of copies required")
    estimated_cost: Optional[str] = Field(default=None, description="Engineer's estimate or project cost range")
    liquidated_damages: Optional[str] = Field(default=None, description="Liquidated damages provisions")
    special_requirements: list[str] = Field(default_factory=list, description="Any other special requirements or conditions")


EXTRACTION_SYSTEM_PROMPT = """You are an expert bid/RFP analyst specializing in construction and public works procurement documents.
Your task is to thoroughly analyze bid documents and extract ALL required submission information with precision and completeness.

Key guidelines:
- Extract every form, document, and item explicitly required for submission
- Note exact deadlines, times, and timezone information
- Capture all technical specifications and approved products
- Identify water meter sizes and quantities precisely
- List all bonding, insurance, and notary requirements
- Extract all qualification and experience requirements
- Note any DBE/MBE/WBE requirements
- Capture pre-bid meeting details
- Be thorough — missing a required submission item could disqualify a bid

Return structured JSON matching the BidExtraction schema exactly."""


class BidExtractor:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    def upload_document(self, file_content: bytes, filename: str, media_type: str) -> str:
        """Upload a document to the Files API and return the file_id."""
        response = self.client.beta.files.upload(
            file=(filename, file_content, media_type),
        )
        return response.id

    def delete_document(self, file_id: str) -> None:
        """Delete a file from the Files API."""
        try:
            self.client.beta.files.delete(file_id)
        except Exception:
            pass

    def extract_bid_info(self, file_id: str, filename: str) -> BidExtraction:
        """Extract bid information from an uploaded document using structured output."""
        response = self.client.messages.create(
            model="claude-opus-4-7",
            max_tokens=8000,
            thinking={"type": "adaptive"},
            system=EXTRACTION_SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"Please analyze this bid/RFP document ({filename}) and extract all required submission information. Be thorough and capture every item needed for a complete and compliant bid submission."
                        },
                        {
                            "type": "document",
                            "source": {
                                "type": "file",
                                "file_id": file_id,
                            },
                        },
                    ],
                }
            ],
            tools=[
                {
                    "name": "extract_bid_information",
                    "description": "Extract all bid/RFP information into structured format",
                    "input_schema": BidExtraction.model_json_schema(),
                }
            ],
            tool_choice={"type": "tool", "name": "extract_bid_information"},
            betas=["files-api-2025-04-14"],
        )

        for block in response.content:
            if block.type == "tool_use" and block.name == "extract_bid_information":
                return BidExtraction.model_validate(block.input)

        raise ValueError("Failed to extract bid information from document")

    def chat_about_bid(
        self,
        message: str,
        bid_data: Optional[BidExtraction],
        conversation_history: list[dict],
    ) -> str:
        """Generate a streaming chat response about bid information."""
        system = """You are a helpful bid management assistant. You help contractors understand RFP and bid documents,
answer questions about submission requirements, deadlines, and specifications.
Be precise with deadlines, requirements, and technical details.
If bid data has been extracted, use it to provide accurate answers."""

        if bid_data:
            system += f"\n\nCurrently loaded bid data:\n{bid_data.model_dump_json(indent=2)}"

        messages = conversation_history + [{"role": "user", "content": message}]

        response_text = ""
        with self.client.messages.stream(
            model="claude-opus-4-7",
            max_tokens=4096,
            thinking={"type": "adaptive"},
            system=system,
            messages=messages,
        ) as stream:
            for text in stream.text_stream:
                response_text += text
                yield text

        return response_text
