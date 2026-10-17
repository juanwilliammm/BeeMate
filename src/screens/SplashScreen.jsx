import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 18;
      });
    }, 320);

    const timeout = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className="flex flex-col h-full bg-[#0F1115] text-white items-center justify-between p-8 relative overflow-hidden select-none cursor-pointer"
    >
      <div className="text-center pt-6 z-10">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-xs font-bold text-[#38BDF8] tracking-wider uppercase">
          <ShieldCheck size={14} />
          <span>Verified Binusian Academic Network</span>
        </span>
      </div>

      {/* Center BeeMate Logo */}
      <div className="flex flex-col items-center z-10 my-auto">
        <div className="relative">
          <div className="w-36 h-36 rounded-full bg-[#181B22] border-2 border-[#F59E0B]/60 flex items-center justify-center animate-pulse-glow overflow-hidden shadow-2xl">
            <img
              src="/beemate-logo.png"
              alt="BeeMate Logo"
              className="w-32 h-32 object-contain animate-float-bee"
            />
          </div>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight mt-6 text-white">
          Bee<span className="text-[#F59E0B]">Mate</span>
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1.5 max-w-[240px] text-center leading-relaxed">
          Platform kolaborasi akademik, partner lomba, dan diskusi lintas jurusan Binusian
        </p>
      </div>

      {/* Loading Pill Bar at Bottom */}
      <div className="w-full max-w-[220px] space-y-2.5 pb-4 z-10 text-center">
        <div className="w-full h-2 bg-[#181B22] rounded-full overflow-hidden p-0.5 border border-[#2E3440]">
          <div
            style={{ width: `${Math.min(100, progress)}%` }}
            className="h-full bg-[#F59E0B] rounded-full transition-all duration-300"
          />
        </div>
        <p className="text-xs text-[#94A3B8] font-medium">
          Menyiapkan ruang kolaborasi kampus...
        </p>
      </div>
    </div>
  );
}
