import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, GraduationCap, Edit3 } from 'lucide-react';
import { FACULTY_MAJORS_MAP } from '../data/mockData';

const FACULTY_LIST = Object.keys(FACULTY_MAJORS_MAP);

export default function VerifyNimScreen({ user, onUpdateUser, onNext, onBack }) {
  const [nim, setNim] = useState(user.nim || '2802419283');
  const [fullName, setFullName] = useState(user.name || 'Rafi Pratama');
  const [faculty, setFaculty] = useState(
    user.faculty && FACULTY_MAJORS_MAP[user.faculty]
      ? user.faculty
      : FACULTY_LIST[0]
  );
  const [major, setMajor] = useState(
    user.major || FACULTY_MAJORS_MAP[FACULTY_LIST[0]][0]
  );
  const [manualBatch, setManualBatch] = useState('');
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [error, setError] = useState('');

  const availableMajors = FACULTY_MAJORS_MAP[faculty] || [];

  const handleFacultyChange = (newFaculty) => {
    setFaculty(newFaculty);
    const majorsForFaculty = FACULTY_MAJORS_MAP[newFaculty] || [];
    if (!majorsForFaculty.includes(major)) {
      setMajor(majorsForFaculty[0] || '');
    }
  };

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
    <div className="flex flex-col h-full bg-[#0F1115] text-white justify-between p-6 overflow-y-auto no-scrollbar">
      {/* Top Progress Header — Step 2 of 3 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className="w-10 h-10 rounded-full bg-[#181B22] border border-[#2E3440] flex items-center justify-center text-white hover:border-[#F59E0B] transition cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs font-bold text-[#F59E0B]">
            Langkah 2 dari 3 · Data Akademik
          </span>
          <div className="w-10" />
        </div>

        <div className="flex gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-[#F59E0B]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#F59E0B]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#222631]" />
        </div>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit} className="space-y-4 my-auto py-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold leading-tight">
            Verifikasi <span className="text-[#F59E0B]">NIM & Jurusan</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Masukkan 10 digit NIM & pilih program studi kamu di Binus University.
          </p>
        </div>

        <div className="bg-[#181B22] border border-[#2E3440] rounded-4xl p-4 space-y-3">
          <div className="bg-[#222631] border border-[#2E3440] rounded-3xl px-4 py-3 focus-within:border-[#F59E0B]">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                NIM Binusian (10 Digit)
              </span>
              <span className="text-[11px] font-bold text-[#38BDF8]">
                {nim.length}/10
              </span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              required
              value={nim}
              onChange={handleNimChange}
              placeholder="2802419283"
              className="w-full bg-transparent text-sm font-bold tracking-widest text-white mt-1 focus:outline-none"
            />
          </div>

          {/* Auto Calculated Batch Pill Box — Academic Blue for verified batch/faculty identity */}
          {gradYear && autoBatch && (
            <div className="bg-[#0F1115] border border-[#38BDF8]/40 rounded-3xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#38BDF8]">
                  <GraduationCap size={15} className="text-[#38BDF8]" />
                  <span>Kode NIM &ldquo;{nim.slice(0, 2)}&rdquo; Terdeteksi</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsManualOverride(!isManualOverride);
                    if (!manualBatch) setManualBatch(autoBatch);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#222631] hover:bg-[#2E3440] px-2.5 py-1 rounded-full cursor-pointer"
                >
                  <Edit3 size={11} />
                  <span>{isManualOverride ? 'Otomatis' : 'Koreksi Angkatan'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#181B22] px-3 py-2 rounded-2xl border border-[#2E3440]">
                  <span className="text-[11px] text-[#94A3B8] block">Perkiraan Lulus</span>
                  <span className="text-xs font-extrabold text-white">Tahun {gradYear}</span>
                </div>
                <div className="bg-[#38BDF8]/15 px-3 py-2 rounded-2xl border border-[#38BDF8]/40">
                  <span className="text-[11px] text-[#38BDF8] block">Status Angkatan</span>
                  <span className="text-xs font-extrabold text-[#38BDF8]">Binusian {finalBatch}</span>
                </div>
              </div>

              {isManualOverride && (
                <select
                  value={manualBatch}
                  onChange={(e) => setManualBatch(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-2xl bg-[#222631] border border-[#38BDF8] text-white font-semibold"
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
          <div className="bg-[#222631] border border-[#2E3440] rounded-3xl px-4 py-3 focus-within:border-[#F59E0B]">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
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

          {/* Linked Faculty & Major Dropdowns */}
          <div className="grid grid-cols-1 gap-2.5">
            <div className="bg-[#222631] border border-[#2E3440] rounded-3xl px-4 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                  Fakultas / School
                </span>
                <span className="text-[11px] font-bold text-[#38BDF8]">Akademik</span>
              </div>
              <select
                value={faculty}
                onChange={(e) => handleFacultyChange(e.target.value)}
                className="w-full bg-[#222631] text-xs font-bold text-white mt-1 focus:outline-none"
              >
                {FACULTY_LIST.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#222631] border border-[#2E3440] rounded-3xl px-4 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                  Jurusan ({availableMajors.length} program)
                </span>
                <span className="text-[11px] font-semibold text-[#38BDF8]">Terfilter otomatis</span>
              </div>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full bg-[#222631] text-xs font-bold text-white mt-1 focus:outline-none"
              >
                {availableMajors.map((m) => (
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
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 rounded-full bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0F1115] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F59E0B]/25 transition cursor-pointer"
        >
          <span>Lanjut ke Unggah Student ID</span>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
