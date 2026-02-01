from groq import Groq # type: ignore
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("TOPIC_FINDER_QROQ_AI"))

def get_short_summary(text: str):
    prompt = f"""
    You are an expert lecturer and note-taker.
    Please provide a **concise summary** of the following lecture text,
    highlighting **key concepts, definitions, formulas, examples, and main points**.
    Keep it short and structured in bullet points or numbered list.

    Lecture Text:
    {text}
    """

    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,            # moderate creativity
        max_completion_tokens=1024, # enough for short summary
        top_p=1,
        reasoning_effort="medium",
        stream=True
    )

    summary = ""
    for chunk in completion:
        summary += chunk.choices[0].delta.content or ""

    return summary
