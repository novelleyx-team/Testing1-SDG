import os
import uuid
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import matplotlib.pyplot as plt
import numpy as np
from google import genai
from google.genai import types
import subprocess
import json
import shutil

import sys
import os

# Link to the master database folder "Superbase_db"
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from Superbase_db import database as db

# --- ABSOLUTE PATHING FOR LOCAL STORAGE SANDBOX (Tickets 2 & 3) ---
# Hardcoded absolute paths for datasets and student uploads
SANDBOX_DIR = r"d:\SDG_Local_Sandbox"
DATASETS_DIR = r"d:\SDG_Local_Sandbox\datasets"
STUDENT_UPLOADS_DIR = r"d:\SDG_Local_Sandbox\student_uploads"

# Ensure isolated local directories exist
os.makedirs(DATASETS_DIR, exist_ok=True)
os.makedirs(STUDENT_UPLOADS_DIR, exist_ok=True)
# -----------------------------------------------------------------

app = FastAPI()

# --- User Auth Models ---
class UserRegister(BaseModel):
    id: str
    name: str
    email: str
    role: str
    department: str | None = None
    passkey: str | None = None

class UserLogin(BaseModel):
    email: str
    passkey: str | None = None

class ProjectCreate(BaseModel):
    id: str
    studentId: str
    department: str
    title: str
    abstract: str
    aiScore: str

# --- Auth Endpoints (Phase 1) ---

@app.post("/api/register")
async def register_user(user: UserRegister):
    # Department is used as Branch
    user_id = db.create_user(
        user_id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        department=user.department
    )
    if not user_id:
        raise HTTPException(status_code=500, detail="Failed to register user. Email might already exist.")
    return {"message": "User registered successfully", "user_id": user_id}

@app.post("/api/login")
async def login_user(creds: UserLogin):
    # Mocking simple login by fetching user by email
    conn = db.get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (creds.email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if user:
            return {"message": "Login successful", "user": user}
    raise HTTPException(status_code=401, detail="Invalid credentials or user not found.")

@app.post("/api/projects")
async def save_project(project: ProjectCreate):
    score = 0
    try:
        score = int(float(project.aiScore))
    except:
        pass
    project_id = db.create_project(
        project_id=project.id,
        student_id=project.studentId,
        title=project.title,
        abstract=project.abstract,
        status="Pending",
        faculty_id=None,
        department=project.department,
        sdg_match_score=score
    )
    if not project_id:
        raise HTTPException(status_code=500, detail="Failed to save project to DB.")
    return {"message": "Project saved", "project_id": project_id}

@app.get("/api/projects/{student_id}")
async def get_student_projects(student_id: str):
    projects = db.get_projects_by_student(student_id)
    # Map database column names to frontend expected variables
    mapped_projects = []
    for p in projects:
        mapped_projects.append({
            "id": p["id"],
            "studentId": p["student_id"],
            "title": p["title"],
            "abstract": p["abstract"],
            "status": p["status"],
            "aiScore": str(p["sdg_match_score"]) if p["sdg_match_score"] is not None else "0",
            "date": p["created_at"].strftime("%b %d, %Y") if p["created_at"] else "Recently",
            "targetSdg": "SDG Pending", # Optional mapping
            "studentDepartment": p["department"]
        })
    return {"projects": mapped_projects}

@app.get("/api/export")
async def export_data_to_csv():
    # Export projects to CSV for Excel consumption
    projects = db.get_all_projects()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Project ID", "Student ID", "Title", "Abstract", "Status", "Department", "Score", "Created At"])
    for p in projects:
        writer.writerow([
            p["id"], p["student_id"], p["title"], p["abstract"], 
            p["status"], p["department"], p["sdg_match_score"], p["created_at"]
        ])
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=projects_export.csv"}
    )

# Allow CORS so Next.js frontend can call it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
client = genai.Client(api_key=GEMINI_API_KEY)

# Define request model
class ProjectSubmission(BaseModel):
    student_name: str
    department: str
    title: str
    abstract: str
    keywords: str

# Define response model
class GenerationResponse(BaseModel):
    is_sdg: bool
    summary: str
    target_sdg: str
    sdg_scores: dict[str, float] | None = None
    radar_map_url: str | None = None
    report_url: str | None = None

SDG_LABELS = [
    "No Poverty", "Zero Hunger", "Good Health", "Quality Education",
    "Gender Equality", "Clean Water", "Clean Energy", "Decent Work",
    "Industry & Innovation", "Reduced Inequalities", "Sustainable Cities",
    "Responsible Consumption", "Climate Action", "Life Below Water",
    "Life on Land", "Peace & Justice", "Partnerships"
]

def generate_radar_chart(scores_list, filename):
    angles = np.linspace(0, 2 * np.pi, len(SDG_LABELS), endpoint=False).tolist()
    # close the plot
    plot_scores = scores_list + scores_list[:1]
    plot_angles = angles + angles[:1]
    
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
    ax.fill(plot_angles, plot_scores, color='blue', alpha=0.25)
    ax.plot(plot_angles, plot_scores, color='blue', linewidth=2)
    
    ax.set_yticks([2, 4, 6, 8, 10])
    ax.set_yticklabels(["2", "4", "6", "8", "10"], color="grey", size=7)
    ax.set_ylim(0, 10)
    
    # Add labels
    ax.set_xticks(angles)
    ax.set_xticklabels(SDG_LABELS, size=9)
    
    plt.title("SDG Impact Radar Map", size=15, color="blue", y=1.1)
    
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    plt.savefig(filename, format='png', bbox_inches='tight')
    plt.close()

def compile_typst_report(student_name: str, title: str, summary: str, radar_path: str, output_pdf_path: str):
    radar_filename = os.path.basename(radar_path)
    relative_radar_path = f"../radar_maps/{radar_filename}"
    
    temp_typ_path = output_pdf_path.replace(".pdf", ".typ")
    os.makedirs(os.path.dirname(output_pdf_path), exist_ok=True)
    
    typst_content = f'''
#set page(paper: "a4", margin: 2cm)
#set text(font: "Linux Libertine", size: 12pt)

#align(center)[
  #text(size: 24pt, weight: "bold")[SDG Impact Report]
  
  #v(1em)
  #text(size: 16pt)[Project: {title}]
  
  #text(size: 14pt)[By: {student_name}]
]

#v(2em)

== Project Summary
{summary}

#v(2em)

== Impact Footprint
#align(center)[
  #image("{relative_radar_path}", width: 80%)
]

#v(1fr)
_Report generated by Automated Assessment System_
'''
    with open(temp_typ_path, "w", encoding="utf-8") as f:
        f.write(typst_content)
        
    public_dir = os.path.dirname(os.path.dirname(output_pdf_path))
    try:
        subprocess.run(["typst", "compile", "--root", public_dir, temp_typ_path, output_pdf_path], check=True)
    except FileNotFoundError:
        print("Typst is not installed. Please install it to generate PDF reports.")
        raise
    except Exception as e:
        print(f"Typst compilation failed: {e}")
        raise e

class GeminiResponseSchema(BaseModel):
    is_sdg: bool
    primary_sdg: str
    summary: str
    sdg_scores: list[int]

@app.post("/api/generate-sdg-report", response_model=GenerationResponse)
async def generate_sdg_report(submission: ProjectSubmission):
    prompt = f"""
    You are an expert AI evaluator for Sustainable Development Goals (SDGs).
    Analyze the following student project:
    Title: {submission.title}
    Abstract: {submission.abstract}
    Keywords: {submission.keywords}
    
    Determine if this project is related to any of the 17 UN SDGs.
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=GeminiResponseSchema,
            ),
        )
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text.replace("```json\n", "", 1)
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
        elif raw_text.startswith("```"):
            raw_text = raw_text.replace("```\n", "", 1)
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
        result = json.loads(raw_text.strip())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")
        
    project_id = str(uuid.uuid4())[:8]
    is_sdg = result.get("is_sdg", False)
    summary = result.get("summary", "Analysis complete.")
    target_sdg = result.get("primary_sdg", "N/A")
    scores_list = result.get("sdg_scores", [0]*17)
    if not isinstance(scores_list, list):
        scores_list = [0]*17
        
    if len(scores_list) < 17:
        scores_list = scores_list + [0]*(17-len(scores_list))
    elif len(scores_list) > 17:
        scores_list = scores_list[:17]
    
    # Path inside the Next.js public directory
    public_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")
    reports_dir = os.path.join(public_dir, "reports")
    radar_maps_dir = os.path.join(public_dir, "radar_maps")
    
    os.makedirs(reports_dir, exist_ok=True)
    os.makedirs(radar_maps_dir, exist_ok=True)
    
    if is_sdg:
        radar_filename = f"radar_{project_id}.png"
        radar_path = os.path.join(radar_maps_dir, radar_filename)
        generate_radar_chart(scores_list, radar_path)
        
        pdf_filename = f"report_{project_id}.pdf"
        pdf_path = os.path.join(reports_dir, pdf_filename)
        
        safe_summary = summary.replace('"', "'")
        safe_title = submission.title.replace('"', "'")
        safe_name = submission.student_name.replace('"', "'")
        
        try:
            compile_typst_report(safe_name, safe_title, safe_summary, radar_path, pdf_path)
            report_url = f"/reports/{pdf_filename}"
        except Exception as e:
            print(f"Skipping PDF generation due to error: {e}")
            report_url = None
        
        sdg_scores_dict = {f"SDG {i+1}": score for i, score in enumerate(scores_list)}
        
        return GenerationResponse(
            is_sdg=True,
            summary=summary,
            target_sdg=target_sdg,
            sdg_scores=sdg_scores_dict,
            radar_map_url=f"/radar_maps/{radar_filename}",
            report_url=report_url
        )
    else:
        return GenerationResponse(
            is_sdg=False,
            summary=summary,
            target_sdg=target_sdg
        )

# --- Suggestions API ---

class SuggestionCreate(BaseModel):
    authorType: str
    name: str
    topic: str
    content: str

class SuggestionUpdate(BaseModel):
    status: str

# In-memory database for suggestions
suggestions_db = [
    {
        "id": "SUG-1001",
        "authorType": "Faculty",
        "name": "Dr. Alan Turing",
        "topic": "New Template Request",
        "content": "We need a specific template for computational biology projects that automatically checks for genetic sequence plagiarism.",
        "date": "Jul 12, 2026",
        "status": "Reviewed"
    }
]

import datetime
import random

@app.get("/api/suggestions")
async def get_suggestions():
    return suggestions_db

@app.post("/api/suggestions")
async def create_suggestion(sug: SuggestionCreate):
    new_sug = {
        "id": f"SUG-{random.randint(1000, 9999)}",
        "authorType": sug.authorType,
        "name": sug.name,
        "topic": sug.topic,
        "content": sug.content,
        "date": datetime.datetime.now().strftime("%b %d, %Y"),
        "status": "Pending"
    }
    # Add to start of list
    suggestions_db.insert(0, new_sug)
    return new_sug

@app.patch("/api/suggestions/{sug_id}")
async def update_suggestion(sug_id: str, update: SuggestionUpdate):
    for sug in suggestions_db:
        if sug["id"] == sug_id:
            sug["status"] = update.status
            return sug
    raise HTTPException(status_code=404, detail="Suggestion not found")

@app.delete("/api/suggestions/{sug_id}")
async def delete_suggestion(sug_id: str):
    global suggestions_db
    suggestions_db = [s for s in suggestions_db if s["id"] != sug_id]
    return {"message": "Deleted successfully"}

# --- File Upload API (Ticket 2) ---

import requests

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    # Uploads route automatically to the designated local folder (STUDENT_UPLOADS_DIR)
    # This directory operates independently of the main server environment
    file_path = os.path.join(STUDENT_UPLOADS_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Trigger SDG.AI Knowledge Engine
        try:
            # We use filename as a temporary project_id mapping
            payload = {
                "project_id": file.filename.split('.')[0],
                "file_path": file_path
            }
            requests.post("http://127.0.0.1:8001/api/ai/process", json=payload, timeout=2)
            ai_status = "Sent to SDG.AI for indexing"
        except Exception as e:
            ai_status = f"SDG.AI Engine offline or failed: {str(e)}"
            
        return {
            "filename": file.filename, 
            "status": "Uploaded successfully to local sandbox", 
            "absolute_path": file_path,
            "sdg_ai_status": ai_status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

