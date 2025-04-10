from docx import Document
import tempfile

def parse_document(content: bytes, filename: str) -> str:
    if filename.endswith(".pdf"):
        import fitz
        doc = fitz.open(stream=content, filetype="pdf")
        return "".join([page.get_text() for page in doc])
    elif filename.endswith(".docx"):
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
            tmp.write(content)
            path = tmp.name
        doc = Document(path)
        return "\n".join([p.text for p in doc.paragraphs])
    return ""
