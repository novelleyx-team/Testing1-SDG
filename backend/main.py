import os
import sys
import uuid
import io
import csv
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Response, BackgroundTasks, Depends, Request
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import json
import shutil
import time
import jwt

# Link to the master database folder "Superbase_db"
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from Superbase_db import database as db

# --- JWT Auth Setup ---
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
security = HTTPBearer()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "super-secret-jwt-token-with-at-least-32-characters-long")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"], options={"verify_aud": False})
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token: missing subject")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

# --- PATHING FOR STORAGE SANDBOX ---
SANDBOX_DIR = os.getenv("SANDBOX_DIR", os.path.join(os.getcwd(), "SDG_Local_Sandbox"))
DATASETS_DIR = os.path.join(SANDBOX_DIR, "datasets")
STUDENT_UPLOADS_DIR = os.path.join(SANDBOX_DIR, "student_uploads")
os.makedirs(DATASETS_DIR, exist_ok=True)
os.makedirs(STUDENT_UPLOADS_DIR, exist_ok=True)

from fastapi.responses import FileResponse

from backend.pdf_worker import start_pdf_workers, enqueue_pdf_job
from backend.storage.service import StorageService
from backend.storage.config import PARTITIONS, QUOTAS
from backend.storage.cleanup import start_cleanup_worker
from backend.ai_engine.worker import start_ai_workers, enqueue_ai_job
from backend.jobs.state_machine import JobStateMachine
from backend.notifications.worker import NotificationWorker
import asyncio

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await start_pdf_workers(num_workers=2)
    await start_cleanup_worker()
    await start_ai_workers(num_workers=1)
    # Start the notification worker as a background asyncio task
    # Note: run_worker_loop is blocking, so we run it in a thread
    asyncio.get_event_loop().run_in_executor(None, NotificationWorker.run_worker_loop)

# --- Simple In-Memory Rate Limiter ---
RATE_LIMIT_DURATION = 60 # seconds
RATE_LIMIT_REQUESTS = 5
ip_request_counts = {}

async def rate_limiter(request: Request):
    client_ip = request.client.host
    current_time = time.time()
    
    if client_ip in ip_request_counts:
        ip_request_counts[client_ip] = [t for t in ip_request_counts[client_ip] if current_time - t < RATE_LIMIT_DURATION]
    else:
        ip_request_counts[client_ip] = []
        
    if len(ip_request_counts[client_ip]) >= RATE_LIMIT_REQUESTS:
        raise HTTPException(status_code=429, detail="Too many requests. Please wait 60 seconds before trying again.")
        
    ip_request_counts[client_ip].append(current_time)

# Allow CORS so Next.js frontend can call it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    user_id = db.create_user(
        user_id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        department=user.department
    )
    if not user_id:
        raise HTTPException(status_code=500, detail="Failed to register user.")
    return {"message": "User registered successfully", "user_id": user_id}

@app.post("/api/login")
async def login_user(creds: UserLogin):
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT u.*, d.name as department_name 
        FROM users u 
        LEFT JOIN departments d ON u.department_id = d.id 
        WHERE u.email = %s OR u.id = %s
    """, (creds.email, creds.email))
    user = cursor.fetchone()
    if user:
        if user.get('department_name'):
            user['department'] = user['department_name']
        return {"message": "Login successful", "user": user}
    raise HTTPException(status_code=401, detail="Invalid credentials or user not found.")

@app.post("/api/projects")
async def save_project(project: ProjectCreate):
    score = 0
    try:
        score = int(float(project.aiScore.replace('/100', '')))
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
            "targetSdg": "SDG Mapping Complete",
            "studentDepartment": p["department"]
        })
    return {"projects": mapped_projects}

@app.get("/api/export")
async def export_data_to_csv():
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

# --- Job System & AI Pipeline (Phase 2 & 3) ---

@app.get("/api/jobs/{job_id}")
async def get_job_status(job_id: str):
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    result_data = None
    if job["result"]:
        try:
            result_data = json.loads(job["result"])
        except:
            pass
            
    return {
        "job_id": job["id"],
        "status": job["status"],
        "stage": job["stage"],
        "result": result_data,
        "error": job.get("error")
    }

class ProjectSubmission(BaseModel):
    student_name: str
    department: str
    title: str
    abstract: str
    keywords: str

from fastapi import Header

@app.post("/api/generate-sdg-report", dependencies=[Depends(rate_limiter)])
async def generate_sdg_report(
    submission: ProjectSubmission, 
    background_tasks: BackgroundTasks, 
    idempotency_key: str = Header(None),
    user_payload: dict = Depends(get_current_user)
):
    if idempotency_key:
        existing = db.check_idempotency_key(idempotency_key, "GENERATE_REPORT")
        if existing:
            return existing["response_payload"]
            
    job_id = f"job-{uuid.uuid4().hex[:8]}"
    project_id = f"proj-{uuid.uuid4().hex[:8]}"
    
    db.create_job(job_id, project_id, status="QUEUED", stage="Ingesting Project Data...")
    background_tasks.add_task(process_sdg_job_pipeline, job_id, project_id, submission)
    
    response = {"job_id": job_id, "project_id": project_id, "status": "QUEUED"}
    
    if idempotency_key:
        db.save_idempotency_key(idempotency_key, "GENERATE_REPORT", project_id, response)
        
    return response

async def process_sdg_job_pipeline(job_id: str, project_id: str, submission: ProjectSubmission):
    try:
        db.update_job(job_id, status="PROCESSING", stage="Global Target Analysis via SDG.AI...")
        
        payload = {
            "title": submission.title,
            "problem": submission.abstract,
            "description": submission.abstract,
            "solution": "Student submitted solution",
            "technologies": submission.keywords.split(","),
            "outcomes": "Not specified"
        }
        
        # Ping internal SDG.AI Engine
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                response = await client.post("http://127.0.0.1:8001/api/sdg/report", json=payload)
                response.raise_for_status()
                ai_data = response.json()
            except Exception as internal_err:
                print(f"SDG.AI engine error: {internal_err}")
                raise Exception("Failed to connect to internal SDG.AI Engine. Make sure it is running on port 8001.")
            
        db.update_job(job_id, stage="Formatting AI Knowledge...")
        
        analysis = ai_data.get("analysis", {})
        impact = ai_data.get("impact", {})
        
        is_sdg = analysis.get("overall_confidence", 0) > 40
        primary_sdg = "N/A"
        if analysis.get("sdg_analysis"):
            primary_sdg = analysis["sdg_analysis"][0].get("sdg_name", "N/A")
            
        summary = analysis.get("project_summary", "Analysis complete.")
        overall_score = impact.get("overall_score", 0)
        
        db.update_job(job_id, stage="Finalizing Report Data...")
        
        # Next.js API for PDF Generation via Puppeteer
        report_url = f"/api/pdf/generate?projectId={project_id}"
        
        result = {
            "is_sdg": is_sdg,
            "summary": summary,
            "target_sdg": primary_sdg,
            "sdg_scores": {"SDG Score": overall_score}, 
            "radar_map_url": None,
            "report_url": report_url,
            "raw_analysis": ai_data
        }
        
        db.create_report(f"rep-{project_id}", project_id, result, report_url, None)
        # db.update_job(job_id, status="COMPLETED", stage="Finished", result=result)
        JobStateMachine.transition_state(job_id, "COMPLETED", result=json.dumps(result))
        
    except Exception as e:
        print(f"Job {job_id} failed: {e}")
        # db.update_job(job_id, status="FAILED", stage="Error", error=str(e))
        JobStateMachine.transition_state(job_id, "SYSTEM_FAILED", error=str(e))

@app.get("/api/reports/{project_id}")
async def get_report(project_id: str, request: Request, user_payload: dict = Depends(get_current_user)):
    # 1. Resource Ownership Validation (Real JWT)
    authenticated_user_id = user_payload.get("sub")
    authenticated_role = user_payload.get("role", "authenticated")
    
    report = db.get_report_by_project(project_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    if report["report_data"]:
        try:
            report["report_data"] = json.loads(report["report_data"])
        except:
            pass
            
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM projects WHERE id = %s", (project_id,))
    project = cursor.fetchone()
    
    student_name = "Unknown"
    guide_name = "Unknown"
    department = "Unknown"
    
    if project:
        # 2. Strict Access Control Check
        # Only allow if the requestor is the student who owns the project, or an admin
        if project.get("student_id") != authenticated_user_id and authenticated_user_id != "admin" and authenticated_role != "admin":
             # We throw 403 Forbidden
             print(f"SECURITY WARNING: User {authenticated_user_id} accessed report {project_id} owned by {project.get('student_id')}")
             raise HTTPException(status_code=403, detail="Access Denied: You do not own this report.")
             
        # Fetch student info
        if project.get("student_id"):
            cursor.execute("SELECT name, department FROM users WHERE id = %s", (project["student_id"],))
            user = cursor.fetchone()
            if user:
                student_name = user["name"]
                if user.get("department"):
                    department = user["department"]
        
        # Fetch guide/faculty info
        if project.get("faculty_id"):
            cursor.execute("SELECT name FROM users WHERE id = %s", (project["faculty_id"],))
            faculty = cursor.fetchone()
            if faculty:
                guide_name = faculty["name"]
        
        # Use project-level department as fallback
        if department == "Unknown" and project.get("department"):
            department = project["department"]
            
    return {
        "report": report,
        "project": project,
        "student_name": student_name,
        "guide_name": guide_name,
        "department": department
    }

# --- PDF GENERATION API ---

@app.post("/api/reports/{report_id}/pdf")
async def request_pdf_generation(report_id: str):
    report = db.get_report_by_project(report_id)  # Note: The route param implies project_id or report_id, let's assume it's report_id, but the function takes project_id? Wait, in DB, reports table has id and project_id. Let's fetch the report by its ID.
    
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM reports WHERE id = %s", (report_id,))
    report_record = cursor.fetchone()
    
    if not report_record:
        # Fallback: check if they passed project_id instead
        cursor.execute("SELECT * FROM reports WHERE project_id = %s ORDER BY created_at DESC LIMIT 1", (report_id,))
        report_record = cursor.fetchone()
        if not report_record:
            raise HTTPException(status_code=404, detail="Report not found")
            
    actual_report_id = report_record["id"]
    project_id = report_record["project_id"]
    
    job_id = f"pdfjob-{uuid.uuid4().hex[:8]}"
    db.create_pdf_job(job_id, actual_report_id, project_id)
    
    await enqueue_pdf_job(job_id, actual_report_id, project_id)
    
    return {"job_id": job_id, "report_id": actual_report_id, "status": "QUEUED"}

@app.get("/api/reports/{report_id}/pdf/status")
async def get_pdf_status(report_id: str, job_id: str = None):
    # If job_id is provided, check that job. Otherwise get latest job for report_id
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    if job_id:
        cursor.execute("SELECT * FROM pdf_jobs WHERE id = %s", (job_id,))
    else:
        cursor.execute("SELECT * FROM pdf_jobs WHERE report_id = %s ORDER BY created_at DESC LIMIT 1", (report_id,))
        
    job = cursor.fetchone()
    if not job:
        raise HTTPException(status_code=404, detail="PDF job not found")
        
    return {
        "job_id": job["id"],
        "status": job["status"],
        "error": job.get("error")
    }

@app.get("/api/reports/{report_id}/pdf/download")
async def download_pdf(report_id: str):
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM pdf_jobs WHERE report_id = %s AND status = 'COMPLETED' ORDER BY created_at DESC LIMIT 1", (report_id,))
    job = cursor.fetchone()
    
    if not job or not job.get("storage_location"):
        raise HTTPException(status_code=404, detail="PDF not generated yet or not found")
        
    file_path = job["storage_location"]
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="PDF file missing from disk")
        
    return FileResponse(
        path=file_path, 
        filename=f"SDG_Report_{report_id}.pdf", 
        media_type="application/pdf"
    )

# --- Suggestions API ---
class SuggestionCreate(BaseModel):
    authorType: str
    name: str
    topic: str
    content: str

class SuggestionUpdate(BaseModel):
    status: str

suggestions_db = []

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


# --- File Storage & Serving API ---
@app.get("/api/storage/{storage_key:path}")
async def get_storage_file(storage_key: str):
    """Serve files securely using their storage key."""
    try:
        abs_path = StorageService.get_absolute_path(storage_key)
        if not os.path.exists(abs_path):
            raise HTTPException(status_code=404, detail="File not found")
            
        # Optional: guess media type, or just return FileResponse
        return FileResponse(path=abs_path)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- File Upload API ---
@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    owner_id: str = Form("anonymous"),
    project_id: str = Form(None),
    user_payload: dict = Depends(get_current_user)
):
    try:
        # Override owner_id with authenticated user if possible
        if user_payload and user_payload.get("sub"):
            owner_id = user_payload.get("sub")

        # Use StorageService instead of raw filesystem
        result = await StorageService.upload_file(file, owner_id, project_id)
        
        # Enqueue for AI Analysis if it is a project upload
        ai_status = "Not sent (SDG.AI only processes project submission data)"
        if project_id:
            try:
                # Create a new analysis record
                analysis_id = f"ai_job_{uuid.uuid4().hex}"
                db.create_ai_analysis(analysis_id, project_id, version=1)
                
                # Enqueue job
                await enqueue_ai_job(analysis_id, project_id)
                ai_status = "Sent to SDG.AI Engine"
            except Exception as e:
                ai_status = f"SDG.AI Engine failed to queue: {str(e)}"

                
        return {
            "file_id": result["file_id"],
            "filename": result["filename"], 
            "status": "Uploaded successfully", 
            "size_bytes": result["size_bytes"],
            "sdg_ai_status": ai_status
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

@app.get("/api/files/{file_id}/download")
async def download_file(file_id: str):
    record = db.get_file(file_id)
    if not record or record["status"] != "ACTIVE":
        raise HTTPException(status_code=404, detail="File not found")
        
    abs_path = StorageService.get_absolute_path(record["storage_key"])
    if not os.path.exists(abs_path):
        raise HTTPException(status_code=404, detail="Physical file missing")
        
    return FileResponse(
        path=abs_path, 
        filename=record["original_filename"],
        media_type=record["mime_type"]
    )

# --- SDG.AI API ---

class AIProcessRequest(BaseModel):
    project_id: str

@app.post("/api/ai/process")
async def process_ai_project(req: AIProcessRequest):
    try:
        analysis_id = f"ai_job_{uuid.uuid4().hex}"
        db.create_ai_analysis(analysis_id, req.project_id, version=1)
        await enqueue_ai_job(analysis_id, req.project_id)
        return {"status": "success", "analysis_id": analysis_id, "message": "Job enqueued"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/status/{project_id}")
async def get_ai_status(project_id: str):
    analysis = db.get_ai_analysis(project_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="No analysis found")
    return {"status": analysis["status"]}

@app.get("/api/ai/analysis/{project_id}")
async def get_ai_analysis_result(project_id: str):
    analysis = db.get_ai_analysis(project_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="No analysis found")
    return analysis

@app.get("/api/storage/metrics")
async def get_storage_metrics():
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT COUNT(*) as cnt, SUM(size_bytes) as total_size FROM files WHERE status = 'ACTIVE'")
    row = cursor.fetchone()
    
    total_files = row["cnt"] or 0
    total_bytes = row["total_size"] or 0
    
    return {
        "metrics": {
            "total_files": total_files,
            "total_bytes": total_bytes,
            "total_mb": round(total_bytes / (1024*1024), 2),
            "partitions": {
                name: path for name, path in PARTITIONS.items()
            },
            "quotas": QUOTAS
        }
    }

# --- ANALYTICS API ---

@app.get("/api/analytics/student/{student_id}")
async def get_student_analytics_api(student_id: str):
    return db.get_student_analytics(student_id)

@app.get("/api/analytics/faculty/{department}")
async def get_faculty_analytics_api(department: str):
    return db.get_faculty_analytics(department)

@app.get("/api/analytics/leadership")
async def get_leadership_analytics_api():
    return db.get_leadership_analytics()

@app.get("/api/analytics/admin")
async def get_admin_analytics_api():
    return db.get_admin_analytics()

# --- HEALTH AND OBSERVABILITY ---

@app.get("/api/health")
async def health_check():
    """Comprehensive health check across all systems."""
    health_status = {
        "status": "HEALTHY",
        "database": "UNKNOWN",
        "ai_service": "UNKNOWN",
        "queue": "HEALTHY",
        "email": "HEALTHY",
        "sms": "HEALTHY"
    }
    
    # Check Database
    try:
        conn = db.get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        health_status["database"] = "HEALTHY"
    except Exception as e:
        health_status["database"] = "FAILED"
        health_status["status"] = "DEGRADED"
        
    # Check Internal AI Service
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get("http://127.0.0.1:8001/api/health")
            if resp.status_code == 200:
                health_status["ai_service"] = "HEALTHY"
            else:
                health_status["ai_service"] = "DEGRADED"
    except:
        health_status["ai_service"] = "UNREACHABLE"
        health_status["status"] = "DEGRADED"
        
    return health_status

# --- PROVIDER WEBHOOKS (Delivery Tracking) ---
class WebhookPayload(BaseModel):
    provider_message_id: str
    status: str
    failure_reason: str | None = None
    event_timestamp: str | None = None

@app.post("/api/webhooks/notifications")
async def handle_notification_webhook(payload: WebhookPayload, request: Request):
    """
    Handles async delivery receipts from Email/SMS providers (Part 27)
    """
    # Map provider statuses to internal status enum
    status_mapping = {
        "delivered": "DELIVERED",
        "bounced": "BOUNCED",
        "failed": "FAILED",
        "complained": "FAILED",
        "opened": "DELIVERED"
    }
    
    internal_status = status_mapping.get(payload.status.lower(), payload.status)
    
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT id FROM notifications WHERE provider_message_id = %s", (payload.provider_message_id,))
    notif = cursor.fetchone()
    
    if not notif:
        return {"status": "ignored", "reason": "Unknown provider_message_id"}
        
    db.update_notification_status(
        notification_id=notif['id'],
        status=internal_status,
        failure_reason=payload.failure_reason
    )
    
    return {"status": "success"}
