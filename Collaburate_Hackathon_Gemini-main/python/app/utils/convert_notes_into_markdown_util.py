# app/utils/markdown_notes_rag.py
import os
from groq import Groq # type: ignore

client = Groq(api_key=os.getenv("TOPIC_FINDER_QROQ_AI"))

def convert_notes_to_markdown(detailed_notes: str) -> str:
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
    - Preserve all formulas accurately
    - Italicize definitions wherever possible
    - Keep the notes concise, clear, and structured
    - Do NOT add any content that is not present in the provided notes

    Lecture Notes:
    {detailed_notes}

    Markdown Notes:
    """

    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,           # minimize hallucinations
        max_completion_tokens=3000, # enough for detailed markdown notes
        top_p=1,
        reasoning_effort="medium",
        stream=False
    )

    return completion.choices[0].message.content.strip()
