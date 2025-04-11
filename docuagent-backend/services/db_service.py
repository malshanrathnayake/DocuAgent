from azure.cosmos import CosmosClient
import os
from utils.load_env import load_env

load_env()


def get_container():
    client = CosmosClient(os.getenv("AZURE_COSMOS_URI"), os.getenv("AZURE_COSMOS_KEY"))
    db = client.get_database_client("DocuAgent")
    return db.get_container_client("Results")

def save_to_cosmos(data: dict):
    container = get_container()
    container.upsert_item(data)

def get_all_documents():
    """Retrieve all documents from Cosmos DB"""
    container = get_container()
    query = "SELECT * FROM c ORDER BY c._ts DESC"
    items = list(container.query_items(query=query, enable_cross_partition_query=True))
    return items

def get_document_by_id(document_id: str):
    """Retrieve a specific document by ID from Cosmos DB"""
    container = get_container()
    query = f"SELECT * FROM c WHERE c.id = '{document_id}'"
    items = list(container.query_items(query=query, enable_cross_partition_query=True))
    if items:
        return items[0]
    return None

def get_recent_documents(limit: int = 5):
    """Retrieve the most recent documents"""
    container = get_container()
    query = f"SELECT * FROM c ORDER BY c._ts DESC OFFSET 0 LIMIT {limit}"
    items = list(container.query_items(query=query, enable_cross_partition_query=True))
    return items
