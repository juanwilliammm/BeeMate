import React, { useState, useEffect } from 'react';
import {
  Database,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Smartphone,
  RefreshCw,
  Trash2,
  Cloud,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import {
  getSupabase,
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection
} from '../utils/supabaseClient';
import { syncAllLocalStudentIdsToCloud } from '../utils/studentIdDb';

const SQL_SNIPPET = `CREATE TABLE IF NOT EXISTS public.beemate_users (
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

ALTER TABLE public.beemate_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beemate_student_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read/write beemate_users" ON public.beemate_users;
CREATE POLICY "Allow public read/write beemate_users" ON public.beemate_users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write beemate_student_verifications" ON public.beemate_student_verifications;
CREATE POLICY "Allow public read/write beemate_student_verifications" ON public.beemate_student_verifications FOR ALL USING (true) WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('beemate-uploads', 'beemate-uploads', true) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Public Access beemate-uploads" ON storage.objects;
CREATE POLICY "Public Access beemate-uploads" ON storage.objects FOR ALL USING (bucket_id = 'beemate-uploads') WITH CHECK (bucket_id = 'beemate-uploads');`;

export default function SupabaseConfigModal({
  isOpen,
  onClose,
  onConfigSaved,
  currentUserEmail,
  currentUser,
  onForcePushLocalToCloud
}) {
  const initial = getSupabaseConfig();
  const [url, setUrl] = useState(initial.url);
  const [anonKey, setAnonKey] = useState(initial.anonKey);
  const [testing, setTesting] = useState(false);
  const [statusResult, setStatusResult] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [cloudUsers, setCloudUsers] = useState([]);
  const [cloudVerifications, setCloudVerifications] = useState([]);
  const [loadingInspector, setLoadingInspector] = useState(false);

  const loadCloudDataPreview = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    setLoadingInspector(true);
    try {
      await syncAllLocalStudentIdsToCloud(currentUser);
      if (onForcePushLocalToCloud) {
        await onForcePushLocalToCloud();
      }
      const { data: usersData } = await supabase
        .from('beemate_users')
        .select('email, nim, name, major, batch, avatar, extra_photos, student_id_photo, updated_at')
        .order('updated_at', { ascending: false });
      const { data: verifData } = await supabase
        .from('beemate_student_verifications')
        .select('nim, name, file_name, source, image_data, updated_at')
        .order('updated_at', { ascending: false });

      setCloudUsers(usersData || []);
      setCloudVerifications(verifData || []);
    } catch {
      // ignore
    } finally {
      setLoadingInspector(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setUrl(cfg.url);
      setAnonKey(cfg.anonKey);
      loadCloudDataPreview();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async (e) => {
    e.preventDefault();
    saveSupabaseConfig(url, anonKey);
    setTesting(true);
    const res = await testSupabaseConnection();
    await loadCloudDataPreview();
    setTesting(false);
    setStatusResult(res);
    if (onConfigSaved) {
      onConfigSaved(res.ok);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SNIPPET);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopyMobileLink = () => {
    const base = window.location.origin + window.location.pathname;
    const shareUrl = `${base}?sb_url=${encodeURIComponent(url.trim())}&sb_key=${encodeURIComponent(anonKey.trim())}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setStatusResult({
      ok: false,
      message: 'Koneksi Supabase diputus. Beralih ke penyimpanan lokal.'
    });
    if (onConfigSaved) {
      onConfigSaved(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#181B22] border border-[#2E3440] rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl max-h-[90dvh] overflow-y-auto no-scrollbar text-white">
        <div className="flex items-center justify-between border-b border-[#2E3440] pb-3">
          <div className="flex items-center gap-2">
            <Cloud size={18} className="text-[#38BDF8]" />
            <div>
              <h3 className="font-display font-extrabold text-sm text-white">
                Supabase Cloud Database
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Sinkronisasi Akun & Foto di HP maupun Laptop
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#222631] flex items-center justify-center text-[#94A3B8] hover:text-white cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Live Cloud Data & Photos Inspector */}
        <div className="p-3.5 rounded-2xl bg-[#0F1115] border border-[#38BDF8]/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#38BDF8] flex items-center gap-1.5">
              <ImageIcon size={14} />
              <span>Data & Foto di Supabase Saat Ini</span>
            </span>
            <button
              type="button"
              onClick={loadCloudDataPreview}
              className="px-2.5 py-1 rounded-full bg-[#222631] hover:bg-[#2E3440] text-[11px] font-bold text-white flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={11} className={loadingInspector ? 'animate-spin' : ''} />
              <span>Refresh & Sinkron</span>
            </button>
          </div>

          {/* Student ID Photos in `beemate_student_verifications` */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#94A3B8] block">
              1. Foto Kartu Mahasiswa (`beemate_student_verifications`): {cloudVerifications.length} file
            </span>
            {cloudVerifications.length === 0 ? (
              <p className="text-[11px] text-[#F59E0B] bg-[#222631] p-2.5 rounded-xl">
                Belum ada foto Kartu Mahasiswa yang di-upload. Buka menu <strong>Daftar Baru → Langkah 3 (Binusian Card)</strong> atau unggah dari halaman <strong>Profil</strong> untuk menyimpan foto ke Supabase!
              </p>
            ) : (
              <div className="space-y-2">
                {cloudVerifications.map((item) => (
                  <div
                    key={item.nim}
                    className="p-2 rounded-xl bg-[#181B22] border border-[#2E3440] flex items-center gap-2.5"
                  >
                    <img
                      src={item.image_data}
                      alt={item.name}
                      className="w-14 h-10 rounded-lg object-cover border border-[#38BDF8]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">
                        {item.name} ({item.nim})
                      </p>
                      <p className="text-[10px] text-[#94A3B8] truncate">
                        {item.file_name} · {item.source}
                      </p>
                      {item.image_data?.startsWith('http') && (
                        <a
                          href={item.image_data}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-[#38BDF8] font-bold inline-flex items-center gap-1 hover:underline"
                        >
                          <span>Buka Link Foto Cloud</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Registered Users & Profile Photos in `beemate_users` */}
          <div className="space-y-1.5 pt-1 border-t border-[#2E3440]">
            <span className="text-[11px] font-bold text-[#94A3B8] block">
              2. Akun & Foto Profil (`beemate_users`): {cloudUsers.length} akun
            </span>
            {cloudUsers.map((u) => {
              const extraCount = Array.isArray(u.extra_photos)
                ? u.extra_photos.filter(Boolean).length
                : 0;
              return (
                <div
                  key={u.email}
                  className="p-2 rounded-xl bg-[#181B22] border border-[#2E3440] flex items-center gap-2.5"
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#F59E0B]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">
                      {u.name} ({u.nim || 'Tanpa NIM'})
                    </p>
                    <p className="text-[10px] text-[#38BDF8] truncate">{u.email}</p>
                    <p className="text-[10px] text-[#94A3B8]">
                      Foto utama: 1 · Foto ekstra: {extraCount} · KTM: {u.student_id_photo ? 'Ada' : 'Belum'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Share Link for Phone / Laptop */}
        {url && anonKey && (
          <div className="p-3 rounded-2xl bg-[#222631] border border-[#2E3440] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#38BDF8] flex items-center gap-1.5">
                <Smartphone size={13} />
                <span>Buka di HP Tanpa Ketik Ulang Key</span>
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Salin tautan di bawah lalu buka di browser HP kamu. Kredensial Supabase akan otomatis terhubung dan siap login dengan akun{' '}
              <strong className="text-white">{currentUserEmail || '@binus.ac.id'}</strong>.
            </p>
            <button
              type="button"
              onClick={handleCopyMobileLink}
              className="w-full py-2 rounded-xl bg-[#0F1115] hover:bg-[#181B22] border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Copy size={12} />
              <span>
                {copiedLink
                  ? '✓ Tautan Auto-Connect Berhasil Disalin!'
                  : 'Salin Link Auto-Connect untuk HP'}
              </span>
            </button>
          </div>
        )}

        <form onSubmit={handleSaveAndTest} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#38BDF8] block">
              Supabase Project URL
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xxxx.supabase.co"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#222631] border border-[#2E3440] text-xs font-mono text-white focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#38BDF8] block">
              Supabase Anon / Publishable Key
            </label>
            <input
              type="text"
              required
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="sb_publishable_..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#222631] border border-[#2E3440] text-xs font-mono text-white focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={testing}
              className="flex-1 py-2.5 rounded-full bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0F1115] font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} className={testing ? 'animate-spin' : ''} />
              <span>{testing ? 'Menguji Koneksi...' : 'Simpan & Tes Koneksi'}</span>
            </button>
            {(url || anonKey) && (
              <button
                type="button"
                onClick={handleDisconnect}
                title="Putuskan Koneksi"
                className="px-3 py-2.5 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </form>

        {statusResult && (
          <div
            className={`p-3 rounded-2xl border text-xs flex items-start gap-2 ${
              statusResult.ok
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-200'
            }`}
          >
            {statusResult.ok ? (
              <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-amber-400" />
            )}
            <span className="leading-relaxed">{statusResult.message}</span>
          </div>
        )}

        {/* SQL Schema Copy Section */}
        <div className="p-3 rounded-2xl bg-[#0F1115] border border-[#2E3440] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <Database size={13} className="text-[#F59E0B]" />
              <span>Setup Tabel & Storage Supabase (1x Klik)</span>
            </span>
            <button
              type="button"
              onClick={handleCopySql}
              className="px-2.5 py-1 rounded-full bg-[#222631] hover:bg-[#F59E0B] text-[#F59E0B] hover:text-[#0F1115] text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Copy size={11} />
              <span>{copiedSql ? 'Disalin!' : 'Salin SQL'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
