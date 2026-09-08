import os
import sys
import json
import uuid
import time
from unittest.mock import patch

# Ensure paths
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from backend.jobs.state_machine import JobStateMachine
from backend.notifications.worker import NotificationWorker
from backend.notifications.service import NotificationService
from Superbase_db import database as db

def run_tests():
    print("--- Running Production Architecture Verification ---")
    
    # Setup Mock Data
    student_id = f"user-{uuid.uuid4().hex[:6]}"
    project_id = f"proj-{uuid.uuid4().hex[:6]}"
    job_id = f"job-{uuid.uuid4().hex[:6]}"
    
    db.create_user(student_id, "Test Student", "test@novelleyx.com", "student", department="Computer Science")
    db.create_project(project_id, student_id, "Test SDG Project", "Testing abstract", "Pending", None, "Computer Science", 0)
    db.create_job(job_id, project_id, "QUEUED", "Pending")
    
    print(f"\n[1] Testing Job State Machine")
    try:
        # Invalid Transition
        JobStateMachine.transition_state(job_id, "COMPLETED")
        print("FAIL: Allowed invalid transition from QUEUED to COMPLETED")
    except ValueError:
        print("PASS: Prevented invalid transition from QUEUED to COMPLETED")
        
    # Valid Transitions
    JobStateMachine.transition_state(job_id, "PROCESSING")
    JobStateMachine.transition_state(job_id, "COMPLETED", result='{"test": "success"}')
    print("PASS: Valid transition QUEUED -> PROCESSING -> COMPLETED")
    
    print(f"\n[2] Testing Outbox Event Creation")
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM outbox_events WHERE status = 'PENDING'")
    events = cursor.fetchall()
    
    found = False
    for evt in events:
        if f"evt-comp-{job_id}" in evt["id"]:
            found = True
            break
            
    if found:
        print("PASS: Outbox event created transactionally on job completion")
    else:
        print("FAIL: Outbox event not found")
        
    print(f"\n[3] Testing Notification Worker & Idempotency")
    NotificationWorker.process_outbox()
    
    # Check if notification was created securely
    cursor.execute("SELECT * FROM notifications WHERE recipient_user_id = %s", (student_id,))
    notifs = cursor.fetchall()
    if len(notifs) == 1 and notifs[0]["contact_reference"] == "test@novelleyx.com":
        print("PASS: Notification created securely via Recipient Policy Engine")
    else:
        print("FAIL: Notification not created correctly")
        
    # Run again to test idempotency
    NotificationWorker.process_outbox()
    cursor.execute("SELECT * FROM notifications WHERE recipient_user_id = %s", (student_id,))
    notifs_after = cursor.fetchall()
    if len(notifs_after) == 1:
        print("PASS: Idempotency prevented duplicate notifications")
    else:
        print("FAIL: Idempotency failed, duplicates created")
        
    print(f"\n[4] Testing Notification Delivery Simulation")
    NotificationWorker.send_queued_notifications()
    cursor.execute("SELECT * FROM notifications WHERE recipient_user_id = %s", (student_id,))
    final_notifs = cursor.fetchall()
    if final_notifs[0]["status"] == "DELIVERED":
        print("PASS: Notification delivery and tracking succeeded")
    else:
        print(f"FAIL: Notification status is {final_notifs[0]['status']}")

    print("\n--- Tests Completed ---")

if __name__ == "__main__":
    run_tests()
