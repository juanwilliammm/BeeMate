import React, { useState } from 'react';
import {
  Phone,
  PhoneOff,
  MessageCircle,
  BadgeCheck,
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
    <div className="flex flex-col h-full bg-[#0A0A0E] text-white justify-between p-6 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#FF4D8D]/20 blur-3xl pointer-events-none" />

      {/* Top Status & DND Pill */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15151E] border border-[#2A2A3A]">
          <img
            src="/beemate-logo.png"
            alt="BeeMate"
            className="w-5 h-5 rounded-full object-contain"
          />
          <span className="text-[11px] font-bold text-[#FF85B3]">
            Incoming Video Call
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleDnd}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition cursor-pointer ${
            userDndMode
              ? 'bg-[#FF4D8D] text-[#0A0A0E] border-[#FF4D8D]'
              : 'bg-[#15151E] text-[#9494A8] border-[#2A2A3A]'
          }`}
        >
          <Moon size={12} />
          <span>{userDndMode ? 'DND Aktif' : 'DND Off'}</span>
        </button>
      </div>

      {userDndMode && (
        <div className="bg-[#15151E] border border-[#FF4D8D]/40 rounded-3xl p-3.5 flex items-center gap-2.5 text-xs text-[#FF85B3] z-10">
          <BellOff size={16} className="text-[#FF4D8D] shrink-0" />
          <span>Mode Jangan Ganggu aktif. Nada dering disenyapkan.</span>
        </div>
      )}

      {/* Center Caller Card */}
      <div className="text-center space-y-4 my-auto z-10">
        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#FF4D8D] to-[#FF85B3] animate-pulse-glow mx-auto">
          <img
            src={caller.avatar}
            alt={caller.name}
            className="w-full h-full rounded-full object-cover border-4 border-[#0A0A0E]"
          />
        </div>

        <div>
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="font-display text-2xl font-extrabold">{caller.name}</h1>
            <BadgeCheck size={19} className="text-[#FF4D8D]" />
          </div>
          <p className="text-xs text-[#9494A8] mt-1">
            {caller.major} · Binusian {caller.batch}
          </p>
          <span className="inline-block mt-3 px-4 py-1 rounded-full bg-[#FF4D8D]/15 text-[#FF85B3] text-xs font-bold">
            Memanggil Video Call 1-on-1...
          </span>
        </div>
      </div>

      {/* Quick Reply & Accept/Decline Buttons */}
      <div className="space-y-4 z-10">
        {showQuickReplies ? (
          <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-4 space-y-2">
            <p className="text-[11px] font-bold text-[#FF85B3] px-1">
              Balas Cepat dengan Pesan (FR-49):
            </p>
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onQuickReplyWithMessage(reply)}
                className="w-full text-left p-3 rounded-2xl bg-[#1E1E2A] hover:bg-[#FF4D8D] text-white hover:text-[#0A0A0E] text-xs font-semibold transition cursor-pointer"
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#15151E] hover:bg-[#1E1E2A] border border-[#2A2A3A] text-xs font-bold text-white transition cursor-pointer"
            >
              <MessageCircle size={15} className="text-[#FF4D8D]" />
              <span>Balas dengan pesan</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-around pt-2">
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onDeclineMissedCall}
              aria-label="Tolak"
              className="w-16 h-16 rounded-full bg-[#1E1E2A] hover:bg-rose-600 text-rose-400 hover:text-white border border-[#2A2A3A] flex items-center justify-center shadow-xl transition cursor-pointer"
            >
              <PhoneOff size={26} />
            </button>
            <span className="text-xs font-bold text-[#9494A8]">Tolak</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onAcceptCall}
              aria-label="Terima"
              className="w-16 h-16 rounded-full bg-[#FF4D8D] hover:bg-[#FF85B3] text-[#0A0A0E] flex items-center justify-center shadow-2xl shadow-[#FF4D8D]/40 transition cursor-pointer"
            >
              <Phone size={26} />
            </button>
            <span className="text-xs font-bold text-[#FF85B3]">Terima</span>
          </div>
        </div>
      </div>
    </div>
  );
}
