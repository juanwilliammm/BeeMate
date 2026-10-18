import React, { useState } from 'react';
import {
  Compass,
  MessageCircle,
  BadgeCheck,
  ArrowRight,
  PhoneIncoming,
  Zap,
  Target,
  BookOpen
} from 'lucide-react';
import { GOALS, calculateMatchScore } from '../data/mockData';
import StreakBadge from '../components/StreakBadge';

export default function HomeScreen({
  user,
  theme = 'light',
  profiles,
  swipedIds = [],
  conversations,
  onNavigate,
  onOpenChat,
  onInspectProfileInDeck,
  onTriggerIncomingCall
}) {
  const [selectedGoalFilter, setSelectedGoalFilter] = useState('Semua');

  // Filter out already swiped profiles and sort using unified calculateMatchScore
  const topPicks = [...profiles]
    .filter((p) => !swipedIds.includes(p.id))
    .filter((p) =>
      selectedGoalFilter === 'Semua' ? true : p.goal === selectedGoalFilter
    )
    .map((p) => ({
      ...p,
      matchScore: calculateMatchScore(user, p),
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

  const logoSrc =
    theme === 'light' ? '/beemate-logo-light.png' : '/beemate-logo-dark.png';

  return (
    <div className="flex flex-col h-full bg-[#0F1115] text-white overflow-y-auto no-scrollbar px-5 pt-5 pb-4 space-y-5">
      {/* Top Bar: Logo, User Greeting & Incoming Call Trigger */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover border border-[#2E3440]"
            />
            <img
              src={logoSrc}
              alt="BeeMate"
              className="w-4 h-4 rounded-full bg-[#0F1115] object-contain absolute -bottom-0.5 -right-0.5"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-display font-extrabold text-base">
                Hai, {user.name.split(' ')[0]}!
              </h1>
              {user.verified && (
                <BadgeCheck
                  size={16}
                  className="text-[#38BDF8] shrink-0"
                  title="Verified Binusian"
                />
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-semibold text-[#38BDF8]">
                {user.major}
              </span>
              <span className="text-xs text-[#94A3B8]">
                {user.hideBatch ? '· Angkatan Disembunyikan' : `· Binusian '${user.batch.slice(-2)}`}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onTriggerIncomingCall}
          title="Simulasi Panggilan Masuk (Khusus Partner Streak 3+ Hari)"
          className="w-10 h-10 rounded-full bg-[#181B22] hover:bg-[#F59E0B] text-[#F59E0B] hover:text-[#0F1115] border border-[#2E3440] flex items-center justify-center transition cursor-pointer shrink-0"
        >
          <PhoneIncoming size={17} />
        </button>
      </div>

      {/* Hero Academic Networking Banner */}
      <div className="relative shrink-0 rounded-4xl bg-[#181B22] border border-[#2E3440] p-5 overflow-hidden shadow-lg space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
            Target Kolaborasi:
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B] text-[#0F1115] text-[11px] font-extrabold uppercase tracking-wider">
            <Target size={12} />
            <span>{user.goal}</span>
          </span>
        </div>

        <h2 className="font-display text-base font-extrabold leading-snug text-white">
          Bangun tim lomba, riset, & diskusi lintas fakultas bersama <span className="text-[#38BDF8]">Binusian</span> terverifikasi.
        </h2>

        {/* Interactive Goal Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          {GOALS.map((g) => {
            const active = selectedGoalFilter === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGoalFilter(g)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold shrink-0 transition cursor-pointer ${
                  active
                    ? 'bg-[#F59E0B] text-[#0F1115]'
                    : 'bg-[#222631] text-[#94A3B8] border border-[#2E3440] hover:text-white'
                }`}
              >
                {g === 'Semua' ? 'Semua Tujuan' : g}
              </button>
            );
          })}
        </div>

        {/* Shortcut Pill Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => onNavigate('matching')}
            className="flex-1 py-3 px-4 rounded-full bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0F1115] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F59E0B]/25 transition cursor-pointer"
          >
            <Compass size={16} />
            <span>Buka Swipe Deck</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('messages')}
            className="py-3 px-4 rounded-full bg-[#222631] hover:bg-[#2E3440] text-white border border-[#2E3440] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <MessageCircle size={15} className="text-[#F59E0B]" />
            <span>{conversations.length} Koneksi</span>
          </button>
        </div>
      </div>

      {/* Last Conversation Pill Card */}
      <div className="space-y-2 shrink-0">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold text-[#94A3B8] uppercase tracking-wider">
            Lanjutkan Diskusi
          </span>
          <button
            type="button"
            onClick={() => onNavigate('messages')}
            className="text-xs font-bold text-[#F59E0B] hover:underline cursor-pointer"
          >
            Semua Chat
          </button>
        </div>

        {lastConv && lastPartner ? (
          <div
            onClick={() => onOpenChat(lastConv.id)}
            className="bg-[#181B22] hover:bg-[#222631] border border-[#2E3440] rounded-4xl p-3.5 flex items-center gap-3.5 transition cursor-pointer"
          >
            <img
              src={lastPartner.avatar}
              alt={lastPartner.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#38BDF8] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-extrabold text-white truncate">
                  {lastPartner.name}
                </h3>
                <BadgeCheck size={14} className="text-[#38BDF8] shrink-0" />
                <StreakBadge
                  days={lastConv.streakDays}
                  expiringSoon={lastConv.streakExpiringSoon}
                />
              </div>
              <p className="text-xs text-[#94A3B8] truncate mt-0.5">
                {lastConv.messages[lastConv.messages.length - 1]?.text}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-[#0F1115] flex items-center justify-center shrink-0">
              <ArrowRight size={15} />
            </div>
          </div>
        ) : (
          <div className="bg-[#181B22] border border-dashed border-[#2E3440] rounded-4xl p-4 text-center space-y-2">
            <p className="text-xs text-[#94A3B8]">
              Belum ada percakapan aktif, mulai jelajah rekan di Swipe Deck!
            </p>
          </div>
        )}
      </div>

      {/* Top Picks Bento Grid — Academic Collaboration Cards (No Instant Match Bypass!) */}
      <div className="space-y-3 shrink-0 pb-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-extrabold text-[#94A3B8] uppercase tracking-wider">
            Rekomendasi Kolaborator Hari Ini
          </h2>
          <span className="text-[11px] font-bold text-[#F59E0B]">
            Kecocokan Akademik
          </span>
        </div>

        {topPicks.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {topPicks.map((profile) => (
              <div
                key={profile.id}
                onClick={() => onInspectProfileInDeck(profile.id)}
                className="group relative bg-[#181B22] border border-[#2E3440] hover:border-[#F59E0B]/60 rounded-3xl overflow-hidden flex flex-col justify-between shadow-lg cursor-pointer transition"
              >
                {/* Top Photo + Score Header */}
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181B22] via-transparent to-black/40" />

                  {/* Match Score Badge — Amber with --on-primary text, NO random rotation */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F59E0B] text-[#0F1115] text-[11px] font-extrabold shadow">
                      <Zap size={11} className="fill-[#0F1115]" />
                      <span>{profile.matchScore}%</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/75 border border-[#38BDF8]/40 text-[#38BDF8] text-[11px] font-bold">
                      &lsquo;{profile.batch.slice(-2)}
                    </span>
                  </div>
                </div>

                {/* Bottom Structured Academic Info */}
                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <h3 className="font-display font-extrabold text-xs text-white truncate">
                        {profile.name}
                      </h3>
                      <BadgeCheck size={14} className="text-[#38BDF8] shrink-0" />
                    </div>
                    <p className="text-[11px] text-[#38BDF8] font-bold truncate">
                      {profile.major}
                    </p>
                    <div className="p-2 rounded-xl bg-[#0F1115] border border-[#2E3440] mt-1">
                      <span className="flex items-center gap-1 text-[11px] text-[#94A3B8] font-medium truncate">
                        <BookOpen size={11} className="text-[#F59E0B] shrink-0" />
                        <span className="truncate text-white/90">{profile.promptAnswer}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspectProfileInDeck(profile.id);
                    }}
                    className="w-full py-2 rounded-full bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0F1115] text-[11px] font-extrabold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Compass size={12} />
                    <span>Tinjau di Deck</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#181B22] border border-[#2E3440] rounded-3xl p-5 text-center space-y-2">
            <p className="text-xs text-[#94A3B8]">
              Semua rekomendasi untuk filter ini sudah kamu tinjau di Swipe Deck.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('matching')}
              className="px-4 py-2 rounded-full bg-[#F59E0B] text-[#0F1115] text-xs font-extrabold cursor-pointer"
            >
              Ke Layar Explore
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
