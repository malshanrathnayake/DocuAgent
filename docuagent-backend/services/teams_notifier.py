import os
import requests
import json
from utils.load_env import load_env

load_env()


def send_teams_notification(title: str, summary: str, metadata: dict, risks: str, blob_url: str):
    webhook_url = os.getenv("TEAMS_WEBHOOK_URL")
    if not webhook_url:
        print("TEAMS_WEBHOOK_URL not found in environment")
        return

    metadata_str = "\n".join([f"**{k}**: {v}" for k, v in metadata.items()])

    payload = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "summary": "DocuAgent Document Summary",
        "themeColor": "0076D7",
        "title": title,
        "sections": [{
            "activityTitle": f"[View Document]({blob_url})",
            "facts": [
                {"name": "Summary", "value": summary},
                {"name": "Metadata", "value": metadata_str},
                {"name": "Risk Flags", "value": risks or "None detected"}
            ],
            "markdown": True
        }]
    }

    headers = {"Content-Type": "application/json"}
    requests.post(webhook_url, headers=headers, data=json.dumps(payload))
