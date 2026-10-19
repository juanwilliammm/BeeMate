import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* BeeMate UI primitives — shared by Home, Discover, Chats and Groups  */
/* All colours come from theme tokens (see tailwind.config.js).        */
/* Note: use text-[#fff] (not text-white) on photos, because the       */
/* legacy light-theme overrides in index.css recolour `.text-white`.   */
/* ------------------------------------------------------------------ */

export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

/* ---------- Formatting helpers ---------- */

export function formatCount(n = 0) {
  if (n >= 1000) {
    const v = n / 1000;
    return `${v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(n);
}

export function formatFee(fee) {
  if (!fee) return 'Free';
  return `Rp${(fee / 1000).toLocaleString('id-ID')}k`;
}

export function formatEventDate(iso) {
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return { day, time, full: `${day} · ${time}` };
}

export function formatRemaining(endIso) {
  const mins = Math.max(0, Math.round((new Date(endIso).getTime() - Date.now()) / 60000));
  if (mins <= 0) return 'Ending now';
  if (mins < 60) return `${mins} min left`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m left` : `${h}h left`;
}

export function greetingForNow() {
  const h = new Date().getHours();
  if (h < 11) return 'Good morning';
  if (h < 15) return 'Good afternoon';
  if (h < 19) return 'Good evening';
  return 'Good night';
}

/* ---------- Mock data loader (loading / error / ready) ---------- */

/**
 * Simulates an async fetch for mock data so screens can show proper
 * loading and error states. Swap `loader` for a real API call later.
 */
export function useMockResource(loader, deps = [], delay = 450) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, status: 'loading' }));
    const t = setTimeout(() => {
      if (!alive) return;
      try {
        setState({ status: 'ready', data: loader(), error: null });
      } catch (err) {
        setState({ status: 'error', data: null, error: err });
      }
    }, delay);
    return () => {
      alive = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce, ...deps]);

  const retry = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, retry };
}

/* ---------- Images & avatars ---------- */

export function SafeImage({ src, alt = '', className = '', fallback = null, ...rest }) {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);
  if (failed) {
    return (
      fallback || (
        <div
          aria-label={alt}
          className={cx('bg-subtle flex items-center justify-center text-ink-3 text-caption', className)}
        >
          {alt ? alt.charAt(0).toUpperCase() : ''}
        </div>
      )
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}

export function Avatar({ src, name = '', size = 44, online, ring = false, className = '' }) {
  return (
    <div className={cx('relative shrink-0', className)} style={{ width: size, height: size }}>
      <div
        className={cx(
          'w-full h-full rounded-full overflow-hidden',
          ring && 'p-[2px] bg-brand'
        )}
      >
        <SafeImage
          src={src}
          alt={name}
          className={cx('w-full h-full object-cover rounded-full', ring && 'border-2 border-card')}
        />
      </div>
      {online !== undefined && (
        <span
          className={cx(
            'absolute bottom-0 right-0 rounded-full border-2 border-card',
            online ? 'bg-success' : 'bg-ink-3'
          )}
          style={{ width: Math.max(10, size * 0.24), height: Math.max(10, size * 0.24) }}
        />
      )}
    </div>
  );
}

export function AvatarStack({ srcs = [], size = 22, max = 3 }) {
  return (
    <div className="flex -space-x-1.5">
      {srcs.slice(0, max).map((s, i) => (
        <SafeImage
          key={i}
          src={s}
          alt=""
          className="rounded-full object-cover border-2 border-card"
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

/* ---------- Layout ---------- */

export function SectionHeader({ title, actionLabel, onAction, className = '' }) {
  return (
    <div className={cx('flex items-center justify-between', className)}>
      <h2 className="text-heading text-ink">{title}</h2>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="text-caption font-medium text-ink-3 hover:text-ink transition cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function IconButton({ label, onClick, children, badge, className = '' }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cx(
        'relative w-10 h-10 rounded-full bg-card border border-line flex items-center justify-center text-ink hover:bg-subtle transition cursor-pointer shrink-0',
        className
      )}
    >
      {children}
      {badge ? (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger ring-2 ring-card" />
      ) : null}
    </button>
  );
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }) {
  const variants = {
    primary: 'bg-brand text-brand-on hover:brightness-105 disabled:bg-subtle disabled:text-ink-3',
    secondary: 'bg-subtle text-ink hover:bg-line disabled:opacity-50',
    soft: 'bg-brand-soft text-brand-ink hover:brightness-95 disabled:opacity-50',
    outline: 'bg-card text-ink border border-line hover:bg-subtle disabled:opacity-50',
    ghost: 'text-ink-2 hover:text-ink hover:bg-subtle'
  };
  const sizes = {
    sm: 'h-8 px-3 text-caption',
    md: 'h-10 px-4 text-body',
    lg: 'h-12 px-5 text-body'
  };
  return (
    <button
      type="button"
      className={cx(
        'inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition cursor-pointer disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Chip({ active, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'h-8 px-3.5 rounded-full text-caption font-medium border whitespace-nowrap transition cursor-pointer shrink-0',
        active
          ? 'bg-ink text-card border-ink'
          : 'bg-card text-ink-2 border-line hover:text-ink',
        className
      )}
    >
      {children}
    </button>
  );
}

/* ---------- States ---------- */

export function Skeleton({ className = '' }) {
  return <div className={cx('skeleton rounded-2xl', className)} />;
}

export function EmptyState({ icon: Icon, title, text, actionLabel, onAction, className = '' }) {
  return (
    <div className={cx('rounded-3xl border border-dashed border-line bg-card px-5 py-7 text-center', className)}>
      {Icon && (
        <div className="w-11 h-11 rounded-full bg-subtle text-ink-2 flex items-center justify-center mx-auto mb-3">
          <Icon size={20} />
        </div>
      )}
      <p className="text-body font-semibold text-ink">{title}</p>
      {text && <p className="text-caption text-ink-3 mt-1 max-w-[240px] mx-auto">{text}</p>}
      {actionLabel && (
        <Button size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ title = "Couldn't load this section", onRetry, className = '' }) {
  return (
    <div className={cx('rounded-3xl border border-line bg-card px-5 py-6 text-center', className)}>
      <AlertCircle size={20} className="text-danger mx-auto mb-2" />
      <p className="text-body font-semibold text-ink">{title}</p>
      <p className="text-caption text-ink-3 mt-1">Check your connection and try again.</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          <RotateCcw size={13} /> Retry
        </Button>
      )}
    </div>
  );
}

/* ---------- Bottom sheet (stays inside the phone frame) ---------- */

export function Sheet({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end animate-fade-in" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] cursor-default"
      />
      <div className="relative w-full max-h-[86%] bg-card rounded-t-[28px] shadow-float flex flex-col animate-sheet-up">
        <div className="pt-2.5 pb-1 flex justify-center">
          <span className="w-10 h-1 rounded-full bg-line" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 pt-1 pb-3">
            <h3 className="text-heading text-ink">{title}</h3>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-subtle text-ink-2 hover:text-ink flex items-center justify-center cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-5">{children}</div>
        {footer && <div className="px-5 pt-3 pb-safe border-t border-line">{footer}</div>}
      </div>
    </div>
  );
}
