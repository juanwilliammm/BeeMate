import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  MailCheck,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Target
} from 'lucide-react';
import { GOALS, INTERESTS_LIST } from '../data/mockData';

export default function VerifyOtpScreen({ user, onUpdateUser, onCompleteVerification, onBack }) {
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [resendCooldown, setResendCooldown] = useState(60); // FR-16: 60s countdown
  const [expirySeconds, setExpirySeconds] = useState(300); // FR-15: 5 minutes validity
  const [wrongAttempts, setWrongAttempts] = useState(0); // FR-17: max 5 wrong attempts
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('otp'); // 'otp' | 'onboarding' (FR-18 + Section 10 High Priority profile setup)

  // Onboarding state after OTP verified
  const [selectedGoal, setSelectedGoal] = useState(user.goal || 'Cari partner lomba');
  const [selectedInterests, setSelectedInterests] = useState(
    user.interests || ['Web Development', 'UI/UX Design', 'Hackathon']
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDigitChange = (index, value) => {
    if (locked) return;
    const digit = value.replace(/\D/g, '').slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
    setError('');

    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (locked) return;

    const code = otp.join('');
    if (code.length < 6) {
      setError('Masukkan 6 digit kode OTP yang dikirim ke email kampus kamu.');
      return;
    }

    if (expirySeconds <= 0) {
      setError('Kode OTP telah kedaluwarsa (lebih dari 5 menit). Silakan kirim ulang kode.');
      return;
    }

    // Valid demo code is 123456
    if (code !== '123456') {
      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      if (nextWrong >= 5) {
        setLocked(true);
        setError('Kode OTP dikunci sementara karena 5 kali salah memasukkan kode (FR-17).');
      } else {
        setError(`Kode OTP tidak sesuai. Gunakan kode demo 123456. (${nextWrong}/5 salah)`);
      }
      return;
    }

    setError('');
    setStep('onboarding');
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    setExpirySeconds(300);
    setWrongAttempts(0);
    setLocked(false);
    setOtp(['1', '2', '3', '4', '5', '6']);
    setError('');
  };

  const toggleInterest = (item) => {
    if (selectedInterests.includes(item)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== item));
      }
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const handleFinishSetup = () => {
    onUpdateUser({
      goal: selectedGoal,
      interests: selectedInterests
    });
    onCompleteVerification();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 justify-between overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className="p-1.5 -ml-1.5 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs font-bold text-binus-blue bg-blue-50 px-3 py-1 rounded-full">
            Langkah 3 dari 3 · Verifikasi OTP
          </span>
          <div className="w-6" />
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-1">
          <div className="w-1/3 bg-emerald-500 h-full rounded-full" />
          <div className="w-1/3 bg-emerald-500 h-full rounded-full" />
          <div className="w-1/3 bg-binus-blue h-full rounded-full" />
        </div>
      </div>

      {step === 'otp' ? (
        <form onSubmit={handleVerifyOtp} className="p-5 space-y-4 flex-1">
          <div className="text-center space-y-2 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-binus-blue flex items-center justify-center mx-auto">
              <MailCheck size={24} />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Cek Email Kampus Kamu</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kode OTP 6 digit telah dikirimkan ke{' '}
              <span className="font-bold text-slate-800">{user.email}</span> dan berlaku selama{' '}
              <span className="font-bold text-binus-orange">
                {Math.floor(expirySeconds / 60)}:{String(expirySeconds % 60).padStart(2, '0')}
              </span>{' '}
              (FR-15).
            </p>
          </div>

          {/* 6 Digit OTP Boxes */}
          <div className="flex justify-center gap-2 py-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                disabled={locked}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                className="w-11 h-12 text-center text-base font-extrabold rounded-xl border-2 border-slate-200 bg-white focus:border-binus-blue focus:outline-none disabled:bg-slate-100"
              />
            ))}
          </div>

          <p className="text-center text-[11px] text-slate-400">
            Kode OTP simulasi terisi otomatis: <strong className="text-slate-600">123456</strong>
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Resend Button with 60s Countdown (FR-16) */}
          <div className="text-center">
            <button
              type="button"
              disabled={resendCooldown > 0}
              onClick={handleResend}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-binus-blue disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
            >
              <RefreshCw size={13} />
              <span>
                {resendCooldown > 0
                  ? `Kirim ulang kode dalam ${resendCooldown} detik (FR-16)`
                  : 'Kirim Ulang Kode OTP Sekarang'}
              </span>
            </button>
          </div>

          {/* Quick PRD Testing Controls */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Simulasi Pengujian OTP (Layar 4):
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setOtp(['9', '9', '9', '9', '9', '9'])}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-lg font-medium"
              >
                Isi Kode Salah (FR-17: {wrongAttempts}/5)
              </button>
              <button
                type="button"
                onClick={() => setResendCooldown(0)}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-lg font-medium"
              >
                Selesaikan Hitung Mundur 60d
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocked(false);
                  setWrongAttempts(0);
                  setOtp(['1', '2', '3', '4', '5', '6']);
                  setError('');
                }}
                className="text-[10px] bg-blue-50 text-binus-blue px-2 py-1 rounded-lg font-semibold"
              >
                Reset ke 123456
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={locked}
            className="w-full py-3 rounded-xl bg-binus-blue hover:bg-[#00427A] disabled:bg-slate-300 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            Verifikasi Kode OTP
          </button>
        </form>
      ) : (
        /* FR-18 + Section 10 High Priority: Confirmation & Initial Profile Setup */
        <div className="p-5 space-y-4 flex-1 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-emerald-950">
                Verifikasi Berhasil! Akun Binusian Aktif (FR-18)
              </h3>
              <p className="text-[11px] text-emerald-800">
                Lengkapi tujuan networking & minat kamu agar rekomendasi di Beranda langsung akurat.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Target size={15} className="text-binus-orange" />
              <span>Tujuan Utama Bergabung di BeeMate:</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {GOALS.filter((g) => g !== 'Semua').map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGoal(g)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                    selectedGoal === g
                      ? 'border-binus-blue bg-blue-50 text-binus-blue'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Pilih Minat & Keahlian:</span>
              <span className="text-[11px] text-slate-400">{selectedInterests.length} dipilih</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {INTERESTS_LIST.map((interest) => {
                const active = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition ${
                      active
                        ? 'bg-binus-blue text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinishSetup}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-binus-blue to-[#003d73] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles size={15} />
            <span>Simpan & Masuk ke Beranda BeeMate</span>
          </button>
        </div>
      )}
    </div>
  );
}
