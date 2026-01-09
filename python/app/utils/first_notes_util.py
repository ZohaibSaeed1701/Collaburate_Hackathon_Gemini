from groq import Groq
import os

client = Groq(api_key=os.getenv("TOPIC_FINDER_QROQ_AI"))

def generate_final_lecture_notes(prof_summary: str, voice_summary: str) -> str:
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
    - Keep the notes SHORT, CONCISE, and EXAM-READY.
    - Do NOT add any content that is NOT present in the provided summaries.
    - Ensure formulas and technical terms are preserved accurately.

    Professor Notes Summary:
    {prof_summary}

    Teacher Voice Summary:
    {voice_summary}

    FINAL LECTURE NOTES:
    """

    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,           # keep hallucination low
        max_completion_tokens=2000, # enough for final notes
        top_p=1,
        reasoning_effort="medium",
        stream=False
    )

    return completion.choices[0].message.content.strip()
