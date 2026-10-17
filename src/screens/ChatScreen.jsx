import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Video,
  Lock,
  MoreVertical,
  Send,
  CheckCheck,
  Paperclip,
  Flame,
  Trash2,
  Flag,
  Ban,
  Calendar,
  BadgeCheck,
  MessageSquare
} from 'lucide-react';
import StreakBadge from '../components/StreakBadge';

export default function ChatScreen({
  conversation,
  partner,
  onBack,
  onSendMessage,
  onStartVideoCall,
  onDeleteConversation,
  onOpenReportModal
}) {
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [lockedToast, setLockedToast] = useState(false);
  const fileInputRef = useRef(null);

  if (!conversation || !partner) return null;

  const isVideoUnlocked = conversation.streakDays >= 3;
  const remainingDays = Math.max(0, 3 - conversation.streakDays);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(conversation.id, inputText.trim());
    setInputText('');
  };

  const handleFileAttach = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === 'string') {
        onSendMessage(
          conversation.id,
          `📎 Lampiran Diskusi: ${file.name}`,
          'me',
          dataUrl
        );
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleVideoClick = () => {
    if (isVideoUnlocked) {
      onStartVideoCall();
    } else {
      setLockedToast(true);
      setTimeout(() => setLockedToast(false), 3500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0F1115] text-white relative">
      {/* Hidden File Input for Real Image/Document Attachment (FR-37) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileAttach}
        className="hidden"
      />

      {/* Top Chat Header */}
      <div className="bg-[#181B22] border-b border-[#2E3440] px-4 py-3 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className="w-9 h-9 rounded-full bg-[#222631] text-white flex items-center justify-center hover:bg-[#F59E0B] hover:text-[#0F1115] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>

          <img
            src={partner.avatar}
            alt={partner.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-[#38BDF8]"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-display text-xs font-extrabold text-white truncate">
                {partner.name}
              </h2>
              <BadgeCheck size={14} className="text-[#38BDF8] shrink-0" />
              <StreakBadge
                days={conversation.streakDays}
                expiringSoon={conversation.streakExpiringSoon}
              />
            </div>
            <p className="text-[11px] text-[#38BDF8] font-semibold truncate">
              {partner.online ? '● Online' : 'Offline'} · {partner.major}
            </p>
          </div>
        </div>

        {/* Video Call Pill & Menu */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleVideoClick}
            className={`px-3.5 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
              isVideoUnlocked
                ? 'bg-[#F59E0B] text-[#0F1115] shadow-md shadow-[#F59E0B]/25'
                : 'bg-[#222631] text-[#94A3B8] border border-[#2E3440]'
            }`}
          >
            {isVideoUnlocked ? (
              <>
                <Video size={14} />
                <span>Video Call</span>
              </>
            ) : (
              <>
                <Lock size={12} className="text-[#F59E0B]" />
                <span>{remainingDays} hr</span>
              </>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Menu"
              className="w-9 h-9 rounded-full bg-[#222631] text-[#94A3B8] hover:text-white flex items-center justify-center cursor-pointer"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-[#181B22] rounded-3xl shadow-2xl border border-[#2E3440] py-2 z-30 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onOpenReportModal(partner);
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-[#222631] flex items-center gap-2 font-semibold cursor-pointer"
                >
                  <Flag size={14} className="text-[#F59E0B]" />
                  <span>Laporkan</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onOpenReportModal(partner);
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-[#222631] flex items-center gap-2 font-semibold cursor-pointer"
                >
                  <Ban size={14} className="text-rose-400" />
                  <span>Blokir Akun</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDeleteConversation(conversation.id);
                  }}
                  className="w-full px-4 py-2 text-left text-rose-400 hover:bg-[#222631] flex items-center gap-2 font-bold border-t border-[#2E3440] cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Hapus Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-Way Streak Status Bar */}
      <div className="bg-[#181B22]/95 border-b border-[#2E3440] px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#FBBF24]">
          <Flame size={14} className="text-[#F59E0B] fill-[#F59E0B] shrink-0" />
          <span>
            {isVideoUnlocked
              ? `Streak ${conversation.streakDays} hari aktif! Video Call 1-on-1 terbuka.`
              : `Streak ${conversation.streakDays}/3 hari (dihitung saat kedua pihak saling membalas).`}
          </span>
        </div>
      </div>

      {lockedToast && (
        <div className="mx-4 mt-2 p-3 rounded-3xl bg-[#222631] border border-[#F59E0B] text-white text-xs shadow-xl">
          🔒 Video Call terkunci sampai kalian mencapai <strong>Streak 3 hari berturut-turut</strong>. (Gunakan tombol <strong>⚙️ Demo</strong> di pojok atas untuk simulasi +1 hari).
        </div>
      )}

      {/* Messages Area (No floating Heart watermark!) */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3.5 relative">
        {conversation.messages.length === 0 && (
          <div className="my-6 p-4 rounded-3xl bg-[#181B22] border border-[#2E3440] text-center space-y-1.5">
            <p className="text-xs font-extrabold text-white">
              Mulai Diskusi dengan {partner.name.split(' ')[0]}
            </p>
            <p className="text-xs text-[#94A3B8]">
              Kirim pesan pertama dan tunggu balasan {partner.name.split(' ')[0]} untuk menyalakan Streak Hari ke-1!
            </p>
          </div>
        )}

        {conversation.messages.map((msg) => {
          const isMe = msg.sender === 'me';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="px-3.5 py-1 rounded-full bg-[#222631] text-[#FBBF24] border border-[#2E3440] text-xs font-bold">
                  {msg.text} · {msg.time}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] px-4 py-3 rounded-3xl text-xs leading-relaxed shadow-md space-y-2 ${
                  isMe
                    ? 'bg-[#F59E0B] text-[#0F1115] font-semibold rounded-br-xs'
                    : 'bg-[#181B22] text-white border border-[#2E3440] rounded-bl-xs'
                }`}
              >
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Lampiran diskusi"
                    className="rounded-2xl max-h-44 w-full object-cover border border-black/20"
                  />
                )}
                <p>{msg.text}</p>
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[11px] text-[#94A3B8]">{msg.time}</span>
                {isMe && <CheckCheck size={13} className="text-[#F59E0B]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Icebreaker Pill Chips (FR-36) */}
      {conversation.icebreakers && conversation.icebreakers.length > 0 && (
        <div className="px-4 py-2 bg-[#0F1115] border-t border-[#2E3440]/60">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#38BDF8] mb-1.5">
            <MessageSquare size={12} className="text-[#38BDF8]" />
            <span>Pemantik Diskusi Akademik:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {conversation.icebreakers.map((ice, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(ice)}
                className="text-left text-xs bg-[#181B22] hover:bg-[#222631] text-white border border-[#2E3440] hover:border-[#F59E0B] px-3.5 py-1.5 rounded-full shrink-0 max-w-[260px] truncate transition cursor-pointer"
              >
                {ice}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar + Academic Schedule Quick Action (Replaces 💖 button!) */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-[#0F1115] flex items-center gap-2 shrink-0"
      >
        <div className="flex-1 bg-[#181B22] border border-[#2E3440] focus-within:border-[#F59E0B] rounded-full px-3.5 py-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Unggah Gambar / Catatan Diskusi (FR-37)"
            className="text-[#94A3B8] hover:text-[#F59E0B] transition cursor-pointer"
          >
            <Paperclip size={17} />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tulis pesan diskusi..."
            className="flex-1 bg-transparent text-xs text-white placeholder:text-[#94A3B8] focus:outline-none"
          />

          <button
            type="submit"
            aria-label="Kirim"
            className="text-[#F59E0B] hover:text-[#FBBF24] transition cursor-pointer"
          >
            <Send size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            onSendMessage(
              conversation.id,
              `📅 Yuk jadwalkan sesi diskusi di ${partner.campus || 'Library Anggrek'} minggu ini!`
            )
          }
          title="Ajak Jadwalkan Diskusi"
          className="px-3.5 h-10 rounded-full bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0F1115] font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#F59E0B]/25 shrink-0 cursor-pointer"
        >
          <Calendar size={14} />
          <span>Jadwal</span>
        </button>
      </form>
    </div>
  );
}
