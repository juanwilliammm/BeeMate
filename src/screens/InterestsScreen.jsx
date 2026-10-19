import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  INTEREST_OPTIONS,
  MIN_INTERESTS,
  normalizeInterests
} from '../data/mockData';

export default function InterestsScreen({ user, onUpdateUser, onBack, onContinue }) {
  const [selectedInterests, setSelectedInterests] = useState(() =>
    normalizeInterests(user.interests)
  );

  useEffect(() => {
    setSelectedInterests(normalizeInterests(user.interests));
  }, [user.interests]);

  const toggleInterest = (label) => {
    const next = selectedInterests.includes(label)
      ? selectedInterests.filter((i) => i !== label)
      : [...selectedInterests, label];
    setSelectedInterests(next);
    // Preserve immediately in user state so navigating back & returning keeps selection
    onUpdateUser({ interests: next });
  };

  const canContinue = selectedInterests.length >= MIN_INTERESTS;

  const handleContinue = () => {
    if (!canContinue) return;
    onUpdateUser({ interests: selectedInterests });
    onContinue?.();
  };

  return (
    <div className="flex flex-col h-full bg-surface text-ink">
      {/* Top Bar */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-full flex items-center justify-center text-ink hover:bg-subtle transition cursor-pointer"
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <span className="text-meta text-ink-3 font-medium">
          {selectedInterests.length} selected
        </span>
      </div>

      {/* Scrollable Pill Tag Cloud */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-2 pb-6">
        <div className="text-center max-w-xs mx-auto mb-6">
          <h1 className="text-title text-ink font-semibold">
            Let’s select your interests.
          </h1>
          <p className="text-caption text-ink-3 mt-1.5">
            Please select two or more to proceed.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {INTEREST_OPTIONS.map(({ label, icon }) => {
            const selected = selectedInterests.includes(label);
            return (
              <button
                key={label}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleInterest(label)}
                className={`h-10 px-4 rounded-full border text-caption font-medium inline-flex items-center gap-2 transition-all cursor-pointer select-none ${
                  selected
                    ? 'border-brand bg-brand-soft text-brand-ink shadow-xs'
                    : 'border-line bg-card text-ink hover:border-ink-3'
                }`}
              >
                <span className="text-sm leading-none" aria-hidden>
                  {icon}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky Continue Button */}
      <div className="px-5 pt-3 pb-safe bg-card border-t border-line shrink-0">
        <button
          type="button"
          disabled={!canContinue}
          onClick={handleContinue}
          className={`w-full h-12 rounded-full text-body font-semibold transition cursor-pointer disabled:cursor-not-allowed ${
            canContinue
              ? 'bg-brand text-brand-on hover:brightness-105 shadow-card'
              : 'bg-subtle text-ink-3'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
