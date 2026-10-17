import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  X,
  Zap,
  BadgeCheck,
  Flag,
  RotateCcw,
  MessageCircle,
  MapPin,
  BookOpen,
  Award,
  GraduationCap,
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  FACULTIES,
  FACULTY_MAJORS_MAP,
  MAJORS,
  BATCHES,
  GOALS,
  INTERESTS_LIST,
  calculateMatchScore
} from '../data/mockData';

export default function MatchingScreen({
  user,
  profiles,
  swipedIds,
  focusedProfileId,
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

  // 3 Interactive Card Slides: 0 = Profil & Bio, 1 = Prompt Akademik & Portofolio, 2 = Irisan Skill & Kampus
  const [activeSlide, setActiveSlide] = useState(0);

  // Pointer & Touch Drag state
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null); // 'left' | 'right'

  const availableMajorsForFilter =
    facultyFilter === 'Semua'
      ? MAJORS
      : ['Semua', ...(FACULTY_MAJORS_MAP[facultyFilter] || [])];

  const handleFacultyFilterChange = (newFac) => {
    setFacultyFilter(newFac);
    if (newFac !== 'Semua') {
      const allowed = FACULTY_MAJORS_MAP[newFac] || [];
      if (majorFilter !== 'Semua' && !allowed.includes(majorFilter)) {
        setMajorFilter('Semua');
      }
    }
  };

  const baseFiltered = profiles
    .filter((p) => !swipedIds.includes(p.id))
    .filter((p) => (facultyFilter === 'Semua' ? true : p.faculty === facultyFilter))
    .filter((p) => (majorFilter === 'Semua' ? true : p.major === majorFilter))
    .filter((p) => (batchFilter === 'Semua' ? true : p.batch === batchFilter))
    .filter((p) => (goalFilter === 'Semua' ? true : p.goal === goalFilter))
    .filter((p) =>
      interestFilter === 'Semua' ? true : p.interests.includes(interestFilter)
    );

  // If user clicked a profile from HomeScreen, prioritize that profile on top of the deck
  const filteredProfiles = focusedProfileId
    ? [
        ...baseFiltered.filter((p) => p.id === focusedProfileId),
        ...baseFiltered.filter((p) => p.id !== focusedProfileId)
      ]
    : baseFiltered;

  const currentProfile = filteredProfiles[0] || null;
  const nextProfilePreview = filteredProfiles[1] || null;

  // Reset slide to 0 when profile changes
  useEffect(() => {
    setActiveSlide(0);
  }, [currentProfile?.id]);

  // Unified Match Score
  const matchPercent = calculateMatchScore(user, currentProfile);

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
      setActiveSlide(0);
    }, 240);
  };

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
    <div className="flex flex-col h-full bg-[#0F1115] text-white relative overflow-hidden px-4 pt-4 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 z-20 px-1">
        <div className="flex items-center gap-2">
          <img
            src="/beemate-logo.png"
            alt="BeeMate"
            className="w-7 h-7 rounded-full object-contain bg-[#181B22] border border-[#F59E0B]"
          />
          <h1 className="font-display text-base font-extrabold tracking-tight">
            Explore <span className="text-[#F59E0B]">Kolaborator</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span
            title="Sisa kuota ajakan kolaborasi hari ini"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#181B22] border border-[#2E3440] text-xs font-extrabold text-[#F59E0B]"
          >
            <Zap size={12} className="fill-[#F59E0B]" />
            <span>{dailyLikesLeft}</span>
          </span>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 border transition cursor-pointer ${
              activeFilterCount > 0
                ? 'bg-[#F59E0B] text-[#0F1115] border-[#F59E0B]'
                : 'bg-[#181B22] text-white border-[#2E3440] hover:border-[#F59E0B]'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>
        </div>
      </div>

      {/* Filter Modal Drawer (Linked Faculty -> Major) */}
      {showFilters && (
        <div className="absolute inset-x-4 top-16 z-40 bg-[#181B22] border border-[#2E3440] rounded-4xl p-5 space-y-3.5 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white">Filter Kolaborator Akademik</span>
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs font-bold text-[#F59E0B] hover:underline cursor-pointer"
            >
              Reset Semua
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#222631] p-2.5 rounded-2xl border border-[#2E3440]">
              <label className="block text-[11px] font-bold text-[#38BDF8]">Fakultas</label>
              <select
                value={facultyFilter}
                onChange={(e) => handleFacultyFilterChange(e.target.value)}
                className="w-full text-xs bg-[#222631] text-white font-semibold mt-0.5 focus:outline-none"
              >
                {FACULTIES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div className="bg-[#222631] p-2.5 rounded-2xl border border-[#2E3440]">
              <label className="block text-[11px] font-bold text-[#38BDF8]">Jurusan</label>
              <select
                value={majorFilter}
                onChange={(e) => setMajorFilter(e.target.value)}
                className="w-full text-xs bg-[#222631] text-white font-semibold mt-0.5 focus:outline-none"
              >
                {availableMajorsForFilter.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="bg-[#222631] p-2.5 rounded-2xl border border-[#2E3440]">
              <label className="block text-[11px] font-bold text-[#38BDF8]">Angkatan</label>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="w-full text-xs bg-[#222631] text-white font-semibold mt-0.5 focus:outline-none"
              >
                {BATCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="bg-[#222631] p-2.5 rounded-2xl border border-[#2E3440]">
              <label className="block text-[11px] font-bold text-[#94A3B8]">Tujuan</label>
              <select
                value={goalFilter}
                onChange={(e) => setGoalFilter(e.target.value)}
                className="w-full text-xs bg-[#222631] text-white font-semibold mt-0.5 focus:outline-none"
              >
                {GOALS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-[#222631] p-2.5 rounded-2xl border border-[#2E3440]">
            <label className="block text-[11px] font-bold text-[#94A3B8]">Keahlian / Minat</label>
            <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="w-full text-xs bg-[#222631] text-white font-semibold mt-0.5 focus:outline-none"
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
            className="w-full py-3 rounded-full bg-[#F59E0B] text-[#0F1115] text-xs font-extrabold cursor-pointer"
          >
            Terapkan ({filteredProfiles.length} Profil)
          </button>
        </div>
      )}

      {/* Structured Campus Collaboration Swipe Card */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {nextProfilePreview && (
          <div className="absolute inset-x-3 inset-y-2 rounded-5xl bg-[#181B22] border border-[#2E3440] scale-95 opacity-45 pointer-events-none overflow-hidden" />
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
                  ? 'translateX(130%) rotate(14deg)'
                  : swipeDirection === 'left'
                  ? 'translateX(-130%) rotate(-14deg)'
                  : `translateX(${dragOffset}px) rotate(${dragOffset * 0.045}deg)`,
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
            className="relative w-full h-full rounded-4xl overflow-hidden bg-[#181B22] border-2 border-[#2E3440] shadow-2xl select-none cursor-grab active:cursor-grabbing flex flex-col justify-between"
          >
            {/* Top 50% Portrait + Academic Verification Badges */}
            <div className="relative h-[48%] w-full shrink-0 overflow-hidden bg-[#0F1115]">
              <img
                src={currentProfile.avatar}
                alt={currentProfile.name}
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181B22] via-black/25 to-black/50 pointer-events-none" />

              {/* Top Interactive 3-Slide Bars + Match Score + Report */}
              <div className="absolute top-0 inset-x-0 p-4 space-y-2.5 z-20">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide(idx);
                      }}
                      aria-label={`Slide ${idx + 1}`}
                      className={`h-1.5 flex-1 rounded-full transition cursor-pointer ${
                        activeSlide === idx ? 'bg-[#F59E0B]' : 'bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  {/* Academic Blue Campus Pill */}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#38BDF8]/50 text-xs font-bold text-[#38BDF8]">
                    <MapPin size={12} />
                    <span>{currentProfile.campus}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Match % Pill — Amber with --on-primary */}
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F59E0B] text-[#0F1115] text-xs font-extrabold shadow-lg">
                      <Target size={13} />
                      <span>{matchPercent}% Cocok</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenReportModal(currentProfile);
                      }}
                      title="Lapor atau Blokir"
                      className="w-8 h-8 rounded-full bg-black/65 hover:bg-rose-600 text-white/85 hover:text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer"
                    >
                      <Flag size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Slide Navigation Tap Zones on Photo */}
              <div className="absolute inset-x-0 bottom-2 px-4 flex items-end justify-between z-10">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-display text-xl font-extrabold text-white tracking-tight">
                      {currentProfile.name}
                    </h2>
                    {currentProfile.verified && (
                      <BadgeCheck
                        size={19}
                        className="text-[#38BDF8] fill-[#0F1115] shrink-0"
                        title="Verified Binusian"
                      />
                    )}
                  </div>
                  {/* Academic Blue Faculty / Major / Batch */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-bold">
                      {currentProfile.major}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#222631] border border-[#38BDF8]/30 text-[#38BDF8] text-xs font-bold">
                      Binusian &lsquo;{currentProfile.batch.slice(-2)}
                    </span>
                  </div>
                </div>

                {/* Slide Switcher Pill */}
                <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md border border-white/15 rounded-full p-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide((s) => (s > 0 ? s - 1 : 2));
                    }}
                    className="p-1 text-white/80 hover:text-white cursor-pointer"
                    aria-label="Slide sebelumnya"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[11px] font-bold text-[#F59E0B] px-1">
                    {activeSlide + 1}/3
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide((s) => (s < 2 ? s + 1 : 0));
                    }}
                    className="p-1 text-white/80 hover:text-white cursor-pointer"
                    aria-label="Slide berikutnya"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Swipe Stamps (KOLAB ⚡ / LEWATI) */}
            {dragOffset > 45 && (
              <div className="absolute top-20 left-6 z-30 border-4 border-[#F59E0B] bg-[#F59E0B] text-[#0F1115] font-display font-black text-xl px-4 py-1 rounded-2xl shadow-xl">
                AJAK KOLAB ⚡
              </div>
            )}
            {dragOffset < -45 && (
              <div className="absolute top-20 right-6 z-30 border-4 border-white/80 bg-black/80 text-white font-display font-black text-xl px-4 py-1 rounded-2xl shadow-xl">
                LEWATI ✕
              </div>
            )}

            {/* Bottom 52% Structured Academic Panel */}
            <div className="flex-1 p-4 flex flex-col justify-between bg-[#181B22] overflow-y-auto no-scrollbar">
              {activeSlide === 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-xs font-bold text-[#F59E0B]">
                      <Target size={13} />
                      <span>{currentProfile.goal}</span>
                    </span>
                    <span className="text-[11px] text-[#38BDF8] font-semibold">
                      {currentProfile.faculty}
                    </span>
                  </div>

                  {/* Prompt Akademik Highlight Card (Previously hidden in mockData!) */}
                  <div className="p-3 rounded-2xl bg-[#0F1115] border border-[#2E3440] space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#38BDF8] uppercase tracking-wider">
                      <BookOpen size={12} />
                      <span>{currentProfile.promptQuestion}</span>
                    </div>
                    <p className="text-xs font-extrabold text-white leading-snug">
                      &ldquo;{currentProfile.promptAnswer}&rdquo;
                    </p>
                  </div>

                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {currentProfile.bio}
                  </p>
                </div>
              )}

              {activeSlide === 1 && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#0F1115] border border-[#38BDF8]/40 space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#38BDF8]">
                      <BookOpen size={14} />
                      <span>Fokus & Topik Akademik</span>
                    </span>
                    <p className="text-xs text-white/90 font-semibold leading-relaxed">
                      {currentProfile.promptQuestion}: &ldquo;{currentProfile.promptAnswer}&rdquo;
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#222631] border border-[#2E3440] space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F59E0B]">
                      <Award size={14} />
                      <span>Rekam Jejak & Organisasi</span>
                    </span>
                    <p className="text-xs text-white font-semibold">
                      {currentProfile.portfolioTag || 'Aktif dalam proyek kolaborasi lintas jurusan Binusian'}
                    </p>
                  </div>
                </div>
              )}

              {activeSlide === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#94A3B8]">Irisan Keahlian & Minat:</span>
                    <span className="font-bold text-[#38BDF8]">
                      <GraduationCap size={13} className="inline mr-1" />
                      {currentProfile.campus}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {currentProfile.interests.map((interest) => {
                      const isShared = user.interests.includes(interest);
                      return (
                        <span
                          key={interest}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isShared
                              ? 'bg-[#F59E0B] text-[#0F1115]'
                              : 'bg-[#222631] text-white border border-[#2E3440]'
                          }`}
                        >
                          {interest} {isShared ? '✓' : ''}
                        </span>
                      );
                    })}
                  </div>

                  <p className="text-xs text-[#94A3B8]">
                    Tap bar di atas kartu untuk melihat bio dan fokus topik akademik {currentProfile.name.split(' ')[0]}.
                  </p>
                </div>
              )}

              {/* Bottom Action Dock: Skip (Left) & Ajak Kolab (Right — Amber + --on-primary) */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#2E3440]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerSwipe('left');
                  }}
                  aria-label="Lewati Profil (Geser Kiri)"
                  className="py-2.5 px-4 rounded-full bg-[#222631] hover:bg-[#2E3440] text-white border border-[#2E3440] flex items-center justify-center gap-1.5 text-xs font-bold transition cursor-pointer"
                >
                  <X size={17} strokeWidth={2.5} />
                  <span>Lewati</span>
                </button>

                <div className="flex gap-1">
                  {[0, 1, 2].map((dot) => (
                    <button
                      key={dot}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide(dot);
                      }}
                      className={`w-2 h-2 rounded-full transition cursor-pointer ${
                        activeSlide === dot ? 'bg-[#F59E0B] w-4' : 'bg-[#2E3440]'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerSwipe('right');
                  }}
                  aria-label="Ajak Kolaborasi (Geser Kanan)"
                  className="py-2.5 px-5 rounded-full bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0F1115] flex items-center justify-center gap-1.5 text-xs font-extrabold shadow-lg shadow-[#F59E0B]/25 transition cursor-pointer"
                >
                  <Zap size={16} className="fill-[#0F1115]" />
                  <span>Ajak Kolab</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Out of Profiles State */
          <div className="bg-[#181B22] border border-[#2E3440] p-7 rounded-4xl text-center space-y-4 max-w-xs">
            <div className="w-16 h-16 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center mx-auto">
              <Zap size={30} />
            </div>
            <h3 className="font-display text-lg font-extrabold text-white">
              Semua Profil Sudah Ditinjau
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Ubah filter pencarian fakultas/tujuan atau muat ulang daftar kolaborator Binusian.
            </p>
            <div className="space-y-2 pt-1">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="w-full py-3 rounded-full bg-[#F59E0B] text-[#0F1115] text-xs font-extrabold cursor-pointer"
                >
                  Reset Filter ({activeFilterCount})
                </button>
              )}
              <button
                type="button"
                onClick={onResetSwipes}
                className="w-full py-3 rounded-full bg-[#222631] hover:bg-[#2E3440] text-white text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Tampilkan Ulang Kartu</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mutual Collaboration Match Modal */}
      {newlyMatchedProfile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="bg-[#181B22] border-2 border-[#F59E0B] rounded-4xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#F59E0B] text-[#0F1115] text-xs font-extrabold">
              <Zap size={13} className="fill-[#0F1115]" />
              <span>KONEKSI KOLABORASI BARU!</span>
            </span>

            <div className="flex items-center justify-center -space-x-3 py-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-3xl object-cover border-2 border-white shadow-lg"
              />
              <img
                src={newlyMatchedProfile.avatar}
                alt={newlyMatchedProfile.name}
                className="w-20 h-20 rounded-3xl object-cover border-2 border-[#F59E0B] shadow-lg"
              />
            </div>

            <div>
              <h3 className="font-display text-lg font-extrabold text-white">
                Terhubung dengan {newlyMatchedProfile.name.split(' ')[0]}!
              </h3>
              <p className="text-xs text-[#38BDF8] font-bold mt-0.5">
                {newlyMatchedProfile.major} · Binusian &lsquo;{newlyMatchedProfile.batch.slice(-2)}
              </p>
              <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                Saling berkirim pesan selama 3 hari berturut-turut untuk membuka fitur Video Call diskusi 1-on-1.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => onOpenChatFromMatch(newlyMatchedProfile.id)}
                className="w-full py-3.5 rounded-full bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0F1115] text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#F59E0B]/25 cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Mulai Diskusi Sekarang</span>
              </button>
              <button
                type="button"
                onClick={onClearNewMatch}
                className="w-full py-3 rounded-full bg-[#222631] text-[#94A3B8] hover:text-white text-xs font-bold cursor-pointer"
              >
                Lanjut Explore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
