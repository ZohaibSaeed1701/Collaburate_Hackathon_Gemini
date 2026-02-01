from groq import Groq # type: ignore
import os

client = Groq(api_key=os.getenv("TOPIC_FINDER_QROQ_AI"))

def llm_refine_text(raw_text: str) -> str:
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
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-maverick-17b-128e-instruct",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_completion_tokens=2048
    )
    return completion.choices[0].message.content
