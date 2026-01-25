# app/utils/professor_summary_util.py

from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API"))

def generate_professor_summary(extracted_text: str) -> str:
    if not os.getenv("GEMINI_API"):
        raise ValueError("GEMINI_API is missing in environment.")
    prompt = f"""
    You are an academic summarization agent.

    RULES:
    - Generate a SHORT and CLEAR summary
    - Use ONLY the provided extracted content
    - Do NOT add explanations, examples, or assumptions
    - The summary must reflect exactly what the professor taught

    Extracted Content:
    {extracted_text}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    if not getattr(response, "text", None):
        return ""

    return response.text.strip()
