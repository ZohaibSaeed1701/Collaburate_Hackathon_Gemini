from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API"))

def llm_refine_text(raw_text: str) -> str:
    if not os.getenv("GEMINI_API"):
        raise ValueError("GEMINI_API is missing in environment.")
    prompt = f"""
You are an OCR + academic content extraction engine.
Preserve all formulas, equations, symbols, variables, and definitions exactly as they appear.
Do not summarize.
Do not remove anything.
Do not add any information from your knowledge base.
Just clean layout noise and return structured readable text.

TEXT:
{raw_text}
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text or ""
