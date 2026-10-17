import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Image as ImageIcon,
  Shield,
  CheckCircle2,
  Clock,
  XCircle,
  Sun,
  Maximize2,
  Sparkles,
  Lock
} from 'lucide-react';

export default function VerifyIdScreen({ user, onUpdateUser, onNext, onBack }) {
  const [hasUploaded, setHasUploaded] = useState(true);
  const [uploadSource, setUploadSource] = useState('Kamera'); // 'Kamera' | 'Galeri'
  const [status, setStatus] = useState(user.verificationStatus || 'Disetujui'); // 'Menunggu' | 'Disetujui' | 'Ditolak'
  const [rejectReason, setRejectReason] = useState(
    'Foto kartu mahasiswa tampak buram pada bagian NIM 10 digit. Mohon foto ulang di tempat terang.'
  );

  const handleSimulateUpload = (source) => {
    setUploadSource(source);
    setHasUploaded(true);
    setStatus('Disetujui');
    onUpdateUser({ verificationStatus: 'Disetujui', verified: true });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 justify-between overflow-y-auto">
      {/* Step Header (FR-09) */}
      <div className="bg-white border-b border-slate-200 px-5 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali ke Verifikasi NIM"
            className="p-1.5 -ml-1.5 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs font-bold text-binus-blue bg-blue-50 px-3 py-1 rounded-full">
            Langkah 2 dari 3 · Kartu Mahasiswa
          </span>
          <div className="w-6" />
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-1">
          <div className="w-1/3 bg-emerald-500 h-full rounded-full" />
          <div className="w-1/3 bg-binus-blue h-full rounded-full" />
          <div className="w-1/3 bg-slate-200 h-full rounded-full" />
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Unggah Binusian Card (Student ID)</h2>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Admin tim BeeMate akan mencocokkan Nama (<span className="font-semibold text-slate-700">{user.name}</span>) dan NIM (<span className="font-mono font-semibold text-slate-700">{user.nim}</span>) dengan kartu mahasiswa kamu (FR-12).
          </p>
        </div>

        {/* Photo Guidelines (FR-11) */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
          <p className="text-xs font-bold text-slate-800">Panduan Pengambilan Foto (FR-11):</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <Sun size={16} className="mx-auto text-amber-500 mb-1" />
              <span className="text-[10px] font-semibold text-slate-700 block">Cahaya Cukup</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <Maximize2 size={16} className="mx-auto text-binus-blue mb-1" />
              <span className="text-[10px] font-semibold text-slate-700 block">Kartu Utuh</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <Sparkles size={16} className="mx-auto text-emerald-500 mb-1" />
              <span className="text-[10px] font-semibold text-slate-700 block">Tidak Buram</span>
            </div>
          </div>
        </div>

        {/* Simulated Student ID Card Preview & Upload Buttons (FR-10) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
          {hasUploaded ? (
            <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-binus-blue/40 bg-gradient-to-r from-[#00549A] to-[#003666] p-4 text-white shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold block">
                    BINUS UNIVERSITY · STUDENT ID CARD
                  </span>
                  <h4 className="font-extrabold text-sm mt-0.5">{user.name}</h4>
                </div>
                <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-md font-semibold">
                  Via {uploadSource}
                </span>
              </div>
              <div className="flex items-end justify-between text-xs pt-2 border-t border-white/15">
                <div>
                  <span className="text-[10px] text-blue-200 block">NIM / BINUSIAN ID</span>
                  <span className="font-mono font-bold tracking-wider">{user.nim}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-blue-200 block">{user.major}</span>
                  <span className="font-bold text-amber-300">Binusian {user.batch}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-xs text-slate-400">Belum ada foto kartu yang dipilih</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleSimulateUpload('Kamera')}
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-binus-blue hover:bg-blue-50/40 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              <Camera size={16} className="text-binus-blue" />
              <span>Potret Kamera</span>
            </button>
            <button
              type="button"
              onClick={() => handleSimulateUpload('Galeri')}
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-binus-blue hover:bg-blue-50/40 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              <ImageIcon size={16} className="text-binus-orange" />
              <span>Unggah Galeri</span>
            </button>
          </div>
        </div>

        {/* Admin Review Status Simulation (FR-12, FR-13) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Status Tinjauan Admin (FR-13):</span>
            <span className="text-[10px] text-slate-400">SLA Maks. 1x24 Jam</span>
          </div>

          {/* Interactive Switcher so User can test all 3 PRD states */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
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
                className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                  status === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {status === 'Menunggu' && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <Clock size={17} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Menunggu Tinjauan Admin (Maks. 1x24 Jam)</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Admin tim sedang mencocokkan nama & NIM pada kartu. Kamu tetap dapat melanjutkan ke verifikasi OTP email.
                </p>
              </div>
            </div>
          )}

          {status === 'Disetujui' && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
              <CheckCircle2 size={17} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Kartu Mahasiswa Disetujui!</p>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Identitas NIM {user.nim} cocok. File foto kartu telah dihapus otomatis sesuai kebijakan privasi (FR-14).
                </p>
              </div>
            </div>
          )}

          {status === 'Ditolak' && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900">
              <XCircle size={17} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Verifikasi Ditolak</p>
                <p className="text-[11px] text-rose-800 mt-0.5">Alasan: {rejectReason}</p>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Notice (FR-14 & UU PDP No. 27 Tahun 2022) */}
        <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-start gap-2 text-[11px] text-slate-600">
          <Lock size={15} className="text-binus-blue shrink-0 mt-0.5" />
          <span>
            <strong>Jaminan Privasi (FR-14 & UU PDP):</strong> Foto kartu mahasiswa dienkripsi dan langsung dihapus dari server setelah verifikasi selesai. BeeMate hanya menyimpan status <em>Terverifikasi</em>.
          </span>
        </div>

        <button
          type="button"
          disabled={status === 'Ditolak'}
          onClick={onNext}
          className="w-full py-3 rounded-xl bg-binus-blue hover:bg-[#00427A] disabled:bg-slate-300 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
        >
          <span>
            {status === 'Ditolak'
              ? 'Unggah Ulang Foto Kartu untuk Lanjut'
              : 'Lanjut ke Verifikasi OTP Email'}
          </span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
