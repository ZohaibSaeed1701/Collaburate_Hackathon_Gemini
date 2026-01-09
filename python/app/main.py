from fastapi import FastAPI
from app.routes.lecture_route import router as lecture_routes

app = FastAPI(
    title="Lecture Notes API",
    description="API for cleaning and processing lecture notes, ready for RAG",
    version="1.0.0"
)

app.include_router(lecture_routes, prefix="/lecture")

@app.get("/")
def root():
    return {"message": "FastAPI Lecture Notes API is running!"}
