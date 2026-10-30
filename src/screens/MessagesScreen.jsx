import React, { useState } from 'react';
import { Search, User, Plus, MessageCircle, X, BadgeCheck } from 'lucide-react';
import StreakBadge from '../components/StreakBadge';
import QuickActionMenu from '../components/QuickActionMenu';
import { Avatar, EmptyState, IconButton, SectionHeader } from '../components/ui';

export function BeeMateWordmark({ theme }) {
  const logoSrc = theme === 'light' ? '/beemate-logo-light.png' : '/beemate-logo-dark.png';
  return (
    <div className="flex items-center gap-2">
      <img src={logoSrc} alt="" className="w-7 h-7 object-contain" />
      <span className="text-[20px] font-semibold tracking-tight text-ink">BeeMate</span>
    </div>
  );
}

export default function MessagesScreen({
  theme,
  conversations,
  profiles,
  onOpenChat,
  onNavigate,
  quickActions = {}
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getPartner = (partnerId) => profiles.find((p) => p.id === partnerId);

  const enriched = conversations
    .map((c) => ({ ...c, partner: getPartner(c.partnerId) }))
    .filter((c) => c.partner)
    .filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const lastMsg = c.messages[c.messages.length - 1]?.text || '';
      return (
        c.partner.name.toLowerCase().includes(q) ||
        c.partner.major.toLowerCase().includes(q) ||
        lastMsg.toLowerCase().includes(q)
      );
    });

  const newConnections = enriched.filter((c) => c.messages.length === 0);
  const activeChats = enriched.filter((c) => c.messages.length > 0);

  return (
    <div className="relative h-full flex flex-col bg-surface text-ink">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Header */}
        <header className="px-5 pt-6 pb-3 flex items-center justify-between">
          <BeeMateWordmark theme={theme} />
          <div className="flex items-center gap-2">
            <IconButton
              label={searchOpen ? 'Close search' : 'Search chats'}
              onClick={() => {
                setSearchOpen((v) => !v);
                setSearchQuery('');
              }}
            >
              {searchOpen ? <X size={18} /> : <Search size={18} strokeWidth={1.8} />}
            </IconButton>
            <IconButton label="Profile" onClick={() => onNavigate('profile')}>
              <User size={18} strokeWidth={1.8} />
            </IconButton>
          </div>
        </header>

        {searchOpen && (
          <div className="px-5 pb-2 animate-fade-in">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, major or message"
                className="w-full h-11 pl-10 pr-4 rounded-full bg-card border border-line text-body text-ink placeholder:text-ink-3 focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        )}

        {/* Activity row (new connections first, then online partners) */}
        <section className="pt-2">
          <SectionHeader title="New connections" className="px-5 mb-3" />
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-1">
            <button
              type="button"
              onClick={() => onNavigate('matching')}
              className="flex flex-col items-center gap-1.5 shrink-0 w-16 cursor-pointer group"
            >
              <span className="w-[60px] h-[60px] rounded-full bg-card border border-line flex items-center justify-center text-ink-2 group-hover:bg-subtle transition">
                <Plus size={22} strokeWidth={1.6} />
              </span>
              <span className="text-meta text-ink-3">Discover</span>
            </button>
            {newConnections.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onOpenChat(c.id)}
                className="flex flex-col items-center gap-1.5 shrink-0 w-16 cursor-pointer"
              >
                <Avatar src={c.partner.avatar} name={c.partner.name} size={60} ring />
                <span className="text-meta text-ink truncate w-full text-center">{c.partner.name.split(' ')[0]}</span>
              </button>
            ))}
            {activeChats
              .filter((c) => c.partner.online)
              .map((c) => (
                <button
                  key={`on-${c.id}`}
                  type="button"
                  onClick={() => onOpenChat(c.id)}
                  className="flex flex-col items-center gap-1.5 shrink-0 w-16 cursor-pointer"
                >
                  <Avatar src={c.partner.avatar} name={c.partner.name} size={60} online />
                  <span className="text-meta text-ink-2 truncate w-full text-center">{c.partner.name.split(' ')[0]}</span>
                </button>
              ))}
          </div>
        </section>

        {/* Recent chats */}
        <section className="pt-6 px-5">
          <SectionHeader title="Recent chats" className="mb-1" />
          {activeChats.length > 0 ? (
            <ul className="divide-y divide-line">
              {activeChats.map((conv) => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                const unread = conv.unreadCount > 0;
                return (
                  <li key={conv.id}>
                    <button
                      type="button"
                      onClick={() => onOpenChat(conv.id)}
                      className="w-full flex items-center gap-3 py-3 text-left cursor-pointer group"
                    >
                      <Avatar src={conv.partner.avatar} name={conv.partner.name} size={48} online={conv.partner.online} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-body font-semibold text-ink truncate">{conv.partner.name}</span>
                          {conv.partner.verified && <BadgeCheck size={14} className="text-sky-500 shrink-0" />}
                          <StreakBadge days={conv.streakDays} expiringSoon={conv.streakExpiringSoon} />
                        </div>
                        <p className={`text-caption truncate mt-0.5 ${unread ? 'text-ink font-medium' : 'text-ink-3'}`}>
                          {lastMsg?.sender === 'me' ? 'You: ' : ''}
                          {lastMsg?.imageUrl && !lastMsg?.text ? '📷 Photo' : lastMsg?.text}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-meta text-ink-3">{conv.lastUpdated}</span>
                        {unread ? (
                          <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand text-brand-on text-meta font-semibold flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        ) : (
                          <span className="h-5" />
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              className="mt-2"
              icon={MessageCircle}
              title={searchQuery ? 'No chats found' : 'No conversations yet'}
              text={searchQuery ? 'Try a different name or keyword.' : 'Connect with students in Discover to start chatting.'}
              actionLabel={searchQuery ? undefined : 'Go to Discover'}
              onAction={() => onNavigate('matching')}
            />
          )}
        </section>
      </div>

      <QuickActionMenu {...quickActions} />
    </div>
  );
}
