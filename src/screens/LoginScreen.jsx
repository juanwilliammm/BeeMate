import React, { useState, useEffect } from 'react';
import { Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginScreen({ onLoginSuccess, onRegisterStart }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('rafi.pratama@binus.ac.id');
  const [password, setPassword] = useState('binusian2028');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [forgotModal, setForgotModal] = useState(false);

  // FR-05: Lockout timer after 5 failed attempts
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((s) => {
        if (s <= 1) {
          setFailedAttempts(0);
          setErrorMsg('');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Strict Binus campus email validation: must start with alphabetic name and contain dot before @binus.ac.id (rejects pure numbers like 123.456@binus.ac.id)
  const validateBinusEmail = (value) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)+@binus\.ac\.id$/;
    return regex.test(value.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail.endsWith('@binus.ac.id') || !validateBinusEmail(cleanEmail)) {
      setErrorMsg(
        'Gunakan email resmi kampus berformat namaawal.namaakhir@binus.ac.id (bukan angka atau domain umum).'
      );
      return;
    }

    if (password.length < 6 || password === 'salah') {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setLockoutSeconds(120);
        setErrorMsg(
          'Terlalu banyak percobaan gagal (5x). Akun ditahan sementara selama 2 menit.'
        );
      } else {
        setErrorMsg(`Email atau kata sandi salah. (${nextAttempts}/5 percobaan)`);
      }
      return;
    }

    setErrorMsg('');
    if (isRegisterMode) {
      // Daftar Baru: Step 1 OTP Email -> Step 2 NIM & Jurusan -> Step 3 Student ID & Minat
      onRegisterStart(cleanEmail);
    } else {
      // Masuk: Pengguna terdaftar langsung masuk ke Beranda tanpa mengulang registrasi
      onLoginSuccess(cleanEmail);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0F1115] text-white justify-between p-6 overflow-y-auto no-scrollbar relative">
      {/* Top Logo & Header */}
      <div className="pt-2 flex flex-col items-center text-center z-10">
        <div className="w-20 h-20 rounded-full bg-[#181B22] border-2 border-[#F59E0B]/70 flex items-center justify-center shadow-lg shadow-[#F59E0B]/15 mb-3 overflow-hidden">
          <img
            src="/beemate-logo.png"
            alt="BeeMate"
            className="w-16 h-16 object-contain"
          />
        </div>
        {/* Academic Blue Badge exclusively for verified campus identity */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[11px] font-bold text-[#38BDF8]">
          <ShieldCheck size={13} />
          <span>Khusus Sivitas Akademika @binus.ac.id</span>
        </span>
        <h1 className="font-display text-2xl font-extrabold mt-2.5">
          Selamat Datang di Bee<span className="text-[#F59E0B]">Mate</span>
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          {isRegisterMode
            ? 'Verifikasi email kampus, NIM, dan Binusian Card untuk mulai berkolaborasi'
            : 'Masuk langsung ke akun networking akademik Binusian kamu'}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-[#181B22] border border-[#2E3440] rounded-4xl p-5 shadow-2xl my-4 z-10 space-y-4">
        {/* Segmented Pill Switcher — Amber for active action */}
        <div className="flex bg-[#0F1115] p-1.5 rounded-full border border-[#2E3440]">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-full transition cursor-pointer ${
              !isRegisterMode
                ? 'bg-[#F59E0B] text-[#0F1115] shadow-md shadow-[#F59E0B]/20'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-full transition cursor-pointer ${
              isRegisterMode
                ? 'bg-[#F59E0B] text-[#0F1115] shadow-md shadow-[#F59E0B]/20'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Flow Explanation Badge */}
        <div className="px-3.5 py-2.5 rounded-2xl bg-[#0F1115] border border-[#2E3440] text-xs text-[#94A3B8] flex items-center justify-between gap-2">
          <span className="shrink-0">Alur {isRegisterMode ? 'Daftar' : 'Masuk'}:</span>
          <span className="font-bold text-[#38BDF8] text-right">
            {isRegisterMode
              ? '1. OTP Email → 2. NIM → 3. Kartu ID'
              : 'Validasi Sandi → Langsung Beranda'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="bg-[#222631] border border-[#2E3440] rounded-3xl px-4 py-3 focus-within:border-[#F59E0B] transition">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Email Kampus Binus
              </label>
              <span className="text-[11px] font-semibold text-[#38BDF8]">
                @binus.ac.id
              </span>
            </div>
            <div className="flex items-center gap-2.5 mt-1.5">
              <Mail size={16} className="text-[#38BDF8] shrink-0" />
              <input
                type="email"
                required
                disabled={lockoutSeconds > 0}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namaawal.namaakhir@binus.ac.id"
                className="w-full bg-transparent text-xs font-medium text-white focus:outline-none placeholder:text-[#94A3B8]/50"
              />
            </div>
          </div>

          <div className="bg-[#222631] border border-[#2E3440] rounded-3xl px-4 py-3 focus-within:border-[#F59E0B] transition">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                {isRegisterMode ? 'Buat Kata Sandi' : 'Kata Sandi'}
              </label>
              {!isRegisterMode && (
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-[11px] font-bold text-[#F59E0B] hover:underline cursor-pointer"
                >
                  Lupa sandi?
                </button>
              )}
            </div>
            <div className="flex items-center gap-2.5 mt-1.5">
              <Lock size={16} className="text-[#94A3B8] shrink-0" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                disabled={lockoutSeconds > 0}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full bg-transparent text-xs font-medium text-white focus:outline-none placeholder:text-[#94A3B8]/50"
              />
              <button
                type="button"
                aria-label="Tampilkan sandi"
                onClick={() => setShowPass(!showPass)}
                className="text-[#94A3B8] hover:text-white cursor-pointer"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-3xl bg-rose-500/15 border border-rose-500/40 flex items-start gap-2.5 text-rose-200 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <div className="space-y-1">
                <p className="font-medium leading-snug">{errorMsg}</p>
                {lockoutSeconds > 0 && (
                  <p className="font-bold text-[#F59E0B]">
                    Tunggu: {Math.floor(lockoutSeconds / 60)}:
                    {String(lockoutSeconds % 60).padStart(2, '0')}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={lockoutSeconds > 0}
            className="w-full py-3.5 rounded-full bg-[#F59E0B] hover:bg-[#FBBF24] disabled:bg-[#2E3440] disabled:text-[#94A3B8] text-[#0F1115] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F59E0B]/25 transition cursor-pointer"
          >
            <span>
              {isRegisterMode
                ? 'Kirim Kode OTP ke Email Kampus'
                : 'Masuk ke Beranda'}
            </span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="text-center pb-1 z-10">
        <p className="text-[11px] text-[#94A3B8]">
          Dilindungi enkripsi & sesuai kepatuhan <strong className="text-white">UU PDP No. 27/2022</strong>
        </p>
      </div>

      {forgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-[#181B22] border border-[#2E3440] text-white rounded-4xl p-6 max-w-xs w-full space-y-3 text-center">
            <h3 className="font-bold text-sm">Reset Kata Sandi</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Tautan pemulihan kata sandi telah dikirim ke email kampus{' '}
              <span className="font-bold text-[#38BDF8]">{email || '@binus.ac.id'}</span>.
            </p>
            <button
              type="button"
              onClick={() => setForgotModal(false)}
              className="w-full py-2.5 bg-[#F59E0B] text-[#0F1115] rounded-full text-xs font-extrabold cursor-pointer"
            >
              Oke, Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
