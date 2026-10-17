import React, { useState } from 'react';
import { AlertTriangle, Ban, X, CheckCircle2 } from 'lucide-react';

export default function ReportBlockModal({ targetUser, onClose, onConfirmReport, onConfirmBlock }) {
  const [mode, setMode] = useState('report'); // 'report' | 'block'
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              {mode === 'report' ? 'Laporan Terkirim ke Admin' : 'Pengguna Diblokir'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {mode === 'report'
                ? 'Tim moderasi BeeMate akan meninjau laporan ini dalam 1x24 jam demi keamanan komunitas Binus.'
                : `${targetUser.name} tidak akan lagi muncul di rekomendasi atau dapat menghubungi kamu.`}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-rose-500" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Keamanan & Moderasi
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup modal"
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMode('report')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                  mode === 'report'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Laporkan {targetUser.name.split(' ')[0]}
              </button>
              <button
                type="button"
                onClick={() => setMode('block')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                  mode === 'block'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Blokir Akun
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'report' ? (
                <>
                  <p className="text-xs text-slate-500">
                    Pilih alasan pelaporan untuk <span className="font-semibold text-slate-700">{targetUser.name}</span>:
                  </p>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {reasons.map((r) => (
                      <label
                        key={r}
                        className={`flex items-start gap-2 p-2 rounded-xl border text-xs cursor-pointer transition ${
                          reason === r
                            ? 'border-rose-500 bg-rose-50/60 text-rose-900 font-medium'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="report_reason"
                          checked={reason === r}
                          onChange={() => setReason(r)}
                          className="mt-0.5 accent-rose-600"
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
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:border-binus-blue"
                  />
                </>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-xs">
                    <Ban size={15} />
                    <span>Konfirmasi Blokir {targetUser.name}</span>
                  </div>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Setelah diblokir, profil ini akan dihapus dari daftar rekomendasi, match, dan riwayat percakapan kamu.
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 text-xs font-semibold text-white rounded-xl shadow-sm ${
                    mode === 'report'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
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
