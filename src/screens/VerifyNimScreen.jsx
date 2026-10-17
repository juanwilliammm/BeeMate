import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Hash, UserCheck, AlertCircle, Calendar, Edit3, CheckCircle2 } from 'lucide-react';
import { FACULTIES, MAJORS } from '../data/mockData';

export default function VerifyNimScreen({ user, onUpdateUser, onNext, onBack }) {
  const [nim, setNim] = useState(user.nim || '3001928374');
  const [fullName, setFullName] = useState(user.name || 'Rafi Pratama');
  const [faculty, setFaculty] = useState(user.faculty || 'School of Computer Science');
  const [major, setMajor] = useState(user.major || 'Computer Science');
  const [manualBatch, setManualBatch] = useState('');
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [error, setError] = useState('');

  // FR-07: Calculate graduation year & batch automatically from first 2 digits of 10-digit NIM
  const computeBatchInfo = (nimStr) => {
    const clean = nimStr.replace(/\D/g, '');
    if (clean.length < 2) return { gradYear: null, autoBatch: null };
    const prefix = parseInt(clean.substring(0, 2), 10);
    if (isNaN(prefix) || prefix < 20 || prefix > 38) {
      return { gradYear: null, autoBatch: null };
    }
    const gradYear = 2000 + prefix;
    const autoBatch = gradYear - 4; // e.g., 30 -> 2030 - 4 = 2026
    return { gradYear, autoBatch: String(autoBatch) };
  };

  const { gradYear, autoBatch } = computeBatchInfo(nim);
  const finalBatch = isManualOverride && manualBatch ? manualBatch : autoBatch;

  const handleNimChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setNim(digitsOnly);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // FR-07: 10 digits validation
    if (!/^\d{10}$/.test(nim)) {
      setError('NIM wajib terdiri dari tepat 10 digit angka sesuai Binusian ID Card.');
      return;
    }

    if (!gradYear || !autoBatch) {
      setError('2 digit pertama NIM harus menunjukkan tahun perkiraan lulus yang valid (contoh: 28, 29, 30).');
      return;
    }

    // FR-08: Simulate duplicate NIM check
    if (nim === '2800000000') {
      setError('NIM 2800000000 sudah terhubung ke akun lain (FR-08: Satu NIM hanya untuk satu akun).');
      return;
    }

    if (fullName.trim().length < 3) {
      setError('Masukkan nama lengkap sesuai kartu mahasiswa (Flazz / Binusian Card).');
      return;
    }

    onUpdateUser({
      nim,
      name: fullName.trim(),
      faculty,
      major,
      batch: finalBatch,
      graduationYear: String(gradYear)
    });
    onNext();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 justify-between overflow-y-auto">
      {/* Header with Step Indicator (FR-09) */}
      <div className="bg-white border-b border-slate-200 px-5 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali ke Login"
            className="p-1.5 -ml-1.5 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs font-bold text-binus-blue bg-blue-50 px-3 py-1 rounded-full">
            Langkah 1 dari 3 · Verifikasi NIM
          </span>
          <div className="w-6" />
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-1">
          <div className="w-1/3 bg-binus-blue h-full rounded-full" />
          <div className="w-1/3 bg-slate-200 h-full rounded-full" />
          <div className="w-1/3 bg-slate-200 h-full rounded-full" />
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4 flex-1">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Data Identitas Kampus</h2>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Masukkan NIM 10 digit dan nama lengkap sesuai Kartu Mahasiswa (Binusian Card) kamu.
          </p>
        </div>

        {/* NIM Input (FR-06, FR-07) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">
                Nomor Induk Mahasiswa (NIM)
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {nim.length}/10 digit
              </span>
            </div>
            <div className="relative">
              <Hash size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                inputMode="numeric"
                required
                value={nim}
                onChange={handleNimChange}
                placeholder="Contoh: 3001928374"
                className="w-full pl-10 pr-3 py-2.5 text-sm font-mono tracking-wider rounded-xl border border-slate-200 focus:outline-none focus:border-binus-blue"
              />
            </div>
            <div className="flex gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => setNim('3001928374')}
                className="text-[10px] bg-blue-50 text-binus-blue px-2 py-1 rounded-lg font-semibold"
              >
                Contoh NIM 30xxxx (Lulus 2030 → Angkatan 2026)
              </button>
              <button
                type="button"
                onClick={() => setNim('2800000000')}
                className="text-[10px] bg-rose-50 text-rose-700 px-2 py-1 rounded-lg font-semibold"
              >
                Uji NIM Terpakai (FR-08)
              </button>
            </div>
          </div>

          {/* Automatic Batch Calculation Box (FR-07) */}
          {gradYear && autoBatch && (
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Calendar size={15} className="text-binus-orange" />
                  <span>Deteksi Otomatis NIM &quot;{nim.slice(0, 2)}&quot;</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsManualOverride(!isManualOverride);
                    if (!manualBatch) setManualBatch(autoBatch);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-binus-blue hover:underline"
                >
                  <Edit3 size={12} />
                  <span>{isManualOverride ? 'Gunakan Otomatis' : 'Koreksi Manual'}</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/90 p-2 rounded-lg border border-amber-100">
                  <span className="text-[10px] text-slate-400 block">Perkiraan Lulus</span>
                  <span className="font-bold text-slate-800">Tahun {gradYear}</span>
                </div>
                <div className="bg-white/90 p-2 rounded-lg border border-amber-100">
                  <span className="text-[10px] text-slate-400 block">Angkatan (Lulus - 4)</span>
                  <span className="font-bold text-binus-blue">Binusian {finalBatch}</span>
                </div>
              </div>

              {isManualOverride && (
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Koreksi Tahun Angkatan (untuk program masa studi berbeda):
                  </label>
                  <select
                    value={manualBatch}
                    onChange={(e) => setManualBatch(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-white font-semibold"
                  >
                    <option value="2022">Angkatan 2022</option>
                    <option value="2023">Angkatan 2023</option>
                    <option value="2024">Angkatan 2024</option>
                    <option value="2025">Angkatan 2025</option>
                    <option value="2026">Angkatan 2026</option>
                    <option value="2027">Angkatan 2027</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap Sesuai Kartu Mahasiswa (FR-06)
            </label>
            <div className="relative">
              <UserCheck size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama lengkap sesuai Binusian Card"
                className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-binus-blue"
              />
            </div>
          </div>

          {/* Faculty & Major */}
          <div className="grid grid-cols-1 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fakultas / School</label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {FACULTIES.filter((f) => f !== 'Semua').map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jurusan / Program Studi</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {MAJORS.filter((m) => m !== 'Semua').map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2 text-[11px] text-slate-600">
          <CheckCircle2 size={15} className="text-binus-blue shrink-0 mt-0.5" />
          <span>
            Satu NIM hanya dapat terhubung ke satu akun aktif BeeMate untuk mencegah akun palsu.
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-binus-blue hover:bg-[#00427A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
        >
          <span>Simpan & Lanjut Unggah Kartu Mahasiswa</span>
          <ArrowRight size={15} />
        </button>
      </form>
    </div>
  );
}
