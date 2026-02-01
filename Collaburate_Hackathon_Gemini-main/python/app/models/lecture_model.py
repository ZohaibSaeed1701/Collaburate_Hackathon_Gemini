from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class LectureText(BaseModel):
    text: str
