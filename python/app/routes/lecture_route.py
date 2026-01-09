from fastapi import APIRouter, UploadFile, File, Form
import shutil
import json
from app.utils.sentence_util import paragraph_to_sentences
from app.utils.summary_util import get_short_summary
from app.utils.file_loader_util import load_pdf, load_ppt
from app.utils.professor_summary_util import generate_professor_summary
from app.utils.refine_text_util import llm_refine_text
from app.utils.first_notes_util import generate_final_lecture_notes
from app.utils.convert_notes_into_markdown_util import convert_notes_to_markdown

router = APIRouter()

@router.post("/clean")
def clean_lecture_text(text: str = Form(...), file: UploadFile = File(...)):
    """
    Endpoint to process lecture text + uploaded PDF/PPT,
    clean it, summarize, refine, and return final lecture notes in markdown.
    """

    # Agar text JSON format me hai, parse karo; agar nahi, directly use karo
    try:
        data = json.loads(text)
        lecture_text = data.get("text", "")
    except json.JSONDecodeError:
        lecture_text = text

    # Temporary file save karna
    path = f"temp_{file.filename}"
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # File type ke hisaab se text extract karna
    if file.filename.endswith(".pdf"):
        raw_text = load_pdf(path)
    elif file.filename.endswith(".pptx"):
        raw_text = load_ppt(path)
    else:
        return {"error": "Unsupported file type"}

    # Paragraphs ko sentences me convert karna
    clean_data = paragraph_to_sentences(lecture_text)

    # Summary generate karna
    text_for_summary = " ".join(clean_data)
    summary_from_qroq = get_short_summary(text_for_summary)

    # LLM se refined text
    refined_text = llm_refine_text(raw_text)

    # Professor style lecture notes generate karna
    lecture_notes = generate_professor_summary(refined_text)

    # Final lecture notes prepare karna
    lecture_prepared = generate_final_lecture_notes(lecture_notes, summary_from_qroq)

    # Markdown me convert karna
    final_answer = convert_notes_to_markdown(lecture_prepared)

    return {"status": 200, "message": final_answer}
