import sqlite3
import json
from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "dev_brain.db")

class Lesson(BaseModel):
    title: str = Field(..., description="Short summary of the lesson")
    problem: str = Field(..., description="What was the error or requirement")
    context: str = Field(..., description="Files or architecture involved")
    attempt: str = Field(..., description="What was tried first")
    result: str = Field(..., description="What happened")
    failure_reason: str = Field(..., description="Why it failed (if applicable)")
    solution: str = Field(..., description="The correct approach")
    verification: str = Field(..., description="How it was tested")
    category: str = Field(..., description="CODE, ARCHITECTURE, SECURITY, DATABASE, AI, PERFORMANCE, DEPLOYMENT, TESTING")
    confidence: str = Field(default="VERIFIED", description="PROPOSED, VERIFIED, TRUSTED, DEPRECATED")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS lessons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            problem TEXT,
            context TEXT,
            attempt TEXT,
            result TEXT,
            failure_reason TEXT,
            solution TEXT,
            verification TEXT,
            category TEXT,
            confidence TEXT,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            project_version TEXT
        )
    ''')
    conn.commit()
    conn.close()

def store_lesson(lesson: Lesson, project_version: str = "1.0"):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        INSERT INTO lessons (title, problem, context, attempt, result, failure_reason, solution, verification, category, confidence, project_version)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        lesson.title, lesson.problem, lesson.context, lesson.attempt, lesson.result,
        lesson.failure_reason, lesson.solution, lesson.verification, lesson.category,
        lesson.confidence, project_version
    ))
    conn.commit()
    conn.close()
    return True

def retrieve_lessons(category: Optional[str] = None, limit: int = 10):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    if category:
        c.execute("SELECT * FROM lessons WHERE category = ? ORDER BY date DESC LIMIT ?", (category, limit))
    else:
        c.execute("SELECT * FROM lessons ORDER BY date DESC LIMIT ?", (limit,))
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# Initialize DB on load
init_db()
