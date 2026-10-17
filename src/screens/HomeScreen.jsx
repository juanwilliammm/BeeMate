import React from 'react';
import {
  Compass,
  MessageSquare,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  PhoneIncoming,
  Target,
  HeartHandshake
} from 'lucide-react';
import StreakBadge from '../components/StreakBadge';

export default function HomeScreen({
  user,
  profiles,
  conversations,
  onNavigate,
  onOpenChat,
  onLikeProfile,
  onTriggerIncomingCall
}) {
  // Section 8 & FR-21: Sort profiles using compatibility score (shared interests + same goal + batch proximity)
  const computeScore = (profile) => {
    const sharedInterests = profile.interests.filter((i) =>
      user.interests.includes(i)
    ).length;
    const sameGoal = profile.goal === user.goal ? 25 : 10;
    const sameFaculty = profile.faculty === user.faculty ? 10 : 5;
    const raw = Math.min(98, 55 + sharedInterests * 12 + sameGoal + sameFaculty);
    return raw;
  };

  const topPicks = [...profiles]
    .map((p) => ({
      ...p,
      matchScore: computeScore(p),
      sharedInterests: p.interests.filter((i) => user.interests.includes(i))
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  // FR-20: Last active conversation
  const activeConvs = conversations.filter((c) => c.messages.length > 0);
  const lastConv = activeConvs[0] || null;
  const lastPartner = lastConv
    ? profiles.find((p) => p.id === lastConv.partnerId) || {
        name: 'Nadya Kusuma',
        major: 'Visual Communication Design',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'
      }
    : null;

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-4">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-binus-blue to-[#00396B] text-white px-5 pt-5 pb-6 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
            />
            <div>
              <div className="flex items-center gap-1">
                <h1 className="font-extrabold text-sm">Halo, {user.name.split(' ')[0]}!</h1>
                {user.verified && (
                  <BadgeCheck size={15} className="text-amber-300 fill-amber-300/20" />
                )}
              </div>
              <p className="text-[11px] text-blue-100">
                {user.major} · Binusian {user.batch}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onTriggerIncomingCall}
            title="Simulasi Layar 11 (Panggilan Masuk)"
            className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-amber-300 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border border-white/15 transition cursor-pointer"
          >
            <PhoneIncoming size={13} />
            <span>Simulasi Call Masuk</span>
          </button>
        </div>

        {/* Quick Shortcuts (FR-20) */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('matching')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/15 p-3 rounded-2xl text-left transition flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                Jelajah Teman
              </span>
              <span className="text-xs font-extrabold">Buka Matching</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center">
              <Compass size={18} />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('messages')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/15 p-3 rounded-2xl text-left transition flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider block">
                Kotak Masuk
              </span>
              <span className="text-xs font-extrabold">
                {conversations.length} Match & Pesan
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center">
              <MessageSquare size={17} />
            </div>
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Last Active Conversation Shortcut (FR-20) or Empty State (FR-23) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Percakapan Terakhir (FR-20)
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('messages')}
              className="text-[11px] font-bold text-binus-blue hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          {lastConv && lastPartner ? (
            <div
              onClick={() => onOpenChat(lastConv.id)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-binus-blue transition cursor-pointer flex items-center gap-3"
            >
              <img
                src={lastPartner.avatar}
                alt={lastPartner.name}
                className="w-12 h-12 rounded-2xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-extrabold text-slate-900 truncate">
                    {lastPartner.name}
                  </h3>
                  <BadgeCheck size={14} className="text-binus-blue shrink-0" />
                  <StreakBadge
                    days={lastConv.streakDays}
                    expiringSoon={lastConv.streakExpiringSoon}
                  />
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {lastConv.messages[lastConv.messages.length - 1]?.text}
                </p>
              </div>
              <ArrowRight size={16} className="text-slate-400 shrink-0" />
            </div>
          ) : (
            /* FR-23: Empty state encouraging action */
            <div className="bg-white p-4 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
              <p className="text-xs font-bold text-slate-700">
                Belum ada match, mulai jelajah sekarang! (FR-23)
              </p>
              <button
                type="button"
                onClick={() => onNavigate('matching')}
                className="px-4 py-2 rounded-xl bg-binus-blue text-white text-xs font-bold"
              >
                Mulai Swipe Profil
              </button>
            </div>
          )}
        </div>

        {/* Today's Top Matched Profiles (FR-19 & FR-21: Ranked by Compatibility Score, No Activity Feed) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles size={15} className="text-binus-orange" />
              <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Pilihan Paling Cocok Hari Ini (FR-19, FR-21)
              </h2>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">
              Urut Skor Kecocokan
            </span>
          </div>

          {topPicks.length > 0 ? (
            <div className="space-y-2.5">
              {topPicks.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 truncate">
                          <h3 className="text-sm font-extrabold text-slate-900 truncate">
                            {profile.name}
                          </h3>
                          {profile.verified && (
                            <BadgeCheck size={15} className="text-binus-blue shrink-0" />
                          )}
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold shrink-0">
                          {profile.matchScore}% Cocok
                        </span>
                      </div>

                      <p className="text-[11px] font-semibold text-slate-600">
                        {profile.major} · Angkatan {profile.batch}
                      </p>

                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold">
                        <Target size={11} className="text-binus-orange" />
                        <span>{profile.goal}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {profile.bio}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1">
                      {profile.interests.slice(0, 3).map((tag) => {
                        const isShared = user.interests.includes(tag);
                        return (
                          <span
                            key={tag}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              isShared
                                ? 'bg-blue-50 text-binus-blue border border-blue-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isShared ? `★ ${tag}` : tag}
                          </span>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onLikeProfile(profile);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-binus-blue hover:bg-[#00427A] text-white text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <HeartHandshake size={13} />
                      <span>Ajak Match</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2">
              <p className="text-xs font-bold text-slate-700">
                Semua profil pilihan hari ini sudah kamu lihat!
              </p>
              <button
                type="button"
                onClick={() => onNavigate('matching')}
                className="px-4 py-2 rounded-xl bg-binus-blue text-white text-xs font-bold"
              >
                Buka Layar Matching
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
