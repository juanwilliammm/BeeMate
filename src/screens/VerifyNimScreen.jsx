import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, Sparkles, Edit3 } from 'lucide-react';
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
    const autoBatch = gradYear - 4;
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

    if (!/^\d{10}$/.test(nim)) {
      setError('NIM wajib terdiri dari tepat 10 digit angka.');
      return;
    }

    if (!gradYear || !autoBatch) {
      setError('2 digit pertama NIM harus menunjukkan tahun perkiraan lulus yang valid (contoh: 28, 29, 30).');
      return;
    }

    if (nim === '2800000000') {
      setError('NIM ini sudah terhubung ke akun lain (1 NIM = 1 Akun).');
      return;
    }

    if (fullName.trim().length < 3) {
      setError('Masukkan nama lengkap sesuai Binusian Card.');
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
    <div className="flex flex-col h-full bg-[#0A0A0E] text-white justify-between p-6 overflow-y-auto no-scrollbar">
      {/* Top Progress Header (Inspired by UI Reference Question 1/3) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className="w-10 h-10 rounded-full bg-[#15151E] border border-[#2A2A3A] flex items-center justify-center text-white hover:border-[#FF4D8D] transition cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs font-bold text-[#FF85B3]">
            Langkah 1 dari 3
          </span>
          <div className="w-10" />
        </div>

        {/* Segmented Dashes like Reference UI */}
        <div className="flex gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-[#FF4D8D]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#1E1E2A]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#1E1E2A]" />
        </div>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit} className="space-y-4 my-auto py-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold leading-tight">
            Verifikasi <span className="text-[#FF4D8D]">NIM Binusian</span>
          </h1>
          <p className="text-xs text-[#9494A8] mt-1">
            Masukkan 10 digit NIM & nama sesuai kartu mahasiswa kamu.
          </p>
        </div>

        {/* Bento Card Inputs (Inspired by Reference Form Card) */}
        <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-4 space-y-3">
          <div className="bg-[#1E1E2A] border border-[#2A2A3A] rounded-3xl px-4 py-3 focus-within:border-[#FF4D8D]">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-semibold text-[#9494A8] uppercase tracking-wider">
                NIM (10 Digit)
              </span>
              <span className="text-[10px] font-bold text-[#FF85B3]">
                {nim.length}/10
              </span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              required
              value={nim}
              onChange={handleNimChange}
              placeholder="3001928374"
              className="w-full bg-transparent text-sm font-bold tracking-widest text-white mt-1 focus:outline-none"
            />
          </div>

          {/* Auto Calculated Batch Pill Box */}
          {gradYear && autoBatch && (
            <div className="bg-[#0A0A0E] border border-[#FF4D8D]/40 rounded-3xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FF85B3]">
                  <Sparkles size={13} className="text-[#FF4D8D]" />
                  <span>Deteksi Otomatis NIM &ldquo;{nim.slice(0, 2)}&rdquo;</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsManualOverride(!isManualOverride);
                    if (!manualBatch) setManualBatch(autoBatch);
                  }}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-[#1E1E2A] px-2.5 py-1 rounded-full"
                >
                  <Edit3 size={11} />
                  <span>{isManualOverride ? 'Otomatis' : 'Ubah Angkatan'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#15151E] px-3 py-2 rounded-2xl border border-[#2A2A3A]">
                  <span className="text-[10px] text-[#9494A8] block">Perkiraan Lulus</span>
                  <span className="text-xs font-extrabold text-white">Tahun {gradYear}</span>
                </div>
                <div className="bg-[#FF4D8D]/15 px-3 py-2 rounded-2xl border border-[#FF4D8D]/40">
                  <span className="text-[10px] text-[#FF85B3] block">Angkatan (Lulus - 4)</span>
                  <span className="text-xs font-extrabold text-[#FF4D8D]">Binusian {finalBatch}</span>
                </div>
              </div>

              {isManualOverride && (
                <select
                  value={manualBatch}
                  onChange={(e) => setManualBatch(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-2xl bg-[#1E1E2A] border border-[#FF4D8D] text-white font-semibold"
                >
                  {['2022', '2023', '2024', '2025', '2026', '2027'].map((b) => (
                    <option key={b} value={b}>
                      Binusian Angkatan {b}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Full Name */}
          <div className="bg-[#1E1E2A] border border-[#2A2A3A] rounded-3xl px-4 py-3 focus-within:border-[#FF4D8D]">
            <span className="text-[10px] font-semibold text-[#9494A8] uppercase tracking-wider block">
              Nama Lengkap Sesuai Kartu
            </span>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama lengkap kamu"
              className="w-full bg-transparent text-xs font-semibold text-white mt-1 focus:outline-none"
            />
          </div>

          {/* Faculty & Major Dropdowns */}
          <div className="grid grid-cols-1 gap-2.5">
            <div className="bg-[#1E1E2A] border border-[#2A2A3A] rounded-3xl px-4 py-2.5">
              <span className="text-[10px] font-semibold text-[#9494A8] uppercase tracking-wider block">
                Fakultas / School
              </span>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full bg-[#1E1E2A] text-xs font-bold text-white mt-0.5 focus:outline-none"
              >
                {FACULTIES.filter((f) => f !== 'Semua').map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#1E1E2A] border border-[#2A2A3A] rounded-3xl px-4 py-2.5">
              <span className="text-[10px] font-semibold text-[#9494A8] uppercase tracking-wider block">
                Jurusan
              </span>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full bg-[#1E1E2A] text-xs font-bold text-white mt-0.5 focus:outline-none"
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
          <div className="p-3.5 rounded-3xl bg-rose-500/15 border border-rose-500/40 flex items-center gap-2 text-rose-200 text-xs">
            <AlertCircle size={16} className="text-[#FF4D8D] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 rounded-full bg-[#FF4D8D] hover:bg-[#FF85B3] text-[#0A0A0E] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D8D]/30 transition cursor-pointer"
        >
          <span>Lanjut ke Kartu Mahasiswa</span>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
