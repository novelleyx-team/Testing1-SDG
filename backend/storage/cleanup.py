import os
import time
import logging
import asyncio
from backend.storage.config import PARTITIONS
from Superbase_db import database as db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("StorageCleanup")

# Delete temporary files older than 1 hour
TEMP_MAX_AGE = 3600

async def cleanup_temp_partition():
    while True:
        try:
            logger.info("Running storage cleanup task...")
            temp_dir = PARTITIONS["temp"]
            now = time.time()
            
            # Clean orphaned temp files
            for filename in os.listdir(temp_dir):
                file_path = os.path.join(temp_dir, filename)
                if os.path.isfile(file_path):
                    if os.stat(file_path).st_mtime < now - TEMP_MAX_AGE:
                        logger.info(f"Removing stale temp file: {filename}")
                        os.remove(file_path)
            
            # Additional DB reconciliation logic could go here
            # For example, finding 'PROCESSING' pdf_jobs that are stuck for hours
                        
        except Exception as e:
            logger.error(f"Error during storage cleanup: {e}")
            
        await asyncio.sleep(3600) # Run once an hour

async def start_cleanup_worker():
    return asyncio.create_task(cleanup_temp_partition())
