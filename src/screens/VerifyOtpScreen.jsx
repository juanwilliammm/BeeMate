import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { GOALS, INTERESTS_LIST } from '../data/mockData';

export default function VerifyOtpScreen({ user, onUpdateUser, onCompleteVerification, onBack }) {
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [expirySeconds, setExpirySeconds] = useState(300);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('otp'); // 'otp' | 'onboarding'

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
      setError('Masukkan 6 digit kode OTP.');
      return;
    }

    if (code !== '123456') {
      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      if (nextWrong >= 5) {
        setLocked(true);
        setError('OTP dikunci sementara karena 5x salah memasukkan kode.');
      } else {
        setError(`Kode OTP salah. Gunakan kode 123456 (${nextWrong}/5).`);
      }
      return;
    }

    setError('');
    setStep('onboarding');
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
    <div className="flex flex-col h-full bg-[#0A0A0E] text-white justify-between p-6 overflow-y-auto no-scrollbar">
      {/* Top Progress Header */}
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
            Langkah 3 dari 3
          </span>
          <div className="w-10" />
        </div>

        <div className="flex gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-[#FF4D8D]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#FF4D8D]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#FF4D8D]" />
        </div>
      </div>

      {step === 'otp' ? (
        <form onSubmit={handleVerifyOtp} className="space-y-5 my-auto py-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold">
              Masukkan <span className="text-[#FF4D8D]">Kode OTP</span>
            </h1>
            <p className="text-xs text-[#9494A8] mt-1 leading-relaxed">
              Kode 6 digit dikirim ke <strong className="text-white">{user.email}</strong>. Berlaku{' '}
              <span className="text-[#FF85B3] font-bold">
                {Math.floor(expirySeconds / 60)}:{String(expirySeconds % 60).padStart(2, '0')}
              </span>
            </p>
          </div>

          <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-5 space-y-4">
            <div className="flex justify-between gap-2">
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
                  className="w-11 h-13 text-center text-base font-extrabold rounded-2xl border-2 border-[#2A2A3A] bg-[#0A0A0E] text-[#FF4D8D] focus:border-[#FF4D8D] focus:outline-none"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#9494A8]">Kode demo: <strong className="text-white">123456</strong></span>
              <button
                type="button"
                disabled={resendCooldown > 0}
                onClick={() => {
                  setResendCooldown(60);
                  setExpirySeconds(300);
                  setLocked(false);
                  setWrongAttempts(0);
                  setOtp(['1', '2', '3', '4', '5', '6']);
                }}
                className="inline-flex items-center gap-1 font-bold text-[#FF85B3] disabled:text-[#9494A8]"
              >
                <RefreshCw size={12} />
                <span>
                  {resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim Ulang'}
                </span>
              </button>
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
            disabled={locked}
            className="w-full py-3.5 rounded-full bg-[#FF4D8D] hover:bg-[#FF85B3] text-[#0A0A0E] font-extrabold text-xs shadow-lg shadow-[#FF4D8D]/30 transition cursor-pointer"
          >
            Verifikasi & Lanjut
          </button>
        </form>
      ) : (
        /* Interactive Pill Tag Cloud Onboarding (Directly Inspired by Reference Image Top Center!) */
        <div className="space-y-4 my-auto py-4">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#FF4D8D]/15 border border-[#FF4D8D]/40 w-fit">
            <CheckCircle2 size={15} className="text-[#FF4D8D]" />
            <span className="text-xs font-bold text-[#FF85B3]">Akun Binusian Terverifikasi!</span>
          </div>

          <div>
            <h1 className="font-display text-2xl font-extrabold">
              Pilih <span className="text-[#FF4D8D]">Minat & Tujuanmu</span>
            </h1>
            <p className="text-xs text-[#9494A8] mt-1">
              Supaya algoritma BeeMate mencocokkan partner yang paling pas buat kamu.
            </p>
          </div>

          {/* Goal Pills */}
          <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-4 space-y-2.5">
            <span className="text-[11px] font-bold text-[#9494A8] uppercase tracking-wider block">
              Tujuan Utama
            </span>
            <div className="flex flex-wrap gap-2">
              {GOALS.filter((g) => g !== 'Semua').map((g) => {
                const active = selectedGoal === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGoal(g)}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                      active
                        ? 'bg-[#FF4D8D] text-[#0A0A0E] shadow-md shadow-[#FF4D8D]/30 -rotate-1'
                        : 'bg-[#1E1E2A] text-white border border-[#2A2A3A] hover:border-[#FF4D8D]'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Floating Interest Bubbles like Reference UI */}
          <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-4 space-y-2.5">
            <span className="text-[11px] font-bold text-[#9494A8] uppercase tracking-wider block">
              Minat & Keahlian ({selectedInterests.length} dipilih)
            </span>
            <div className="flex flex-wrap gap-2">
              {INTERESTS_LIST.map((interest, idx) => {
                const active = selectedInterests.includes(interest);
                const tiltClass = idx % 3 === 0 ? '-rotate-2' : idx % 3 === 1 ? 'rotate-1' : '';
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                      active
                        ? `bg-[#FF4D8D] text-[#0A0A0E] shadow-md shadow-[#FF4D8D]/25 ${tiltClass}`
                        : 'bg-transparent text-white border border-[#2A2A3A] hover:border-[#FF85B3]'
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
            className="w-full py-3.5 rounded-full bg-[#FF4D8D] hover:bg-[#FF85B3] text-[#0A0A0E] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D8D]/30 cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Masuk ke Beranda BeeMate</span>
          </button>
        </div>
      )}
    </div>
  );
}
