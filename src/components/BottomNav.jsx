import React from 'react';
import { Sparkles, Compass, MessageCircle, User } from 'lucide-react';

export default function BottomNav({ currentScreen, onNavigate, unreadTotal }) {
  const navItems = [
    { id: 'home', label: 'Beranda', icon: Sparkles },
    { id: 'matching', label: 'Explore', icon: Compass },
    { id: 'messages', label: 'Chat', icon: MessageCircle, badge: unreadTotal },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="px-5 pb-4 pt-2 bg-gradient-to-t from-[#0A0A0E] via-[#0A0A0E]/95 to-transparent shrink-0 z-20">
      <nav
        aria-label="Navigasi Utama"
        className="bg-[#15151E] border border-[#2A2A3A] rounded-full p-1.5 flex items-center justify-between shadow-2xl shadow-black/80"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              className={`relative flex items-center justify-center gap-2 py-2.5 px-4 rounded-full transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#FF4D8D] text-[#0A0A0E] font-bold shadow-lg shadow-[#FF4D8D]/30'
                  : 'text-[#9494A8] hover:text-white font-medium'
              }`}
            >
              <div className="relative flex items-center">
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge > 0 && (
                  <span
                    className={`absolute -top-2 -right-2.5 text-[10px] font-extrabold px-1.5 rounded-full min-w-[17px] h-[17px] flex items-center justify-center ${
                      isActive
                        ? 'bg-[#0A0A0E] text-[#FF4D8D]'
                        : 'bg-[#FF4D8D] text-[#0A0A0E]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              {isActive && (
                <span className="text-xs tracking-wide">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
