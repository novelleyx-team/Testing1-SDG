import uuid
import logging
from typing import Dict, Any

from Superbase_db import database as db
from .templates import TemplateEngine

logger = logging.getLogger("NotificationService")

class NotificationService:
    """
    Recipient Policy Engine. 
    Enforces strict access control and recipient lookup.
    Never accepts AI-generated contact details.
    """
    
    @staticmethod
    def queue_notification(event_type: str, resource_id: str, payload: Dict[str, Any]):
        """
        Creates a notification safely by looking up the authorized user from the database.
        """
        logger.info(f"Processing outbox event: {event_type} for resource {resource_id}")
        
        if event_type == "ANALYSIS_COMPLETED":
            NotificationService._handle_analysis_completed(resource_id, payload)
        elif event_type == "ANALYSIS_FAILED":
            NotificationService._handle_analysis_failed(resource_id, payload)
        else:
            logger.warning(f"Unknown event type: {event_type}")

    @staticmethod
    def _handle_analysis_completed(project_id: str, payload: Dict[str, Any]):
        # 1. Lookup Project Owner securely
        conn = db.get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT student_id, title FROM projects WHERE id = %s", (project_id,))
        project = cursor.fetchone()
        
        if not project:
            logger.error(f"Project {project_id} not found.")
            return
            
        student_id = project["student_id"]
        project_name = project["title"]
        
        # 2. Retrieve Verified Contact Details
        cursor.execute("SELECT email, name FROM users WHERE id = %s", (student_id,))
        user = cursor.fetchone()
        
        if not user or not user["email"]:
            logger.error(f"Verified email not found for student {student_id}")
            return
            
        # 3. Create Notification Record
        notification_id = f"notif-{uuid.uuid4().hex[:8]}"
        db.create_notification(
            notification_id=notification_id,
            event_type="ANALYSIS_COMPLETED",
            recipient_user_id=student_id,
            recipient_role="STUDENT",
            channel="EMAIL",
            contact_reference=user["email"], # Authoritative DB source
            template_id="ANALYSIS_COMPLETED_EMAIL"
        )
        
        logger.info(f"Notification {notification_id} queued for {student_id}")

    @staticmethod
    def _handle_analysis_failed(project_id: str, payload: Dict[str, Any]):
        # Similar secure lookup logic
        conn = db.get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT student_id, title FROM projects WHERE id = %s", (project_id,))
        project = cursor.fetchone()
        
        if not project: return
        student_id = project["student_id"]
        
        cursor.execute("SELECT email, name FROM users WHERE id = %s", (student_id,))
        user = cursor.fetchone()
        
        if not user or not user["email"]: return
            
        notification_id = f"notif-{uuid.uuid4().hex[:8]}"
        db.create_notification(
            notification_id=notification_id,
            event_type="ANALYSIS_FAILED",
            recipient_user_id=student_id,
            recipient_role="STUDENT",
            channel="EMAIL",
            contact_reference=user["email"],
            template_id="ANALYSIS_FAILED_EMAIL"
        )
