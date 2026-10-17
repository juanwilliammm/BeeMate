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
      <div className="bg-[#181B22] text-white rounded-4xl max-w-sm w-full p-6 shadow-2xl border border-[#2E3440]">
        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center mx-auto">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="font-bold text-white text-base">
              {mode === 'report' ? 'Laporan Tercatat di Sistem' : 'Pengguna Diblokir'}
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {mode === 'report'
                ? 'Laporan telah disimpan di antrean moderasi BeeMate untuk ditinjau dalam 1x24 jam.'
                : `${targetUser.name} tidak akan lagi muncul di rekomendasi atau dapat menghubungi kamu.`}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-[#2E3440]">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#F59E0B]" />
                <h3 className="font-bold text-white text-sm">
                  Keamanan & Moderasi Kampus
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup modal"
                className="p-1.5 rounded-full bg-[#222631] text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 my-4 bg-[#0F1115] p-1.5 rounded-full border border-[#2E3440]">
              <button
                type="button"
                onClick={() => setMode('report')}
                className={`py-2 text-xs font-extrabold rounded-full transition cursor-pointer ${
                  mode === 'report'
                    ? 'bg-[#F59E0B] text-[#0F1115]'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Laporkan
              </button>
              <button
                type="button"
                onClick={() => setMode('block')}
                className={`py-2 text-xs font-extrabold rounded-full transition cursor-pointer ${
                  mode === 'block'
                    ? 'bg-rose-500 text-white'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Blokir Akun
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'report' ? (
                <>
                  <p className="text-xs text-[#94A3B8]">
                    Pilih alasan pelaporan untuk <span className="font-bold text-white">{targetUser.name}</span>:
                  </p>
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1 no-scrollbar">
                    {reasons.map((r) => (
                      <label
                        key={r}
                        className={`flex items-start gap-2.5 p-3 rounded-2xl border text-xs cursor-pointer transition ${
                          reason === r
                            ? 'border-[#F59E0B] bg-[#F59E0B]/15 text-white font-semibold'
                            : 'border-[#2E3440] bg-[#222631]/60 text-[#94A3B8]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="report_reason"
                          checked={reason === r}
                          onChange={() => setReason(r)}
                          className="mt-0.5 accent-[#F59E0B]"
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
                    className="w-full text-xs rounded-2xl bg-[#0F1115] border border-[#2E3440] text-white p-3 focus:outline-none focus:border-[#F59E0B]"
                  />
                </>
              ) : (
                <div className="p-4 bg-[#222631] border border-[#2E3440] rounded-3xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <Ban size={16} />
                    <span>Blokir {targetUser.name}?</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Setelah diblokir, profil ini tidak akan muncul di rekomendasi maupun daftar chat kamu.
                  </p>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 text-xs font-bold text-[#94A3B8] bg-[#222631] rounded-full hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-extrabold text-[#0F1115] bg-[#F59E0B] hover:bg-[#FBBF24] rounded-full shadow-lg shadow-[#F59E0B]/25 cursor-pointer"
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
