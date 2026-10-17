import React, { useState } from 'react';
import { AlertTriangle, Ban, X, CheckCircle2 } from 'lucide-react';

export default function ReportBlockModal({ targetUser, onClose, onConfirmReport, onConfirmBlock }) {
  const [mode, setMode] = useState('report');
  const [reason, setReason] = useState('Akun mencurigakan / bukan mahasiswa Binus asli');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    'Akun mencurigakan / bukan mahasiswa Binus asli',
    'Perilaku tidak sopan atau pelecehan',
    'Spam atau promosi tidak relevan',
    'Penyalahgunaan untuk tujuan di luar networking kampus',
    'Lainnya'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      if (mode === 'report') {
        onConfirmReport(targetUser.id, reason, details);
      } else {
        onConfirmBlock(targetUser.id);
      }
      onClose();
    }, 900);
  };

  if (!targetUser) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-5">
      <div className="bg-[#15151E] text-white rounded-4xl max-w-sm w-full p-6 shadow-2xl border border-[#2A2A3A]">
        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FF4D8D]/20 text-[#FF4D8D] flex items-center justify-center mx-auto">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="font-bold text-white text-base">
              {mode === 'report' ? 'Laporan Terkirim ke Admin' : 'Pengguna Diblokir'}
            </h3>
            <p className="text-xs text-[#9494A8] leading-relaxed">
              {mode === 'report'
                ? 'Tim moderasi BeeMate akan meninjau laporan ini dalam 1x24 jam.'
                : `${targetUser.name} tidak akan lagi muncul di rekomendasi atau dapat menghubungi kamu.`}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A3A]">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#FF4D8D]" />
                <h3 className="font-bold text-white text-sm">
                  Keamanan & Moderasi
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup modal"
                className="p-1.5 rounded-full bg-[#1E1E2A] text-[#9494A8] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 my-4 bg-[#0A0A0E] p-1.5 rounded-full border border-[#2A2A3A]">
              <button
                type="button"
                onClick={() => setMode('report')}
                className={`py-2 text-xs font-bold rounded-full transition cursor-pointer ${
                  mode === 'report'
                    ? 'bg-[#FF4D8D] text-[#0A0A0E]'
                    : 'text-[#9494A8]'
                }`}
              >
                Laporkan
              </button>
              <button
                type="button"
                onClick={() => setMode('block')}
                className={`py-2 text-xs font-bold rounded-full transition cursor-pointer ${
                  mode === 'block'
                    ? 'bg-white text-[#0A0A0E]'
                    : 'text-[#9494A8]'
                }`}
              >
                Blokir Akun
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'report' ? (
                <>
                  <p className="text-xs text-[#9494A8]">
                    Pilih alasan pelaporan untuk <span className="font-bold text-white">{targetUser.name}</span>:
                  </p>
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1 no-scrollbar">
                    {reasons.map((r) => (
                      <label
                        key={r}
                        className={`flex items-start gap-2.5 p-3 rounded-2xl border text-xs cursor-pointer transition ${
                          reason === r
                            ? 'border-[#FF4D8D] bg-[#FF4D8D]/15 text-white font-semibold'
                            : 'border-[#2A2A3A] bg-[#1E1E2A]/60 text-[#9494A8]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="report_reason"
                          checked={reason === r}
                          onChange={() => setReason(r)}
                          className="mt-0.5 accent-[#FF4D8D]"
                        />
                        <span>{r}</span>
                      </label>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Keterangan tambahan (opsional)..."
                    className="w-full text-xs rounded-2xl bg-[#0A0A0E] border border-[#2A2A3A] text-white p-3 focus:outline-none focus:border-[#FF4D8D]"
                  />
                </>
              ) : (
                <div className="p-4 bg-[#1E1E2A] border border-[#2A2A3A] rounded-3xl space-y-2">
                  <div className="flex items-center gap-2 text-[#FF85B3] font-bold text-xs">
                    <Ban size={16} />
                    <span>Blokir {targetUser.name}?</span>
                  </div>
                  <p className="text-xs text-[#9494A8] leading-relaxed">
                    Setelah diblokir, profil ini tidak akan muncul di rekomendasi maupun daftar chat kamu.
                  </p>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 text-xs font-bold text-[#9494A8] bg-[#1E1E2A] rounded-full hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-bold text-[#0A0A0E] bg-[#FF4D8D] hover:bg-[#FF85B3] rounded-full shadow-lg shadow-[#FF4D8D]/25 cursor-pointer"
                >
                  {mode === 'report' ? 'Kirim Laporan' : 'Blokir Sekarang'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
