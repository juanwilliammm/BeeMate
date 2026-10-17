import React, { useState } from 'react';
import { Search, BadgeCheck, Compass, MessageCircle, Plus, Flame } from 'lucide-react';
import StreakBadge from '../components/StreakBadge';

export default function MessagesScreen({
  conversations,
  profiles,
  onOpenChat,
  onNavigateMatching
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const getPartner = (partnerId) =>
    profiles.find((p) => p.id === partnerId) || profiles[0];

  const enriched = conversations
    .map((c) => ({
      ...c,
      partner: getPartner(c.partnerId)
    }))
    .filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const lastMsg = c.messages[c.messages.length - 1]?.text || '';
      return (
        c.partner.name.toLowerCase().includes(q) ||
        c.partner.major.toLowerCase().includes(q) ||
        lastMsg.toLowerCase().includes(q)
      );
    });

  // Fixed Bug: newMatches only contains matches with 0 messages, and activeChats contains conversations with >= 1 message
  const newMatches = enriched.filter((c) => c.messages.length === 0);
  const activeChats = enriched.filter((c) => c.messages.length > 0);

  return (
    <div className="flex flex-col h-full bg-[#0F1115] text-white overflow-y-auto no-scrollbar px-5 pt-5 pb-4 space-y-5">
      {/* Header & Pill Search Bar */}
      <div className="space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-extrabold">
            Diskusi & <span className="text-[#F59E0B]">Streak</span>
          </h1>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#181B22] border border-[#2E3440] text-[11px] font-bold text-[#F59E0B]">
            <Flame size={12} className="fill-[#F59E0B]" />
            <span>3 Hari = Video Call</span>
          </span>
        </div>

        <div className="relative">
          <Search size={15} className="absolute left-4 top-3.5 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama kolaborator, jurusan, atau topik..."
            className="w-full pl-10 pr-4 py-3 text-xs rounded-full bg-[#181B22] border border-[#2E3440] text-white placeholder:text-[#94A3B8] focus:border-[#F59E0B] focus:outline-none"
          />
        </div>
      </div>

      {/* Circular Avatar Row for New Matches (Fixed: renders newMatches.map instead of enriched.map!) */}
      <div className="space-y-2.5 shrink-0">
        <span className="text-xs font-extrabold text-[#94A3B8] uppercase tracking-wider px-1 block">
          Koneksi Baru ({newMatches.length})
        </span>
        <div className="flex items-start gap-3.5 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={onNavigateMatching}
            title="Cari Kolaborator Baru"
            className="flex flex-col items-center shrink-0 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-[#181B22] group-hover:bg-[#222631] border-2 border-dashed border-[#F59E0B] text-[#F59E0B] flex items-center justify-center transition">
              <Plus size={20} />
            </div>
            <span className="text-[11px] font-semibold text-[#94A3B8] mt-1.5">
              Explore
            </span>
          </button>

          {newMatches.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => onOpenChat(conv.id)}
              className="flex flex-col items-center shrink-0 w-16 group cursor-pointer"
            >
              <div className="relative w-14 h-14 rounded-full p-0.5 bg-[#F59E0B] shrink-0">
                <img
                  src={conv.partner.avatar}
                  alt={conv.partner.name}
                  className="w-full h-full rounded-full object-cover border-2 border-[#0F1115]"
                />
                <span className="absolute -bottom-1 right-0 bg-[#F59E0B] text-[#0F1115] text-[10px] font-extrabold px-1.5 py-0.5 rounded-full leading-none shadow">
                  BARU
                </span>
              </div>
              <span className="text-xs font-bold text-white/90 mt-1.5 w-full text-center truncate">
                {conv.partner.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Conversation Rows */}
      <div className="space-y-2.5 flex-1">
        <span className="text-xs font-extrabold text-[#94A3B8] uppercase tracking-wider px-1 block">
          Percakapan Aktif ({activeChats.length})
        </span>

        {activeChats.length > 0 ? (
          <div className="space-y-2.5">
            {activeChats.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <div
                  key={conv.id}
                  onClick={() => onOpenChat(conv.id)}
                  className="bg-[#181B22] hover:bg-[#222631] border border-[#2E3440] hover:border-[#F59E0B]/50 rounded-4xl p-3.5 flex items-center justify-between gap-3 transition cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 shrink-0">
                      <img
                        src={conv.partner.avatar}
                        alt={conv.partner.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#2E3440]"
                      />
                      {conv.partner.online && (
                        <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#181B22] absolute bottom-0 right-0" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-extrabold text-xs text-white truncate">
                          {conv.partner.name}
                        </h3>
                        <BadgeCheck
                          size={14}
                          className="text-[#38BDF8] shrink-0"
                          title="Verified Binusian"
                        />
                        <StreakBadge
                          days={conv.streakDays}
                          expiringSoon={conv.streakExpiringSoon}
                        />
                      </div>
                      <p className="text-[11px] font-semibold text-[#38BDF8] truncate">
                        {conv.partner.major} · &lsquo;{conv.partner.batch.slice(-2)}
                      </p>
                      <p className="text-xs text-[#94A3B8] truncate mt-0.5">
                        {lastMsg?.sender === 'me' ? 'Kamu: ' : ''}
                        {lastMsg?.text}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[11px] text-[#94A3B8] font-medium">
                      {conv.lastUpdated}
                    </span>
                    {conv.unreadCount > 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F59E0B] text-[#0F1115] text-[11px] font-extrabold">
                        {conv.unreadCount}
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#2E3440]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#181B22] border border-[#2E3440] rounded-4xl p-6 text-center space-y-3">
            <MessageCircle size={28} className="text-[#F59E0B] mx-auto" />
            <p className="text-xs text-[#94A3B8]">
              Belum ada percakapan aktif. Yuk mulai cari rekan kolaborasi di Explore!
            </p>
            <button
              type="button"
              onClick={onNavigateMatching}
              className="px-5 py-2.5 rounded-full bg-[#F59E0B] text-[#0F1115] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Compass size={14} />
              <span>Mulai Explore</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
