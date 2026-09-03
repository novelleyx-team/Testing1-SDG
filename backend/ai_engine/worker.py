import asyncio
import logging
import os
import sys

parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from Superbase_db import database as db
from backend.storage.service import StorageService
from backend.ai_engine.parser import parse_document
from backend.ai_engine.analyzer import extract_facts, reason_sdgs
from backend.ai_engine.vector_store import vector_store

logger = logging.getLogger("SDG_AI_Worker")

# A queue to hold AI Analysis jobs
ai_job_queue = asyncio.Queue(maxsize=50)

async def process_ai_analysis(analysis_id: str, project_id: str):
    logger.info(f"Starting AI Analysis for project: {project_id}")
    db.update_ai_analysis_status(analysis_id, "Extracting Evidence")
    
    try:
        # 1. Fetch project metadata
        conn = db.get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM projects WHERE id = %s", (project_id,))
        project_record = cursor.fetchone()
        
        if not project_record:
            raise Exception("Project metadata not found.")
            
        # 2. Fetch associated files from Storage
        db.update_ai_analysis_status(analysis_id, "Processing Documents")
        cursor.execute("SELECT * FROM files WHERE project_id = %s AND status = 'ACTIVE' AND mime_type = 'application/pdf'", (project_id,))
        files = cursor.fetchall()
        
        aggregated_text = ""
        for f in files:
            abs_path = StorageService.get_absolute_path(f["storage_key"])
            if os.path.exists(abs_path):
                extracted = parse_document(abs_path)
                aggregated_text += f"\n\n--- DOCUMENT: {f['original_filename']} ---\n"
                aggregated_text += extracted
        
        # 3. Call AI Analyzer - PASS 1 (Extraction)
        db.update_ai_analysis_status(analysis_id, "Extracting Facts & Keywords")
        
        metadata = {
            "title": project_record.get("title", ""),
            "department": project_record.get("department", ""),
            "abstract": project_record.get("abstract", "")
        }
        
        loop = asyncio.get_running_loop()
        extraction_result = await loop.run_in_executor(None, extract_facts, metadata, aggregated_text)
        
        # 4. Retrieval (Semantic Search)
        db.update_ai_analysis_status(analysis_id, "Retrieving Local Knowledge")
        query = metadata['title'] + " " + " ".join(extraction_result.get("keywords", []))
        
        # Run local FAISS search
        retrieved_docs = await loop.run_in_executor(None, vector_store.search, query, 5)
        
        retrieved_knowledge = ""
        for doc in retrieved_docs:
            retrieved_knowledge += f"Source: {doc.get('source_type')} (Auth: {doc.get('authority_level')})\nContent: {doc.get('content')}\n\n"
            
        if not retrieved_knowledge:
            retrieved_knowledge = "No local knowledge found."

        # 5. Call AI Analyzer - PASS 2 (Reasoning)
        db.update_ai_analysis_status(analysis_id, "Calculating SDG Assessment")
        analysis_result = await loop.run_in_executor(None, reason_sdgs, extraction_result, retrieved_knowledge)
        
        # 6. Save to Database
        db.update_ai_analysis_status(analysis_id, "Finalizing Analysis")
        db.save_ai_analysis_results(analysis_id, analysis_result)
        logger.info(f"AI Analysis completed for project: {project_id}")
        
    except Exception as e:
        logger.error(f"Error during AI Analysis for {project_id}: {str(e)}")
        db.update_ai_analysis_status(analysis_id, "Failed")

async def ai_worker_task():
    logger.info("AI Worker started and waiting for jobs.")
    while True:
        job = await ai_job_queue.get()
        try:
            await process_ai_analysis(job["analysis_id"], job["project_id"])
        except Exception as e:
            logger.error(f"Unhandled error in AI worker: {e}")
        finally:
            ai_job_queue.task_done()

async def start_ai_workers(num_workers: int = 1):
    workers = []
    for _ in range(num_workers):
        task = asyncio.create_task(ai_worker_task())
        workers.append(task)
    return workers

async def enqueue_ai_job(analysis_id: str, project_id: str):
    await ai_job_queue.put({
        "analysis_id": analysis_id,
        "project_id": project_id
    })
