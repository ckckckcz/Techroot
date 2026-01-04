-- ===========================================================
-- TECHROOT: Module Discussion Forum Migration
-- ===========================================================
-- Migration untuk membuat tabel forum diskusi per module
-- ===========================================================

-- 1. Tabel untuk menyimpan pesan diskusi
CREATE TABLE IF NOT EXISTS public.module_discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id VARCHAR(100) NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT,
    images TEXT[], -- Array untuk menyimpan URL gambar
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Index untuk query cepat berdasarkan module_id
CREATE INDEX IF NOT EXISTS idx_module_discussions_module_id 
ON public.module_discussions(module_id);

-- 3. Index untuk query cepat berdasarkan user_id
CREATE INDEX IF NOT EXISTS idx_module_discussions_user_id 
ON public.module_discussions(user_id);

-- 4. Index gabungan untuk sorting by created_at
CREATE INDEX IF NOT EXISTS idx_module_discussions_module_created 
ON public.module_discussions(module_id, created_at DESC);

-- 5. Trigger untuk auto-update updated_at (reuse function yang sudah ada)
DROP TRIGGER IF EXISTS set_updated_at ON public.module_discussions;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.module_discussions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. RLS (Row Level Security) - Disabled karena pakai service_role
-- ALTER TABLE public.module_discussions ENABLE ROW LEVEL SECURITY;

-- ===========================================================
-- SELESAI! Tabel module_discussions sudah siap digunakan.
-- ===========================================================

-- Contoh Query:
-- 1. Get all messages in a module (sorted by newest first):
--    SELECT d.*, u.name, u.avatar 
--    FROM module_discussions d
--    JOIN users u ON d.user_id = u.id
--    WHERE d.module_id = 'react-basics'
--    ORDER BY d.created_at DESC;
--
-- 2. Insert new message:
--    INSERT INTO module_discussions (module_id, user_id, content, images)
--    VALUES ('react-basics', 'user-uuid', 'Hello!', ARRAY['image1.jpg']);
