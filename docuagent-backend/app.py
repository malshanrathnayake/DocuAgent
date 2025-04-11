import os
import uuid
from fastapi import FastAPI, File, UploadFile, HTTPException, Path, Query, Body
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from agents.azure_openai import summarizer_agent, metadata_agent, risk_checker_agent
#from agents.huggingface import summarizer_agent, metadata_agent, risk_checker_agent
from utils.document_parser import parse_document
from services.file_service import upload_to_blob, download_from_blob, get_blob_url
from services.db_service import save_to_cosmos, get_all_documents, get_document_by_id, get_recent_documents
from services.teams_notifier import send_teams_notification
from dotenv import load_dotenv
from datetime import datetime
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

app = FastAPI(title="DocuAgent API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Pydantic models for request validation
class RiskStatusUpdate(BaseModel):
    status: str
    
class SettingsUpdate(BaseModel):
    settings: Dict[str, Any]

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
        "blob_url": blob_url,
        "created_at": str(datetime.now())  # Add timestamp
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

@app.get("/documents/")
async def get_documents(limit: Optional[int] = Query(None)):
    """Get all documents or limited number of recent documents"""
    try:
        if limit:
            documents = get_recent_documents(limit)
        else:
            documents = get_all_documents()
        return documents
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve documents: {str(e)}")

@app.get("/documents/{document_id}")
async def get_document(document_id: str = Path(...)):
    """Get a specific document by ID"""
    try:
        document = get_document_by_id(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        return document
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve document: {str(e)}")

@app.get("/documents/download/{document_id}")
async def download_document(document_id: str = Path(...)):
    """Download a document from Azure Blob Storage"""
    try:
        # Get document metadata from Cosmos DB
        document = get_document_by_id(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Get filename from metadata
        filename = document["filename"]
        
        # Download file content from blob storage
        content = download_from_blob(filename)
        
        # Determine content type based on file extension
        content_type = "application/octet-stream"
        if filename.endswith(".pdf"):
            content_type = "application/pdf"
        elif filename.endswith((".doc", ".docx")):
            content_type = "application/msword"
        elif filename.endswith(".txt"):
            content_type = "text/plain"
        elif filename.endswith((".xls", ".xlsx")):
            content_type = "application/vnd.ms-excel"
        
        # Return file as streaming response
        return StreamingResponse(
            iter([content]), 
            media_type=content_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to download document: {str(e)}")

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str = Path(...)):
    """Delete a document from Cosmos DB and Blob Storage"""
    try:
        # Get document metadata from Cosmos DB
        document = get_document_by_id(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Get filename from metadata
        filename = document["filename"]
        
        # Delete from Cosmos DB
        container = get_container()
        container.delete_item(item=document_id, partition_key=document_id)
        
        # Delete from Blob Storage (would be implemented here)
        # In a real implementation, you would delete the file from Azure Blob storage
        
        return {"message": "Document deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete document: {str(e)}")

@app.get("/risks/")
async def get_risk_reports(limit: Optional[int] = Query(None)):
    """Get all risk reports or limited number of recent reports"""
    try:
        # Get documents from Cosmos DB
        if limit:
            documents = get_recent_documents(limit)
        else:
            documents = get_all_documents()
        
        # Filter documents with risks
        risky_documents = []
        for doc in documents:
            if doc.get("risks") and doc.get("risks") != "No issues found":
                # Extract risk details and transform to risk report format
                risk_report = {
                    "id": doc["id"],
                    "title": f"Risk report for {doc['filename']}",
                    "document": {
                        "id": doc["id"],
                        "name": doc["filename"],
                        "type": doc["metadata"].get("DocumentType", "Document")
                    },
                    "severity": "Medium",  # Default severity, could be determined by risk analysis
                    "detectedAt": doc.get("created_at", str(datetime.now())),
                    "status": "Open",  # Default status
                    "description": doc["risks"]
                }
                risky_documents.append(risk_report)
                
        return risky_documents
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve risk reports: {str(e)}")

@app.get("/risks/{risk_id}")
async def get_risk_report(risk_id: str = Path(...)):
    """Get a specific risk report by ID"""
    try:
        # In this implementation, risk ID is the same as document ID
        document = get_document_by_id(risk_id)
        if not document:
            raise HTTPException(status_code=404, detail="Risk report not found")
        
        if document.get("risks") == "No issues found":
            raise HTTPException(status_code=404, detail="No risks found for this document")
        
        # Transform to risk report format
        risk_report = {
            "id": document["id"],
            "title": f"Risk report for {document['filename']}",
            "document": {
                "id": document["id"],
                "name": document["filename"],
                "type": document["metadata"].get("DocumentType", "Document")
            },
            "severity": "Medium",  # Default severity
            "detectedAt": document.get("created_at", str(datetime.now())),
            "status": "Open",  # Default status
            "description": document["risks"]
        }
                
        return risk_report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve risk report: {str(e)}")

@app.patch("/risks/{risk_id}")
async def update_risk_status(risk_id: str = Path(...), update: RiskStatusUpdate = Body(...)):
    """Update risk report status"""
    try:
        # Get document from Cosmos DB
        document = get_document_by_id(risk_id)
        if not document:
            raise HTTPException(status_code=404, detail="Risk report not found")
        
        # In a real implementation, you would update the risk status in Cosmos DB
        # For now, we'll just return the updated risk report
        
        risk_report = {
            "id": document["id"],
            "title": f"Risk report for {document['filename']}",
            "document": {
                "id": document["id"],
                "name": document["filename"],
                "type": document["metadata"].get("DocumentType", "Document")
            },
            "severity": "Medium",
            "detectedAt": document.get("created_at", str(datetime.now())),
            "status": update.status,
            "description": document["risks"]
        }
                
        return risk_report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update risk status: {str(e)}")

@app.get("/stats/dashboard")
async def get_dashboard_stats():
    """Get statistics for the dashboard"""
    try:
        # Get all documents
        documents = get_all_documents()
        
        # Count documents with risks
        risky_documents = sum(1 for doc in documents if doc.get("risks") and doc.get("risks") != "No issues found")
        
        # For a real implementation, you would calculate actual processing time
        # This is just a placeholder
        
        return {
            "documentsProcessed": str(len(documents)),
            "riskyDocuments": str(risky_documents),
            "averageProcessingTime": "3.5 seconds"  # Placeholder value
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve dashboard stats: {str(e)}")

@app.get("/settings/")
async def get_settings():
    """Get application settings"""
    # Placeholder for actual settings retrieval
    return {
        "apiEndpoint": os.getenv("AZURE_OPENAI_ENDPOINT", ""),
        "notificationsEnabled": True,
        "riskThreshold": "Medium",
        "documentRetentionDays": 30
    }

@app.put("/settings/")
async def update_settings(settings: Dict[str, Any] = Body(...)):
    """Update application settings"""
    # Placeholder for actual settings update
    return {
        "apiEndpoint": settings.get("apiEndpoint", ""),
        "notificationsEnabled": settings.get("notificationsEnabled", True),
        "riskThreshold": settings.get("riskThreshold", "Medium"),
        "documentRetentionDays": settings.get("documentRetentionDays", 30)
    }

if __name__ == "__main__":
    import uvicorn
    from services.db_service import get_container
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)