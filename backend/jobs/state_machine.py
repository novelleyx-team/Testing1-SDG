import logging
from typing import Optional
from Superbase_db import database as db

logger = logging.getLogger("JobStateMachine")

class JobStateMachine:
    """
    Enforces strict state transitions for system jobs.
    Prevents states from skipping or rolling back unexpectedly.
    """
    
    VALID_TRANSITIONS = {
        "DRAFT": ["SUBMITTED"],
        "SUBMITTED": ["VALIDATING"],
        "VALIDATING": ["VALIDATED", "VALIDATION_FAILED"],
        "VALIDATED": ["ANALYZING"],
        "ANALYZING": ["ANALYSIS_VALIDATING", "ANALYSIS_FAILED", "SYSTEM_FAILED"],
        "ANALYSIS_VALIDATING": ["COMPLETED", "ANALYSIS_FAILED"],
        "QUEUED": ["PROCESSING", "FAILED", "SYSTEM_FAILED"],
        "PROCESSING": ["COMPLETED", "FAILED", "SYSTEM_FAILED"],
        "COMPLETED": [], # Terminal state
        "VALIDATION_FAILED": ["SUBMITTED"], # Retry
        "ANALYSIS_FAILED": ["ANALYZING"], # Retry
        "SYSTEM_FAILED": ["ANALYZING", "QUEUED", "PROCESSING"], # Retry
        "FAILED": ["QUEUED", "PROCESSING"] # Retry
    }
    
    @staticmethod
    def transition_state(job_id: str, new_state: str, result: Optional[str] = None, error: Optional[str] = None) -> bool:
        """
        Attempts to transition a job to a new state.
        Returns True if successful, raises ValueError if the transition is invalid.
        """
        # Note: Depending on the implementation of get_job, it might return a dictionary or tuple.
        # Here we assume it returns a dictionary based on database.py's implementation.
        job = db.get_job(job_id)
        if not job:
            raise ValueError(f"Job {job_id} not found.")
            
        current_state = job.get('status', 'UNKNOWN')
        
        # If it's already in the new state, return True (idempotent)
        if current_state == new_state:
            logger.info(f"Job {job_id} is already in state {new_state}.")
            return True
            
        # Check valid transitions
        allowed_next_states = JobStateMachine.VALID_TRANSITIONS.get(current_state, [])
        if new_state not in allowed_next_states:
            logger.error(f"Invalid state transition for {job_id}: {current_state} -> {new_state}")
            raise ValueError(f"Invalid transition: Cannot move from {current_state} to {new_state}")
            
        # Perform transition transactionally
        logger.info(f"Transitioning job {job_id}: {current_state} -> {new_state}")
        
        # We manually construct the queries to ensure atomicity within the same transaction wrapper
        import json
        with db.get_db_connection() as conn:
            cursor = conn.cursor()
            
            # 1. Update Job
            updates = ["status = %s"]
            params = [new_state]
            if result is not None:
                updates.append("result = %s")
                params.append(json.dumps(result) if isinstance(result, (dict, list)) else result)
            if error is not None:
                updates.append("error = %s")
                params.append(error)
            updates.append("updated_at = CURRENT_TIMESTAMP")
            
            query = f"UPDATE jobs SET {', '.join(updates)} WHERE id = %s"
            params.append(job_id)
            cursor.execute(query, tuple(params))
            
            # 2. Transactional Outbox hook
            if new_state == "COMPLETED":
                event_id = f"evt-comp-{job_id}"
                payload = json.dumps({"job_id": job_id, "project_id": job.get('project_id')})
                cursor.execute("INSERT INTO outbox_events (id, event_type, payload) VALUES (%s, %s, %s)",
                               (event_id, "ANALYSIS_COMPLETED", payload))
                
            elif new_state in ["ANALYSIS_FAILED", "SYSTEM_FAILED", "VALIDATION_FAILED"]:
                event_id = f"evt-fail-{job_id}"
                payload = json.dumps({"job_id": job_id, "project_id": job.get('project_id'), "error": error})
                cursor.execute("INSERT INTO outbox_events (id, event_type, payload) VALUES (%s, %s, %s)",
                               (event_id, "ANALYSIS_FAILED", payload))
            
            # The context manager __exit__ will automatically commit()
            
        return True
