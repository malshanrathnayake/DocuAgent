from .base_agent import create_agent
import json

SYSTEM_PROMPT = """You are a metadata extraction agent.
Given a document, extract relevant metadata fields such as:
- Title
- Author or Creator
- Date
- Document Type
- Keywords (if any)

Return output as a JSON dictionary."""

def run(document_text: str) -> dict:
    agent = create_agent("MetadataAgent", SYSTEM_PROMPT)
    response = agent.run(document_text)

    try:
        return json.loads(response)
    except Exception as e:
        return {"error": "Could not parse metadata output", "detail": str(e)}
