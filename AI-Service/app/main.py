from fastapi import FastAPI,UploadFile,File,HTTPException
from app.audio_analysis import analyze_audio

import os
import shutil
import uuid

# create fastapi application

app = FastAPI()

# home route

@app.get("/")
def home():
    return{
        "success": True,
        "message": "Welcome to Moodify AI Service!"
    }

@app.post("/analyze-audio")

async def analyze_song(file:UploadFile = File(...)):

    if not file.filename.lower().endswith(".mp3"):
        raise HTTPException(
            status_code=400,
            detail="Only MP# files are alllowed"
        )
    temp_file = f"temp_{uuid.uuid4().hex}.mp3"

    try:
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = analyze_audio(temp_file)

        return {
            "success": True,
            "message": "Audio analuzed successfully",
            "features": result
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
    finally:
        await file.close()
        if os.path.exists(temp_file):
            os.remove(temp_file)