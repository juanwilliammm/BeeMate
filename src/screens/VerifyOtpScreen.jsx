import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Copy
} from 'lucide-react';

export default function VerifyOtpScreen({
  user,
  onVerifiedOtp,
  onBack
}) {
  // Start empty instead of pre-filled so the user experiences a real OTP input
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [expirySeconds, setExpirySeconds] = useState(300);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDigitChange = (index, value) => {
    if (locked) return;
    const digits = value.replace(/\D/g, '');

    if (digits.length > 1) {
      const chars = digits.slice(0, 6).split('');
      const nextOtp = [...otp];
      chars.forEach((ch, idx) => {
        if (index + idx < 6) nextOtp[index + idx] = ch;
      });
      setOtp(nextOtp);
      setError('');
      const focusIdx = Math.min(5, index + chars.length);
      document.getElementById(`otp-input-${focusIdx}`)?.focus();
      return;
    }

    const digit = digits.slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
    setError('');

    if (digit && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (locked) return;
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (locked) return;

    const code = otp.join('');
    if (code.length < 6) {
      setError('Masukkan 6 digit kode OTP yang dikirim ke email kampusmu.');
      return;
    }

    if (code !== '123456') {
      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      if (nextWrong >= 5) {
        setLocked(true);
        setError('OTP dikunci sementara karena 5x salah memasukkan kode.');
      } else {
        setError(`Kode OTP tidak sesuai (${nextWrong}/5 percobaan).`);
      }
      return;
    }

    setError('');
    onVerifiedOtp();
  };

  return (
    <div className="flex flex-col h-full bg-[#0F1115] text-white justify-between p-5 overflow-y-auto no-scrollbar">
      {/* Top Progress Header — Step 1 of 3 */}
      <div className="space-y-3 shrink-0">
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
            Langkah 1 dari 3 · Verifikasi Email
          </span>
          <div className="w-10" />
        </div>

        <div className="flex gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-[#F59E0B]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#222631]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#222631]" />
        </div>
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-5 my-auto py-4 w-full">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-xs font-bold text-[#38BDF8]">
            <ShieldCheck size={14} />
            <span>Kepemilikan Email Kampus</span>
          </span>
          <h1 className="font-display text-2xl font-extrabold">
            Masukkan <span className="text-[#F59E0B]">Kode OTP</span>
          </h1>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Sebelum mengisi NIM & mengunggah Binusian Card, masukkan 6 digit kode yang dikirim ke{' '}
            <strong className="text-[#38BDF8] break-all">{user.email}</strong>. Berlaku{' '}
            <span className="text-[#F59E0B] font-bold">
              {Math.floor(expirySeconds / 60)}:{String(expirySeconds % 60).padStart(2, '0')}
            </span>
          </p>
        </div>

        {/* Responsive 6-Column Grid */}
        <div className="bg-[#181B22] border border-[#2E3440] rounded-4xl p-4 sm:p-5 space-y-4 w-full">
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 w-full">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="tel"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                disabled={locked}
                value={digit}
                placeholder="•"
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                className="w-full min-w-0 aspect-square max-h-12 text-center text-base font-extrabold rounded-2xl border-2 border-[#2E3440] bg-[#0F1115] text-[#F59E0B] placeholder:text-[#2E3440] focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/25 focus:outline-none transition"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => {
                setOtp(['1', '2', '3', '4', '5', '6']);
                setError('');
              }}
              className="inline-flex items-center gap-1.5 text-[#94A3B8] hover:text-white cursor-pointer"
            >
              <Copy size={12} className="text-[#F59E0B]" />
              <span>Isi Kode Demo (123456)</span>
            </button>
            <button
              type="button"
              disabled={resendCooldown > 0}
              onClick={() => {
                setResendCooldown(60);
                setExpirySeconds(300);
                setLocked(false);
                setWrongAttempts(0);
                setOtp(['', '', '', '', '', '']);
              }}
              className="inline-flex items-center gap-1 font-bold text-[#F59E0B] disabled:text-[#94A3B8] cursor-pointer"
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
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={locked}
          className="w-full py-3.5 rounded-full bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0F1115] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F59E0B]/25 transition cursor-pointer"
        >
          <span>Verifikasi Email & Lanjut ke NIM</span>
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="text-center pb-1">
        <p className="text-[11px] text-[#94A3B8]">
          Verifikasi OTP di awal melindungi privasi identitas mahasiswa sesuai UU PDP
        </p>
      </div>
    </div>
  );
}
