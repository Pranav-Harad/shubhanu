import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Shubhanu NLP Tutor Service",
    description="Python FastAPI NLP Tutor microservice integrating Google Gemini 2.0 Flash API",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Google Gemini SDK
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
api_configured = False

if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_GOOGLE_AI_STUDIO_GEMINI_API_KEY_HERE":
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        api_configured = True
        print("Google Gemini SDK successfully configured!")
    except Exception as e:
        print(f"Failed to configure Gemini SDK: {e}")
else:
    print("Gemini API Key not set. Running in simulation fallback mode.")

class TutorQuery(BaseModel):
  childId: str
  query: str = Field(..., min_length=1)
  ageGroup: str = Field(..., pattern="^(5-7|8-11|12-14)$")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "nlp-tutor-service",
        "gemini_active": api_configured
    }

@app.post("/api/v1/tutor/ask")
async def ask_tutor(payload: TutorQuery):
    system_instruction = ""
    
    # 1. Establish strict system prompt instructions based on age brackets
    if payload.ageGroup == "5-7":
        system_instruction = (
            "You are 'Shubh-Buddy', a gentle, highly encouraging AI cartoon tutor companion for 5-7 year old children. "
            "Exclusively limit explanations to 2-3 sentences. Explain concepts visually utilizing analogies of toys, apples, "
            "or cookies. Use plenty of simple emojis. Never use technical, algebraic, or dry definitions. Be sweet and cheerful!"
        )
    elif payload.ageGroup == "8-11":
        system_instruction = (
            "You are 'Shubh-Buddy', an energetic AI tutor for 8-11 year old children. Formulate concepts in 3-4 sentences. "
            "Use comparisons to computer games, cartoons, or school activities. Explain math/science logically but simply. "
            "Always ask an engaging follow-up question to keep them interested."
        )
    else: # "12-14"
        system_instruction = (
            "You are 'Shubh-Buddy', an analytical AI study companion for 12-14 year old teenagers. Provide rigorous, logical, "
            "and factual explanations. You can introduce simple mathematical symbols, variables, or standard historical dates. "
            "Keep the tone encouraging, intellectual, and professional."
        )

    # 2. Inject Safety redirection constraints
    system_instruction += (
        " You must strictly answer questions relating to school subjects: Mathematics, English/Grammar, Science, "
        "and General Knowledge/History. If the child asks a question unrelated to educational subjects "
        "(such as video game cheat codes, celebrity gossips, action movies, or non-educational content), "
        "gently and politely redirect them back to the active quest. Example: 'That's a fun topic! "
        "However, I am currently focused on helping you solve math locks in Count Castle! Let's get back to counting our keys!'"
    )

    # 3. Request actual Gemini API generation
    if api_configured:
        try:
            model = genai.GenerativeModel(
                model_name="gemini-2.0-flash",
                generation_config={"temperature": 0.5, "max_output_tokens": 150},
                system_instruction=system_instruction
            )
            response = model.generate_content(payload.query)
            return {
                "reply": response.text,
                "engine": "gemini-2.0-flash",
                "simulated": False
            }
        except Exception as e:
            print(f"❌ Gemini Generation failed: {e}")
            # Fall through to simulated fallback if API fails
            pass

    # 4. Simulated Fallback Module (Allows offline testing for vivas!)
    query_lower = payload.query.lower()
    
    # Custom keywords check
    if "why" in query_lower or "addition" in query_lower or "math" in query_lower:
        if payload.ageGroup == "5-7":
            reply = "Math is like a super-power! Adding lets us see how many toy blocks we have, or how many key codes Shubh-Buddy collected! 🍎🧸"
        elif payload.ageGroup == "8-11":
            reply = "Addition groups values together! Game loops use addition to increment your character's score, level, or inventory. 🎮⚡"
        else:
            reply = "Addition is the fundamental operation of numerical aggregation, utilized in algorithms to run counter indices and array mappings. 📐🧠"
    elif "fraction" in query_lower or "half" in query_lower or "pizza" in query_lower:
        if payload.ageGroup == "5-7":
            reply = "Imagine a pizza! If we cut it down the middle, we get 2 halves (1/2). Merge both halves, and we get 1 whole pizza again! 🍕"
        elif payload.ageGroup == "8-11":
            reply = "Fractions describe sections of a whole. 2/2 means we have both equal slices of a two-piece partition, forming a whole integer. 📊"
        else:
            reply = "A fraction represents a rational ratio a/b denoting sections of an integer partitioned into b segments. Two halves aggregate to a value of 1. 📏"
    else:
        # Off-topic redirection simulation
        reply = (
            "That's a fun question! However, Shubh-Buddy wants to make sure we conquer the Gate of Count Castle first! "
            "Let's focus on solving our current lock challenge, and we can explore more of the kingdom after! 🏰🛡️"
        )

    return {
        "reply": reply,
        "engine": "mock-simulator-flash",
        "simulated": True
    }
