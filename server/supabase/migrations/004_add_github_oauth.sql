-- ===========================================================
-- TECHROOT: GitHub OAuth Migration
-- ===========================================================
-- Jalankan migration ini di Supabase SQL Editor
-- Dashboard Supabase > SQL Editor > New Query > Paste & Run
-- ===========================================================

-- 1. Tambah kolom untuk OAuth support
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS github_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS github_username VARCHAR(255),
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'email';

-- 2. Ubah password_hash menjadi nullable (untuk OAuth users)
ALTER TABLE public.users 
ALTER COLUMN password_hash DROP NOT NULL;

-- 3. Buat index pada github_id (untuk login cepat via GitHub)
CREATE INDEX IF NOT EXISTS idx_users_github_id ON public.users(github_id);

-- 4. Buat index pada auth_provider
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON public.users(auth_provider);

-- ===========================================================
-- SELESAI! Tabel users sudah mendukung GitHub OAuth.
-- ===========================================================
