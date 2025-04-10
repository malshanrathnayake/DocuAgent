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
