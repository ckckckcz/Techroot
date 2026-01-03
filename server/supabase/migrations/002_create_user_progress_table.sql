-- ===========================================================
-- TECHROOT: User Progress Table Migration (FIXED)
-- ===========================================================
-- Jalankan migration ini di Supabase SQL Editor
-- Dashboard Supabase > SQL Editor > New Query > Paste & Run
-- PASTIKAN users table sudah ada sebelum menjalankan ini!
-- ===========================================================

-- 1. Enable UUID extension (jika belum)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if exist (untuk fresh start)
DROP TABLE IF EXISTS public.user_badges CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;

-- 3. Create user_progress table
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    
    -- Completed lessons (stored as array of "moduleId:lessonId")
    completed_lessons TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Completed modules (stored as array of "pathId:moduleId")
    completed_modules TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Current learning position
    current_path TEXT DEFAULT NULL,
    current_module TEXT DEFAULT NULL,
    current_lesson TEXT DEFAULT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Foreign key to users table
    CONSTRAINT fk_user_progress_user 
        FOREIGN KEY (user_id) 
        REFERENCES public.users(id) 
        ON DELETE CASCADE,
    
    -- Ensure one progress record per user
    CONSTRAINT unique_user_progress UNIQUE (user_id)
);

-- 4. Create index for faster lookups
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);

-- 5. Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_user_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER trigger_user_progress_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_progress_timestamp();

-- 6. Create user_badges table (optional - for gamification)
CREATE TABLE public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    badge_id TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Foreign key to users table
    CONSTRAINT fk_user_badges_user 
        FOREIGN KEY (user_id) 
        REFERENCES public.users(id) 
        ON DELETE CASCADE,
    
    -- Ensure unique badge per user
    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);

-- 7. Create index for badges
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);

-- 8. DISABLE Row Level Security (karena kita pakai service_role key)
-- Jika RLS aktif, backend tidak bisa akses data
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges DISABLE ROW LEVEL SECURITY;

-- 9. Grant permissions to authenticated users (jika perlu)
GRANT ALL ON public.user_progress TO service_role;
GRANT ALL ON public.user_badges TO service_role;
GRANT ALL ON public.user_progress TO anon;
GRANT ALL ON public.user_badges TO anon;

-- ===========================================================
-- SELESAI! Tabel user_progress sudah siap digunakan.
-- ===========================================================

-- Untuk verifikasi, jalankan:
-- SELECT * FROM public.user_progress;
-- SELECT * FROM public.users;
