import os
import uuid
from fastapi import FastAPI, File, UploadFile
from agents.azure_openai import summarizer_agent, metadata_agent, risk_checker_agent
#from agents.huggingface import summarizer_agent, metadata_agent, risk_checker_agent
from utils.document_parser import parse_document
from services.file_service import upload_to_blob
from services.db_service import save_to_cosmos
from services.teams_notifier import send_teams_notification
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

app = FastAPI()

@app.post("/process-document/")
async def process_document(file: UploadFile = File(...)):
    # Read file once
    content = await file.read()

    # Upload to Blob (using bytes)
    blob_url = upload_to_blob(file.filename, content)

    # Parse document text
    doc_text = parse_document(content, file.filename)

    # Run agents
    summary = summarizer_agent.run(doc_text)
    metadata = metadata_agent.run(doc_text)
    risks = risk_checker_agent.run(doc_text)

    # Store in Cosmos DB
    result = {
        "id": str(uuid.uuid4()),  # Unique Cosmos DB ID
        "filename": file.filename,
        "summary": summary,
        "metadata": metadata,
        "risks": risks,
        "blob_url": blob_url
    }
    save_to_cosmos(result)

    # Send Teams notification
    send_teams_notification(
        title=file.filename,
        summary=summary,
        metadata=metadata,
        risks=risks,
        blob_url=blob_url
    )

    return {"message": "Document processed", "data": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)