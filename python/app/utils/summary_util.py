from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API"))

def get_short_summary(text: str):
    if not os.getenv("GEMINI_API"):
        raise ValueError("GEMINI_API is missing in environment.")
    prompt = f"""
    You are an expert lecturer and note-taker.
    Please provide a **detailed but structured summary** of the following lecture text,
    highlighting **key concepts, definitions, formulas, examples, and main points**.
    - Include important slide details (not just headlines).
    - Keep it structured in bullet points or numbered list.
    - Make it richer than a short outline while staying clear and exam-friendly.

    Lecture Text:
    {text}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text or ""
