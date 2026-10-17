import React, { useState } from 'react';
import { Search, BadgeCheck, Compass, MessageCircle, Plus } from 'lucide-react';
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

  const newMatches = enriched.filter((c) => c.messages.length === 0);
  const activeChats = enriched.filter((c) => c.messages.length > 0);

  return (
    <div className="flex flex-col h-full bg-[#0A0A0E] text-white overflow-y-auto no-scrollbar px-5 pt-5 pb-4 space-y-5">
      {/* Header & Pill Search Bar (FR-32) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-extrabold">
            Messages & <span className="text-[#FF4D8D]">Streaks</span>
          </h1>
          <span className="px-3 py-1 rounded-full bg-[#15151E] border border-[#2A2A3A] text-[10px] font-bold text-[#FF85B3]">
            🔥 3 Hari = Video Call
          </span>
        </div>

        <div className="relative">
          <Search size={15} className="absolute left-4 top-3.5 text-[#9494A8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari teman atau diskusi..."
            className="w-full pl-10 pr-4 py-3 text-xs rounded-full bg-[#15151E] border border-[#2A2A3A] text-white placeholder:text-[#9494A8] focus:border-[#FF4D8D] focus:outline-none"
          />
        </div>
      </div>

      {/* Circular Avatar Row for New Matches (Directly Inspired by Reference Image "+ (avatar) (avatar) (avatar)"!) */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-extrabold text-[#9494A8] uppercase tracking-wider px-1 block">
          Match Baru ({newMatches.length})
        </span>
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={onNavigateMatching}
            title="Cari Match Baru"
            className="w-14 h-14 rounded-full bg-[#15151E] hover:bg-[#1E1E2A] border-2 border-dashed border-[#FF4D8D] text-[#FF4D8D] flex items-center justify-center shrink-0 transition cursor-pointer"
          >
            <Plus size={20} />
          </button>

          {enriched.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => onOpenChat(conv.id)}
              className="flex flex-col items-center shrink-0 group cursor-pointer"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#FF4D8D] to-[#FF85B3]">
                <img
                  src={conv.partner.avatar}
                  alt={conv.partner.name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-[#0A0A0E]"
                />
                {conv.messages.length === 0 && (
                  <span className="absolute -bottom-1 right-0 bg-[#FF4D8D] text-[#0A0A0E] text-[8px] font-black px-1.5 py-0.2 rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-white/90 mt-1 max-w-[60px] truncate">
                {conv.partner.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pill-Shaped Conversation Rows (Directly Inspired by Reference Image "Lucy, 22 / Margareth, 21" cards!) */}
      <div className="space-y-2.5 flex-1">
        <span className="text-[11px] font-extrabold text-[#9494A8] uppercase tracking-wider px-1 block">
          Percakapan Aktif
        </span>

        {activeChats.length > 0 ? (
          <div className="space-y-2.5">
            {activeChats.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <div
                  key={conv.id}
                  onClick={() => onOpenChat(conv.id)}
                  className="bg-[#15151E] hover:bg-[#1E1E2A] border border-[#2A2A3A] hover:border-[#FF4D8D]/50 rounded-4xl p-3.5 flex items-center justify-between gap-3 transition cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={conv.partner.avatar}
                        alt={conv.partner.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#2A2A3A]"
                      />
                      {conv.partner.online && (
                        <span className="w-3 h-3 rounded-full bg-[#FF4D8D] border-2 border-[#15151E] absolute bottom-0 right-0" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-extrabold text-xs text-white truncate">
                          {conv.partner.name}, &lsquo;{conv.partner.batch.slice(-2)}
                        </h3>
                        <BadgeCheck size={13} className="text-[#FF4D8D] shrink-0" />
                        <StreakBadge
                          days={conv.streakDays}
                          expiringSoon={conv.streakExpiringSoon}
                        />
                      </div>
                      <p className="text-xs text-[#9494A8] truncate mt-0.5">
                        {lastMsg?.sender === 'me' ? 'Kamu: ' : ''}
                        {lastMsg?.text}
                      </p>
                    </div>
                  </div>

                  {/* Right Pill Unread Counter or Time (Like Reference UI "3" yellow/pink badge) */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-[#9494A8] font-medium">
                      {conv.lastUpdated}
                    </span>
                    {conv.unreadCount > 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-[10px] font-extrabold">
                        {conv.unreadCount}
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#2A2A3A]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-6 text-center space-y-3">
            <MessageCircle size={28} className="text-[#FF4D8D] mx-auto" />
            <p className="text-xs text-[#9494A8]">
              Belum ada percakapan aktif. Yuk mulai swipe di Explore!
            </p>
            <button
              type="button"
              onClick={onNavigateMatching}
              className="px-5 py-2.5 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-xs font-extrabold inline-flex items-center gap-1.5"
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
