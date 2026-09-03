import sqlite3
import os
import datetime
import threading
import json

class MockCursor:
    def __init__(self, conn, dictionary=False):
        self.conn = conn
        self.cursor = conn.cursor()
        self.dictionary = dictionary
        
    def execute(self, query, params=()):
        q = query.replace('%s', '?')
        self.cursor.execute(q, params)
        return self
        
    def fetchone(self):
        row = self.cursor.fetchone()
        if not row: return None
        if self.dictionary:
            return dict(zip([col[0] for col in self.cursor.description], row))
        return row
        
    def fetchall(self):
        rows = self.cursor.fetchall()
        if not rows: return []
        if self.dictionary:
            cols = [col[0] for col in self.cursor.description]
            return [dict(zip(cols, row)) for row in rows]
        return rows
        
    def close(self):
        self.cursor.close()
        
    @property
    def lastrowid(self):
        return self.cursor.lastrowid

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sqlite.db")

# Thread-local storage for SQLite connections
_local = threading.local()

def get_db_connection():
    if not hasattr(_local, "conn"):
        # Enable WAL for high concurrency
        conn = sqlite3.connect(DB_FILE, check_same_thread=False, timeout=15.0)
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=NORMAL;")
        _local.conn = conn
        _init_db(conn)
    
    # Return a wrapper to match the expected interface
    class ConnWrapper:
        def __init__(self, c):
            self.conn = c
        def cursor(self, dictionary=False):
            return MockCursor(self.conn, dictionary)
        def commit(self):
            self.conn.commit()
        def close(self):
            pass # Keep thread-local connection open
    return ConnWrapper(_local.conn)

def _init_db(conn):
    conn.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        role TEXT,
        avatar TEXT,
        college_id TEXT,
        department TEXT,
        department_id INTEGER
    )''')
    conn.execute('''
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        student_id TEXT,
        title TEXT,
        abstract TEXT,
        status TEXT,
        faculty_id TEXT,
        department TEXT,
        department_id INTEGER,
        sdg_match_score INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    conn.execute('''
    CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
    )''')
    
    # NEW TABLES FOR SCALABILITY
    conn.execute('''
    CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        status TEXT,
        stage TEXT,
        result TEXT,
        error TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        report_data TEXT,
        pdf_url TEXT,
        radar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS pdf_jobs (
        id TEXT PRIMARY KEY,
        report_id TEXT,
        project_id TEXT,
        version TEXT,
        model_version TEXT,
        status TEXT,
        storage_location TEXT,
        error TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    
    # Seed Departments
    official_deps = [
        "Computer Science", 
        "Computer Science Data (CSD)", 
        "Artificial Intelligence & Machine Learning", 
        "Mechanical Engineering", 
        "Civil Engineering", 
        "Electronics & Communication", 
        "Electrical Engineering",
        "Information Technology",
        "Cyber Security",
        "MBA",
        "Other"
    ]
    for dep in official_deps:
        conn.execute("INSERT OR IGNORE INTO departments (name) VALUES (?)", (dep,))
        
    # Auto-migrate legacy columns if department_id is null
    try:
        # We try to add columns just in case the tables were created before this script update
        # SQLite ALTER TABLE ADD COLUMN ignores if it exists (in some versions, but we catch the error)
        conn.execute("ALTER TABLE users ADD COLUMN department_id INTEGER")
    except:
        pass
    try:
        conn.execute("ALTER TABLE projects ADD COLUMN department_id INTEGER")
    except:
        pass
        
    # Migrate data
    conn.execute("""
        UPDATE users 
        SET department_id = (SELECT id FROM departments WHERE name = users.department)
        WHERE department_id IS NULL AND department IS NOT NULL
    """)
    conn.execute("""
        UPDATE projects 
        SET department_id = (SELECT id FROM departments WHERE name = projects.department)
        WHERE department_id IS NULL AND department IS NOT NULL
    """)
    
    conn.commit()


# --- USERS & DEPARTMENTS ---

def create_department(name: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO departments (name) VALUES (%s)", (name,))
    conn.commit()
    return cursor.lastrowid

def get_departments():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM departments")
    return cursor.fetchall()

def create_user(user_id, name, email, role, avatar=None, college_id=None, department=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    # Resolve department ID first
    cursor.execute("SELECT id FROM departments WHERE name = %s", (department,))
    dep_row = cursor.fetchone()
    dep_id = dep_row[0] if dep_row else None
    
    query = """INSERT INTO users (id, name, email, role, avatar, college_id, department, department_id) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
    cursor.execute(query, (user_id, name, email, role, avatar, college_id, department, dep_id))
    conn.commit()
    return user_id

def get_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT u.*, d.name as department_name 
        FROM users u 
        LEFT JOIN departments d ON u.department_id = d.id 
        WHERE u.id = %s
    """, (user_id,))
    user = cursor.fetchone()
    if user and user.get('department_name'):
        user['department'] = user['department_name']  # Ensure canonical value
    return user

# --- PROJECTS ---

def create_project(project_id, student_id, title, abstract, status, faculty_id, department, sdg_match_score):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM departments WHERE name = %s", (department,))
    dep_row = cursor.fetchone()
    dep_id = dep_row[0] if dep_row else None
    
    query = """INSERT INTO projects (id, student_id, title, abstract, status, faculty_id, department, department_id, sdg_match_score) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    cursor.execute(query, (project_id, student_id, title, abstract, status, faculty_id, department, dep_id, sdg_match_score))
    conn.commit()
    return project_id

def get_projects_by_student(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.*, d.name as department_name 
        FROM projects p 
        LEFT JOIN departments d ON p.department_id = d.id 
        WHERE p.student_id = %s
    """, (student_id,))
    res = cursor.fetchall()
    for r in res:
        if r.get('department_name'):
            r['department'] = r['department_name']
        if isinstance(r.get('created_at'), str):
            try:
                r['created_at'] = datetime.datetime.strptime(r['created_at'], "%Y-%m-%d %H:%M:%S")
            except:
                pass
    return res

def get_all_projects():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.*, d.name as department_name 
        FROM projects p 
        LEFT JOIN departments d ON p.department_id = d.id
    """)
    res = cursor.fetchall()
    for r in res:
        if r.get('department_name'):
            r['department'] = r['department_name']
        if isinstance(r.get('created_at'), str):
            try:
                r['created_at'] = datetime.datetime.strptime(r['created_at'], "%Y-%m-%d %H:%M:%S")
            except:
                pass
    return res

# --- JOBS (NEW) ---

def create_job(job_id, project_id, status="QUEUED", stage="Pending"):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """INSERT INTO jobs (id, project_id, status, stage) VALUES (%s, %s, %s, %s)"""
    cursor.execute(query, (job_id, project_id, status, stage))
    conn.commit()
    return job_id

def update_job(job_id, status=None, stage=None, result=None, error=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    updates = []
    params = []
    if status is not None:
        updates.append("status = %s")
        params.append(status)
    if stage is not None:
        updates.append("stage = %s")
        params.append(stage)
    if result is not None:
        updates.append("result = %s")
        if isinstance(result, (dict, list)):
            result = json.dumps(result)
        params.append(result)
    if error is not None:
        updates.append("error = %s")
        params.append(error)
        
    if not updates:
        return
        
    updates.append("updated_at = CURRENT_TIMESTAMP")
    
    query = f"UPDATE jobs SET {', '.join(updates)} WHERE id = %s"
    params.append(job_id)
    
    cursor.execute(query, tuple(params))
    conn.commit()

def get_job(job_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM jobs WHERE id = %s", (job_id,))
    return cursor.fetchone()

# --- REPORTS (NEW) ---

def create_report(report_id, project_id, report_data, pdf_url=None, radar_url=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if isinstance(report_data, (dict, list)):
        report_data = json.dumps(report_data)
    query = """INSERT INTO reports (id, project_id, report_data, pdf_url, radar_url) 
               VALUES (%s, %s, %s, %s, %s)"""
    cursor.execute(query, (report_id, project_id, report_data, pdf_url, radar_url))
    
    # Also update project score and status
    try:
        report_json = json.loads(report_data)
        score = report_json.get("impact", {}).get("overall_score", 0)
        cursor.execute("UPDATE projects SET sdg_match_score = %s, status = 'Completed' WHERE id = %s", (score, project_id))
    except:
        pass
        
    conn.commit()
    return report_id

def get_report_by_project(project_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM reports WHERE project_id = %s ORDER BY created_at DESC LIMIT 1", (project_id,))
    return cursor.fetchone()

# --- PDF JOBS (NEW) ---

def create_pdf_job(job_id, report_id, project_id, version="1.0", model_version="1.0"):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """INSERT INTO pdf_jobs (id, report_id, project_id, version, model_version, status) 
               VALUES (%s, %s, %s, %s, %s, 'QUEUED')"""
    cursor.execute(query, (job_id, report_id, project_id, version, model_version))
    conn.commit()
    return job_id

def update_pdf_job(job_id, status=None, storage_location=None, error=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    updates = []
    params = []
    if status is not None:
        updates.append("status = %s")
        params.append(status)
    if storage_location is not None:
        updates.append("storage_location = %s")
        params.append(storage_location)
    if error is not None:
        updates.append("error = %s")
        params.append(error)
        
    if not updates:
        return
        
    updates.append("updated_at = CURRENT_TIMESTAMP")
    
    query = f"UPDATE pdf_jobs SET {', '.join(updates)} WHERE id = %s"
    params.append(job_id)
    
    cursor.execute(query, tuple(params))
    conn.commit()

def get_pdf_job(job_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM pdf_jobs WHERE id = %s", (job_id,))
    return cursor.fetchone()

# --- ANALYTICS ---

def get_student_analytics(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT COUNT(*) as count FROM projects WHERE student_id = %s", (student_id,))
    total_projects = cursor.fetchone()['count']
    
    cursor.execute("SELECT AVG(sdg_match_score) as avg_score FROM projects WHERE student_id = %s AND sdg_match_score > 0", (student_id,))
    avg_score = cursor.fetchone()['avg_score'] or 0
    
    cursor.execute("SELECT COUNT(*) as count FROM projects WHERE student_id = %s AND status = 'Pending'", (student_id,))
    pending = cursor.fetchone()['count']
    
    return {
        "total_projects": total_projects,
        "average_score": round(avg_score, 1),
        "pending_projects": pending
    }

def get_faculty_analytics(department):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    if not department:
        return {"department_projects": 0, "average_score": 0.0, "pending_review": 0}
        
    cursor.execute("SELECT id FROM departments WHERE name = %s", (department,))
    dep_row = cursor.fetchone()
    
    if not dep_row:
        # Fallback if somehow department wasn't migrated
        cursor.execute("SELECT COUNT(*) as count FROM projects WHERE department = %s", (department,))
        total = cursor.fetchone()['count']
        cursor.execute("SELECT AVG(sdg_match_score) as avg FROM projects WHERE department = %s AND sdg_match_score > 0", (department,))
        avg = cursor.fetchone()['avg'] or 0
        cursor.execute("SELECT COUNT(*) as count FROM projects WHERE department = %s AND status = 'Pending'", (department,))
        pending = cursor.fetchone()['count']
    else:
        dep_id = dep_row['id']
        cursor.execute("SELECT COUNT(*) as count FROM projects WHERE department_id = %s", (dep_id,))
        total = cursor.fetchone()['count']
        cursor.execute("SELECT AVG(sdg_match_score) as avg FROM projects WHERE department_id = %s AND sdg_match_score > 0", (dep_id,))
        avg = cursor.fetchone()['avg'] or 0
        cursor.execute("SELECT COUNT(*) as count FROM projects WHERE department_id = %s AND status = 'Pending'", (dep_id,))
        pending = cursor.fetchone()['count']
    
    return {
        "department_projects": total,
        "average_score": round(avg, 1),
        "pending_review": pending
    }

def get_leadership_analytics():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT COUNT(*) as count FROM users WHERE role = 'student'")
    students = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) as count FROM projects")
    projects = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) as count FROM projects WHERE status = 'Completed'")
    completed = cursor.fetchone()['count']
    
    return {
        "total_students": students,
        "total_projects": projects,
        "completed_projects": completed
    }

def get_admin_analytics():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT COUNT(*) as count FROM users")
    users = cursor.fetchone()['count']
    
    return {
        "total_users": users,
        "active_sessions": users,  # Simplified for now
        "system_uptime": "99.9%",
        "security_alerts": 0
    }
