-- SQL Dump for SDG Project Database

CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

INSERT IGNORE INTO departments (name) VALUES 
('Computer Science'),
('Information Technology'),
('Artificial Intelligence & Machine Learning'),
('Computer Science Data (CSD)'),
('Cyber Security'),
('Electronics & Communication'),
('Mechanical Engineering'),
('Civil Engineering'),
('Electrical Engineering'),
('MBA');

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    avatar VARCHAR(255),
    college_id VARCHAR(50),
    department VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    abstract TEXT,
    status VARCHAR(50),
    faculty_id VARCHAR(50),
    department VARCHAR(255),
    sdg_match_score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
