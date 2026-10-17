import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  Heart,
  BadgeCheck,
  Flag,
  Target,
  Sparkles,
  RotateCcw,
  MessageSquare,
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

  // Swipe drag/animation state
  const [dragOffset, setDragOffset] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null); // 'left' | 'right'

  // Filter & sort profiles according to Section 8 & FR-26
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

  const sharedInterests = currentProfile
    ? currentProfile.interests.filter((i) => user.interests.includes(i))
    : [];

  const triggerSwipe = (dir) => {
    if (!currentProfile) return;
    setSwipeDirection(dir);
    setTimeout(() => {
      if (dir === 'right') {
        onSwipeRight(currentProfile);
      } else {
        onSwipeLeft(currentProfile);
      }
      setSwipeDirection(null);
      setDragOffset(0);
    }, 220);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    const diff = e.touches[0].clientX - touchStartX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (dragOffset > 75) {
      triggerSwipe('right');
    } else if (dragOffset < -75) {
      triggerSwipe('left');
    } else {
      setDragOffset(0);
    }
    setTouchStartX(null);
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
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Top Header & Filter Button (FR-26) */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 z-10">
        <div>
          <h1 className="text-sm font-extrabold text-slate-900">Matching Partner</h1>
          <p className="text-[11px] text-slate-500">
            Sisa kuota suka hari ini: <strong className="text-binus-blue">{dailyLikesLeft}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
            activeFilterCount > 0
              ? 'bg-binus-blue text-white border-binus-blue'
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          }`}
        >
          <SlidersHorizontal size={14} />
          <span>Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
        </button>
      </div>

      {/* Filter Drawer (FR-26: Fakultas, Jurusan, Angkatan, Minat, Tujuan) */}
      {showFilters && (
        <div className="bg-white border-b border-slate-200 p-4 space-y-3 shadow-lg z-20 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800">
              Filter Pencarian Partner (FR-26)
            </span>
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[11px] font-bold text-binus-blue hover:underline"
            >
              Atur Ulang Filter
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                Fakultas
              </label>
              <select
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
              >
                {FACULTIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                Jurusan
              </label>
              <select
                value={majorFilter}
                onChange={(e) => setMajorFilter(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
              >
                {MAJORS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                Angkatan
              </label>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
              >
                {BATCHES.map((b) => (
                  <option key={b} value={b}>
                    {b === 'Semua' ? 'Semua Angkatan' : `Binusian ${b}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                Tujuan Networking
              </label>
              <select
                value={goalFilter}
                onChange={(e) => setGoalFilter(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
              >
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
              Minat / Keahlian Spesifik
            </label>
            <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50"
            >
              <option value="Semua">Semua Minat</option>
              {INTERESTS_LIST.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(false)}
            className="w-full py-2 rounded-xl bg-binus-blue text-white text-xs font-bold"
          >
            Terapkan ({filteredProfiles.length} Profil Ditemukan)
          </button>
        </div>
      )}

      {/* Main Card Area (FR-24, FR-25, FR-28, FR-29) */}
      <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
        {currentProfile ? (
          <>
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                transform:
                  swipeDirection === 'right'
                    ? 'translateX(120%) rotate(12deg)'
                    : swipeDirection === 'left'
                    ? 'translateX(-120%) rotate(-12deg)'
                    : `translateX(${dragOffset}px) rotate(${dragOffset * 0.04}deg)`
              }}
              className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex-1 flex flex-col justify-between transition-transform duration-200 select-none"
            >
              {/* Photo & Top Overlay */}
              <div className="relative h-60 bg-slate-200 shrink-0">
                <img
                  src={currentProfile.avatar}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Top Badges: Goal & Report/Block Button (FR-29) */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                    <Target size={12} />
                    <span>{currentProfile.goal}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpenReportModal(currentProfile)}
                    title="Lapor atau Blokir Profil (FR-29)"
                    aria-label="Lapor atau Blokir"
                    className="p-2 rounded-full bg-slate-900/60 hover:bg-rose-600 text-white backdrop-blur-xs transition cursor-pointer"
                  >
                    <Flag size={14} />
                  </button>
                </div>

                {/* Swipe Stamp Feedback */}
                {dragOffset > 40 && (
                  <div className="absolute top-14 left-4 border-4 border-emerald-400 text-emerald-400 font-black text-lg px-3 py-0.5 rounded-xl -rotate-12">
                    COCOK!
                  </div>
                )}
                {dragOffset < -40 && (
                  <div className="absolute top-14 right-4 border-4 border-rose-400 text-rose-400 font-black text-lg px-3 py-0.5 rounded-xl rotate-12">
                    LEWATI
                  </div>
                )}

                {/* Bottom Name & Major on Photo (FR-25) */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-lg font-extrabold">{currentProfile.name}</h2>
                    {currentProfile.verified && (
                      <BadgeCheck
                        size={18}
                        className="text-amber-300 fill-binus-blue shrink-0"
                        title="Mahasiswa Terverifikasi Binus (FR-39)"
                      />
                    )}
                  </div>
                  <p className="text-xs text-blue-100 font-medium">
                    {currentProfile.major} · Angkatan {currentProfile.batch}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-0.5">
                    <MapPin size={11} />
                    <span>Kampus {currentProfile.campus}</span>
                  </div>
                </div>
              </div>

              {/* Card Details: Bio, Shared Interests, Icebreaker Prompt (FR-25) */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentProfile.bio}
                  </p>

                  {/* Shared Interests Highlight (FR-25) */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Minat & Keahlian ({sharedInterests.length} Minat Bersama):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentProfile.interests.map((interest) => {
                        const isShared = user.interests.includes(interest);
                        return (
                          <span
                            key={interest}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                              isShared
                                ? 'bg-blue-50 text-binus-blue border border-blue-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isShared ? `★ ${interest} (Sama)` : interest}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Profile Prompt (Section 10 Medium Priority) */}
                {currentProfile.promptQuestion && (
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-binus-blue block">
                      {currentProfile.promptQuestion}
                    </span>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                      &ldquo;{currentProfile.promptAnswer}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Swipe Action Buttons (FR-24: Geser kiri/kanan atau tombol alternatif) */}
            <div className="pt-3 flex items-center justify-center gap-5 shrink-0">
              <button
                type="button"
                onClick={() => triggerSwipe('left')}
                aria-label="Lewati Profil (Geser Kiri)"
                className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 hover:border-rose-400 text-rose-500 flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer"
              >
                <X size={26} strokeWidth={2.5} />
              </button>

              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 block">
                  Geser Kartu atau Tap
                </span>
                <span className="text-[11px] font-extrabold text-slate-600">
                  {filteredProfiles.length} Profil Tersisa
                </span>
              </div>

              <button
                type="button"
                onClick={() => triggerSwipe('right')}
                aria-label="Suka / Ajak Kolaborasi (Geser Kanan)"
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-binus-blue to-[#0070CC] text-white flex items-center justify-center shadow-lg shadow-binus-blue/30 hover:scale-105 transition cursor-pointer"
              >
                <Heart size={25} className="fill-white" />
              </button>
            </div>
          </>
        ) : (
          /* FR-28: Out of profiles state with suggestion to adjust filters */
          <div className="my-auto bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-binus-blue flex items-center justify-center mx-auto">
              <Sparkles size={28} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Profil Habis Ditampilkan (FR-28)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kamu sudah melihat semua mahasiswa yang sesuai dengan filter saat ini. Coba ubah filter fakultas, jurusan, atau tujuan untuk menemukan teman baru!
            </p>
            <div className="flex flex-col gap-2 pt-2">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="w-full py-2.5 rounded-xl bg-binus-blue text-white text-xs font-bold"
                >
                  Ubah / Reset Filter ({activeFilterCount} Aktif)
                </button>
              )}
              <button
                type="button"
                onClick={onResetSwipes}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>Muat Ulang Semua Profil Demo</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FR-27: Mutual Match Modal with "Kirim Pesan" button */}
      {newlyMatchedProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl border border-amber-300">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold">
              <Sparkles size={14} className="text-binus-orange" />
              <span>IT&apos;S A BEE-MATCH! (FR-27)</span>
            </div>

            <div className="flex items-center justify-center -space-x-3 py-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
              <img
                src={newlyMatchedProfile.avatar}
                alt={newlyMatchedProfile.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-400 shadow-md"
              />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Kamu & {newlyMatchedProfile.name} Saling Tertarik!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kalian sama-sama ingin <strong>{newlyMatchedProfile.goal}</strong>. Mulai ngobrol selama 3 hari berturut-turut untuk membuka fitur Video Call!
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => onOpenChatFromMatch(newlyMatchedProfile.id)}
                className="w-full py-3 rounded-xl bg-binus-blue hover:bg-[#00427A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <MessageSquare size={15} />
                <span>Kirim Pesan Sekarang</span>
              </button>
              <button
                type="button"
                onClick={onClearNewMatch}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
              >
                Lanjut Jelajah Profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
