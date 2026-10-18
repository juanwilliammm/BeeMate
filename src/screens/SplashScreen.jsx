import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
  // Stage 1: 'logo' (center logo pops in)
  // Stage 2: 'tagline' (animated "beeMate | find your hive & thrive" reveals)
  // Stage 3: 'splash-out' (expanding splash transition to Login page)
  const [stage, setStage] = useState('logo');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage('tagline');
    }, 850);

    const t2 = setTimeout(() => {
      setStage('splash-out');
    }, 2500);

    const t3 = setTimeout(() => {
      onFinish();
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className="flex flex-col h-full w-full bg-[#0F1115] text-white items-center justify-center p-6 relative overflow-hidden select-none cursor-pointer"
    >
      {/* Subtle Ambient Honey Ring in Center */}
      <div
        className={`absolute w-64 h-64 rounded-full bg-[#F59E0B]/10 blur-2xl pointer-events-none transition-all duration-700 ${
          stage === 'splash-out' ? 'scale-[8] opacity-0' : 'scale-100 opacity-100'
        }`}
      />

      {/* Stage 3 Expanding Splash Transition Portal to Login Page */}
      <div
        className={`absolute w-24 h-24 rounded-full bg-[#F59E0B] pointer-events-none z-30 transition-all duration-700 ease-in-out ${
          stage === 'splash-out'
            ? 'scale-[22] opacity-100'
            : 'scale-0 opacity-0'
        }`}
      />

      {/* Centered Logo + Animated Lockup */}
      <div
        className={`flex flex-col items-center justify-center z-20 transition-all duration-500 ${
          stage === 'splash-out'
            ? 'scale-125 opacity-0 -translate-y-4'
            : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        {/* 1. Centered BeeMate Logo */}
        <div
          className={`relative flex items-center justify-center transition-all duration-700 ease-out ${
            stage === 'logo'
              ? 'scale-105 translate-y-3'
              : 'scale-100 translate-y-0'
          }`}
        >
          {/* Animated Ripple Halo */}
          <div className="absolute inset-0 rounded-full border-2 border-[#F59E0B]/40 animate-ping opacity-30" />
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#181B22] border-2 border-[#F59E0B]/70 flex items-center justify-center shadow-2xl animate-pulse-glow overflow-hidden">
            <img
              src="/beemate-logo.png"
              alt="BeeMate Logo"
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain animate-logo-entrance"
            />
          </div>
        </div>

        {/* 2. Animated "beeMate | find your hive & thrive" Lockup */}
        <div
          className={`mt-6 flex flex-col items-center transition-all duration-700 ease-out ${
            stage === 'logo'
              ? 'opacity-0 translate-y-4 pointer-events-none'
              : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="flex items-center justify-center gap-3 px-4 py-2 rounded-2xl bg-[#181B22]/90 border border-[#2E3440] shadow-xl">
            {/* Brand Name: beeMate */}
            <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#F3F4F6]">
              bee<span className="text-[#F59E0B]">Mate</span>
            </span>

            {/* Animated Vertical Divider "|" */}
            <span
              className={`w-[2px] h-6 bg-[#F59E0B] rounded-full transition-transform duration-500 origin-center ${
                stage === 'logo' ? 'scale-y-0' : 'scale-y-100'
              }`}
            />

            {/* Animated Tagline: find your hive & thrive */}
            <span
              className={`text-xs sm:text-sm font-bold tracking-wide text-[#38BDF8] transition-all duration-700 delay-150 ${
                stage === 'logo'
                  ? 'opacity-0 -translate-x-3'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              find your hive &amp; thrive
            </span>
          </div>

          {/* Subtle progress indicator dots */}
          <div className="flex items-center gap-1.5 mt-5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
