from .base_agent import create_agent

SYSTEM_PROMPT = """You are a document summarizer agent.
Given any type of document (legal, resume, invoice, policy, etc.), write a concise summary in 3-5 bullet points.
Keep the language simple and professional."""

def run(document_text: str) -> str:
    agent = create_agent("SummarizerAgent", SYSTEM_PROMPT)
    return agent.run(document_text)
