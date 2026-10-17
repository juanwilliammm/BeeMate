import React from 'react';
import { Home, Compass, MessageSquare, User } from 'lucide-react';

export default function BottomNav({ currentScreen, onNavigate, unreadTotal }) {
  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'matching', label: 'Matching', icon: Compass },
    { id: 'messages', label: 'Pesan', icon: MessageSquare, badge: unreadTotal },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shrink-0 z-20"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            className={`relative flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all ${
              isActive
                ? 'text-binus-blue font-semibold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div className="relative">
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-binus-blue' : 'text-slate-400'}
              />
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1">{item.label}</span>
            {isActive && (
              <span className="w-5 h-1 bg-binus-orange rounded-full mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
