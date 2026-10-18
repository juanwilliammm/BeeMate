import { createClient } from '@supabase/supabase-js';

const LS_URL_KEY = 'beemate_supabase_url';
const LS_ANON_KEY = 'beemate_supabase_anon_key';
export const STORAGE_BUCKET = 'beemate-uploads';

let cachedClient = null;
let cachedUrl = '';
let cachedKey = '';

// Auto-import Supabase credentials from URL parameters (?sb_url=...&sb_key=...) for easy mobile sharing
try {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('sb_url');
    const keyParam = params.get('sb_key');
    if (urlParam && keyParam) {
      window.localStorage.setItem(LS_URL_KEY, urlParam.trim());
      window.localStorage.setItem(LS_ANON_KEY, keyParam.trim());
      // Clean URL query params without reloading
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }
} catch {
  // Ignore URL parsing errors
}

const DEFAULT_SUPABASE_URL = 'https://bbwscqwdlcrwbsrbqsvw.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_eWajaExAWNR6oCZ4sxQafQ_7UISmNkv';

export function getSupabaseConfig() {
  const envUrl =
    import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const envKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_SUPABASE_KEY;

  let storedUrl = '';
  let storedKey = '';
  try {
    storedUrl = window.localStorage.getItem(LS_URL_KEY) || '';
    storedKey = window.localStorage.getItem(LS_ANON_KEY) || '';
  } catch {
    // ignore
  }

  const url = (storedUrl || envUrl).trim();
  const anonKey = (storedKey || envKey).trim();
  const isConfigured =
    Boolean(url && anonKey) &&
    !url.includes('your-project-id') &&
    url.startsWith('http');

  return { url, anonKey, isConfigured };
}

export function saveSupabaseConfig(url, anonKey) {
  try {
    window.localStorage.setItem(LS_URL_KEY, url.trim());
    window.localStorage.setItem(LS_ANON_KEY, anonKey.trim());
    cachedClient = null;
  } catch {
    // ignore
  }
}

export function clearSupabaseConfig() {
  try {
    window.localStorage.removeItem(LS_URL_KEY);
    window.localStorage.removeItem(LS_ANON_KEY);
    cachedClient = null;
  } catch {
    // ignore
  }
}

export function getSupabase() {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (cachedClient && cachedUrl === url && cachedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    cachedUrl = url;
    cachedKey = anonKey;
    return cachedClient;
  } catch {
    return null;
  }
}

/**
 * Compress a Data URL image so that even if stored as Base64 fallback in PostgreSQL,
 * it transfers fast between Mobile and Laptop.
 */
export function compressImageDataUrl(dataUrl, maxWidth = 900, quality = 0.8) {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Uploads an image (DataURL) to Supabase Storage bucket `beemate-uploads`.
 * If the bucket exists, returns the public HTTPS URL from Supabase Storage.
 * If the bucket is not created yet, returns a compressed DataURL that is saved
 * directly in the Supabase PostgreSQL row so it still syncs across HP & Laptop.
 */
export async function uploadPhotoToSupabase(dataUrl, folder = 'general', identifier = 'user') {
  const compressed = await compressImageDataUrl(dataUrl);
  const supabase = getSupabase();
  if (!supabase || !compressed) {
    return { url: compressed, storagePath: null, isCloudStorage: false };
  }

  try {
    if (compressed.startsWith('http://') || compressed.startsWith('https://')) {
      return { url: compressed, storagePath: null, isCloudStorage: true };
    }
    const blob = dataUrlToBlob(compressed);
    const safeId = String(identifier).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = `${folder}/${safeId}_${Date.now()}.jpg`;

    const { error: uploadErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadErr) {
      // Fallback to compressed DataURL stored in PostgreSQL row
      return { url: compressed, storagePath: null, isCloudStorage: false };
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    if (data?.publicUrl) {
      return { url: data.publicUrl, storagePath: filePath, isCloudStorage: true };
    }
    return { url: compressed, storagePath: null, isCloudStorage: false };
  } catch {
    return { url: compressed, storagePath: null, isCloudStorage: false };
  }
}

export function mapDbRowToAppState(row, fallbackUser, fallbackConversations) {
  if (!row) return null;
  const user = {
    ...fallbackUser,
    email: row.email || fallbackUser.email,
    nim: row.nim || fallbackUser.nim,
    name: row.name || fallbackUser.name,
    faculty: row.faculty || fallbackUser.faculty,
    major: row.major || fallbackUser.major,
    batch: row.batch || fallbackUser.batch,
    graduationYear: row.graduation_year || fallbackUser.graduationYear,
    campus: row.campus || fallbackUser.campus,
    verified: Boolean(row.verified),
    verificationStatus: row.verification_status || 'Menunggu',
    bio: row.bio ?? fallbackUser.bio,
    goal: row.goal || fallbackUser.goal,
    promptQuestion: row.prompt_question || fallbackUser.promptQuestion,
    promptAnswer: row.prompt_answer ?? fallbackUser.promptAnswer,
    interests: Array.isArray(row.interests) ? row.interests : fallbackUser.interests,
    avatar: row.avatar || fallbackUser.avatar,
    extraPhotos: Array.isArray(row.extra_photos) ? row.extra_photos : [null, null, null],
    studentIdPhoto: row.student_id_photo || null,
    dndMode: Boolean(row.dnd_mode),
    streakNotif: row.streak_notif !== undefined ? Boolean(row.streak_notif) : true,
    hideBatch: Boolean(row.hide_batch)
  };

  return {
    user,
    swipedIds: Array.isArray(row.swiped_ids) ? row.swiped_ids : [],
    blockedIds: Array.isArray(row.blocked_ids) ? row.blocked_ids : [],
    dailyLikesLeft: typeof row.daily_likes_left === 'number' ? row.daily_likes_left : 15,
    conversations:
      Array.isArray(row.conversations) && row.conversations.length > 0
        ? row.conversations
        : fallbackConversations,
    updatedAt: row.updated_at
  };
}

export async function fetchUserFromCloud(email) {
  const supabase = getSupabase();
  if (!supabase || !email) return { data: null, error: null };

  try {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('beemate_users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error) return { data: null, error };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function upsertUserToCloud({
  user,
  password,
  swipedIds,
  blockedIds,
  dailyLikesLeft,
  conversations
}) {
  const supabase = getSupabase();
  if (!supabase || !user?.email) return { ok: false, error: 'Supabase belum dikonfigurasi' };

  try {
    const cleanEmail = user.email.trim().toLowerCase();
    const payload = {
      email: cleanEmail,
      nim: user.nim || null,
      name: user.name || 'Mahasiswa Binus',
      faculty: user.faculty || 'School of Computer Science',
      major: user.major || 'Computer Science',
      batch: user.batch || '2024',
      graduation_year: user.graduationYear || '2028',
      campus: user.campus || 'Kemanggisan (Anggrek)',
      verified: Boolean(user.verified),
      verification_status: user.verificationStatus || 'Menunggu',
      bio: user.bio || '',
      goal: user.goal || 'Cari partner lomba',
      prompt_question: user.promptQuestion || 'Target kolaborasi semester ini',
      prompt_answer: user.promptAnswer || '',
      interests: user.interests || [],
      avatar: user.avatar || '',
      extra_photos: user.extraPhotos || [null, null, null],
      student_id_photo: user.studentIdPhoto || null,
      dnd_mode: Boolean(user.dndMode),
      streak_notif: user.streakNotif !== undefined ? Boolean(user.streakNotif) : true,
      hide_batch: Boolean(user.hideBatch),
      swiped_ids: swipedIds || [],
      blocked_ids: blockedIds || [],
      daily_likes_left: typeof dailyLikesLeft === 'number' ? dailyLikesLeft : 15,
      conversations: conversations || [],
      updated_at: new Date().toISOString()
    };

    if (password) {
      payload.password_hash = password;
    }

    const { data, error } = await supabase
      .from('beemate_users')
      .upsert(payload, { onConflict: 'email' })
      .select()
      .maybeSingle();

    if (error) return { ok: false, error: error.message };
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err?.message || 'Gagal sinkronisasi ke Supabase' };
  }
}

export async function deleteUserFromCloud(email, nim) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    if (email) {
      await supabase.from('beemate_users').delete().eq('email', email.trim().toLowerCase());
    }
    if (nim) {
      await supabase.from('beemate_student_verifications').delete().eq('nim', nim);
    }
  } catch {
    // ignore
  }
}

export async function testSupabaseConnection() {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, message: 'URL atau Anon Key Supabase belum diisi.' };
  }
  try {
    const { error } = await supabase.from('beemate_users').select('email').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return {
          ok: false,
          needsSchema: true,
          message:
            'Terhubung ke Supabase, tetapi tabel "beemate_users" belum dibuat. Jalankan file supabase_schema.sql di SQL Editor Supabase kamu.'
        };
      }
      return { ok: false, message: `Gagal: ${error.message}` };
    }
    return {
      ok: true,
      message: 'Terhubung ke Supabase Cloud! Data & foto siap disinkronkan di HP & Laptop.'
    };
  } catch (err) {
    return { ok: false, message: err?.message || 'Koneksi gagal.' };
  }
}
