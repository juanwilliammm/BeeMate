import React, { useEffect, useState } from 'react';

export default function SplashScreen({ theme = 'light', onFinish }) {
  // Phase 1 ('center'): BeeMate logo appears dead-center without border
  // Phase 2 ('slide'): Logo slides left as "| find your hive & thrive" animates out to its right
  // Phase 3 ('stacked'): Settles into Reference Image 3 Screen 1 layout (Centered Logo + "beeMate" + "find your hive & thrive" stacked below, with yellow corner circles) before transitioning to LoginScreen
  const [phase, setPhase] = useState('center');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('slide');
    }, 750);

    const t2 = setTimeout(() => {
      setPhase('stacked');
    }, 2000);

    const t3 = setTimeout(() => {
      onFinish();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  const logoSrc =
    theme === 'light' ? '/beemate-logo-light.png' : '/beemate-logo-dark.png';

  return (
    <div
      onClick={onFinish}
      className="flex flex-col h-full w-full bg-[#0F1115] text-white items-center justify-center p-6 relative overflow-hidden select-none cursor-pointer transition-colors duration-300"
    >
      {/* Top-Right Amber Corner Circle (Reference Image 3 - Screen 1) */}
      <div
        className={`absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[#F59E0B] pointer-events-none transition-all duration-700 ease-out ${
          phase === 'center'
            ? 'scale-75 opacity-80'
            : 'scale-100 opacity-100'
        }`}
      />

      {/* Bottom-Left Amber Corner Circle (Reference Image 3 - Screen 1) */}
      <div
        className={`absolute -bottom-24 -left-20 w-64 h-64 rounded-full bg-[#F59E0B] pointer-events-none transition-all duration-700 ease-out ${
          phase === 'center'
            ? 'scale-75 opacity-80'
            : 'scale-100 opacity-100'
        }`}
      />

      {/* Center Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4">
        {/* Phase 1 & 2: Logo starts in center, then slides left as "| find your hive & thrive" expands */}
        {phase !== 'stacked' && (
          <div className="flex items-center justify-center">
            <img
              src={logoSrc}
              alt="BeeMate Logo"
              className={`w-24 h-24 sm:w-28 sm:h-28 object-contain transition-all duration-700 ease-out ${
                phase === 'center'
                  ? 'translate-x-0 scale-105 animate-logo-entrance'
                  : '-translate-x-2 scale-95'
              }`}
            />

            <div
              className={`flex items-center overflow-hidden transition-all duration-700 ease-out ${
                phase === 'slide'
                  ? 'max-w-[240px] opacity-100 ml-3'
                  : 'max-w-0 opacity-0 ml-0'
              }`}
            >
              {/* Vertical Divider "|" */}
              <span className="w-[2.5px] h-12 bg-[#F59E0B] rounded-full shrink-0" />

              <div className="pl-3 flex flex-col justify-center whitespace-nowrap">
                <span className="font-display text-2xl font-extrabold tracking-tight leading-none text-white">
                  <span className="text-[#F59E0B]">Bee</span>Mate
                </span>
                <span className="text-xs font-semibold tracking-wide text-[#94A3B8] mt-1">
                  find your hive &amp; thrive
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Phase 3: Stacked Layout (Reference Image 3 - Screen 1: Logo on top, "beeMate" below, "find your hive & thrive" below) */}
        {phase === 'stacked' && (
          <div className="flex flex-col items-center text-center animate-splash-reveal">
            <img
              src={logoSrc}
              alt="BeeMate Logo"
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain animate-float-bee"
            />
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-white">
              <span className="text-[#F59E0B]">Bee</span>Mate
            </h1>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.26em] text-[#94A3B8] mt-2">
              find your hive &amp; thrive
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
