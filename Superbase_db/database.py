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
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS files (
        file_id TEXT PRIMARY KEY,
        owner_id TEXT,
        project_id TEXT,
        original_filename TEXT,
        storage_key TEXT,
        mime_type TEXT,
        size_bytes INTEGER,
        checksum TEXT,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS storage_usage (
        scope TEXT,
        scope_id TEXT,
        bytes_used INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(scope, scope_id)
    )''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS storage_events (
        event_id TEXT PRIMARY KEY,
        file_id TEXT,
        action TEXT,
        actor_id TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    
    # --- AI ANALYSIS TABLES ---
    conn.execute('''
    CREATE TABLE IF NOT EXISTS ai_analysis (
        analysis_id TEXT PRIMARY KEY,
        project_id TEXT,
        submission_version INTEGER DEFAULT 1,
        status TEXT,
        overall_confidence REAL,
        overall_sdg_assessment TEXT,
        environmental_impact TEXT,
        social_impact TEXT,
        economic_impact TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS ai_sdg_mappings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id TEXT,
        sdg_number INTEGER,
        sdg_name TEXT,
        classification TEXT,
        target TEXT,
        reasoning TEXT,
        evidence TEXT,
        evidence_strength TEXT,
        confidence REAL
    )''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS ai_claims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id TEXT,
        claim TEXT,
        source TEXT,
        evidence TEXT,
        verification_status TEXT
    )''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS ai_recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id TEXT,
        recommendation TEXT
    )''')

    conn.execute('''
    CREATE TABLE IF NOT EXISTS ai_contradictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id TEXT,
        student_claim TEXT,
        documented_result TEXT,
        measured_result TEXT,
        verification_status TEXT,
        explanation TEXT
    )''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS ai_kpis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id TEXT,
        kpi_name TEXT,
        original_value TEXT,
        original_unit TEXT,
        normalized_value REAL,
        normalized_unit TEXT,
        evidence TEXT
    )''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS ai_government_alignment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id TEXT,
        government_body TEXT,
        framework_name TEXT,
        indicator TEXT,
        alignment_strength TEXT,
        evidence TEXT
    )''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS ai_sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id TEXT,
        source_title TEXT,
        organization TEXT,
        url TEXT,
        publication_date TEXT,
        source_type TEXT,
        authority_level TEXT,
        relevant_claim TEXT
    )''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS knowledge_documents (
        id TEXT PRIMARY KEY,
        content TEXT,
        source_type TEXT,
        authority_level TEXT,
        retrieved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        version TEXT
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

# --- STORAGE MANAGEMENT ---

def register_file(file_id, owner_id, project_id, original_filename, storage_key, mime_type, size_bytes, checksum, status="ACTIVE"):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """INSERT INTO files (file_id, owner_id, project_id, original_filename, storage_key, mime_type, size_bytes, checksum, status) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    cursor.execute(query, (file_id, owner_id, project_id, original_filename, storage_key, mime_type, size_bytes, checksum, status))
    conn.commit()
    return file_id

def get_file(file_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM files WHERE file_id = %s", (file_id,))
    return cursor.fetchone()

def update_file_status(file_id, status):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE files SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE file_id = %s", (status, file_id))
    conn.commit()

def record_storage_usage(scope, scope_id, bytes_diff):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT bytes_used FROM storage_usage WHERE scope = %s AND scope_id = %s", (scope, scope_id))
    row = cursor.fetchone()
    if row:
        new_bytes = max(0, row[0] + bytes_diff)
        cursor.execute("UPDATE storage_usage SET bytes_used = %s, updated_at = CURRENT_TIMESTAMP WHERE scope = %s AND scope_id = %s", 
                       (new_bytes, scope, scope_id))
    else:
        new_bytes = max(0, bytes_diff)
        cursor.execute("INSERT INTO storage_usage (scope, scope_id, bytes_used) VALUES (%s, %s, %s)", 
                       (scope, scope_id, new_bytes))
    conn.commit()
    return new_bytes

def get_storage_usage(scope, scope_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT bytes_used FROM storage_usage WHERE scope = %s AND scope_id = %s", (scope, scope_id))
    row = cursor.fetchone()
    return row[0] if row else 0

def log_storage_event(event_id, file_id, action, actor_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """INSERT INTO storage_events (event_id, file_id, action, actor_id) VALUES (%s, %s, %s, %s)"""
    cursor.execute(query, (event_id, file_id, action, actor_id))
    conn.commit()

# --- AI ANALYSIS MANAGEMENT ---

def create_ai_analysis(analysis_id, project_id, version=1):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO ai_analysis (analysis_id, project_id, submission_version, status) VALUES (%s, %s, %s, 'PROCESSING')",
                   (analysis_id, project_id, version))
    conn.commit()
    return analysis_id

def update_ai_analysis_status(analysis_id, status):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE ai_analysis SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE analysis_id = %s", (status, analysis_id))
    conn.commit()

def save_ai_analysis_results(analysis_id, data: dict):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Update main table
    cursor.execute("""
        UPDATE ai_analysis 
        SET overall_confidence = %s, overall_sdg_assessment = %s, environmental_impact = %s, social_impact = %s, economic_impact = %s, status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP
        WHERE analysis_id = %s
    """, (
        data.get("overall_confidence"),
        data.get("overall_sdg_assessment"),
        data.get("environmental_impact"),
        data.get("social_impact"),
        data.get("economic_impact"),
        analysis_id
    ))
    
    # Insert mappings
    for sdg in data.get("sdgs", []):
        cursor.execute("""
            INSERT INTO ai_sdg_mappings (analysis_id, sdg_number, sdg_name, classification, target, reasoning, evidence, evidence_strength, confidence)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            analysis_id, sdg.get("sdg_number"), sdg.get("sdg_name"), sdg.get("classification"),
            sdg.get("target"), sdg.get("reasoning"), sdg.get("evidence"), sdg.get("evidence_strength"), sdg.get("confidence")
        ))
        
    # Insert claims
    for claim in data.get("claims", []):
        cursor.execute("""
            INSERT INTO ai_claims (analysis_id, claim, source, evidence, verification_status)
            VALUES (%s, %s, %s, %s, %s)
        """, (analysis_id, claim.get("claim"), claim.get("source"), claim.get("evidence"), claim.get("verification_status")))
        
    # Insert recommendations
    for rec in data.get("recommendations", []):
        cursor.execute("""
            INSERT INTO ai_recommendations (analysis_id, recommendation)
            VALUES (%s, %s)
        """, (analysis_id, rec))
        
    # Insert contradictions
    for contra in data.get("contradictions", []):
        cursor.execute("""
            INSERT INTO ai_contradictions (analysis_id, student_claim, documented_result, measured_result, verification_status, explanation)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (analysis_id, contra.get("student_claim"), contra.get("documented_result"), contra.get("measured_result"), contra.get("verification_status"), contra.get("explanation")))
        
    # Insert KPIs
    for kpi in data.get("kpis", []):
        cursor.execute("""
            INSERT INTO ai_kpis (analysis_id, kpi_name, original_value, original_unit, normalized_value, normalized_unit, evidence)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (analysis_id, kpi.get("kpi_name"), kpi.get("original_value"), kpi.get("original_unit"), kpi.get("normalized_value"), kpi.get("normalized_unit"), kpi.get("evidence")))
        
    # Insert Government Alignment
    for gov in data.get("government_alignment", []):
        cursor.execute("""
            INSERT INTO ai_government_alignment (analysis_id, government_body, framework_name, indicator, alignment_strength, evidence)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (analysis_id, gov.get("government_body"), gov.get("framework_name"), gov.get("indicator"), gov.get("alignment_strength"), gov.get("evidence")))
        
    # Insert External Sources
    for src in data.get("external_sources", []):
        cursor.execute("""
            INSERT INTO ai_sources (analysis_id, source_title, organization, url, publication_date, source_type, authority_level, relevant_claim)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (analysis_id, src.get("source_title"), src.get("organization"), src.get("url"), src.get("publication_date"), src.get("source_type"), src.get("authority_level"), src.get("relevant_claim")))
        
    conn.commit()

def get_ai_analysis(project_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM ai_analysis WHERE project_id = %s ORDER BY created_at DESC LIMIT 1", (project_id,))
    analysis = cursor.fetchone()
    
    if not analysis:
        return None
        
    aid = analysis["analysis_id"]
    
    cursor.execute("SELECT * FROM ai_sdg_mappings WHERE analysis_id = %s", (aid,))
    analysis["sdgs"] = cursor.fetchall()
    
    cursor.execute("SELECT * FROM ai_claims WHERE analysis_id = %s", (aid,))
    analysis["claims"] = cursor.fetchall()
    
    cursor.execute("SELECT * FROM ai_recommendations WHERE analysis_id = %s", (aid,))
    analysis["recommendations"] = [r["recommendation"] for r in cursor.fetchall()]
    
    cursor.execute("SELECT * FROM ai_contradictions WHERE analysis_id = %s", (aid,))
    analysis["contradictions"] = cursor.fetchall()
    
    cursor.execute("SELECT * FROM ai_kpis WHERE analysis_id = %s", (aid,))
    analysis["kpis"] = cursor.fetchall()
    
    cursor.execute("SELECT * FROM ai_government_alignment WHERE analysis_id = %s", (aid,))
    analysis["government_alignment"] = cursor.fetchall()
    
    cursor.execute("SELECT * FROM ai_sources WHERE analysis_id = %s", (aid,))
    analysis["external_sources"] = cursor.fetchall()
    
    return analysis

