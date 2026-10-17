# BeeMate — Binus University Student Networking App (PRD v0.1 Prototype)

Prototype aplikasi mobile web interaktif (**Vite + React + Tailwind CSS**) berdasarkan dokumen **PRD BeeMate Versi 0.1 (17 Oktober 2026 · Tim BeeMate, Binus University)**. Siap di-deploy langsung ke **Vercel**.

## ✨ 11 Layar & Fitur Sesuai PRD (FR-01 s/d FR-58)

1. **Layar 1 — Login (`src/screens/LoginScreen.jsx`)**:
   - Validasi format wajib `namaawal.namaakhir@binus.ac.id` (FR-01, FR-03).
   - Mode Daftar & Lupa Kata Sandi (FR-02).
   - Pesan galat aman (FR-04) & penguncian otomatis setelah 5x gagal login (FR-05).
2. **Layar 2 — Verifikasi NIM (`src/screens/VerifyNimScreen.jsx`)**:
   - Validasi NIM 10 digit angka & kalkulasi otomatis Tahun Lulus + Angkatan (`Tahun Lulus - 4`) beserta fitur koreksi manual (FR-06, FR-07).
   - Validasi 1 NIM 1 akun (FR-08) & indikator langkah `Langkah 1 dari 3` (FR-09).
3. **Layar 3 — Verifikasi Student ID (`src/screens/VerifyIdScreen.jsx`)**:
   - Unggah dari Kamera/Galeri & panduan foto (FR-10, FR-11).
   - Simulasi status tinjauan admin 1x24 jam: `Menunggu`, `Disetujui`, `Ditolak` beserta alasan (FR-12, FR-13).
   - Keterangan enkripsi & penghapusan foto kartu setelah verifikasi sesuai UU PDP (FR-14).
4. **Layar 4 — Verifikasi OTP (`src/screens/VerifyOtpScreen.jsx`)**:
   - Input 6 digit OTP dengan masa berlaku 5 menit (FR-15) & hitung mundur kirim ulang 60 detik (FR-16).
   - Lockout setelah 5x salah OTP (FR-17) dan penyiapan profil awal sebelum masuk Beranda (FR-18).
5. **Layar 5 — Beranda (`src/screens/HomeScreen.jsx`)**:
   - Profil pilihan paling cocok hari ini yang diurutkan dengan skor kecocokan tanpa umpan aktivitas (FR-19, FR-21).
   - Pintasan ke Matching, Pesan, dan percakapan terakhir (FR-20) serta navigasi bawah tetap (FR-22).
6. **Layar 6 — Matching (`src/screens/MatchingScreen.jsx`)**:
   - Swipe kartu ke kanan (Suka) atau ke kiri (Lewati) serta tombol alternatif (FR-24, FR-25).
   - Filter lengkap: Fakultas, Jurusan, Angkatan, Minat, dan Tujuan Networking (FR-26).
   - Modal *Mutual Match* (FR-27), kondisi profil habis (FR-28), dan tombol Lapor/Blokir di setiap kartu (FR-29).
7. **Layar 7 — Pesan (`src/screens/MessagesScreen.jsx`)**:
   - Bagian *Match Baru* di atas (FR-31) dan daftar percakapan terbaru dengan badge belum dibaca & ikon api streak (FR-30, FR-53).
   - Pencarian percakapan (FR-32) & kondisi kosong (FR-33).
8. **Layar 8 — Chat (`src/screens/ChatScreen.jsx`)**:
   - Chat real-time dengan status terkirim/dibaca & lampiran gambar (FR-34, FR-37).
   - Saran pembuka percakapan (*Icebreaker*) berdasarkan minat bersama (FR-36).
   - Indikator Streak Chat ala TikTok (🔥 + angka hari, ⏳ jam pasir saat hampir habis) dan tombol Video Call yang terkunci otomatis bila streak < 3 hari (FR-35, FR-42, FR-52 s/d FR-58).
9. **Layar 9 — Profil (`src/screens/ProfileScreen.jsx`)**:
   - Edit data profil, tujuan bergabung, minat, lencana *Terverifikasi*, dan statistik streak (FR-38, FR-39, FR-40).
   - Pengaturan privasi, Mode Jangan Ganggu (FR-51), toggle notifikasi streak (FR-57), keluar, dan hapus akun (FR-41).
10. **Layar 10 — Video Call (`src/screens/VideoCallScreen.jsx`)**:
    - Kontrol mikrofon, kamera, balik kamera, durasi, kualitas koneksi, dan tombol Lapor (FR-43, FR-44, FR-45).
    - Simulasi edukasi izin kamera/mikrofon ditolak (FR-46) & simulasi koneksi terputus (FR-47).
11. **Layar 11 — Panggilan Masuk (`src/screens/IncomingCallScreen.jsx`)**:
    - Layar panggilan masuk penuh dengan tombol Terima, Tolak, dan *Balas dengan pesan* seperti `"Nanti ya, aku lagi kuliah."` (FR-48, FR-49).
    - Pencatatan panggilan tak terjawab di Chat (FR-50) dan Mode Jangan Ganggu (FR-51).

---

## 🚀 Cara Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

## 🌐 Cara Upload / Deploy ke Vercel

Proyek ini sudah dilengkapi dengan `vercel.json` dan struktur standar Vite sehingga bisa langsung di-upload ke Vercel dengan 2 cara:

### Cara 1: Lewat GitHub / GitLab (Paling Direkomendasikan)
1. Push seluruh isi folder `beemate-app` ini ke repository GitHub baru.
2. Buka [vercel.com/new](https://vercel.com/new) dan pilih repository tersebut.
3. Vercel akan otomatis mendeteksi **Framework Preset: Vite** (`Build Command: vite build`, `Output Directory: dist`).
4. Klik **Deploy** — aplikasi langsung online!

### Cara 2: Lewat Vercel CLI (Langsung dari Terminal)
```bash
npx vercel
```
Ikuti petunjuk login di terminal, lalu jalankan `npx vercel --prod` untuk mendapatkan URL produksi.
