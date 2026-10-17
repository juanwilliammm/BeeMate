import React, { useState } from 'react';
import { Search, BadgeCheck, Sparkles, Compass, MessageSquare } from 'lucide-react';
import StreakBadge from '../components/StreakBadge';

export default function MessagesScreen({
  conversations,
  profiles,
  onOpenChat,
  onNavigateMatching
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const getPartner = (partnerId) =>
    profiles.find((p) => p.id === partnerId) || {
      id: partnerId,
      name: 'Mahasiswa Binus',
      major: 'Computer Science',
      verified: true,
      online: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    };

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

  // FR-31: Separate New Matches (never chatted) at the top
  const newMatches = enriched.filter((c) => c.messages.length === 0);
  // FR-30: Active conversations ordered by newest
  const activeChats = enriched.filter((c) => c.messages.length > 0);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header & Search (FR-32) */}
      <div className="bg-white border-b border-slate-200 px-4 py-3.5 space-y-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-extrabold text-slate-900">Pesan & Match</h1>
            <p className="text-[11px] text-slate-500">
              Pertahankan streak 3 hari untuk membuka Video Call (FR-52)
            </p>
          </div>
        </div>

        {/* Search Input (FR-32) */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama teman, jurusan, atau isi pesan..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 border border-transparent focus:bg-white focus:border-binus-blue focus:outline-none"
          />
        </div>
      </div>

      {conversations.length === 0 ? (
        /* FR-33: Empty state directing to Matching */
        <div className="m-auto p-6 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-binus-blue flex items-center justify-center mx-auto">
            <MessageSquare size={26} />
          </div>
          <h3 className="text-sm font-extrabold text-slate-800">
            Belum Ada Percakapan (FR-33)
          </h3>
          <p className="text-xs text-slate-500 max-w-xs">
            Temukan partner belajar atau lomba di layar Matching terlebih dahulu untuk mulai mengobrol.
          </p>
          <button
            type="button"
            onClick={onNavigateMatching}
            className="px-4 py-2.5 rounded-xl bg-binus-blue text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Compass size={15} />
            <span>Buka Layar Matching</span>
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-5">
          {/* FR-31: New Matches Section at the Top */}
          {newMatches.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles size={14} className="text-binus-orange" />
                <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Match Baru Belum Dichat (FR-31)
                </h2>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {newMatches.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => onOpenChat(conv.id)}
                    className="flex flex-col items-center bg-white p-2.5 rounded-2xl border border-amber-200 shadow-2xs shrink-0 w-24 hover:border-binus-blue transition cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={conv.partner.avatar}
                        alt={conv.partner.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
                      />
                      <span className="absolute -bottom-1 right-0 bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                        BARU
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 truncate w-full text-center mt-1.5">
                      {conv.partner.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate w-full text-center">
                      {conv.partner.major}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FR-30 & FR-53: Active Conversations List with Streak Flame & Unread Indicator */}
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
              Daftar Percakapan Aktif (FR-30, FR-53)
            </h2>

            {activeChats.length > 0 ? (
              <div className="space-y-2">
                {activeChats.map((conv) => {
                  const lastMsg = conv.messages[conv.messages.length - 1];
                  return (
                    <div
                      key={conv.id}
                      onClick={() => onOpenChat(conv.id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                        conv.unreadCount > 0
                          ? 'bg-white border-binus-blue/40 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={conv.partner.avatar}
                          alt={conv.partner.name}
                          className="w-12 h-12 rounded-2xl object-cover"
                        />
                        {conv.partner.online && (
                          <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h3 className="text-xs font-extrabold text-slate-900 truncate">
                              {conv.partner.name}
                            </h3>
                            <BadgeCheck size={14} className="text-binus-blue shrink-0" />
                            {/* FR-53: Streak icon & number next to name */}
                            <StreakBadge
                              days={conv.streakDays}
                              expiringSoon={conv.streakExpiringSoon}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 shrink-0">
                            {conv.lastUpdated}
                          </span>
                        </div>

                        <p className="text-[10px] font-semibold text-binus-blue mt-0.5">
                          {conv.partner.major} · Angkatan {conv.partner.batch}
                        </p>

                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p
                            className={`text-xs truncate ${
                              conv.unreadCount > 0
                                ? 'font-bold text-slate-900'
                                : 'text-slate-500'
                            }`}
                          >
                            {lastMsg?.sender === 'me' ? 'Kamu: ' : ''}
                            {lastMsg?.text}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-binus-blue text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                Tidak ada percakapan yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
