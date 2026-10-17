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
      className={`inline-flex items-center gap-1 rounded-full font-extrabold select-none ${
        size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'
      } ${
        isUnlocked
          ? 'bg-[#F59E0B] text-[#0F1115] shadow-sm shadow-[#F59E0B]/30'
          : 'bg-[#222631] text-[#FBBF24] border border-[#F59E0B]/45'
      }`}
    >
      <Flame
        size={size === 'lg' ? 14 : 12}
        className={isUnlocked ? 'fill-[#0F1115] text-[#0F1115]' : 'fill-[#F59E0B] text-[#F59E0B]'}
      />
      <span>{days}</span>
      {expiringSoon && (
        <Hourglass
          size={size === 'lg' ? 13 : 11}
          className={isUnlocked ? 'text-[#0F1115] ml-0.5' : 'text-[#FBBF24] ml-0.5'}
          title="Streak hampir berakhir! Balas pesan dua arah untuk menjaga streak."
        />
      )}
    </div>
  );
}
