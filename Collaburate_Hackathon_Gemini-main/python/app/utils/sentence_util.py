import re

def paragraph_to_sentences(paragraph: str):
    if not paragraph or not paragraph.strip():
        return []

    # Step 1: Normalize spaces and line breaks
    paragraph = re.sub(r'\s+', ' ', paragraph).strip()

    # Step 2: Split into sentences using '.', '!', '?' as delimiters
    raw_sentences = re.split(r'(?<=[.!?])\s+', paragraph)

    # Step 3 & 4: Clean each sentence, remove empty ones, and remove duplicates while keeping order
    seen = set()
    sentences = []
    for sent in raw_sentences:
        cleaned = sent.strip()
        if cleaned and cleaned not in seen:
            sentences.append(cleaned)
            seen.add(cleaned)

    return sentences
