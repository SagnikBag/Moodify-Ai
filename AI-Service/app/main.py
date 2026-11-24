from fastapi import FastAPI

# create fastapi application

app = FastAPI()

# home route

@app.get("/")
def home():
    return{
        "success": True,
        "message": "Welcome to Moodify AI Service!"
    }

@app.get("/health")
def health():
    return{
        "success": True,
        "status": "Ai Service is running"
    }