import React, { useState } from 'react';
import {
  Phone,
  PhoneOff,
  MessageCircle,
  BadgeCheck,
  Moon,
  BellOff,
  Flame
} from 'lucide-react';

export default function IncomingCallScreen({
  caller,
  streakDays = 4,
  userDndMode,
  onToggleDnd,
  onAcceptCall,
  onDeclineMissedCall,
  onQuickReplyWithMessage
}) {
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const quickReplies = [
    'Nanti ya, aku lagi di kelas kuliah.',
    'Tunggu 10 menit lagi ya, lagi menuju ke perpustakaan.',
    'Kita bahas lewat ruang chat dulu ya!'
  ];

  if (!caller) return null;

  return (
    <div className="flex flex-col h-full bg-[#0F1115] text-white justify-between p-6 relative overflow-hidden">
      {/* Top Status & DND Pill */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181B22] border border-[#2E3440]">
          <img
            src="/beemate-logo.png"
            alt="BeeMate"
            className="w-5 h-5 rounded-full object-contain"
          />
          <span className="text-xs font-bold text-[#F59E0B]">
            Panggilan Diskusi Video
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleDnd}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition cursor-pointer ${
            userDndMode
              ? 'bg-[#F59E0B] text-[#0F1115] border-[#F59E0B]'
              : 'bg-[#181B22] text-[#94A3B8] border-[#2E3440]'
          }`}
        >
          <Moon size={12} />
          <span>{userDndMode ? 'DND Aktif' : 'DND Off'}</span>
        </button>
      </div>

      {userDndMode && (
        <div className="bg-[#181B22] border border-[#F59E0B]/40 rounded-3xl p-3.5 flex items-center gap-2.5 text-xs text-[#FBBF24] z-10">
          <BellOff size={16} className="text-[#F59E0B] shrink-0" />
          <span>Mode Jangan Ganggu aktif. Nada dering disenyapkan.</span>
        </div>
      )}

      {/* Center Caller Card */}
      <div className="text-center space-y-4 my-auto z-10">
        <div className="w-32 h-32 rounded-full p-1 bg-[#F59E0B] animate-pulse-glow mx-auto">
          <img
            src={caller.avatar}
            alt={caller.name}
            className="w-full h-full rounded-full object-cover border-4 border-[#0F1115]"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="font-display text-2xl font-extrabold">{caller.name}</h1>
            <BadgeCheck size={19} className="text-[#38BDF8]" />
          </div>
          <p className="text-xs font-bold text-[#38BDF8]">
            {caller.major} · Binusian &lsquo;{caller.batch.slice(-2)}
          </p>
          <div className="pt-2 flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#F59E0B] text-[#0F1115] text-xs font-extrabold">
              <Flame size={13} className="fill-[#0F1115]" />
              <span>Streak {streakDays} Hari Terverifikasi · Video Call 1-on-1</span>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Reply & Accept/Decline Buttons */}
      <div className="space-y-4 z-10">
        {showQuickReplies ? (
          <div className="bg-[#181B22] border border-[#2E3440] rounded-4xl p-4 space-y-2">
            <p className="text-xs font-bold text-[#F59E0B] px-1">
              Balas Cepat dengan Pesan (FR-49):
            </p>
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onQuickReplyWithMessage(reply)}
                className="w-full text-left p-3 rounded-2xl bg-[#222631] hover:bg-[#F59E0B] text-white hover:text-[#0F1115] text-xs font-semibold transition cursor-pointer"
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181B22] hover:bg-[#222631] border border-[#2E3440] text-xs font-bold text-white transition cursor-pointer"
            >
              <MessageCircle size={15} className="text-[#F59E0B]" />
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
              className="w-16 h-16 rounded-full bg-[#222631] hover:bg-rose-600 text-rose-400 hover:text-white border border-[#2E3440] flex items-center justify-center shadow-xl transition cursor-pointer"
            >
              <PhoneOff size={26} />
            </button>
            <span className="text-xs font-bold text-[#94A3B8]">Tolak</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onAcceptCall}
              aria-label="Terima"
              className="w-16 h-16 rounded-full bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0F1115] flex items-center justify-center shadow-2xl shadow-[#F59E0B]/30 transition cursor-pointer"
            >
              <Phone size={26} />
            </button>
            <span className="text-xs font-extrabold text-[#F59E0B]">Terima</span>
          </div>
        </div>
      </div>
    </div>
  );
}
