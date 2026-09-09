import time
import logging
import os
import httpx
from typing import List

from Superbase_db import database as db
from .service import NotificationService
from .templates import TemplateEngine

logger = logging.getLogger("NotificationWorker")

class NotificationWorker:
    """
    Background worker that strictly polls the Transactional Outbox
    and safely processes notifications via idempotency keys.
    """
    
    @staticmethod
    def process_outbox():
        """Polls for pending events and generates notifications."""
        conn = db.get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # 1. Fetch pending outbox events
        cursor.execute("SELECT * FROM outbox_events WHERE status = 'PENDING' LIMIT 50")
        events = cursor.fetchall()
        
        for event in events:
            logger.info(f"Processing outbox event: {event['id']}")
            try:
                # 2. Check Idempotency - Has this outbox event already been processed?
                idem_key = f"outbox-{event['id']}"
                if db.check_idempotency_key(idem_key, "PROCESS_OUTBOX"):
                    logger.warning(f"Event {event['id']} already processed via idempotency check.")
                    cursor.execute("UPDATE outbox_events SET status = 'PROCESSED' WHERE id = %s", (event['id'],))
                    conn.commit()
                    continue
                
                # 3. Route to Notification Policy Engine
                import json
                payload = json.loads(event['payload'])
                resource_id = payload.get("project_id", "")
                
                NotificationService.queue_notification(
                    event_type=event['event_type'],
                    resource_id=resource_id,
                    payload=payload
                )
                
                # 4. Mark Processed and Save Idempotency
                cursor.execute("UPDATE outbox_events SET status = 'PROCESSED', processed_at = CURRENT_TIMESTAMP WHERE id = %s", (event['id'],))
                db.save_idempotency_key(idem_key, "PROCESS_OUTBOX", event['id'], {"status": "success"})
                
            except Exception as e:
                logger.error(f"Failed to process outbox event {event['id']}: {e}")
                cursor.execute("UPDATE outbox_events SET status = 'FAILED' WHERE id = %s", (event['id'],))
                conn.commit()

    @staticmethod
    def send_queued_notifications():
        """Polls the notifications table and sends via configured Provider APIs."""
        conn = db.get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM notifications WHERE status = 'QUEUED' LIMIT 50")
        notifications = cursor.fetchall()
        
        provider_url = os.getenv("EMAIL_PROVIDER_URL", "https://api.resend.com/emails")
        provider_key = os.getenv("EMAIL_PROVIDER_KEY", "re_123456789")
        
        for notif in notifications:
            logger.info(f"Sending notification {notif['id']} to {notif['contact_reference']}")
            try:
                # Render strict template
                user_info = {"student_name": "Student", "project_name": "Your Project", "report_link": f"https://novelleyx.com/reports/{notif['id']}"}
                rendered = TemplateEngine.render(notif['template_id'], user_info, notif['channel'])
                
                # Real API call to Email Provider (Resend API format as example)
                with httpx.Client() as client:
                    response = client.post(
                        provider_url,
                        headers={
                            "Authorization": f"Bearer {provider_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "from": "notifications@novelleyx.com",
                            "to": notif['contact_reference'],
                            "subject": "Novelleyx SDG Report Update",
                            "html": rendered
                        },
                        timeout=10.0
                    )
                    response.raise_for_status()
                    provider_message_id = response.json().get("id", f"msg-{notif['id']}")
                
                logger.info(f"Successfully sent via Provider API. Message ID: {provider_message_id}")
                
                # Update status
                db.update_notification_status(
                    notification_id=notif['id'],
                    status='DELIVERED', # Ideally QUEUED at provider, and Webhook sets DELIVERED
                    provider_message_id=provider_message_id
                )
                
                
            except Exception as e:
                logger.error(f"Failed to send notification {notif['id']}: {e}")
                db.update_notification_status(
                    notification_id=notif['id'],
                    status='FAILED',
                    failure_reason=str(e)
                )

    @staticmethod
    def run_worker_loop():
        """Runs the worker in a continuous polling loop."""
        logger.info("Starting Notification Worker Loop...")
        while True:
            try:
                NotificationWorker.process_outbox()
                NotificationWorker.send_queued_notifications()
            except Exception as e:
                logger.error(f"Worker iteration error: {e}")
            time.sleep(5)
