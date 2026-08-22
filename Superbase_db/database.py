import os
import mysql.connector
from mysql.connector import Error

def get_db_connection():
    try:
        # Encryption requirement: Setting ssl_ca or ssl_disabled=False to ensure encrypted transfer
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            database=os.getenv("DB_NAME", "sdg_project"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            # Require SSL for end-to-end encryption of data in transit
            ssl_disabled=False
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL Platform: {e}")
        return None

# --- Standard CRUD Operations ---

def create_department(name: str):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        query = "INSERT INTO departments (name) VALUES (%s)"
        cursor.execute(query, (name,))
        conn.commit()
        cursor.close()
        conn.close()
        return cursor.lastrowid
    return None

def get_departments():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM departments")
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    return []

def create_user(user_id, name, email, role, avatar=None, college_id=None, department=None):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        query = """INSERT INTO users (id, name, email, role, avatar, college_id, department) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(query, (user_id, name, email, role, avatar, college_id, department))
        conn.commit()
        cursor.close()
        conn.close()
        return user_id
    return None

def get_user(user_id):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result
    return None

def create_project(project_id, student_id, title, abstract, status, faculty_id, department, sdg_match_score):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        query = """INSERT INTO projects (id, student_id, title, abstract, status, faculty_id, department, sdg_match_score) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(query, (project_id, student_id, title, abstract, status, faculty_id, department, sdg_match_score))
        conn.commit()
        cursor.close()
        conn.close()
        return project_id
    return None

def get_projects_by_student(student_id):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM projects WHERE student_id = %s", (student_id,))
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    return []

def get_all_projects():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM projects")
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    return []
