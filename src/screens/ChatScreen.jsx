import React, { useState } from 'react';
import {
  ArrowLeft,
  Video,
  Lock,
  MoreVertical,
  Send,
  Sparkles,
  CheckCheck,
  Paperclip,
  Flame,
  PlusCircle,
  Trash2,
  Flag,
  Ban,
  Heart
} from 'lucide-react';
import StreakBadge from '../components/StreakBadge';

export default function ChatScreen({
  conversation,
  partner,
  onBack,
  onSendMessage,
  onIncrementStreak,
  onStartVideoCall,
  onDeleteConversation,
  onOpenReportModal
}) {
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [lockedToast, setLockedToast] = useState(false);

  if (!conversation || !partner) return null;

  const isVideoUnlocked = conversation.streakDays >= 3;
  const remainingDays = Math.max(0, 3 - conversation.streakDays);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(conversation.id, inputText.trim());
    setInputText('');
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
    <div className="flex flex-col h-full bg-[#0A0A0E] text-white relative">
      {/* Top Chat Header (Inspired by Reference Bottom-Left "Mary, 23 Online" Card!) */}
      <div className="bg-[#15151E] border-b border-[#2A2A3A] px-4 py-3 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className="w-9 h-9 rounded-full bg-[#1E1E2A] text-white flex items-center justify-center hover:bg-[#FF4D8D] hover:text-[#0A0A0E] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>

          <img
            src={partner.avatar}
            alt={partner.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-[#FF4D8D]"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-display text-xs font-extrabold text-white truncate">
                {partner.name}
              </h2>
              <StreakBadge
                days={conversation.streakDays}
                expiringSoon={conversation.streakExpiringSoon}
              />
            </div>
            <p className="text-[10px] text-[#FF85B3] font-semibold">
              {partner.online ? 'Online' : 'Offline'} · {partner.major}
            </p>
          </div>
        </div>

        {/* Video Call Pill & Menu */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleVideoClick}
            className={`px-3 py-2 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
              isVideoUnlocked
                ? 'bg-[#FF4D8D] text-[#0A0A0E] shadow-md shadow-[#FF4D8D]/30'
                : 'bg-[#1E1E2A] text-[#9494A8] border border-[#2A2A3A]'
            }`}
          >
            {isVideoUnlocked ? (
              <>
                <Video size={14} />
                <span>Call</span>
              </>
            ) : (
              <>
                <Lock size={12} className="text-[#FF85B3]" />
                <span>{remainingDays} hr</span>
              </>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Menu"
              className="w-9 h-9 rounded-full bg-[#1E1E2A] text-[#9494A8] hover:text-white flex items-center justify-center cursor-pointer"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-[#15151E] rounded-3xl shadow-2xl border border-[#2A2A3A] py-2 z-30 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onOpenReportModal(partner);
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-[#1E1E2A] flex items-center gap-2 font-semibold"
                >
                  <Flag size={14} className="text-[#FF4D8D]" />
                  <span>Laporkan</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onOpenReportModal(partner);
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-[#1E1E2A] flex items-center gap-2 font-semibold"
                >
                  <Ban size={14} className="text-[#FF85B3]" />
                  <span>Blokir Akun</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDeleteConversation(conversation.id);
                  }}
                  className="w-full px-4 py-2 text-left text-rose-400 hover:bg-[#1E1E2A] flex items-center gap-2 font-bold border-t border-[#2A2A3A]"
                >
                  <Trash2 size={14} />
                  <span>Hapus Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Streak Interactive Simulator Bar */}
      <div className="bg-[#15151E]/90 border-b border-[#2A2A3A] px-4 py-2 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-[#FF85B3]">
          <Flame size={13} className="text-[#FF4D8D] fill-[#FF4D8D] shrink-0" />
          <span>
            {isVideoUnlocked
              ? `Streak ${conversation.streakDays} hari aktif! Video Call terbuka.`
              : `Streak ${conversation.streakDays}/3 hari. Butuh ${remainingDays} hari lagi untuk Video Call.`}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onIncrementStreak(conversation.id)}
          className="px-2.5 py-1 rounded-full bg-[#FF4D8D]/20 hover:bg-[#FF4D8D] text-[#FF85B3] hover:text-[#0A0A0E] font-extrabold text-[10px] inline-flex items-center gap-1 transition cursor-pointer shrink-0"
        >
          <PlusCircle size={11} />
          <span>+1 Hari</span>
        </button>
      </div>

      {lockedToast && (
        <div className="mx-4 mt-2 p-3 rounded-3xl bg-[#1E1E2A] border border-[#FF4D8D] text-white text-xs shadow-xl">
          🔒 Video Call terkunci sampai kalian punya <strong>Streak 3 hari</strong>. Klik tombol <strong>+1 Hari</strong> di kanan atas untuk simulasi membuka kunci!
        </div>
      )}

      {/* Messages Area with Tilted Highlight Bubbles (Like Reference Image Bottom-Left!) */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3.5 relative">
        {/* Decorative Floating Heart like Reference UI */}
        <Heart
          size={42}
          className="text-[#FF4D8D]/10 fill-[#FF4D8D]/10 absolute top-4 right-6 rotate-12 pointer-events-none"
        />

        {conversation.messages.map((msg) => {
          const isMe = msg.sender === 'me';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="px-3.5 py-1 rounded-full bg-[#1E1E2A] text-[#FF85B3] border border-[#2A2A3A] text-[11px] font-bold">
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
                className={`max-w-[82%] px-4 py-3 rounded-3xl text-xs font-medium leading-relaxed shadow-md ${
                  isMe
                    ? 'bg-[#FF4D8D] text-[#0A0A0E] font-semibold rounded-br-xs'
                    : 'bg-[#15151E] text-white border border-[#2A2A3A] rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[10px] text-[#9494A8]">{msg.time}</span>
                {isMe && <CheckCheck size={13} className="text-[#FF4D8D]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Icebreaker Pill Chips (FR-36) */}
      {conversation.icebreakers && conversation.icebreakers.length > 0 && (
        <div className="px-4 py-2 bg-[#0A0A0E]">
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#FF85B3] mb-1.5">
            <Sparkles size={11} className="text-[#FF4D8D]" />
            <span>Icebreaker Topik Diskusi:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {conversation.icebreakers.map((ice, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(ice)}
                className="text-left text-[11px] bg-[#15151E] hover:bg-[#1E1E2A] text-white border border-[#2A2A3A] hover:border-[#FF4D8D] px-3.5 py-1.5 rounded-full shrink-0 max-w-[240px] truncate transition cursor-pointer"
              >
                {ice}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pill Input Bar (Directly Inspired by Reference Image "[📎 Type something... ▷] (♥)") */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-[#0A0A0E] flex items-center gap-2.5 shrink-0"
      >
        <div className="flex-1 bg-[#15151E] border border-[#2A2A3A] focus-within:border-[#FF4D8D] rounded-full px-3.5 py-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onSendMessage(
                conversation.id,
                '📷 [Foto Terlampir: Catatan Diskusi & Wireframe]'
              )
            }
            title="Lampirkan Gambar (FR-37)"
            className="text-[#9494A8] hover:text-[#FF4D8D] transition cursor-pointer"
          >
            <Paperclip size={17} />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type something..."
            className="flex-1 bg-transparent text-xs text-white placeholder:text-[#9494A8] focus:outline-none"
          />

          <button
            type="submit"
            aria-label="Kirim"
            className="text-[#FF4D8D] hover:text-[#FF85B3] transition cursor-pointer"
          >
            <Send size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onSendMessage(conversation.id, '💖 Siap kolaborasi bareng!')}
          aria-label="Kirim Reaksi Cepat"
          className="w-10 h-10 rounded-full bg-[#FF4D8D] hover:bg-[#FF85B3] text-[#0A0A0E] flex items-center justify-center shadow-lg shadow-[#FF4D8D]/30 shrink-0 cursor-pointer"
        >
          <Heart size={17} className="fill-[#0A0A0E]" />
        </button>
      </form>
    </div>
  );
}
