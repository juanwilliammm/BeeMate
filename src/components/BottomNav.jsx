import React from 'react';
import { Home, Compass, MessageCircle, Users, User } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'matching', label: 'Discover', icon: Compass },
  { id: 'messages', label: 'Chats', icon: MessageCircle, badgeKey: 'chats' },
  { id: 'groups', label: 'Groups', icon: Users, badgeKey: 'groups' },
  { id: 'profile', label: 'Profile', icon: User }
];

export default function BottomNav({ currentScreen, onNavigate, unreadTotal = 0, groupUnread = 0 }) {
  const badges = { chats: unreadTotal, groups: groupUnread };

  return (
    <div className="px-4 pt-2 pb-safe bg-card border-t border-line shrink-0 z-30">
      <nav aria-label="Main navigation" className="flex items-center justify-between gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          const badge = item.badgeKey ? badges[item.badgeKey] : 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative h-10 flex items-center justify-center gap-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-brand-soft text-brand-ink px-4'
                  : 'text-ink-3 hover:text-ink px-3'
              }`}
            >
              <span className="relative flex items-center">
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-brand text-brand-on text-[10px] font-semibold flex items-center justify-center ring-2 ring-card">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </span>
              {isActive && <span className="text-caption font-semibold">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
