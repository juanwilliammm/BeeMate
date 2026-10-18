import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  UserCheck,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { fetchUserFromCloud, getSupabaseConfig } from '../utils/supabaseClient';

export default function LoginScreen({
  theme = 'light',
  isCloudConnected = false,
  onOpenCloudConfig,
  onLoginSuccess,
  onRegisterStart,
  onQuickSkipToHome
}) {
  // 'welcome' = Middle screen in Reference Image 3 (Logo on top + Yellow "Hi!" bottom card)
  // 'signin'  = Right screen in Reference Image 3 (Yellow top header + Rounded-top Sign In form)
  // 'signup'  = Right screen in Reference Image 3 (Yellow top header + Rounded-top Sign Up form)
  const [stepView, setStepView] = useState('welcome');
  const [email, setEmail] = useState('rafi.pratama@binus.ac.id');
  const [password, setPassword] = useState('binusian2028');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [forgotModal, setForgotModal] = useState(false);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);

  const isRegisterMode = stepView === 'signup';
  const logoSrc =
    theme === 'light' ? '/beemate-logo-light.png' : '/beemate-logo-dark.png';

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

  // Strict Binus campus email validation: must start with alphabetic name and contain dot before @binus.ac.id
  const validateBinusEmail = (value) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)+@binus\.ac\.id$/;
    return regex.test(value.trim());
  };

  const registerFailedAttempt = (customMessage) => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    if (nextAttempts >= 5) {
      setLockoutSeconds(120);
      setErrorMsg(
        'Terlalu banyak percobaan gagal (5x). Akun ditahan sementara selama 2 menit.'
      );
    } else {
      setErrorMsg(
        customMessage || `Email atau kata sandi salah. (${nextAttempts}/5 percobaan)`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockoutSeconds > 0 || isLoadingCloud) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail.endsWith('@binus.ac.id') || !validateBinusEmail(cleanEmail)) {
      setErrorMsg(
        'Gunakan email resmi kampus berformat namaawal.namaakhir@binus.ac.id (bukan angka atau domain umum).'
      );
      return;
    }

    if (password.length < 6 || password === 'salah') {
      registerFailedAttempt();
      return;
    }

    setErrorMsg('');

    const { isConfigured } = getSupabaseConfig();
    if (isConfigured) {
      setIsLoadingCloud(true);
      const { data: cloudRow } = await fetchUserFromCloud(cleanEmail);
      setIsLoadingCloud(false);

      if (isRegisterMode) {
        if (cloudRow && cloudRow.email) {
          setErrorMsg(
            'Email kampus ini sudah terdaftar di database Supabase. Silakan gunakan menu Masuk.'
          );
          return;
        }
        onRegisterStart(cleanEmail, password);
        return;
      }

      // Sign-in mode with Cloud DB:
      if (cloudRow) {
        if (cloudRow.password_hash && cloudRow.password_hash !== password) {
          registerFailedAttempt(
            `Kata sandi tidak sesuai dengan akun di Cloud. (${failedAttempts + 1}/5 percobaan)`
          );
          return;
        }
        onLoginSuccess(cleanEmail, password, cloudRow);
        return;
      }
    }

    if (isRegisterMode) {
      onRegisterStart(cleanEmail, password);
    } else {
      onLoginSuccess(cleanEmail, password, null);
    }
  };

  // ============================================================================
  // VIEW 1: WELCOME SCREEN (Matches Middle Screen of Reference Image 3)
  // ============================================================================
  if (stepView === 'welcome') {
    return (
      <div className="flex flex-col h-full w-full bg-[#0F1115] text-white justify-between relative overflow-hidden select-none">
        {/* Top Brand Showcase: Centered Logo (NO yellow border) + beeMate + find your hive & thrive */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-6 animate-splash-reveal">
          <img
            src={logoSrc}
            alt="BeeMate Logo"
            className="w-28 h-28 sm:w-32 sm:h-32 object-contain animate-float-bee"
          />
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-white">
            <span className="text-[#F59E0B]">Bee</span>Mate
          </h1>
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.26em] text-[#94A3B8] mt-2">
            find your hive &amp; thrive
          </p>
        </div>

        {/* Bottom Amber Welcome Sheet (Slides up like Middle Phone in Reference Image 3) */}
        <div className="bg-[#F59E0B] text-[#0F1115] rounded-t-[40px] px-7 pt-8 pb-9 shadow-2xl space-y-6 animate-sheet-up keep-dark-overlay">
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#0F1115]">
              Hi!
            </h2>
            <p className="text-sm font-semibold text-[#0F1115]/85 leading-relaxed">
              Welcome to BeeMate and find your hive &amp; thrive!
            </p>
          </div>

          {/* Side-by-side Pill Buttons: Masuk (Black Pill) & Daftar Baru (White Pill) */}
          <div className="grid grid-cols-2 gap-3.5 pt-1">
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setStepView('signin');
              }}
              className="py-3.5 px-5 rounded-full bg-[#0F1115] hover:bg-[#181B22] text-white font-display font-extrabold text-xs sm:text-sm shadow-lg transition-all cursor-pointer active:scale-95"
            >
              Masuk
            </button>

            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setStepView('signup');
              }}
              className="py-3.5 px-5 rounded-full bg-white hover:bg-[#F8FAFC] text-[#0F1115] font-display font-extrabold text-xs sm:text-sm shadow-lg transition-all cursor-pointer active:scale-95"
            >
              Daftar Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: MASUK / DAFTAR BARU FORM (Matches Right Screen of Reference Image 3)
  // ============================================================================
  return (
    <div className="flex flex-col h-full w-full bg-[#F59E0B] overflow-hidden relative animate-splash-reveal">
      {/* Top Amber Header Area (Matches Right Phone in Reference Image 3) */}
      <div className="px-7 pt-5 pb-10 text-[#0F1115] shrink-0 keep-dark-overlay">
        {/* Top Navigation Row: Back Arrow on Left, Switch Mode on Right */}
        <div className="flex items-center justify-between mb-5 pr-24">
          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              setStepView('welcome');
            }}
            className="w-9 h-9 rounded-full bg-[#0F1115]/10 hover:bg-[#0F1115]/20 flex items-center justify-center text-[#0F1115] transition cursor-pointer"
            aria-label="Kembali"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              setStepView(isRegisterMode ? 'signin' : 'signup');
            }}
            className="text-xs font-extrabold text-[#0F1115] hover:underline cursor-pointer"
          >
            {isRegisterMode ? 'Masuk' : 'Daftar Baru'}
          </button>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115]">
          {isRegisterMode ? 'Daftar Baru' : 'Masuk'}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-[#0F1115]/80 mt-1 leading-relaxed">
          Welcome to BeeMate and find your hive &amp; thrive!
        </p>
      </div>

      {/* Rounded-Top Form Sheet (White in Light Mode, Charcoal in Dark Mode) */}
      <div className="flex-1 bg-[#181B22] rounded-t-[40px] -mt-4 px-7 pt-7 pb-6 flex flex-col justify-between overflow-y-auto no-scrollbar shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campus Email Pill Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#94A3B8] block pl-2">
              Email Resmi Kampus (@binus.ac.id)
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-4 text-[#94A3B8]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama.mahasiswa@binus.ac.id"
                disabled={lockoutSeconds > 0 || isLoadingCloud}
                className="w-full pl-11 pr-4 py-3.5 text-xs font-semibold rounded-full bg-[#222631] border border-[#2E3440] text-white placeholder-[#64748B] focus:outline-none focus:border-[#F59E0B] transition"
                required
              />
            </div>
          </div>

          {/* Password Pill Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#94A3B8] block pl-2">
              Kata Sandi
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-4 text-[#94A3B8]" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                disabled={lockoutSeconds > 0 || isLoadingCloud}
                className="w-full pl-11 pr-11 py-3.5 text-xs font-semibold rounded-full bg-[#222631] border border-[#2E3440] text-white placeholder-[#64748B] focus:outline-none focus:border-[#F59E0B] transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 text-[#94A3B8] hover:text-white cursor-pointer"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {!isRegisterMode && (
              <div className="flex justify-end pt-1 pr-2">
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-xs font-bold text-[#94A3B8] hover:text-[#F59E0B] cursor-pointer transition"
                >
                  Lupa Kata Sandi?
                </button>
              </div>
            )}
          </div>

          {/* Error / Lockout Alert */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 keep-dark-overlay">
              <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{errorMsg}</p>
                {lockoutSeconds > 0 && (
                  <p className="text-[11px] font-bold text-rose-400 mt-1">
                    Waktu tunggu tersisa: {lockoutSeconds} detik
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Primary Pill Action Button (Matches Black Pill in Reference Image 3) */}
          <button
            type="submit"
            disabled={lockoutSeconds > 0 || isLoadingCloud}
            className="w-full py-4 rounded-full bg-[#0F1115] hover:bg-[#222631] disabled:opacity-50 text-white font-display font-extrabold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer keep-dark-overlay mt-2"
          >
            {isLoadingCloud ? (
              <>
                <RefreshCw size={15} className="animate-spin text-[#F59E0B]" />
                <span>Menyinkronkan dari Supabase...</span>
              </>
            ) : (
              <>
                <span>
                  {isRegisterMode
                    ? 'Daftar Baru & Kirim OTP'
                    : 'Masuk'}
                </span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Bottom Quick Action Pill Rows (Matches Bottom Pill Cards in Reference Image 3) */}
        <div className="space-y-2.5 pt-5">
          <button
            type="button"
            onClick={() => {
              setEmail('rafi.pratama@binus.ac.id');
              setPassword('binusian2028');
              setErrorMsg('');
            }}
            className="w-full px-5 py-3.5 rounded-full bg-[#222631] hover:bg-[#2E3440] border border-[#2E3440] flex items-center justify-between text-xs font-bold text-white shadow-sm transition cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <UserCheck size={16} className="text-[#F59E0B]" />
              <span>Gunakan Akun Demo Binusian</span>
            </span>
            <ArrowRight size={15} className="text-[#94A3B8]" />
          </button>

          {onQuickSkipToHome && (
            <button
              type="button"
              onClick={onQuickSkipToHome}
              className="w-full px-5 py-3.5 rounded-full bg-[#222631] hover:bg-[#2E3440] border border-[#2E3440] flex items-center justify-between text-xs font-bold text-white shadow-sm transition cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-[#38BDF8]" />
                <span>Lewati langsung ke Beranda (Demo)</span>
              </span>
              <ArrowRight size={15} className="text-[#94A3B8]" />
            </button>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5 z-50">
          <div className="bg-[#181B22] border border-[#2E3440] rounded-4xl max-w-xs w-full p-5 space-y-3 text-center shadow-2xl">
            <h3 className="font-display font-extrabold text-sm text-white">
              Reset Kata Sandi Kampus
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Tautan pemulihan kata sandi telah dikirimkan ke alamat email{' '}
              <span className="text-[#38BDF8] font-semibold">
                {email || 'kampus kamu'}
              </span>
              .
            </p>
            <button
              type="button"
              onClick={() => setForgotModal(false)}
              className="w-full py-2.5 rounded-full bg-[#F59E0B] text-[#0F1115] font-extrabold text-xs cursor-pointer"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
