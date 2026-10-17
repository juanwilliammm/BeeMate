import React, { useState } from 'react';
import {
  Phone,
  PhoneOff,
  MessageSquare,
  BadgeCheck,
  Flame,
  Moon,
  BellOff
} from 'lucide-react';

export default function IncomingCallScreen({
  caller,
  userDndMode,
  onToggleDnd,
  onAcceptCall,
  onDeclineMissedCall,
  onQuickReplyWithMessage
}) {
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const quickReplies = [
    'Nanti ya, aku lagi kuliah.',
    'Tunggu 10 menit lagi ya, lagi di jalan ke kampus.',
    'Aku lagi di perpustakaan, kita bahas lewat chat dulu ya!'
  ];

  if (!caller) return null;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-[#002B52] to-slate-950 text-white justify-between p-6 relative overflow-hidden">
      {/* Top Status & DND Toggle (FR-51) */}
      <div className="flex items-center justify-between z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-amber-300">
          <Flame size={13} className="fill-amber-400 text-amber-400" />
          <span>Panggilan Video BeeMate</span>
        </span>

        <button
          type="button"
          onClick={onToggleDnd}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
            userDndMode
              ? 'bg-indigo-600 text-white border-indigo-400'
              : 'bg-white/10 text-slate-300 border-white/15'
          }`}
        >
          <Moon size={12} />
          <span>{userDndMode ? 'Jangan Ganggu: Aktif' : 'Jangan Ganggu: Nonaktif'}</span>
        </button>
      </div>

      {/* DND Banner Notice (FR-51) */}
      {userDndMode && (
        <div className="bg-indigo-950/90 border border-indigo-400/40 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-indigo-100 z-10">
          <BellOff size={16} className="text-indigo-300 shrink-0" />
          <span>
            Mode <strong>Jangan Ganggu (FR-51)</strong> sedang aktif. Nada dering disenyapkan.
          </span>
        </div>
      )}

      {/* Caller Avatar & Info (FR-48) */}
      <div className="text-center space-y-3 my-auto z-10">
        <div className="relative inline-block">
          <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-binus-orange to-amber-300 animate-pulse-slow mx-auto">
            <img
              src={caller.avatar}
              alt={caller.name}
              className="w-full h-full rounded-full object-cover border-4 border-slate-900"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-xl font-extrabold">{caller.name}</h1>
            <BadgeCheck size={18} className="text-amber-300" />
          </div>
          <p className="text-xs text-blue-200 mt-0.5">
            {caller.major} · Angkatan {caller.batch}
          </p>
          <p className="text-[11px] text-amber-300 font-semibold mt-2">
            Memanggil untuk Video Call 1-on-1...
          </p>
        </div>
      </div>

      {/* Quick Reply Drawer (FR-49: "Nanti ya, aku lagi kuliah") */}
      <div className="space-y-4 z-10">
        {showQuickReplies ? (
          <div className="bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 space-y-2 animate-in slide-in-from-bottom-3 duration-150">
            <p className="text-[11px] font-bold text-amber-300">
              Pilih Balasan Cepat & Tolak Panggilan (FR-49):
            </p>
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onQuickReplyWithMessage(reply)}
                className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition cursor-pointer"
              >
                &ldquo;{reply}&rdquo;
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowQuickReplies(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition cursor-pointer"
            >
              <MessageSquare size={14} className="text-amber-300" />
              <span>Balas dengan pesan (FR-49)</span>
            </button>
          </div>
        )}

        {/* Accept & Decline Buttons (FR-48, FR-50) */}
        <div className="flex items-center justify-around pt-2 pb-2">
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onDeclineMissedCall}
              aria-label="Tolak Panggilan"
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition cursor-pointer"
            >
              <PhoneOff size={26} />
            </button>
            <span className="text-xs font-bold text-slate-300">Tolak (FR-48/50)</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onAcceptCall}
              aria-label="Terima Panggilan"
              className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 transition cursor-pointer"
            >
              <Phone size={26} />
            </button>
            <span className="text-xs font-bold text-emerald-300">Terima (FR-48)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
