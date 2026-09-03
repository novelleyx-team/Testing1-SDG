import asyncio
import os
from playwright.async_api import async_playwright
import sys
import logging

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from Superbase_db import database as db
from backend.storage.service import StorageService
from backend.storage.config import PARTITIONS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("PDFWorker")

# A queue to hold PDF jobs
pdf_job_queue = asyncio.Queue(maxsize=100)

async def generate_pdf(job_id: str, report_id: str, project_id: str):
    logger.info(f"Starting PDF generation for job: {job_id}, report: {report_id}")
    db.update_pdf_job(job_id, status="PROCESSING")
    
    # Define paths and URLs
    nextjs_url = f"http://127.0.0.1:3000/reports/{report_id}/preview"
    output_filename = f"SDG_Report_{report_id}.pdf"
    
    # Store temporarily in temp partition first
    output_filepath = os.path.join(PARTITIONS["temp"], output_filename)
    
    try:
        async with async_playwright() as p:
            # Launch chromium locally
            browser = await p.chromium.launch(
                headless=True,
                args=['--no-sandbox', '--disable-setuid-sandbox']
            )
            page = await browser.new_page()
            
            # Navigate to the preview URL. Wait for networkidle to ensure Tailwind CDN is loaded.
            logger.info(f"Navigating to {nextjs_url}")
            response = await page.goto(nextjs_url, wait_until="networkidle", timeout=30000)
            
            if response is None or not response.ok:
                raise Exception(f"Failed to fetch preview page. Status: {response.status if response else 'Unknown'}")
                
            # Generate the PDF
            await page.pdf(
                path=output_filepath,
                format="A4",
                print_background=True,
                margin={"top": "0px", "right": "0px", "bottom": "0px", "left": "0px"}
            )
            await browser.close()
            
        # Verify file size
        if not os.path.exists(output_filepath) or os.path.getsize(output_filepath) == 0:
            raise Exception("Generated PDF file is empty or missing.")
            
        # Register file via StorageService (this will move it to the proper persistent directory and log it)
        # We need the owner_id to properly assign the file. Let's get it from the project.
        conn = db.get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT student_id FROM projects WHERE id = %s", (project_id,))
        proj_record = cursor.fetchone()
        owner_id = proj_record["student_id"] if proj_record else "system"
        
        reg = StorageService.register_system_file(
            source_path=output_filepath, 
            owner_id=owner_id, 
            project_id=project_id, 
            original_filename=output_filename, 
            mime_type="application/pdf"
        )
            
        logger.info(f"Successfully generated and stored PDF: {reg['absolute_path']}")
        
        # Update pdf_job with new storage location
        db.update_pdf_job(job_id, status="COMPLETED", storage_location=reg['absolute_path'])
        
    except Exception as e:
        logger.error(f"Error generating PDF for job {job_id}: {str(e)}")
        db.update_pdf_job(job_id, status="FAILED", error=str(e))

async def pdf_worker_task():
    logger.info("PDF Worker started and waiting for jobs.")
    while True:
        job = await pdf_job_queue.get()
        try:
            await generate_pdf(job["job_id"], job["report_id"], job["project_id"])
        except Exception as e:
            logger.error(f"Unhandled error in PDF worker: {e}")
        finally:
            pdf_job_queue.task_done()

async def start_pdf_workers(num_workers: int = 2):
    workers = []
    for _ in range(num_workers):
        task = asyncio.create_task(pdf_worker_task())
        workers.append(task)
    return workers

async def enqueue_pdf_job(job_id: str, report_id: str, project_id: str):
    await pdf_job_queue.put({
        "job_id": job_id,
        "report_id": report_id,
        "project_id": project_id
    })
