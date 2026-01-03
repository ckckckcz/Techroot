-- ===========================================================
-- TECHROOT: Users Table Migration
-- ===========================================================
-- Jalankan migration ini di Supabase SQL Editor
-- Dashboard Supabase > SQL Editor > New Query > Paste & Run
-- ===========================================================

-- 1. Enable UUID extension (jika belum)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Buat tabel users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    avatar TEXT,
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    last_active_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Buat index pada email (untuk login cepat)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 4. Function untuk update timestamp otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger untuk auto-update updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.users;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. RLS (Row Level Security) - Opsional, karena kita pakai service_role key
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ===========================================================
-- SELESAI! Tabel users sudah siap digunakan.
-- ===========================================================
