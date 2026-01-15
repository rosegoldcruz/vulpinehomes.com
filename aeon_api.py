# aeon_api.py
from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

app = FastAPI()

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
)

class Prompt(BaseModel):
    prompt: str

@app.post("/code")
def code(prompt: Prompt):
    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
        messages=[
            {"role": "system", "content": "You are an expert software engineer."},
            {"role": "user", "content": prompt.prompt}
        ],
        max_completion_tokens=2048,
    )
    return {"output": response.choices[0].message.content}
