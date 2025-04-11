import os
import tempfile
import fitz
from docx import Document
import pandas as pd

def parse_document(content: bytes, filename: str) -> str:
    filename = filename.lower()

    if filename.endswith(".pdf"):
        doc = fitz.open(stream=content, filetype="pdf")
        return "\n".join([page.get_text() for page in doc])

    elif filename.endswith(".docx"):
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
            tmp.write(content)
            path = tmp.name
        doc = Document(path)
        return "\n".join([p.text for p in doc.paragraphs])

    elif filename.endswith(".txt"):
        return content.decode("utf-8", errors="ignore")

    elif filename.endswith(".csv"):
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
            tmp.write(content)
            path = tmp.name
        df = pd.read_csv(path)
        return df.to_string(index=False)

    elif filename.endswith(".xlsx"):
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp:
            tmp.write(content)
            path = tmp.name
        df = pd.read_excel(path)
        return df.to_string(index=False)

    return "Unsupported file type."
