from fastapi import FastAPI
from app.routes.lecture_route import router as lecture_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Lecture Notes API",
    description="API for cleaning and processing lecture notes, ready for RAG",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lecture_routes)

@app.get("/")
def root():
    return {"message": "FastAPI Lecture Notes API is running!"}
