import os
from openai import AzureOpenAI
from utils.load_env import load_env

load_env()

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

def create_agent(name: str, system_prompt: str):
    # Basic wrapper agent using OpenAI API directly
    class AzureOpenAIAgent:
        def run(self, input_text):
            response = client.chat.completions.create(
                model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": input_text}
                ]
            )
            return response.choices[0].message.content

    return AzureOpenAIAgent()
