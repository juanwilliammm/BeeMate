import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

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
    // FR-03: namaawal.namaakhir@binus.ac.id
    const regex = /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+@binus\.ac\.id$/;
    return regex.test(value.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    const cleanEmail = email.trim().toLowerCase();

    // Check domain & format first (FR-03)
    if (!cleanEmail.endsWith('@binus.ac.id') || !validateBinusEmail(cleanEmail)) {
      setErrorMsg(
        'Hanya email berformat namaawal.namaakhir@binus.ac.id yang diterima. Email domain lain ditolak.'
      );
      return;
    }

    // Simulate wrong password if password < 6 chars or equals 'salah' (FR-04 & FR-05)
    if (password.length < 6 || password === 'salah') {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setLockoutSeconds(120); // 2 minutes lockout
        setErrorMsg(
          'Terlalu banyak percobaan gagal (5x). Demi keamanan, silakan tunggu sebelum mencoba lagi.'
        );
      } else {
        // FR-04: Do not leak which field is wrong
        setErrorMsg(`Email atau kata sandi salah. (${nextAttempts}/5 percobaan)`);
      }
      return;
    }

    setErrorMsg('');
    onSuccessLogin(cleanEmail);
  };

  const simulateFailedAttempt = () => {
    if (lockoutSeconds > 0) return;
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    if (nextAttempts >= 5) {
      setLockoutSeconds(120);
      setErrorMsg('Batas 5 kali gagal tercapai (FR-05). Akun ditahan sementara selama 2 menit.');
    } else {
      setErrorMsg(`Email atau kata sandi salah. (${nextAttempts}/5 percobaan)`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-binus-blue via-[#003d73] to-slate-900 text-white justify-between p-6 overflow-y-auto">
      {/* Top Branding */}
      <div className="pt-4">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs font-medium text-amber-300 mb-4">
          <ShieldCheck size={15} />
          <span>Eksklusif Mahasiswa Terverifikasi Binus</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-binus-orange to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 font-extrabold text-2xl text-slate-900">
            B
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">BeeMate</h1>
            <p className="text-xs text-blue-100">
              Temukan partner belajar, lomba & kolaborasi lintas jurusan
            </p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white text-slate-800 rounded-3xl p-5 shadow-2xl my-4">
        <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              !isRegisterMode ? 'bg-white text-binus-blue shadow-xs' : 'text-slate-500'
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              isRegisterMode ? 'bg-white text-binus-blue shadow-xs' : 'text-slate-500'
            }`}
          >
            Daftar Baru (FR-02)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Kampus Binus (FR-01, FR-03)
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                disabled={lockoutSeconds > 0}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namaawal.namaakhir@binus.ac.id"
                className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-binus-blue focus:ring-2 focus:ring-binus-blue/15 disabled:bg-slate-100"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Wajib format: <span className="font-mono text-slate-600">namaawal.namaakhir@binus.ac.id</span>
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
              {!isRegisterMode && (
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-[11px] font-semibold text-binus-blue hover:underline"
                >
                  Lupa kata sandi?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                disabled={lockoutSeconds > 0}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-binus-blue focus:ring-2 focus:ring-binus-blue/15 disabled:bg-slate-100"
              />
              <button
                type="button"
                aria-label="Tampilkan kata sandi"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
              <div className="space-y-1">
                <p className="font-medium leading-snug">{errorMsg}</p>
                {lockoutSeconds > 0 && (
                  <p className="font-bold text-rose-800">
                    Coba lagi dalam: {Math.floor(lockoutSeconds / 60)}:
                    {String(lockoutSeconds % 60).padStart(2, '0')}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={lockoutSeconds > 0}
            className="w-full py-3 rounded-xl bg-binus-blue hover:bg-[#00427A] disabled:bg-slate-300 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-binus-blue/20 transition cursor-pointer"
          >
            <span>
              {isRegisterMode
                ? 'Daftar & Lanjut Verifikasi NIM'
                : 'Masuk & Lanjut Verifikasi NIM'}
            </span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Demo Helpers for PRD Verification */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Simulasi Pengujian PRD (Layar 1):
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setEmail('budi123@gmail.com');
                setErrorMsg(
                  'Hanya email berformat namaawal.namaakhir@binus.ac.id yang diterima. Email dengan domain lain ditolak.'
                );
              }}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-lg font-medium"
            >
              Uji Email Non-Binus (FR-03)
            </button>
            <button
              type="button"
              onClick={simulateFailedAttempt}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-lg font-medium"
            >
              Uji Salah Sandi ({failedAttempts}/5) (FR-04/05)
            </button>
            {lockoutSeconds > 0 && (
              <button
                type="button"
                onClick={() => {
                  setLockoutSeconds(0);
                  setFailedAttempts(0);
                  setErrorMsg('');
                }}
                className="text-[10px] bg-amber-100 text-amber-800 px-2 py-1 rounded-lg font-semibold"
              >
                Reset Lockout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Bypass to Beranda for Evaluators */}
      <div className="text-center">
        <button
          type="button"
          onClick={onQuickSkipToHome}
          className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-4"
        >
          <Sparkles size={13} />
          <span>Lewati ke Beranda (Mode Demo Cepat)</span>
        </button>
      </div>

      {/* Forgot Password Modal (FR-02) */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-2xl p-5 max-w-xs w-full space-y-3 shadow-xl">
            <h3 className="font-bold text-sm text-slate-900">Atur Ulang Kata Sandi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tautan pemulihan kata sandi akan dikirimkan ke email kampus{' '}
              <span className="font-semibold text-binus-blue">{email || '@binus.ac.id'}</span>.
            </p>
            <button
              type="button"
              onClick={() => setForgotModal(false)}
              className="w-full py-2 bg-binus-blue text-white rounded-xl text-xs font-bold"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
