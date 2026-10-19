import React, { useEffect, useState } from 'react';
import { Plus, X, MessageSquarePlus, Phone, Users, UserPlus, ChevronRight } from 'lucide-react';

/**
 * Floating action button + compact quick-action menu (Chats & Groups).
 * Rendered inside a `relative` screen container so it never overlaps the bottom nav.
 */
export default function QuickActionMenu({ onStartMessage, onCreateGroup, onAddContact, onMakeCall }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const actions = [
    { id: 'msg', label: 'Start a message', icon: MessageSquarePlus, run: onStartMessage },
    { id: 'call', label: 'Make a call', icon: Phone, run: onMakeCall },
    { id: 'group', label: 'Create a group', icon: Users, run: onCreateGroup },
    { id: 'contact', label: 'Add a contact', icon: UserPlus, run: onAddContact }
  ];

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close quick actions"
          onClick={() => setOpen(false)}
          className="absolute inset-0 z-30 bg-black/25 backdrop-blur-[1px] animate-fade-in cursor-default"
        />
      )}

      <div className="absolute right-4 bottom-4 z-40 flex flex-col items-end gap-3">
        {open && (
          <div
            role="menu"
            className="w-56 bg-card border border-line rounded-2xl shadow-float py-1.5 animate-pop-in origin-bottom-right"
          >
            {actions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    a.run?.();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-body text-ink hover:bg-subtle transition cursor-pointer"
                >
                  <Icon size={18} className="text-ink-2" strokeWidth={1.8} />
                  <span className="flex-1 text-left">{a.label}</span>
                  <ChevronRight size={15} className="text-ink-3" />
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          aria-label={open ? 'Close quick actions' : 'Open quick actions'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-float transition-all duration-200 cursor-pointer ${
            open ? 'bg-ink text-card rotate-0' : 'bg-brand text-brand-on hover:brightness-105'
          }`}
        >
          {open ? <X size={22} /> : <Plus size={24} />}
        </button>
      </div>
    </>
  );
}
