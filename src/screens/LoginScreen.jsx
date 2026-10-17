import React, { useState, useEffect } from 'react';
import { Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginScreen({ onSuccessLogin, onQuickSkipToHome }) {
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

  const validateBinusEmail = (value) => {
    const regex = /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+@binus\.ac\.id$/;
    return regex.test(value.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail.endsWith('@binus.ac.id') || !validateBinusEmail(cleanEmail)) {
      setErrorMsg(
        'Hanya email berformat namaawal.namaakhir@binus.ac.id yang diterima.'
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
    onSuccessLogin(cleanEmail);
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0E] text-white justify-between p-6 overflow-y-auto no-scrollbar relative">
      {/* Decorative Pink Ambient Glow */}
      <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[#FF4D8D]/20 blur-3xl pointer-events-none" />

      {/* Top Logo & Header */}
      <div className="pt-3 flex flex-col items-center text-center z-10">
        <div className="w-20 h-20 rounded-full bg-black border-2 border-[#FF4D8D]/60 flex items-center justify-center shadow-lg shadow-[#FF4D8D]/20 mb-3 overflow-hidden">
          <img
            src="/beemate-logo.png"
            alt="BeeMate"
            className="w-16 h-16 object-contain"
          />
        </div>
        <span className="px-3.5 py-1 rounded-full bg-[#15151E] border border-[#2A2A3A] text-[10px] font-bold text-[#FF85B3] uppercase tracking-wider">
          Binusian Exclusive Space
        </span>
        <h1 className="font-display text-2xl font-extrabold mt-2">
          Welcome to Bee<span className="text-[#FF4D8D]">Mate</span>
        </h1>
        <p className="text-xs text-[#9494A8] mt-1">
          Kenalan, cari partner lomba & belajar lintas jurusan
        </p>
      </div>

      {/* Bento Form Card */}
      <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-5 shadow-2xl my-4 z-10 space-y-4">
        {/* Segmented Pill Switcher */}
        <div className="flex bg-[#0A0A0E] p-1.5 rounded-full border border-[#2A2A3A]">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition cursor-pointer ${
              !isRegisterMode
                ? 'bg-[#FF4D8D] text-[#0A0A0E] shadow-md shadow-[#FF4D8D]/25'
                : 'text-[#9494A8] hover:text-white'
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
            className={`flex-1 py-2 text-xs font-bold rounded-full transition cursor-pointer ${
              isRegisterMode
                ? 'bg-[#FF4D8D] text-[#0A0A0E] shadow-md shadow-[#FF4D8D]/25'
                : 'text-[#9494A8] hover:text-white'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="bg-[#1E1E2A] border border-[#2A2A3A] rounded-3xl px-4 py-3 focus-within:border-[#FF4D8D] transition">
            <label className="block text-[10px] font-semibold text-[#9494A8] uppercase tracking-wider">
              Email Kampus Binus
            </label>
            <div className="flex items-center gap-2.5 mt-1">
              <Mail size={16} className="text-[#FF4D8D] shrink-0" />
              <input
                type="email"
                required
                disabled={lockoutSeconds > 0}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namaawal.namaakhir@binus.ac.id"
                className="w-full bg-transparent text-xs font-medium text-white focus:outline-none placeholder:text-[#9494A8]/50"
              />
            </div>
          </div>

          <div className="bg-[#1E1E2A] border border-[#2A2A3A] rounded-3xl px-4 py-3 focus-within:border-[#FF4D8D] transition">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold text-[#9494A8] uppercase tracking-wider">
                Kata Sandi
              </label>
              {!isRegisterMode && (
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-[10px] font-bold text-[#FF85B3] hover:underline"
                >
                  Lupa sandi?
                </button>
              )}
            </div>
            <div className="flex items-center gap-2.5 mt-1">
              <Lock size={16} className="text-[#FF4D8D] shrink-0" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                disabled={lockoutSeconds > 0}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full bg-transparent text-xs font-medium text-white focus:outline-none placeholder:text-[#9494A8]/50"
              />
              <button
                type="button"
                aria-label="Tampilkan sandi"
                onClick={() => setShowPass(!showPass)}
                className="text-[#9494A8] hover:text-white"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-3xl bg-rose-500/15 border border-rose-500/40 flex items-start gap-2.5 text-rose-200 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#FF4D8D]" />
              <div className="space-y-1">
                <p className="font-medium leading-snug">{errorMsg}</p>
                {lockoutSeconds > 0 && (
                  <p className="font-bold text-[#FF85B3]">
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
            className="w-full py-3.5 rounded-full bg-[#FF4D8D] hover:bg-[#FF85B3] disabled:bg-[#2A2A3A] disabled:text-[#9494A8] text-[#0A0A0E] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D8D]/30 transition cursor-pointer"
          >
            <span>{isRegisterMode ? 'Mulai Verifikasi NIM' : 'Masuk Sekarang'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Validation Pills */}
        <div className="pt-2 border-t border-[#2A2A3A] flex flex-wrap gap-1.5 justify-center">
          <button
            type="button"
            onClick={() => {
              setEmail('user@gmail.com');
              setErrorMsg('Hanya email berformat namaawal.namaakhir@binus.ac.id yang diterima.');
            }}
            className="text-[10px] px-3 py-1 rounded-full bg-[#1E1E2A] text-[#9494A8] hover:text-white border border-[#2A2A3A]"
          >
            Cek Email Non-Binus
          </button>
          <button
            type="button"
            onClick={() => {
              const next = failedAttempts + 1;
              setFailedAttempts(next);
              if (next >= 5) {
                setLockoutSeconds(120);
                setErrorMsg('Batas 5x gagal tercapai. Tunggu 2 menit.');
              } else {
                setErrorMsg(`Email atau kata sandi salah (${next}/5)`);
              }
            }}
            className="text-[10px] px-3 py-1 rounded-full bg-[#1E1E2A] text-[#9494A8] hover:text-white border border-[#2A2A3A]"
          >
            Simulasi Salah Sandi ({failedAttempts}/5)
          </button>
        </div>
      </div>

      {/* Bottom Direct Explore Link */}
      <div className="text-center pb-1 z-10">
        <button
          type="button"
          onClick={onQuickSkipToHome}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#15151E] border border-[#2A2A3A] text-xs text-[#FF85B3] hover:bg-[#1E1E2A] font-semibold transition cursor-pointer"
        >
          <Sparkles size={13} className="text-[#FF4D8D]" />
          <span>Langsung Masuk ke Beranda</span>
        </button>
      </div>

      {forgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-[#15151E] border border-[#2A2A3A] text-white rounded-4xl p-6 max-w-xs w-full space-y-3 text-center">
            <h3 className="font-bold text-sm">Reset Kata Sandi</h3>
            <p className="text-xs text-[#9494A8] leading-relaxed">
              Tautan pemulihan telah dikirim ke{' '}
              <span className="font-bold text-[#FF85B3]">{email || '@binus.ac.id'}</span>.
            </p>
            <button
              type="button"
              onClick={() => setForgotModal(false)}
              className="w-full py-2.5 bg-[#FF4D8D] text-[#0A0A0E] rounded-full text-xs font-extrabold"
            >
              Oke, Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
