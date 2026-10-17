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
        size === 'lg' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]'
      } ${
        isUnlocked
          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
          : 'bg-orange-100 text-orange-700 border border-orange-200'
      }`}
    >
      <Flame
        size={size === 'lg' ? 14 : 12}
        className={isUnlocked ? 'fill-white text-white animate-pulse' : 'fill-orange-500 text-orange-600'}
      />
      <span>{days}</span>
      {expiringSoon && (
        <Hourglass
          size={size === 'lg' ? 13 : 11}
          className={isUnlocked ? 'text-amber-100 ml-0.5' : 'text-orange-600 ml-0.5'}
          title="Streak hampir berakhir dalam beberapa jam! Balas pesan untuk menjaga streak."
        />
      )}
    </div>
  );
}
