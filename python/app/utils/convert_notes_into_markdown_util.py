# app/utils/markdown_notes_rag.py
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API"))

def convert_notes_to_markdown(detailed_notes: str) -> str:
    if not os.getenv("GEMINI_API"):
        raise ValueError("GEMINI_API is missing in environment.")
    """
    Agentic RAG to convert detailed lecture notes to Markdown format.
    - Formulas preserved
    - Definitions italicized
    - Key points and headings structured
    - Output ready for PDF generation
    """
    prompt = f"""
    You are an expert academic assistant.

    TASK:
    - Convert the following lecture notes to **Markdown format**
    - Use headings for main topics (e.g., ## Topic Name)
    - Use bullet points for main points
    - **Bold the main points**
    - Preserve all formulas accurately and format them for human readability
      (use LaTeX with $...$ for inline and $$...$$ for block equations when possible)
    - Italicize definitions wherever possible
    - Keep the notes concise, clear, and structured
    - Do NOT add any content that is not present in the provided notes

    Lecture Notes:
    {detailed_notes}

    Markdown Notes:
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    if not getattr(response, "text", None):
        return ""

    return response.text.strip()
