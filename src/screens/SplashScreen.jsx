import React, { useEffect, useState } from 'react';

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
      className="flex flex-col h-full bg-[#0A0A0E] text-white items-center justify-between p-8 relative overflow-hidden select-none cursor-pointer"
    >
      {/* Decorative Pink Ambient Glows */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#FF4D8D]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#FF85B3]/15 blur-3xl pointer-events-none" />

      <div className="text-center pt-6 z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#15151E] border border-[#2A2A3A] text-[11px] font-semibold text-[#FF85B3] tracking-wider uppercase">
          Binusian Networking Space
        </span>
      </div>

      {/* Center BeeMate Logo */}
      <div className="flex flex-col items-center z-10 my-auto">
        <div className="relative">
          <div className="w-36 h-36 rounded-full bg-black border-2 border-[#FF4D8D]/50 flex items-center justify-center animate-pulse-glow overflow-hidden shadow-2xl">
            <img
              src="/beemate-logo.png"
              alt="BeeMate Logo"
              className="w-32 h-32 object-contain animate-float-bee"
            />
          </div>
          {/* Decorative Sparkle Star */}
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 text-[#FF4D8D] absolute -top-2 -right-2 animate-pulse"
            fill="currentColor"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight mt-6 text-white">
          Bee<span className="text-[#FF4D8D]">Mate</span>
        </h1>
        <p className="text-xs text-[#9494A8] mt-1.5 max-w-[230px] text-center leading-relaxed">
          Temukan teman belajar, partner tugas & kolaborasi lintas jurusan
        </p>
      </div>

      {/* Loading Pill Bar at Bottom */}
      <div className="w-full max-w-[220px] space-y-2.5 pb-4 z-10 text-center">
        <div className="w-full h-2 bg-[#15151E] rounded-full overflow-hidden p-0.5 border border-[#2A2A3A]">
          <div
            style={{ width: `${Math.min(100, progress)}%` }}
            className="h-full bg-gradient-to-r from-[#FF4D8D] to-[#FF85B3] rounded-full transition-all duration-300"
          />
        </div>
        <p className="text-[11px] text-[#9494A8] font-medium">
          Menyiapkan ruang aman Binusian...
        </p>
      </div>
    </div>
  );
}
