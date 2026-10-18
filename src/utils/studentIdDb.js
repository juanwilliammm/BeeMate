import { getSupabase, uploadPhotoToSupabase } from './supabaseClient';

const DB_NAME = 'BeeMateDB';
const DB_VERSION = 1;
const STORE_NAME = 'student_verifications';

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'nim' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveStudentIdRecord(record) {
  const nowIso = new Date().toISOString();

  // 1. Upload image to Supabase Storage (or compress for PostgreSQL sync)
  const uploadResult = await uploadPhotoToSupabase(
    record.imageData,
    'student-ids',
    record.nim || 'binusian'
  );

  const finalImageUrl = uploadResult.url || record.imageData;

  const payload = {
    ...record,
    imageData: finalImageUrl,
    storagePath: uploadResult.storagePath || null,
    isCloudSynced: false,
    updatedAt: nowIso
  };

  // 2. Save to Supabase PostgreSQL table `beemate_student_verifications` if configured
  const supabase = getSupabase();
  if (supabase && record.nim) {
    try {
      const { error } = await supabase.from('beemate_student_verifications').upsert(
        {
          nim: record.nim,
          email: record.email || null,
          name: record.name || '',
          major: record.major || '',
          batch: record.batch || '',
          image_data: finalImageUrl,
          storage_path: uploadResult.storagePath || null,
          file_name: record.fileName || 'student_id.jpg',
          source: record.source || 'Upload',
          verification_hash: record.verificationHash || '',
          status: 'Menunggu',
          updated_at: nowIso
        },
        { onConflict: 'nim' }
      );
      if (!error) {
        payload.isCloudSynced = true;
      }
    } catch {
      // Fallback to local if offline
    }
  }

  // 3. Also cache in LocalStorage & IndexedDB
  try {
    localStorage.setItem(`beemate_id_${record.nim}`, JSON.stringify(payload));
  } catch {
    // fallback if localStorage quota exceeded
  }
  try {
    const db = await openDB();
    if (!db) return payload;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(payload);
      tx.oncomplete = () => resolve(payload);
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return payload;
  }
}

/**
 * Automatically migrates any previously uploaded Student ID photos from browser IndexedDB / LocalStorage
 * to Supabase Storage (`beemate-uploads`) and `beemate_student_verifications` table.
 */
export async function syncAllLocalStudentIdsToCloud(fallbackUser) {
  const supabase = getSupabase();
  if (!supabase) return [];

  const localRecords = new Map();

  // 1. Collect from LocalStorage keys `beemate_id_*`
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('beemate_id_')) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.nim && parsed.imageData) {
            localRecords.set(parsed.nim, parsed);
          }
        }
      }
    }
  } catch {
    // ignore
  }

  // 2. Collect from IndexedDB `BeeMateDB` -> `student_verifications`
  try {
    const db = await openDB();
    if (db) {
      const idbRecords = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
      for (const rec of idbRecords) {
        if (rec && rec.nim && rec.imageData) {
          localRecords.set(rec.nim, rec);
        }
      }
    }
  } catch {
    // ignore
  }

  // 3. Also check if current user object in localStorage has `studentIdPhoto`
  if (fallbackUser?.nim && fallbackUser?.studentIdPhoto && !localRecords.has(fallbackUser.nim)) {
    localRecords.set(fallbackUser.nim, {
      nim: fallbackUser.nim,
      email: fallbackUser.email,
      name: fallbackUser.name,
      major: fallbackUser.major,
      batch: fallbackUser.batch,
      imageData: fallbackUser.studentIdPhoto,
      fileName: `KTM_${fallbackUser.nim}.jpg`,
      source: 'Migrasi Lokal',
      verificationHash: `BINUS-${String(fallbackUser.nim).slice(0, 4)}-MIGRATED`
    });
  }

  const syncedList = [];
  for (const [, rec] of localRecords.entries()) {
    const saved = await saveStudentIdRecord({
      ...rec,
      email: rec.email || fallbackUser?.email || null
    });
    syncedList.push(saved);
  }
  return syncedList;
}

export async function getStudentIdRecord(nim) {
  if (!nim) return null;

  // 1. Try fetching from Supabase Cloud first so Laptop & HP stay in sync
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('beemate_student_verifications')
        .select('*')
        .eq('nim', nim)
        .maybeSingle();

      if (!error && data && data.image_data) {
        const cloudRecord = {
          nim: data.nim,
          email: data.email,
          name: data.name,
          major: data.major,
          batch: data.batch,
          imageData: data.image_data,
          storagePath: data.storage_path,
          fileName: data.file_name,
          source: data.source,
          verificationHash: data.verification_hash,
          isCloudSynced: true,
          updatedAt: data.updated_at
        };
        return cloudRecord;
      }
    } catch {
      // Fallback to local
    }
  }

  // 2. Fallback to IndexedDB & LocalStorage (and auto-upload to Supabase if found locally!)
  let localFound = null;
  try {
    const db = await openDB();
    if (db) {
      localFound = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(nim);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    }
  } catch {
    // ignore
  }
  if (!localFound) {
    try {
      const raw = localStorage.getItem(`beemate_id_${nim}`);
      localFound = raw ? JSON.parse(raw) : null;
    } catch {
      localFound = null;
    }
  }

  if (localFound && localFound.imageData && supabase) {
    // Migrate local record to cloud immediately
    return await saveStudentIdRecord(localFound);
  }

  return localFound;
}

export async function deleteStudentIdRecord(nim) {
  const supabase = getSupabase();
  if (supabase && nim) {
    try {
      await supabase.from('beemate_student_verifications').delete().eq('nim', nim);
    } catch {
      // ignore
    }
  }
  try {
    localStorage.removeItem(`beemate_id_${nim}`);
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(nim);
    }
  } catch {
    // ignore
  }
}
