-- ====================================================================
-- NEXUS AI — STUDENT OPERATING SYSTEM DATABASE SCHEMA (PostgreSQL / pgvector)
-- Production DDL Schema Definition
-- ====================================================================

-- 1. Enable Vector Extension for RAG Embeddings & Digital Twin Similarity
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar VARCHAR(10) DEFAULT '👩‍🎓',
    target_role VARCHAR(150) DEFAULT 'SDE-1 (Java / Backend)',
    target_company VARCHAR(150) DEFAULT 'Amazon / Top Tech',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Digital Twin Profiles Table
CREATE TABLE IF NOT EXISTS digital_twin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    readiness_score INT DEFAULT 78 CHECK (readiness_score BETWEEN 0 AND 100),
    learning_speed_multiplier NUMERIC(3, 2) DEFAULT 1.35,
    focus_score INT DEFAULT 92 CHECK (focus_score BETWEEN 0 AND 100),
    streak_days INT DEFAULT 14,
    total_study_hours NUMERIC(6, 1) DEFAULT 142.0,
    peak_productivity_time VARCHAR(50) DEFAULT '9:00 PM - 11:30 PM',
    weak_topics JSONB DEFAULT '[{"topic": "Dynamic Programming (2D Tabulation)", "score": 42}]'::jsonb,
    strong_topics JSONB DEFAULT '[{"topic": "DBMS SQL & Indexing", "score": 94}]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Missions & Study Goals Table
CREATE TABLE IF NOT EXISTS missions (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('assignment', 'coding', 'revision', 'interview', 'wellness')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    difficulty VARCHAR(20) DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. RAG Documents Library Table
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    doc_type VARCHAR(20) NOT NULL CHECK (doc_type IN ('pdf', 'ppt', 'docx', 'image', 'audio')),
    file_size VARCHAR(50) NOT NULL,
    upload_date VARCHAR(100) NOT NULL,
    summary TEXT,
    key_concepts JSONB DEFAULT '[]'::jsonb,
    parsed_content TEXT,
    embedding vector(1536), -- OpenAI / Local Vector Embedding Dimension
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Knowledge Graph Nodes Table
CREATE TABLE IF NOT EXISTS knowledge_nodes (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('java', 'dbms', 'dsa', 'web', 'ai', 'system')),
    mastery INT DEFAULT 50 CHECK (mastery BETWEEN 0 AND 100),
    connections JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Quizzes & Question Records Table
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    topic VARCHAR(150) NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INT NOT NULL,
    explanation TEXT,
    difficulty VARCHAR(20) DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Coding Lab Snippets & Reviews Table
CREATE TABLE IF NOT EXISTS code_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    language VARCHAR(50) DEFAULT 'java',
    code_content TEXT NOT NULL,
    complexity_analysis VARCHAR(100),
    review_feedback JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Interview Evaluations Table (Placement Hub)
CREATE TABLE IF NOT EXISTS interview_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_company VARCHAR(150) DEFAULT 'Amazon',
    question TEXT NOT NULL,
    user_answer TEXT NOT NULL,
    star_score INT CHECK (star_score BETWEEN 0 AND 10),
    feedback TEXT,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Life OS Wellness Logs Table
CREATE TABLE IF NOT EXISTS wellness_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sleep_hours NUMERIC(3, 1) DEFAULT 7.5,
    hydration_liters NUMERIC(3, 1) DEFAULT 2.5,
    stress_level INT DEFAULT 4 CHECK (stress_level BETWEEN 1 AND 10),
    burnout_risk_score INT DEFAULT 22 CHECK (burnout_risk_score BETWEEN 0 AND 100),
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Fast Query Acceleration
CREATE INDEX IF NOT EXISTS idx_missions_user ON missions(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_topic ON quizzes(topic);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_nodes(category);
