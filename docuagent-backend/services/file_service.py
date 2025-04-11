from azure.storage.blob import BlobServiceClient
import os
from utils.load_env import load_env

load_env()


def upload_to_blob(filename: str, content: bytes):
    connection_string = os.getenv("AZURE_BLOB_CONN")
    if not connection_string:
        raise ValueError("AZURE_BLOB_CONN not loaded. Check .env and path.")
    
    blob_service = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service.get_container_client("documents")
    blob_client = container_client.get_blob_client(filename)
    blob_client.upload_blob(content, overwrite=True)
    return blob_client.url

def get_blob_url(filename: str):
    """Generate a URL for accessing a blob without downloading it"""
    connection_string = os.getenv("AZURE_BLOB_CONN")
    if not connection_string:
        raise ValueError("AZURE_BLOB_CONN not loaded. Check .env and path.")
    
    blob_service = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service.get_container_client("documents")
    blob_client = container_client.get_blob_client(filename)
    return blob_client.url

def download_from_blob(filename: str):
    """Download a file from Azure Blob Storage"""
    connection_string = os.getenv("AZURE_BLOB_CONN")
    if not connection_string:
        raise ValueError("AZURE_BLOB_CONN not loaded. Check .env and path.")
    
    blob_service = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service.get_container_client("documents")
    blob_client = container_client.get_blob_client(filename)
    
    download_stream = blob_client.download_blob()
    return download_stream.readall()
