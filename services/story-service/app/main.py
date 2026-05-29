import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Shubhanu Story Engine Service",
    description="Python FastAPI Story & Curriculum microservice linked to MongoDB",
    version="1.0.0"
)

# Enable CORS for frontend and API Gateway connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client.get_database()
chapters_collection = db["story_chapters"]

# Seed MongoDB with World 1 Math Chapter 1 metadata on startup if empty
def seed_curriculum_if_needed():
    if chapters_collection.count_documents({}) == 0:
        default_chapter = {
            "chapter_id": 1,
            "world_id": 1,
            "title": "The Gate of Count Castle",
            "age_group": "5-7",
            "difficulty": "Beginner",
            "introduction": "Greetings, young Hero! The Dark Dragon has locked the gates. Shubh-Buddy needs your help!",
            "challenges": [
                {
                    "id": "challenge_1",
                    "question": "Shubh-Buddy finds 3 Gold Keys and 4 Silver Keys. How many keys in total?",
                    "options": ["5 keys", "6 keys", "7 keys", "8 keys"],
                    "answer_index": 2,
                    "xp_award": 100
                }
            ],
            "branch_rules": {
                "if_score_below": 0.5,
                "branch_easy_id": "challenge_2_easy",
                "if_score_above": 0.85,
                "branch_hard_id": "challenge_2_hard"
            }
        }
        chapters_collection.insert_one(default_chapter)
        print("Seeding: Chapter 1 Math successfully inserted into MongoDB!")

@app.on_event("startup")
async def startup_event():
    seed_curriculum_if_needed()

# Typings
class ChapterSubmit(BaseModel):
    child_id: str
    score: float = Field(..., ge=0.0, le=1.0)
    time_spent_seconds: int

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "story-service"}

@app.get("/api/v1/story/worlds")
def list_worlds():
    return {
        "worlds": [
            {"id": 1, "name": "The Number Kingdom", "subject": "Mathematics", "chapters": 12, "active": True},
            {"id": 2, "name": "The Word Forest", "subject": "English", "chapters": 12, "active": False},
            {"id": 3, "name": "The Science Planet", "subject": "Science", "chapters": 12, "active": False},
            {"id": 4, "name": "The History Vault", "subject": "General Knowledge", "chapters": 12, "active": False}
        ]
    }

@app.get("/api/v1/story/chapter/{chapter_id}")
def get_chapter(chapter_id: int):
    chapter = chapters_collection.find_one({"chapter_id": chapter_id}, {"_id": 0})
    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chapter {chapter_id} not found inside the curriculum database."
        )
    return chapter

@app.post("/api/v1/story/chapter/{chapter_id}/complete")
def complete_chapter(chapter_id: int, payload: ChapterSubmit):
    # Retrieve branching rules from MongoDB
    chapter = chapters_collection.find_one({"chapter_id": chapter_id})
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    rules = chapter.get("branch_rules", {})
    next_branch = "standard"

    # Dynamic RL Pacing Decisions
    if payload.score < rules.get("if_score_below", 0.5):
        next_branch = rules.get("branch_easy_id", "easy")
    elif payload.score > rules.get("if_score_above", 0.85):
        next_branch = rules.get("branch_hard_id", "hard")

    return {
        "message": "Chapter progress recorded successfully",
        "next_branch": next_branch,
        "rewards": {
            "xp_multiplier": 1.5 if next_branch == "hard" else 1.0,
            "badge_unlocked": "Math Wizard" if payload.score >= 0.8 else None
        }
    }
