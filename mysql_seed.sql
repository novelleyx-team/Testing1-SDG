-- MySQL Schema for SDG Project Database
-- This file contains ONLY the table structures (empty/null data)
-- Data will be inserted in real-time by the application

-- 1. Create Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    avatar VARCHAR(255),
    college_id VARCHAR(50),
    department VARCHAR(255)
);

-- 3. Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    abstract TEXT,
    status VARCHAR(50),
    faculty_id VARCHAR(50),
    department VARCHAR(255),
    sdg_match_score INT
);
