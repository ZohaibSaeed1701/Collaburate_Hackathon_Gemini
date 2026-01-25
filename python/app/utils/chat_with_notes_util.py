from google import genai
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from PyPDF2 import PdfReader
import fitz
import os
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API"))

embed_model = SentenceTransformer("all-MiniLM-L6-v2")

def load_text(file_path: str) -> str:
    if file_path.endswith(".pdf"):
        text = ""
        # Try PyMuPDF first (better extraction)
        try:
            doc = fitz.open(file_path)
            for page in doc:
                page_text = page.get_text()
                if page_text:
                    text += page_text + "\n"
        except Exception:
            text = ""

        # Fallback to PyPDF2 if still empty
        if not text.strip():
            try:
                reader = PdfReader(file_path)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            except Exception:
                pass

        return text
    else:  # default to txt
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()

def process_and_answer(file_path: str, question: str) -> str:
    text = load_text(file_path) or ""
    if not text.strip():
        return (
            "No text content found in the uploaded file. "
            "If this is a scanned image PDF, please upload a text-based PDF or provide typed notes."
        )

    # Chunking
    chunks = []
    chunk_size = 500
    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])

    if not chunks:
        return "Could not create chunks from the file. Please try another file."

    # Embeddings
    try:
        embeddings = embed_model.encode(chunks)
        embeddings = np.array(embeddings).astype("float32")
    except Exception:
        return "Embedding failed for the provided file. Please try another file."

    # FAISS index
    if embeddings.ndim != 2 or embeddings.shape[0] == 0:
        return "No embeddings generated from the notes."

    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)

    # Question embedding
    q_embedding = embed_model.encode([question]).astype("float32")
    _, indices = index.search(q_embedding, min(3, len(chunks)))

    context = " ".join([chunks[i] for i in indices[0] if i < len(chunks)])

    prompt = f"""
You are a student assistant.
Answer strictly from the teacher notes.
Keep the answer short and clear.

Teacher Notes:
{context}

Question:
{question}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text
