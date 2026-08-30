import sqlite3
import os
import datetime

class MockCursor:
    def __init__(self, conn, dictionary=False):
        self.conn = conn
        self.cursor = conn.cursor()
        self.dictionary = dictionary
        
    def execute(self, query, params=()):
        q = query.replace('%s', '?')
        self.cursor.execute(q, params)
        
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

class MockConnection:
    def __init__(self, db_path):
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self._init_db()
        
    def _init_db(self):
        self.conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            role TEXT,
            avatar TEXT,
            college_id TEXT,
            department TEXT
        )''')
        self.conn.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            student_id TEXT,
            title TEXT,
            abstract TEXT,
            status TEXT,
            faculty_id TEXT,
            department TEXT,
            sdg_match_score INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )''')
        self.conn.execute('''
        CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        )''')
        self.conn.commit()

    def cursor(self, dictionary=False):
        return MockCursor(self.conn, dictionary)
        
    def commit(self):
        self.conn.commit()
        
    def close(self):
        self.conn.close()

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sqlite.db")
def get_db_connection():
    return MockConnection(DB_FILE)

def create_department(name: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO departments (name) VALUES (%s)", (name,))
    conn.commit()
    rowid = cursor.lastrowid
    cursor.close()
    conn.close()
    return rowid

def get_departments():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM departments")
    res = cursor.fetchall()
    cursor.close()
    conn.close()
    return res

def create_user(user_id, name, email, role, avatar=None, college_id=None, department=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """INSERT INTO users (id, name, email, role, avatar, college_id, department) 
               VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    cursor.execute(query, (user_id, name, email, role, avatar, college_id, department))
    conn.commit()
    cursor.close()
    conn.close()
    return user_id

def get_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    res = cursor.fetchone()
    cursor.close()
    conn.close()
    return res

def create_project(project_id, student_id, title, abstract, status, faculty_id, department, sdg_match_score):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """INSERT INTO projects (id, student_id, title, abstract, status, faculty_id, department, sdg_match_score) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
    cursor.execute(query, (project_id, student_id, title, abstract, status, faculty_id, department, sdg_match_score))
    conn.commit()
    cursor.close()
    conn.close()
    return project_id

def get_projects_by_student(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM projects WHERE student_id = %s", (student_id,))
    res = cursor.fetchall()
    for r in res:
        if isinstance(r.get('created_at'), str):
            try:
                r['created_at'] = datetime.datetime.strptime(r['created_at'], "%Y-%m-%d %H:%M:%S")
            except:
                pass
    cursor.close()
    conn.close()
    return res

def get_all_projects():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM projects")
    res = cursor.fetchall()
    for r in res:
        if isinstance(r.get('created_at'), str):
            try:
                r['created_at'] = datetime.datetime.strptime(r['created_at'], "%Y-%m-%d %H:%M:%S")
            except:
                pass
    cursor.close()
    conn.close()
    return res
