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
  const payload = {
    ...record,
    updatedAt: new Date().toISOString(),
  };
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

export async function getStudentIdRecord(nim) {
  try {
    const db = await openDB();
    if (db) {
      const result = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(nim);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
      if (result) return result;
    }
  } catch {
    // ignore
  }
  try {
    const raw = localStorage.getItem(`beemate_id_${nim}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function deleteStudentIdRecord(nim) {
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
