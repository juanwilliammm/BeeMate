-- ============================================================================
-- BEEMATE SUPABASE CLOUD DATABASE & STORAGE SCHEMA
-- Jalankan script ini di menu "SQL Editor" pada Dashboard Supabase kamu
-- ============================================================================

-- 1. Tabel Akun & Profil Pengguna (Sinkronisasi Lintas Perangkat HP & Laptop)
CREATE TABLE IF NOT EXISTS public.beemate_users (
  email TEXT PRIMARY KEY,
  password_hash TEXT DEFAULT 'binusian2028',
  nim TEXT UNIQUE,
  name TEXT NOT NULL DEFAULT 'Mahasiswa Binus',
  faculty TEXT DEFAULT 'School of Computer Science',
  major TEXT DEFAULT 'Computer Science',
  batch TEXT DEFAULT '2024',
  graduation_year TEXT DEFAULT '2028',
  campus TEXT DEFAULT 'Kemanggisan (Anggrek)',
  verified BOOLEAN DEFAULT FALSE,
  verification_status TEXT DEFAULT 'Menunggu',
  bio TEXT DEFAULT '',
  goal TEXT DEFAULT 'Cari partner lomba',
  prompt_question TEXT DEFAULT 'Target kolaborasi semester ini',
  prompt_answer TEXT DEFAULT '',
  interests JSONB DEFAULT '["Web Development", "UI/UX Design"]'::jsonb,
  avatar TEXT,
  extra_photos JSONB DEFAULT '[null, null, null]'::jsonb,
  student_id_photo TEXT,
  dnd_mode BOOLEAN DEFAULT FALSE,
  streak_notif BOOLEAN DEFAULT TRUE,
  hide_batch BOOLEAN DEFAULT FALSE,
  swiped_ids JSONB DEFAULT '[]'::jsonb,
  blocked_ids JSONB DEFAULT '[]'::jsonb,
  daily_likes_left INTEGER DEFAULT 15,
  conversations JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Verifikasi Kartu Mahasiswa (Binusian Card / Student ID)
CREATE TABLE IF NOT EXISTS public.beemate_student_verifications (
  nim TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  major TEXT,
  batch TEXT,
  image_data TEXT,
  storage_path TEXT,
  file_name TEXT,
  source TEXT,
  verification_hash TEXT,
  status TEXT DEFAULT 'Menunggu',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Aktifkan Row Level Security (RLS) & Kebijakan Akses Publik/Anon untuk Prototipe Lintas Perangkat
ALTER TABLE public.beemate_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beemate_student_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read/write beemate_users" ON public.beemate_users;
CREATE POLICY "Allow public read/write beemate_users"
  ON public.beemate_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write beemate_student_verifications" ON public.beemate_student_verifications;
CREATE POLICY "Allow public read/write beemate_student_verifications"
  ON public.beemate_student_verifications
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Buat Storage Bucket untuk Foto (Profil, Kartu Mahasiswa, Lampiran Chat)
INSERT INTO storage.buckets (id, name, public)
VALUES ('beemate-uploads', 'beemate-uploads', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access beemate-uploads" ON storage.objects;
CREATE POLICY "Public Access beemate-uploads"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'beemate-uploads')
  WITH CHECK (bucket_id = 'beemate-uploads');

-- 5. Aktifkan Realtime pada tabel beemate_users agar perubahan di HP langsung muncul di Laptop
ALTER PUBLICATION supabase_realtime ADD TABLE public.beemate_users;
