import re

def run(document_text: str) -> dict:
    title_match = re.search(r"(Title|Subject|Heading):\s*(.*)", document_text, re.IGNORECASE)
    author_match = re.search(r"(Author|By):\s*(.*)", document_text, re.IGNORECASE)
    date_match = re.search(r"(Date|Dated):\s*(.*)", document_text, re.IGNORECASE)

    return {
        "Title": title_match.group(2).strip() if title_match else "Unknown",
        "Author": author_match.group(2).strip() if author_match else "Unknown",
        "Date": date_match.group(2).strip() if date_match else "Unknown",
        "Document Type": "Auto-detected",
        "Keywords": []
    }
