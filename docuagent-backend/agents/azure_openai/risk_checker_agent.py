from .base_agent import create_agent

SYSTEM_PROMPT = """You are a legal risk checker agent.
Given the full text of a document, identify any clauses or content that may pose legal, ethical, or data privacy risks.
Return a bullet point list of potential risks or a message saying 'No issues found'."""

def run(document_text: str) -> str:
    agent = create_agent("RiskCheckerAgent", SYSTEM_PROMPT)
    response = agent.run(document_text)
    return response or "No response from agent"
