# app/utils/professor_summary_util.py

from groq import Groq
import os

client = Groq(api_key=os.getenv("TOPIC_FINDER_QROQ_AI"))

def generate_professor_summary(extracted_text: str) -> str:
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

    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_completion_tokens=800,
        top_p=1,
        reasoning_effort="medium",
        stream=False
    )

    return completion.choices[0].message.content.strip()
