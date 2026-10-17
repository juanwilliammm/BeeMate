import React, { useState } from 'react';
import {
  ArrowLeft,
  Video,
  Lock,
  MoreVertical,
  Send,
  Sparkles,
  CheckCheck,
  Image as ImageIcon,
  Flame,
  PlusCircle,
  Trash2,
  Flag,
  Ban
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

  const isVideoUnlocked = conversation.streakDays >= 3; // FR-42 & FR-52
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

  const handleSendImageAttachment = () => {
    onSendMessage(
      conversation.id,
      '📷 [Gambar Terlampir: Draft Wireframe & Catatan Diskusi Kelompok]'
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 relative">
      {/* Chat Header (FR-35 & FR-42 & FR-53) */}
      <div className="bg-white border-b border-slate-200 px-3 py-2.5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali ke Daftar Pesan"
            className="p-1.5 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="relative shrink-0">
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-9 h-9 rounded-full object-cover"
            />
            {partner.online && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-extrabold text-slate-900 truncate">
                {partner.name}
              </h2>
              <StreakBadge
                days={conversation.streakDays}
                expiringSoon={conversation.streakExpiringSoon}
              />
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold">
              {partner.online ? 'Online · Siap diskusi' : 'Aktif beberapa jam lalu'}
            </p>
          </div>
        </div>

        {/* Video Call Button (FR-42) & More Menu (FR-35) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleVideoClick}
            aria-label="Mulai Video Call"
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
              isVideoUnlocked
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
            }`}
          >
            {isVideoUnlocked ? (
              <>
                <Video size={14} />
                <span>Video Call</span>
              </>
            ) : (
              <>
                <Lock size={13} className="text-amber-600" />
                <span>Terkunci ({remainingDays} hr)</span>
              </>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Menu Percakapan"
              className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onOpenReportModal(partner);
                  }}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Flag size={14} className="text-amber-600" />
                  <span>Laporkan Pengguna</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onOpenReportModal(partner);
                  }}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Ban size={14} className="text-slate-700" />
                  <span>Blokir Akun</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDeleteConversation(conversation.id);
                  }}
                  className="w-full px-3.5 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold border-t border-slate-100"
                >
                  <Trash2 size={14} />
                  <span>Hapus Percakapan</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Streak & Video Call Unlock Banner (FR-42, FR-52, FR-54) */}
      <div className="bg-amber-50 border-b border-amber-200/80 px-3.5 py-2 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-amber-900">
          <Flame size={14} className="text-binus-orange fill-binus-orange shrink-0" />
          <span>
            {isVideoUnlocked ? (
              <>
                <strong>Streak {conversation.streakDays} Hari Aktif!</strong> Fitur Video Call 1-on-1 sudah terbuka.
              </>
            ) : (
              <>
                Streak saat ini <strong>{conversation.streakDays}/3 hari</strong>. Sisa{' '}
                <strong>{remainingDays} hari</strong> berturut-turut untuk buka Video Call (FR-42).
              </>
            )}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onIncrementStreak(conversation.id)}
          className="ml-2 shrink-0 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-lg font-bold text-[10px] inline-flex items-center gap-1 cursor-pointer"
        >
          <PlusCircle size={11} />
          <span>+1 Hari Streak</span>
        </button>
      </div>

      {/* Locked Video Call Notice Toast */}
      {lockedToast && (
        <div className="mx-3 mt-2 p-2.5 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between shadow-lg animate-in fade-in duration-150">
          <span>
            🔒 Video Call baru terbuka setelah streak chat mencapai 3 hari berturut-turut (Sisa {remainingDays} hari lagi). Klik tombol <strong>+1 Hari Streak</strong> di atas untuk simulasi!
          </span>
        </div>
      )}

      {/* Messages Area (FR-34) */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {conversation.messages.length === 0 && (
          <div className="text-center py-6 space-y-2">
            <p className="text-xs font-bold text-slate-600">
              Mulai percakapan pertamamu dengan {partner.name}!
            </p>
            <p className="text-[11px] text-slate-400">
              Gunakan saran pembuka (Icebreaker) di bawah sesuai minat bersama kalian.
            </p>
          </div>
        )}

        {conversation.messages.map((msg) => {
          const isMe = msg.sender === 'me';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-bold">
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
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-binus-blue text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                }`}
              >
                <p>{msg.text}</p>
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[10px] text-slate-400">{msg.time}</span>
                {isMe && (
                  <CheckCheck
                    size={13}
                    className={
                      msg.status === 'read' ? 'text-binus-blue' : 'text-slate-400'
                    }
                    title={msg.status === 'read' ? 'Dibaca (FR-34)' : 'Terkirim'}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Icebreaker Suggestions Bar (FR-36) */}
      {conversation.icebreakers && conversation.icebreakers.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 px-3 py-2">
          <div className="flex items-center gap-1 text-[10px] font-bold text-binus-blue mb-1.5">
            <Sparkles size={12} className="text-binus-orange" />
            <span>Saran Pembuka Percakapan / Icebreaker (FR-36):</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {conversation.icebreakers.map((ice, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(ice)}
                className="text-left text-[11px] bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-xl shrink-0 max-w-[230px] truncate transition cursor-pointer"
              >
                {ice}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Bar (FR-34 & FR-37 Image attachment) */}
      <form
        onSubmit={handleSend}
        className="bg-white border-t border-slate-200 p-2.5 flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          onClick={handleSendImageAttachment}
          title="Kirim Gambar Catatan/Tugas (FR-37)"
          aria-label="Kirim Gambar"
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-binus-blue transition cursor-pointer"
        >
          <ImageIcon size={19} />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tulis pesan diskusi..."
          className="flex-1 text-xs bg-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-binus-blue/20"
        />

        <button
          type="submit"
          aria-label="Kirim Pesan"
          className="p-2.5 rounded-xl bg-binus-blue hover:bg-[#00427A] text-white transition cursor-pointer"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
