from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API"))

def generate_final_lecture_notes(prof_summary: str, voice_summary: str) -> str:
    if not os.getenv("GEMINI_API"):
        raise ValueError("GEMINI_API is missing in environment.")
    """
    Agentic RAG function to synthesize final lecture notes
    from professor notes summary and teacher voice summary.
    """

    # Prompt instructs LLM to merge, prioritize, and keep formulas
    prompt = f"""
    You are an expert academic assistant.

    TASK:
    - Generate FINAL lecture notes by combining the following two sources:
        1. Professor Notes Summary
        2. Teacher Voice Summary
    - Include all important concepts, definitions, formulas, and examples.
    - Avoid repetition.
    - Keep the notes concise but NOT too short; include key details from slides/lecture.
    - Do NOT add any content that is NOT present in the provided summaries.
    - Ensure formulas and technical terms are preserved accurately and written clearly
      (use readable math notation, avoid ambiguity).
    - Bold the main points and italicize definitions where appropriate.

    Professor Notes Summary:
    {prof_summary}

    Teacher Voice Summary:
    {voice_summary}

    FINAL LECTURE NOTES:
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    if not getattr(response, "text", None):
        return ""

    return response.text.strip()
