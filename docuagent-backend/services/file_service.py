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
