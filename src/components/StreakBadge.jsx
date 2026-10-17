import React from 'react';
import { Flame, Hourglass } from 'lucide-react';

export default function StreakBadge({ days, expiringSoon = false, size = 'sm' }) {
  if (!days || days <= 0) return null;

  const isUnlocked = days >= 3;

  return (
    <div
      title={
        isUnlocked
          ? `Streak ${days} hari aktif! Video call terbuka.`
          : `Streak ${days} hari (butuh ${3 - days} hari lagi untuk membuka Video Call)`
      }
      className={`inline-flex items-center gap-1 rounded-full font-bold select-none ${
        size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'
      } ${
        isUnlocked
          ? 'bg-[#FF4D8D] text-[#0A0A0E] shadow-sm shadow-[#FF4D8D]/30'
          : 'bg-[#1E1E2A] text-[#FF85B3] border border-[#FF4D8D]/40'
      }`}
    >
      <Flame
        size={size === 'lg' ? 14 : 12}
        className={isUnlocked ? 'fill-[#0A0A0E] text-[#0A0A0E] animate-pulse' : 'fill-[#FF4D8D] text-[#FF4D8D]'}
      />
      <span>{days}</span>
      {expiringSoon && (
        <Hourglass
          size={size === 'lg' ? 13 : 11}
          className={isUnlocked ? 'text-[#0A0A0E] ml-0.5' : 'text-[#FF85B3] ml-0.5'}
          title="Streak hampir berakhir! Balas pesan untuk menjaga streak."
        />
      )}
    </div>
  );
}
