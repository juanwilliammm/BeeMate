import React from 'react';
import {
  Compass,
  MessageCircle,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  PhoneIncoming,
  Heart
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
  // Section 8 & FR-21: Sort profiles using compatibility score
  const computeScore = (profile) => {
    const sharedInterests = profile.interests.filter((i) =>
      user.interests.includes(i)
    ).length;
    const sameGoal = profile.goal === user.goal ? 25 : 10;
    const sameFaculty = profile.faculty === user.faculty ? 10 : 5;
    return Math.min(98, 56 + sharedInterests * 12 + sameGoal + sameFaculty);
  };

  const topPicks = [...profiles]
    .map((p) => ({
      ...p,
      matchScore: computeScore(p),
      sharedInterests: p.interests.filter((i) => user.interests.includes(i))
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  // FR-20: Last active conversation
  const activeConvs = conversations.filter((c) => c.messages.length > 0);
  const lastConv = activeConvs[0] || null;
  const lastPartner = lastConv
    ? profiles.find((p) => p.id === lastConv.partnerId) || profiles[0]
    : null;

  return (
    <div className="flex flex-col h-full bg-[#0A0A0E] text-white overflow-y-auto no-scrollbar px-5 pt-5 pb-4 space-y-5">
      {/* Top Bar: Logo, User Greeting & Incoming Call Trigger */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-[#FF4D8D]"
            />
            <img
              src="/beemate-logo.png"
              alt="BeeMate"
              className="w-4 h-4 rounded-full bg-black absolute -bottom-0.5 -right-0.5 border border-[#FF4D8D]"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-display font-extrabold text-base">
                Hai, {user.name.split(' ')[0]}!
              </h1>
              {user.verified && (
                <BadgeCheck size={15} className="text-[#FF4D8D]" />
              )}
            </div>
            <p className="text-[11px] text-[#9494A8]">
              {user.major} · &lsquo;{user.batch.slice(-2)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onTriggerIncomingCall}
          title="Simulasi Panggilan Video Masuk"
          className="w-10 h-10 rounded-full bg-[#15151E] hover:bg-[#FF4D8D] text-[#FF85B3] hover:text-[#0A0A0E] border border-[#2A2A3A] flex items-center justify-center transition cursor-pointer"
        >
          <PhoneIncoming size={17} />
        </button>
      </div>

      {/* Bento Hero Banner (Inspired by Reference UI Top-Right Card with 4-point star & tilted photos) */}
      <div className="relative rounded-4xl bg-gradient-to-br from-[#1E1E2A] via-[#15151E] to-[#0A0A0E] border border-[#2A2A3A] p-5 overflow-hidden shadow-xl">
        {/* Decorative 4-point Pink Star */}
        <svg
          viewBox="0 0 24 24"
          className="w-12 h-12 text-[#FF4D8D]/25 absolute top-3 right-3 rotate-12 pointer-events-none"
          fill="currentColor"
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-[10px] font-extrabold uppercase tracking-wider -rotate-1">
          <Sparkles size={11} />
          <span>{user.goal}</span>
        </span>

        <h2 className="font-display text-lg font-extrabold mt-2.5 leading-snug max-w-[230px]">
          Temukan partner <span className="text-[#FF4D8D]">Binusian</span> paling cocok hari ini!
        </h2>

        {/* Shortcut Pill Buttons (FR-20) */}
        <div className="flex items-center gap-2.5 mt-4">
          <button
            type="button"
            onClick={() => onNavigate('matching')}
            className="flex-1 py-3 px-4 rounded-full bg-[#FF4D8D] hover:bg-[#FF85B3] text-[#0A0A0E] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D8D]/30 transition cursor-pointer"
          >
            <Compass size={16} />
            <span>Mulai Swipe</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('messages')}
            className="py-3 px-4 rounded-full bg-[#0A0A0E] hover:bg-[#1E1E2A] text-white border border-[#2A2A3A] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <MessageCircle size={15} className="text-[#FF4D8D]" />
            <span>{conversations.length} Match</span>
          </button>
        </div>
      </div>

      {/* Last Conversation Pill Card (FR-20 / FR-23) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold text-[#9494A8] uppercase tracking-wider">
            Lanjutkan Diskusi
          </span>
          <button
            type="button"
            onClick={() => onNavigate('messages')}
            className="text-[11px] font-bold text-[#FF85B3] hover:underline"
          >
            Semua Chat
          </button>
        </div>

        {lastConv && lastPartner ? (
          <div
            onClick={() => onOpenChat(lastConv.id)}
            className="bg-[#15151E] hover:bg-[#1E1E2A] border border-[#2A2A3A] rounded-4xl p-3.5 flex items-center gap-3.5 transition cursor-pointer"
          >
            <img
              src={lastPartner.avatar}
              alt={lastPartner.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#FF4D8D]"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-extrabold text-white truncate">
                  {lastPartner.name}
                </h3>
                <StreakBadge
                  days={lastConv.streakDays}
                  expiringSoon={lastConv.streakExpiringSoon}
                />
              </div>
              <p className="text-[11px] text-[#9494A8] truncate mt-0.5">
                {lastConv.messages[lastConv.messages.length - 1]?.text}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FF4D8D] text-[#0A0A0E] flex items-center justify-center shrink-0">
              <ArrowRight size={15} />
            </div>
          </div>
        ) : (
          <div className="bg-[#15151E] border border-dashed border-[#2A2A3A] rounded-4xl p-4 text-center space-y-2">
            <p className="text-xs text-[#9494A8]">
              Belum ada match, mulai jelajah sekarang!
            </p>
          </div>
        )}
      </div>

      {/* Top Picks Bento Grid (FR-19 & FR-21: Ranked by Match Score, Reference UI 94% Pill Badge!) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-extrabold text-[#9494A8] uppercase tracking-wider">
            Rekomendasi Teratas Hari Ini
          </h2>
          <span className="text-[10px] font-bold text-[#FF85B3]">
            Skor Kecocokan
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {topPicks.map((profile, idx) => (
            <div
              key={profile.id}
              className="group relative bg-[#15151E] border border-[#2A2A3A] rounded-4xl overflow-hidden flex flex-col justify-between p-3 h-60 shadow-lg"
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-[#0A0A0E]/30 to-transparent" />

              {/* Top Floating Match Percentage Pill (Just like Reference Image "♡ 94%"!) */}
              <div className="relative z-10 flex justify-between items-start">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-[10px] font-extrabold shadow-md ${
                    idx % 2 === 0 ? '-rotate-3' : 'rotate-3'
                  }`}
                >
                  <Heart size={10} className="fill-[#0A0A0E]" />
                  <span>{profile.matchScore}%</span>
                </span>
              </div>

              {/* Bottom Info & Quick Like */}
              <div className="relative z-10 space-y-2">
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-display font-extrabold text-xs text-white truncate">
                      {profile.name.split(' ')[0]}, &lsquo;{profile.batch.slice(-2)}
                    </h3>
                    <BadgeCheck size={13} className="text-[#FF4D8D] shrink-0" />
                  </div>
                  <p className="text-[10px] text-[#FF85B3] font-semibold truncate">
                    {profile.major}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onLikeProfile(profile)}
                  className="w-full py-2 rounded-full bg-white/15 hover:bg-[#FF4D8D] text-white hover:text-[#0A0A0E] backdrop-blur-md text-[11px] font-extrabold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Heart size={12} className="fill-current" />
                  <span>Match</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
