import React, { useEffect, useRef, useState } from 'react';
import {
  SlidersHorizontal,
  ThumbsUp,
  Star,
  ArrowRight,
  BadgeCheck,
  Flag,
  MessageCircle,
  MapPin,
  GraduationCap,
  Target,
  BookOpen,
  Award,
  Users,
  Zap
} from 'lucide-react';
import {
  FACULTIES,
  FACULTY_MAJORS_MAP,
  MAJORS,
  BATCHES,
  GOALS,
  INTERESTS_LIST,
  calculateMatchScore,
  normalizeInterests,
  goalLabel
} from '../data/mockData';
import { Button, EmptyState, IconButton, SafeImage, Sheet, cx } from '../components/ui';

const SWIPE_THRESHOLD = 90;

export default function MatchingScreen({
  user,
  profiles,
  swipedIds,
  focusedProfileId,
  dailyLikesLeft,
  onSwipeLeft,
  onSwipeRight,
  onLikeProfile,
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
  const [detailProfile, setDetailProfile] = useState(null);

  // Profiles reviewed during this visit → drives the "x of y" stack indicator
  const [sessionReviewed, setSessionReviewed] = useState([]);

  // Drag state
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exitDir, setExitDir] = useState(null); // 'left' | 'right' | 'up'
  const startRef = useRef(null);
  const movedRef = useRef(false);

  const availableMajorsForFilter =
    facultyFilter === 'Semua' ? MAJORS : ['Semua', ...(FACULTY_MAJORS_MAP[facultyFilter] || [])];

  const handleFacultyFilterChange = (newFac) => {
    setFacultyFilter(newFac);
    if (newFac !== 'Semua') {
      const allowed = FACULTY_MAJORS_MAP[newFac] || [];
      if (majorFilter !== 'Semua' && !allowed.includes(majorFilter)) setMajorFilter('Semua');
    }
  };

  const matchesFilters = (p) =>
    (facultyFilter === 'Semua' || p.faculty === facultyFilter) &&
    (majorFilter === 'Semua' || p.major === majorFilter) &&
    (batchFilter === 'Semua' || p.batch === batchFilter) &&
    (goalFilter === 'Semua' || p.goal === goalFilter) &&
    (interestFilter === 'Semua' || normalizeInterests(p.interests).includes(interestFilter));

  // Rank by academic/interest compatibility (networking-first, not romantic)
  const ranked = profiles
    .filter(matchesFilters)
    .map((p) => ({ ...p, matchScore: calculateMatchScore(user, p) }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const remaining = ranked.filter((p) => !swipedIds.includes(p.id));
  const deck = focusedProfileId
    ? [...remaining.filter((p) => p.id === focusedProfileId), ...remaining.filter((p) => p.id !== focusedProfileId)]
    : remaining;

  const reviewedInDeck = ranked.filter((p) => sessionReviewed.includes(p.id)).length;
  const total = deck.length + reviewedInDeck;
  const position = reviewedInDeck + 1;

  const current = deck[0] || null;
  const behind = deck.slice(1, 3);

  const myInterests = normalizeInterests(user.interests);

  useEffect(() => {
    setDragX(0);
    setExitDir(null);
  }, [current?.id]);

  const commit = (dir) => {
    if (!current || exitDir) return;
    if (dir === 'right' && dailyLikesLeft <= 0) {
      onSwipeRight(current); // App shows the quota toast
      setDragX(0);
      return;
    }
    setExitDir(dir);
    const target = current;
    setTimeout(() => {
      setSessionReviewed((prev) => [...prev, target.id]);
      if (dir === 'right') onSwipeRight(target);
      else if (dir === 'up') onLikeProfile(target);
      else onSwipeLeft(target);
    }, 220);
  };

  const onPointerDown = (e) => {
    if (exitDir) return;
    startRef.current = e.clientX;
    movedRef.current = false;
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging || startRef.current === null) return;
    const dx = e.clientX - startRef.current;
    if (Math.abs(dx) > 6) movedRef.current = true;
    setDragX(dx);
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    startRef.current = null;
    if (dragX > SWIPE_THRESHOLD) commit('right');
    else if (dragX < -SWIPE_THRESHOLD) commit('left');
    else {
      setDragX(0);
      if (!movedRef.current && current) setDetailProfile(current);
    }
  };

  const resetAllFilters = () => {
    setFacultyFilter('Semua');
    setMajorFilter('Semua');
    setBatchFilter('Semua');
    setGoalFilter('Semua');
    setInterestFilter('Semua');
  };

  const activeFilterCount = [facultyFilter, majorFilter, batchFilter, goalFilter, interestFilter].filter(
    (v) => v !== 'Semua'
  ).length;

  const cardTransform =
    exitDir === 'right'
      ? 'translateX(140%) rotate(16deg)'
      : exitDir === 'left'
      ? 'translateX(-140%) rotate(-16deg)'
      : exitDir === 'up'
      ? 'translateY(-120%) scale(0.95)'
      : `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`;

  return (
    <div className="relative h-full flex flex-col bg-surface text-ink overflow-hidden">
      {/* Header */}
      <header className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-title text-ink">Discover</h1>
          <p className="text-caption text-ink-3 mt-0.5">Students who share your goals</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            title="Connection requests left today"
            className="h-10 px-3 rounded-full bg-card border border-line inline-flex items-center gap-1 text-caption font-semibold text-ink"
          >
            <Zap size={14} className="text-brand fill-brand" />
            {dailyLikesLeft}
          </span>
          <IconButton label="Filters" onClick={() => setShowFilters(true)} badge={activeFilterCount > 0}>
            <SlidersHorizontal size={17} strokeWidth={1.8} />
          </IconButton>
        </div>
      </header>

      {/* Card stack */}
      <div className="flex-1 min-h-0 relative flex flex-col items-center justify-center px-5 pt-2 pb-5">
        {current ? (
          <>
            <div className="relative w-[84%] flex-1 min-h-0 max-h-[480px]">
              {/* Peeking cards behind */}
              {behind.map((p, i) => (
                <div
                  key={p.id}
                  aria-hidden
                  className="absolute inset-y-6 inset-x-0 rounded-[32px] overflow-hidden bg-subtle shadow-card"
                  style={{
                    transform: `translateX(${i === 0 ? 26 : -26}px) rotate(${i === 0 ? 4 : -4}deg) scale(0.92)`,
                    zIndex: 1 - i
                  }}
                >
                  <SafeImage src={p.avatar} alt="" className="w-full h-full object-cover opacity-80" />
                </div>
              ))}

              {/* Active card */}
              <article
                key={current.id}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                style={{
                  transform: cardTransform,
                  transition: dragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  touchAction: 'pan-y'
                }}
                className="absolute inset-0 z-10 rounded-[32px] overflow-hidden bg-subtle shadow-float select-none cursor-grab active:cursor-grabbing"
                aria-label={`${current.name}, ${current.major}. Tap for details, swipe right to connect, left for next.`}
              >
                <SafeImage
                  src={current.avatar}
                  alt={current.name}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20 pointer-events-none" />

                {/* Top row */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span className="h-7 px-2.5 rounded-full bg-black/45 backdrop-blur text-[#fff] text-meta font-semibold inline-flex items-center gap-1">
                    <Target size={12} />
                    {current.matchScore}% match
                  </span>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenReportModal(current);
                    }}
                    aria-label="Report or block"
                    className="w-8 h-8 rounded-full bg-black/45 backdrop-blur text-[#fff] flex items-center justify-center cursor-pointer hover:bg-black/60"
                  >
                    <Flag size={13} />
                  </button>
                </div>

                {/* Swipe hint stamps */}
                {dragX > 40 && (
                  <span className="absolute top-16 left-5 rotate-[-10deg] px-3 py-1 rounded-xl border-2 border-brand text-brand text-caption font-bold bg-black/30">
                    CONNECT
                  </span>
                )}
                {dragX < -40 && (
                  <span className="absolute top-16 right-5 rotate-[10deg] px-3 py-1 rounded-xl border-2 border-[#fff] text-[#fff] text-caption font-bold bg-black/30">
                    NEXT
                  </span>
                )}

                {/* Bottom info */}
                <div className="absolute inset-x-0 bottom-0 px-5 pb-10 pt-6 text-center">
                  <StackIndicator position={position} total={total} />
                  <h2 className="mt-2.5 text-[22px] leading-7 font-semibold tracking-tight text-[#fff] inline-flex items-center gap-1.5">
                    {current.name}
                    {current.verified && <BadgeCheck size={18} className="text-sky-300" />}
                  </h2>
                  <p className="text-caption text-[#fff]/80 mt-1 inline-flex items-center justify-center gap-1.5 w-full">
                    <GraduationCap size={13} />
                    <span className="truncate">
                      Binus University · {current.major} ’{current.batch.slice(-2)}
                    </span>
                  </p>
                  <p className="text-caption text-[#fff]/70 mt-1.5 line-clamp-2">{current.bio}</p>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-2.5">
                    {normalizeInterests(current.interests)
                      .slice(0, 3)
                      .map((i) => {
                        const shared = myInterests.includes(i);
                        return (
                          <span
                            key={i}
                            className={cx(
                              'h-6 px-2.5 rounded-full text-meta font-medium inline-flex items-center',
                              shared ? 'bg-brand text-brand-on' : 'bg-white/15 text-[#fff] backdrop-blur'
                            )}
                          >
                            {i}
                          </span>
                        );
                      })}
                  </div>
                </div>
              </article>
            </div>

            {/* Actions (overlap the card's bottom edge, as in the reference) */}
            <div className="relative z-20 -mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => commit('up')}
                aria-label="Like profile"
                title="Like"
                className="w-14 h-14 rounded-full bg-ink text-card flex items-center justify-center shadow-float hover:scale-105 transition cursor-pointer"
              >
                <ThumbsUp size={20} />
              </button>
              <button
                type="button"
                onClick={() => commit('right')}
                aria-label="Send connection request"
                className="h-14 px-6 rounded-full bg-brand text-brand-on inline-flex items-center gap-2 font-semibold text-body shadow-float hover:brightness-105 transition cursor-pointer"
              >
                <Star size={18} className="fill-brand-on" />
                Connect
              </button>
              <button
                type="button"
                onClick={() => commit('left')}
                aria-label="Next profile"
                title="Next"
                className="w-14 h-14 rounded-full bg-ink text-card flex items-center justify-center shadow-float hover:scale-105 transition cursor-pointer"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </>
        ) : (
          <EmptyState
            className="w-full"
            icon={Users}
            title="You're all caught up"
            text={
              activeFilterCount
                ? 'No more students match these filters.'
                : 'You have reviewed every suggested student for now.'
            }
            actionLabel={activeFilterCount ? `Clear filters (${activeFilterCount})` : 'Show profiles again'}
            onAction={() => {
              if (activeFilterCount) resetAllFilters();
              else {
                setSessionReviewed([]);
                onResetSwipes();
              }
            }}
          />
        )}
      </div>

      {/* Profile details */}
      <Sheet open={Boolean(detailProfile)} onClose={() => setDetailProfile(null)} title="Profile">
        {detailProfile && (
          <ProfileDetail
            profile={detailProfile}
            myInterests={myInterests}
            onReport={() => {
              setDetailProfile(null);
              onOpenReportModal(detailProfile);
            }}
            onConnect={() => {
              setDetailProfile(null);
              commit('right');
            }}
            onLike={() => {
              setDetailProfile(null);
              commit('up');
            }}
          />
        )}
      </Sheet>

      {/* Filters */}
      <Sheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filters"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={resetAllFilters}>
              Reset
            </Button>
            <Button className="flex-[2]" onClick={() => setShowFilters(false)}>
              Show {remaining.length} {remaining.length === 1 ? 'student' : 'students'}
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <FilterSelect label="Faculty" value={facultyFilter} onChange={handleFacultyFilterChange} options={FACULTIES} />
          <FilterSelect label="Major" value={majorFilter} onChange={setMajorFilter} options={availableMajorsForFilter} />
          <div className="grid grid-cols-2 gap-3">
            <FilterSelect label="Batch" value={batchFilter} onChange={setBatchFilter} options={BATCHES} />
            <FilterSelect
              label="Looking for"
              value={goalFilter}
              onChange={setGoalFilter}
              options={GOALS}
              format={goalLabel}
            />
          </div>
          <FilterSelect
            label="Interest"
            value={interestFilter}
            onChange={setInterestFilter}
            options={['Semua', ...INTERESTS_LIST]}
          />
        </div>
      </Sheet>

      {/* New connection */}
      {newlyMatchedProfile && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-xs bg-card rounded-[28px] p-6 text-center shadow-float animate-pop-in">
            <div className="flex justify-center -space-x-4 mb-4">
              <SafeImage src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-card" />
              <SafeImage
                src={newlyMatchedProfile.avatar}
                alt={newlyMatchedProfile.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-card"
              />
            </div>
            <p className="text-meta font-semibold text-brand-ink uppercase tracking-wide">New connection</p>
            <h3 className="text-title text-ink mt-1">You and {newlyMatchedProfile.name.split(' ')[0]} are connected</h3>
            <p className="text-caption text-ink-3 mt-2">
              Chat 3 days in a row to unlock 1-on-1 video calls.
            </p>
            <div className="mt-5 space-y-2">
              <Button size="lg" className="w-full" onClick={() => onOpenChatFromMatch(newlyMatchedProfile.id)}>
                <MessageCircle size={17} /> Send a message
              </Button>
              <Button variant="ghost" className="w-full" onClick={onClearNewMatch}>
                Keep discovering
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StackIndicator({ position, total }) {
  if (total <= 1) return null;
  if (total <= 8) {
    return (
      <div className="flex items-center justify-center gap-1.5" aria-label={`Profile ${position} of ${total}`}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cx(
              'h-1.5 rounded-full transition-all',
              i === position - 1 ? 'w-5 bg-[#fff]' : i < position - 1 ? 'w-1.5 bg-white/70' : 'w-1.5 bg-white/35'
            )}
          />
        ))}
      </div>
    );
  }
  return (
    <span className="text-meta font-medium text-[#fff]/80">
      {position} / {total}
    </span>
  );
}

function ProfileDetail({ profile, myInterests, onReport, onConnect, onLike }) {
  const interests = normalizeInterests(profile.interests);
  return (
    <div>
      <SafeImage src={profile.avatar} alt={profile.name} className="w-full h-56 rounded-2xl object-cover" />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-title text-ink inline-flex items-center gap-1.5">
            {profile.name}
            {profile.verified && <BadgeCheck size={18} className="text-sky-500" />}
          </h4>
          <p className="text-caption text-ink-2 mt-0.5">
            {profile.major} · Binusian ’{profile.batch.slice(-2)}
          </p>
          <p className="text-caption text-ink-3 mt-0.5 inline-flex items-center gap-1">
            <MapPin size={12} /> {profile.campus}
          </p>
        </div>
        <span className="h-7 px-2.5 rounded-full bg-brand-soft text-brand-ink text-meta font-semibold inline-flex items-center shrink-0">
          {profile.matchScore ?? ''}% match
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-line divide-y divide-line">
        <InfoRow icon={Target} label="Looking for" value={goalLabel(profile.goal)} />
        <InfoRow icon={BookOpen} label={profile.promptQuestion} value={profile.promptAnswer} />
        {profile.portfolioTag && <InfoRow icon={Award} label="Highlights" value={profile.portfolioTag} />}
      </div>

      <p className="text-body text-ink-2 mt-4">{profile.bio}</p>

      <p className="text-caption font-semibold text-ink mt-4 mb-2">Interests</p>
      <div className="flex flex-wrap gap-1.5">
        {interests.map((i) => {
          const shared = myInterests.includes(i);
          return (
            <span
              key={i}
              className={cx(
                'h-7 px-3 rounded-full text-caption border inline-flex items-center',
                shared ? 'border-brand bg-brand-soft text-brand-ink font-medium' : 'border-line text-ink-2'
              )}
            >
              {i}
            </span>
          );
        })}
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onLike}>
          <ThumbsUp size={15} /> Like
        </Button>
        <Button className="flex-[1.6]" onClick={onConnect}>
          <Star size={15} /> Connect
        </Button>
      </div>
      <button
        type="button"
        onClick={onReport}
        className="w-full mt-3 py-2 text-caption text-ink-3 hover:text-danger inline-flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Flag size={13} /> Report or block
      </button>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 px-3.5 py-3">
      <Icon size={16} className="text-ink-3 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-meta text-ink-3">{label}</p>
        <p className="text-caption text-ink font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, format = (v) => (v === 'Semua' ? 'All' : v) }) {
  return (
    <label className="block">
      <span className="text-meta font-medium text-ink-3">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-11 px-3 rounded-xl bg-subtle border border-line text-body text-ink focus:outline-none focus:border-brand cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {format(o)}
          </option>
        ))}
      </select>
    </label>
  );
}
