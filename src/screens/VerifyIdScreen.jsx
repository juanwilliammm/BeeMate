import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  XCircle,
  Lock
} from 'lucide-react';

export default function VerifyIdScreen({ user, onUpdateUser, onNext, onBack }) {
  const [uploadSource, setUploadSource] = useState('Kamera');
  const [status, setStatus] = useState(user.verificationStatus || 'Disetujui');

  const handleSimulateUpload = (source) => {
    setUploadSource(source);
    setStatus('Disetujui');
    onUpdateUser({ verificationStatus: 'Disetujui', verified: true });
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
            Langkah 2 dari 3
          </span>
          <div className="w-10" />
        </div>

        <div className="flex gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-[#FF4D8D]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#FF4D8D]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#1E1E2A]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4 my-auto py-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold">
            Unggah <span className="text-[#FF4D8D]">Student ID</span>
          </h1>
          <p className="text-xs text-[#9494A8] mt-1">
            Pastikan foto Binusian Card terlihat utuh, terang, dan tidak buram.
          </p>
        </div>

        {/* Simulated Student ID Bento Card */}
        <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-4 space-y-3.5">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E1E2A] via-[#15151E] to-black border border-[#FF4D8D]/40 p-4 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <img
                  src="/beemate-logo.png"
                  alt="BeeMate"
                  className="w-7 h-7 rounded-full object-contain bg-black"
                />
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#FF85B3] font-bold block">
                    BINUSIAN CARD · TERVERIFIKASI
                  </span>
                  <h4 className="font-display font-extrabold text-sm text-white">
                    {user.name}
                  </h4>
                </div>
              </div>
              <span className="text-[10px] bg-[#FF4D8D] text-[#0A0A0E] px-2.5 py-0.5 rounded-full font-extrabold">
                {uploadSource}
              </span>
            </div>

            <div className="flex items-end justify-between text-xs pt-3 border-t border-[#2A2A3A]">
              <div>
                <span className="text-[9px] text-[#9494A8] block">NIM MAHASISWA</span>
                <span className="font-mono font-bold tracking-wider text-white">
                  {user.nim}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#9494A8] block">{user.major}</span>
                <span className="font-bold text-[#FF85B3]">Binusian {user.batch}</span>
              </div>
            </div>
          </div>

          {/* Camera & Gallery Pill Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleSimulateUpload('Kamera')}
              className="py-3 px-3 rounded-full bg-[#1E1E2A] hover:bg-[#FF4D8D] hover:text-[#0A0A0E] border border-[#2A2A3A] flex items-center justify-center gap-2 text-xs font-bold text-white transition cursor-pointer"
            >
              <Camera size={15} />
              <span>Kamera</span>
            </button>
            <button
              type="button"
              onClick={() => handleSimulateUpload('Galeri')}
              className="py-3 px-3 rounded-full bg-[#1E1E2A] hover:bg-[#FF4D8D] hover:text-[#0A0A0E] border border-[#2A2A3A] flex items-center justify-center gap-2 text-xs font-bold text-white transition cursor-pointer"
            >
              <ImageIcon size={15} />
              <span>Galeri</span>
            </button>
          </div>
        </div>

        {/* Status Verification Switcher (FR-13) */}
        <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Status Verifikasi Admin</span>
            <span className="text-[10px] text-[#9494A8]">Maks. 1x24 Jam</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 bg-[#0A0A0E] p-1.5 rounded-full border border-[#2A2A3A]">
            {['Menunggu', 'Disetujui', 'Ditolak'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatus(st);
                  onUpdateUser({
                    verificationStatus: st,
                    verified: st === 'Disetujui'
                  });
                }}
                className={`py-1.5 text-[11px] font-bold rounded-full transition cursor-pointer ${
                  status === st
                    ? 'bg-[#FF4D8D] text-[#0A0A0E]'
                    : 'text-[#9494A8] hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {status === 'Menunggu' && (
            <div className="p-3 rounded-3xl bg-[#1E1E2A] border border-[#2A2A3A] flex items-start gap-2.5 text-xs text-[#FF85B3]">
              <Clock size={16} className="shrink-0 mt-0.5 text-[#FF4D8D]" />
              <p className="leading-relaxed">
                Menunggu tinjauan admin (maks. 1x24 jam). Kamu tetap bisa lanjut ke OTP sekarang.
              </p>
            </div>
          )}

          {status === 'Disetujui' && (
            <div className="p-3 rounded-3xl bg-[#FF4D8D]/15 border border-[#FF4D8D]/40 flex items-start gap-2.5 text-xs text-white">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[#FF4D8D]" />
              <p className="leading-relaxed">
                Identitas cocok! Foto kartu telah dienkripsi & dihapus otomatis sesuai UU PDP.
              </p>
            </div>
          )}

          {status === 'Ditolak' && (
            <div className="p-3 rounded-3xl bg-rose-500/15 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-200">
              <XCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <p className="leading-relaxed">
                Ditolak: Foto kartu tampak buram pada bagian NIM. Silakan unggah ulang.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-2 text-[11px] text-[#9494A8]">
          <Lock size={14} className="text-[#FF4D8D] shrink-0" />
          <span>Foto kartu langsung dihapus setelah verifikasi selesai.</span>
        </div>

        <button
          type="button"
          disabled={status === 'Ditolak'}
          onClick={onNext}
          className="w-full py-3.5 rounded-full bg-[#FF4D8D] hover:bg-[#FF85B3] disabled:bg-[#2A2A3A] disabled:text-[#9494A8] text-[#0A0A0E] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D8D]/30 transition cursor-pointer"
        >
          <span>Lanjut ke Kode OTP</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
