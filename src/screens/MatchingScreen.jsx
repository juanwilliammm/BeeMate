import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  Heart,
  BadgeCheck,
  Flag,
  Sparkles,
  RotateCcw,
  MessageCircle,
  MapPin
} from 'lucide-react';
import { FACULTIES, MAJORS, BATCHES, GOALS, INTERESTS_LIST } from '../data/mockData';

export default function MatchingScreen({
  user,
  profiles,
  swipedIds,
  dailyLikesLeft,
  onSwipeLeft,
  onSwipeRight,
  onResetSwipes,
  onOpenReportModal,
  newlyMatchedProfile,
  onClearNewMatch,
  onOpenChatFromMatch
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [facultyFilter, setFacultyFilter] = useState('Semua');
  const [majorFilter, setMajorFilter] = useState('Semua');
  const [batchFilter, setBatchFilter] = useState('Semua');
  const [goalFilter, setGoalFilter] = useState('Semua');
  const [interestFilter, setInterestFilter] = useState('Semua');

  // Pointer & Touch Drag state so both Mouse and Finger Swipe work smoothly!
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null); // 'left' | 'right'

  const filteredProfiles = profiles
    .filter((p) => !swipedIds.includes(p.id))
    .filter((p) => (facultyFilter === 'Semua' ? true : p.faculty === facultyFilter))
    .filter((p) => (majorFilter === 'Semua' ? true : p.major === majorFilter))
    .filter((p) => (batchFilter === 'Semua' ? true : p.batch === batchFilter))
    .filter((p) => (goalFilter === 'Semua' ? true : p.goal === goalFilter))
    .filter((p) =>
      interestFilter === 'Semua' ? true : p.interests.includes(interestFilter)
    );

  const currentProfile = filteredProfiles[0] || null;
  const nextProfilePreview = filteredProfiles[1] || null;

  // Compute Match % for the pill badge on top right (like Reference UI "♡ 94%")
  const computeScore = (profile) => {
    if (!profile) return 90;
    const shared = profile.interests.filter((i) => user.interests.includes(i)).length;
    const sameGoal = profile.goal === user.goal ? 25 : 10;
    return Math.min(98, 58 + shared * 11 + sameGoal);
  };

  const matchPercent = computeScore(currentProfile);

  const triggerSwipe = (dir) => {
    if (!currentProfile || swipeDirection) return;
    setSwipeDirection(dir);
    setTimeout(() => {
      if (dir === 'right') {
        onSwipeRight(currentProfile);
      } else {
        onSwipeLeft(currentProfile);
      }
      setSwipeDirection(null);
      setDragOffset(0);
    }, 240);
  };

  // Unified Pointer / Touch Handlers for Desktop Mouse + Mobile Touch
  const handleStart = (clientX) => {
    if (swipeDirection) return;
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX) => {
    if (!isDragging || startX === null) return;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 85) {
      triggerSwipe('right');
    } else if (dragOffset < -85) {
      triggerSwipe('left');
    } else {
      setDragOffset(0);
    }
    setStartX(null);
  };

  const resetAllFilters = () => {
    setFacultyFilter('Semua');
    setMajorFilter('Semua');
    setBatchFilter('Semua');
    setGoalFilter('Semua');
    setInterestFilter('Semua');
  };

  const activeFilterCount = [
    facultyFilter !== 'Semua',
    majorFilter !== 'Semua',
    batchFilter !== 'Semua',
    goalFilter !== 'Semua',
    interestFilter !== 'Semua'
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col h-full bg-[#0A0A0E] text-white relative overflow-hidden px-4 pt-4 pb-2">
      {/* Minimal Floating Header */}
      <div className="flex items-center justify-between mb-3 z-20 px-1">
        <div className="flex items-center gap-2">
          <img
            src="/beemate-logo.png"
            alt="BeeMate"
            className="w-7 h-7 rounded-full object-contain bg-black border border-[#FF4D8D]"
          />
          <h1 className="font-display text-base font-extrabold tracking-tight">
            Explore <span className="text-[#FF4D8D]">Mate</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#15151E] border border-[#2A2A3A] text-[11px] font-bold text-[#FF85B3]">
            ♥ {dailyLikesLeft}
          </span>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
              activeFilterCount > 0
                ? 'bg-[#FF4D8D] text-[#0A0A0E] border-[#FF4D8D]'
                : 'bg-[#15151E] text-white border-[#2A2A3A] hover:border-[#FF4D8D]'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>
        </div>
      </div>

      {/* Filter Modal Drawer (FR-26) */}
      {showFilters && (
        <div className="absolute inset-x-4 top-16 z-40 bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-5 space-y-3.5 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white">Filter Pencarian</span>
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[11px] font-bold text-[#FF4D8D] hover:underline"
            >
              Reset Semua
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#1E1E2A] p-2.5 rounded-2xl border border-[#2A2A3A]">
              <label className="block text-[10px] font-bold text-[#9494A8]">Fakultas</label>
              <select
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                className="w-full text-xs bg-[#1E1E2A] text-white font-semibold mt-0.5 focus:outline-none"
              >
                {FACULTIES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div className="bg-[#1E1E2A] p-2.5 rounded-2xl border border-[#2A2A3A]">
              <label className="block text-[10px] font-bold text-[#9494A8]">Jurusan</label>
              <select
                value={majorFilter}
                onChange={(e) => setMajorFilter(e.target.value)}
                className="w-full text-xs bg-[#1E1E2A] text-white font-semibold mt-0.5 focus:outline-none"
              >
                {MAJORS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="bg-[#1E1E2A] p-2.5 rounded-2xl border border-[#2A2A3A]">
              <label className="block text-[10px] font-bold text-[#9494A8]">Angkatan</label>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="w-full text-xs bg-[#1E1E2A] text-white font-semibold mt-0.5 focus:outline-none"
              >
                {BATCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="bg-[#1E1E2A] p-2.5 rounded-2xl border border-[#2A2A3A]">
              <label className="block text-[10px] font-bold text-[#9494A8]">Tujuan</label>
              <select
                value={goalFilter}
                onChange={(e) => setGoalFilter(e.target.value)}
                className="w-full text-xs bg-[#1E1E2A] text-white font-semibold mt-0.5 focus:outline-none"
              >
                {GOALS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-[#1E1E2A] p-2.5 rounded-2xl border border-[#2A2A3A]">
            <label className="block text-[10px] font-bold text-[#9494A8]">Minat Bersama</label>
            <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="w-full text-xs bg-[#1E1E2A] text-white font-semibold mt-0.5 focus:outline-none"
            >
              <option value="Semua">Semua Minat</option>
              {INTERESTS_LIST.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(false)}
            className="w-full py-3 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-xs font-extrabold cursor-pointer"
          >
            Terapkan ({filteredProfiles.length} Profil)
          </button>
        </div>
      )}

      {/* Full-Bleed Swipe Card Stack (Directly Inspired by Reference Image Top-Left "Jessica Maple, 25" Card!) */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Background Next Card Stack Preview */}
        {nextProfilePreview && (
          <div className="absolute inset-x-3 inset-y-2 rounded-5xl bg-[#15151E] border border-[#2A2A3A] scale-95 opacity-50 pointer-events-none overflow-hidden">
            <img
              src={nextProfilePreview.avatar}
              alt=""
              className="w-full h-full object-cover blur-xs"
            />
          </div>
        )}

        {currentProfile ? (
          <div
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
            style={{
              transform:
                swipeDirection === 'right'
                  ? 'translateX(130%) rotate(16deg)'
                  : swipeDirection === 'left'
                  ? 'translateX(-130%) rotate(-16deg)'
                  : `translateX(${dragOffset}px) rotate(${dragOffset * 0.055}deg)`,
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
            className="relative w-full h-full rounded-5xl overflow-hidden border-2 border-[#2A2A3A] shadow-2xl select-none cursor-grab active:cursor-grabbing flex flex-col justify-between"
          >
            {/* Full-Bleed Portrait Photo */}
            <img
              src={currentProfile.avatar}
              alt={currentProfile.name}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Smooth Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-[#0A0A0E]/45 to-black/30 pointer-events-none" />

            {/* Top Card Header: Story Indicator Bars + Match % Pill & Report Button */}
            <div className="relative z-10 p-4 space-y-3">
              {/* Story Progress Dashes like Reference UI */}
              <div className="flex gap-1.5">
                <div className="h-1 flex-1 rounded-full bg-white" />
                <div className="h-1 flex-1 rounded-full bg-white/35" />
                <div className="h-1 flex-1 rounded-full bg-white/35" />
              </div>

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-[#FF85B3]">
                  🎯 {currentProfile.goal}
                </span>

                <div className="flex items-center gap-2">
                  {/* Reference UI "♡ 94%" Pill Badge */}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-xs font-extrabold shadow-lg">
                    <Heart size={12} className="fill-[#0A0A0E]" />
                    <span>{matchPercent}%</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenReportModal(currentProfile);
                    }}
                    title="Lapor atau Blokir"
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-rose-600 text-white/80 hover:text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer"
                  >
                    <Flag size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Swipe Stamps (MATCH / SKIP) */}
            {dragOffset > 45 && (
              <div className="absolute top-24 left-6 z-20 border-4 border-[#FF4D8D] bg-[#FF4D8D]/20 backdrop-blur-xs text-[#FF4D8D] font-display font-black text-2xl px-4 py-1 rounded-2xl -rotate-12 shadow-xl">
                MATCH ♥
              </div>
            )}
            {dragOffset < -45 && (
              <div className="absolute top-24 right-6 z-20 border-4 border-white/80 bg-black/50 backdrop-blur-xs text-white font-display font-black text-2xl px-4 py-1 rounded-2xl rotate-12 shadow-xl">
                NOPE ✕
              </div>
            )}

            {/* Bottom Content Overlay + Embedded X & Love Action Buttons (Like Reference UI!) */}
            <div className="relative z-10 p-5 space-y-3.5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">
                    {currentProfile.name}, &lsquo;{currentProfile.batch.slice(-2)}
                  </h2>
                  {currentProfile.verified && (
                    <BadgeCheck size={20} className="text-[#FF4D8D] fill-black shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#FF85B3] font-semibold">
                  <MapPin size={13} className="text-[#FF4D8D]" />
                  <span>{currentProfile.major} · {currentProfile.campus}</span>
                </div>
              </div>

              <p className="text-xs text-white/85 line-clamp-2 leading-relaxed">
                {currentProfile.bio}
              </p>

              {/* Interest Pill Bubbles */}
              <div className="flex flex-wrap gap-1.5">
                {currentProfile.interests.map((interest) => {
                  const isShared = user.interests.includes(interest);
                  return (
                    <span
                      key={interest}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        isShared
                          ? 'bg-[#FF4D8D] text-[#0A0A0E]'
                          : 'bg-white/15 text-white backdrop-blur-md border border-white/15'
                      }`}
                    >
                      {interest}
                    </span>
                  );
                })}
              </div>

              {/* Action Buttons Embedded Inside Bottom of Card (X on Left, Center Swipe Hint, Love on Right) */}
              <div className="pt-2 flex items-center justify-between px-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerSwipe('left');
                  }}
                  aria-label="Tidak Match (Geser Kiri)"
                  className="w-14 h-14 rounded-full bg-[#15151E]/90 hover:bg-white text-white hover:text-[#0A0A0E] border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition cursor-pointer"
                >
                  <X size={24} strokeWidth={2.5} />
                </button>

                <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">
                  Geser Kiri / Kanan
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerSwipe('right');
                  }}
                  aria-label="Match / Love (Geser Kanan)"
                  className="w-16 h-16 rounded-full bg-[#FF4D8D] hover:bg-[#FF85B3] text-[#0A0A0E] flex items-center justify-center shadow-2xl shadow-[#FF4D8D]/50 hover:scale-110 active:scale-95 transition cursor-pointer"
                >
                  <Heart size={28} className="fill-[#0A0A0E]" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Out of Profiles State (FR-28) */
          <div className="bg-[#15151E] border border-[#2A2A3A] p-7 rounded-5xl text-center space-y-4 max-w-xs">
            <div className="w-16 h-16 rounded-full bg-[#FF4D8D]/15 text-[#FF4D8D] flex items-center justify-center mx-auto">
              <Sparkles size={30} />
            </div>
            <h3 className="font-display text-lg font-extrabold text-white">
              Semua Profil Sudah Dilihat!
            </h3>
            <p className="text-xs text-[#9494A8] leading-relaxed">
              Ubah filter pencarianmu atau muat ulang kartu untuk menjelajahi teman Binusian lainnya.
            </p>
            <div className="space-y-2 pt-1">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="w-full py-3 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-xs font-extrabold cursor-pointer"
                >
                  Reset Filter ({activeFilterCount})
                </button>
              )}
              <button
                type="button"
                onClick={onResetSwipes}
                className="w-full py-3 rounded-full bg-[#1E1E2A] hover:bg-[#2A2A3A] text-white text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Ulangi Semua Kartu</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mutual Match Celebration Modal (FR-27) */}
      {newlyMatchedProfile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="bg-[#15151E] border-2 border-[#FF4D8D] rounded-5xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl shadow-[#FF4D8D]/20">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-xs font-extrabold -rotate-2">
              <Sparkles size={13} />
              <span>IT&apos;S A BEE-MATCH!</span>
            </span>

            <div className="flex items-center justify-center -space-x-4 py-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-3xl -rotate-6 object-cover border-3 border-white shadow-lg"
              />
              <img
                src={newlyMatchedProfile.avatar}
                alt={newlyMatchedProfile.name}
                className="w-20 h-20 rounded-3xl rotate-6 object-cover border-3 border-[#FF4D8D] shadow-lg"
              />
            </div>

            <div>
              <h3 className="font-display text-lg font-extrabold text-white">
                Kamu & {newlyMatchedProfile.name.split(' ')[0]} Match!
              </h3>
              <p className="text-xs text-[#9494A8] mt-1 leading-relaxed">
                Bangun streak chat 3 hari berturut-turut untuk membuka fitur Video Call 1-on-1.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => onOpenChatFromMatch(newlyMatchedProfile.id)}
                className="w-full py-3.5 rounded-full bg-[#FF4D8D] hover:bg-[#FF85B3] text-[#0A0A0E] text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D8D]/30 cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Kirim Pesan Sekarang</span>
              </button>
              <button
                type="button"
                onClick={onClearNewMatch}
                className="w-full py-3 rounded-full bg-[#1E1E2A] text-[#9494A8] hover:text-white text-xs font-bold cursor-pointer"
              >
                Lanjut Swipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
