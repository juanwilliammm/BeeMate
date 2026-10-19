import React, { useMemo, useState } from 'react';
import {
  Bell,
  CalendarDays,
  Heart,
  MapPin,
  Video,
  Users,
  Clock,
  Ticket,
  Check,
  CalendarX2,
  DoorOpen,
  Radio,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import {
  MOCK_EVENTS,
  MOCK_ONGOING_EVENTS,
  MOCK_ROOMS,
  ROOM_TYPES,
  EVENT_CATEGORIES
} from '../data/communityData';
import { normalizeInterests } from '../data/mockData';
import {
  Avatar,
  AvatarStack,
  Button,
  Chip,
  EmptyState,
  ErrorState,
  IconButton,
  SafeImage,
  SectionHeader,
  Sheet,
  Skeleton,
  cx,
  formatCount,
  formatEventDate,
  formatFee,
  formatRemaining,
  greetingForNow,
  useMockResource
} from '../components/ui';

const ATTENDEE_FACES = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&auto=format&fit=crop&q=60'
];

export default function HomeScreen({
  user,
  profiles = [],
  conversations = [],
  registeredEventIds = [],
  savedEventIds = [],
  joinedRoomIds = [],
  joinedLiveIds = [],
  groupUnread = 0,
  onToggleRegister,
  onToggleSave,
  onToggleRoom,
  onToggleLive,
  onNavigate,
  onOpenChat
}) {
  const [category, setCategory] = useState('All');
  const [activeEvent, setActiveEvent] = useState(null); // event object (upcoming or live)
  const [activeRoom, setActiveRoom] = useState(null);
  const [sheet, setSheet] = useState(null); // 'calendar' | 'notifications'

  // MOCK: no events API yet — see src/data/communityData.js
  const { status, data, retry } = useMockResource(() => ({
    events: MOCK_EVENTS,
    live: MOCK_ONGOING_EVENTS,
    rooms: MOCK_ROOMS
  }));

  const userInterests = useMemo(() => normalizeInterests(user.interests), [user.interests]);

  // Rank events by registration + interest overlap, soonest first as tiebreaker
  const rankedEvents = useMemo(() => {
    if (!data) return [];
    return [...data.events]
      .filter((e) => new Date(e.startsAt).getTime() > Date.now())
      .map((e) => ({
        ...e,
        relevance:
          (registeredEventIds.includes(e.id) ? 100 : 0) +
          e.tags.filter((t) => userInterests.includes(t)).length * 10
      }))
      .sort((a, b) => b.relevance - a.relevance || new Date(a.startsAt) - new Date(b.startsAt));
  }, [data, registeredEventIds, userInterests]);

  const upcoming = rankedEvents.slice(0, 3);
  const upcomingIds = upcoming.map((e) => e.id);
  const discoverEvents =
    category === 'All'
      ? rankedEvents.filter((e) => !upcomingIds.includes(e.id))
      : rankedEvents.filter((e) => e.category === category);

  const myEvents = rankedEvents
    .filter((e) => registeredEventIds.includes(e.id))
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

  const notifications = useMemo(() => {
    const items = [];
    conversations
      .filter((c) => c.unreadCount > 0)
      .forEach((c) => {
        const p = profiles.find((x) => x.id === c.partnerId);
        if (p) {
          items.push({
            id: `n-${c.id}`,
            icon: MessageCircle,
            title: `${p.name.split(' ')[0]} sent you ${c.unreadCount} new message${c.unreadCount > 1 ? 's' : ''}`,
            meta: c.lastUpdated,
            run: () => onOpenChat(c.id)
          });
        }
      });
    if (groupUnread > 0) {
      items.push({
        id: 'n-groups',
        icon: Users,
        title: `${groupUnread} unread message${groupUnread > 1 ? 's' : ''} in your groups`,
        meta: 'Groups',
        run: () => onNavigate('groups')
      });
    }
    myEvents.slice(0, 2).forEach((e) => {
      items.push({
        id: `n-${e.id}`,
        icon: CalendarDays,
        title: `${e.title} is coming up`,
        meta: formatEventDate(e.startsAt).full,
        run: () => {
          setSheet(null);
          setActiveEvent(e);
        }
      });
    });
    return items;
  }, [conversations, profiles, groupUnread, myEvents, onOpenChat, onNavigate]);

  const firstName = user.name.split(' ')[0];

  return (
    <div className="relative h-full flex flex-col bg-surface text-ink">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* 1. Header */}
        <header className="px-5 pt-6 pb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-3 min-w-0 text-left cursor-pointer"
          >
            <Avatar src={user.avatar} name={user.name} size={44} />
            <div className="min-w-0">
              <p className="text-caption text-ink-3">{greetingForNow()}</p>
              <p className="text-heading text-ink truncate">Hi, {firstName}</p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <IconButton label="My schedule" onClick={() => setSheet('calendar')}>
              <CalendarDays size={18} strokeWidth={1.8} />
            </IconButton>
            <IconButton
              label="Notifications"
              onClick={() => setSheet('notifications')}
              badge={notifications.length > 0}
            >
              <Bell size={18} strokeWidth={1.8} />
            </IconButton>
          </div>
        </header>

        {status === 'error' && <ErrorState className="mx-5" onRetry={retry} />}

        {/* 2. Upcoming events */}
        <section className="pt-2" aria-labelledby="upcoming-h">
          <SectionHeader
            title="Upcoming events"
            actionLabel={myEvents.length ? `My events (${myEvents.length})` : undefined}
            onAction={() => setSheet('calendar')}
            className="px-5 mb-3"
          />
          {status === 'loading' ? (
            <div className="px-5">
              <Skeleton className="h-[300px] rounded-[28px]" />
            </div>
          ) : upcoming.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-5 pb-1">
              {upcoming.map((e) => (
                <UpcomingEventCard
                  key={e.id}
                  event={e}
                  registered={registeredEventIds.includes(e.id)}
                  saved={savedEventIds.includes(e.id)}
                  onOpen={() => setActiveEvent(e)}
                  onToggleSave={() => onToggleSave(e.id)}
                />
              ))}
            </div>
          ) : status === 'ready' ? (
            <EmptyState
              className="mx-5"
              icon={CalendarX2}
              title="No upcoming events"
              text="New campus events will show up here."
            />
          ) : null}
        </section>

        {/* 3. Events discovery */}
        <section className="pt-7" aria-labelledby="discover-h">
          <SectionHeader title="Discover events" className="px-5 mb-3" />
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-3">
            {EVENT_CATEGORIES.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                {c}
              </Chip>
            ))}
          </div>
          <div className="px-5 space-y-2.5">
            {status === 'loading' ? (
              [0, 1].map((i) => <Skeleton key={i} className="h-[84px]" />)
            ) : discoverEvents.length > 0 ? (
              discoverEvents.map((e) => (
                <EventRow
                  key={e.id}
                  event={e}
                  registered={registeredEventIds.includes(e.id)}
                  onOpen={() => setActiveEvent(e)}
                />
              ))
            ) : status === 'ready' ? (
              <EmptyState
                icon={CalendarX2}
                title={`No ${category.toLowerCase()} events yet`}
                text="Try another category."
                actionLabel="Show all"
                onAction={() => setCategory('All')}
              />
            ) : null}
          </div>
        </section>

        {/* 4. Ongoing events */}
        <section className="pt-7" aria-labelledby="ongoing-h">
          <SectionHeader title="Happening now" className="px-5 mb-3" />
          <div className="px-5 space-y-2.5">
            {status === 'loading' ? (
              <Skeleton className="h-[112px]" />
            ) : data?.live?.length ? (
              data.live.map((e) => (
                <OngoingEventCard
                  key={e.id}
                  event={e}
                  joined={joinedLiveIds.includes(e.id)}
                  onJoin={() => onToggleLive(e.id, e.title)}
                  onOpen={() => setActiveEvent({ ...e, live: true })}
                />
              ))
            ) : status === 'ready' ? (
              <EmptyState icon={Radio} title="Nothing live right now" text="Check back later today." />
            ) : null}
          </div>
        </section>

        {/* 5. Group rooms */}
        <section className="pt-7 pb-8" aria-labelledby="rooms-h">
          <SectionHeader
            title="Group rooms"
            actionLabel="All groups"
            onAction={() => onNavigate('groups')}
            className="px-5 mb-3"
          />
          <div className="px-5 grid grid-cols-2 gap-2.5">
            {status === 'loading'
              ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[150px]" />)
              : data?.rooms?.map((r) => (
                  <RoomCard
                    key={r.id}
                    room={r}
                    joined={joinedRoomIds.includes(r.id)}
                    onAction={() => {
                      if (joinedRoomIds.includes(r.id)) setActiveRoom(r);
                      else onToggleRoom(r.id, r.name);
                    }}
                  />
                ))}
          </div>
          {status === 'ready' && !data?.rooms?.length && (
            <EmptyState className="mx-5" icon={DoorOpen} title="No rooms available" />
          )}
        </section>
      </div>

      {/* ---------- Sheets ---------- */}
      <EventDetailSheet
        event={activeEvent}
        registered={activeEvent ? registeredEventIds.includes(activeEvent.id) : false}
        joinedLive={activeEvent ? joinedLiveIds.includes(activeEvent.id) : false}
        onClose={() => setActiveEvent(null)}
        onRegister={() => onToggleRegister(activeEvent.id, activeEvent.title)}
        onJoinLive={() => onToggleLive(activeEvent.id, activeEvent.title)}
      />

      <Sheet open={Boolean(activeRoom)} onClose={() => setActiveRoom(null)} title={activeRoom?.name}>
        {activeRoom && (
          <div className="space-y-4">
            <p className="text-body text-ink-2">{activeRoom.topic}</p>
            <div className="flex items-center gap-2 text-caption text-ink-3">
              <Users size={14} />
              {activeRoom.participants + 1} / {activeRoom.capacity} participants · {ROOM_TYPES[activeRoom.type].label} room
            </div>
            <div className="rounded-2xl bg-subtle p-4 text-caption text-ink-2">
              Room chat and voice are a preview — real-time rooms aren't connected to a backend yet.
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onToggleRoom(activeRoom.id, activeRoom.name);
                setActiveRoom(null);
              }}
            >
              Leave room
            </Button>
          </div>
        )}
      </Sheet>

      <Sheet open={sheet === 'calendar'} onClose={() => setSheet(null)} title="My schedule">
        {myEvents.length ? (
          <div className="space-y-2.5">
            {myEvents.map((e) => (
              <EventRow
                key={e.id}
                event={e}
                registered
                onOpen={() => {
                  setSheet(null);
                  setActiveEvent(e);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarDays}
            title="No registered events"
            text="Events you register for will appear here."
          />
        )}
      </Sheet>

      <Sheet open={sheet === 'notifications'} onClose={() => setSheet(null)} title="Notifications">
        {notifications.length ? (
          <ul className="divide-y divide-line">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSheet(null);
                      n.run();
                    }}
                    className="w-full flex items-center gap-3 py-3 text-left cursor-pointer"
                  >
                    <span className="w-9 h-9 rounded-full bg-subtle text-ink-2 flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-body text-ink truncate">{n.title}</span>
                      <span className="block text-meta text-ink-3 mt-0.5">{n.meta}</span>
                    </span>
                    <ChevronRight size={16} className="text-ink-3" />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState icon={Bell} title="You're all caught up" />
        )}
      </Sheet>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function UpcomingEventCard({ event, registered, saved, onOpen, onToggleSave }) {
  const { day, time } = formatEventDate(event.startsAt);
  return (
    <article
      onClick={onOpen}
      className="relative snap-start shrink-0 w-[86%] h-[300px] rounded-[28px] overflow-hidden bg-subtle shadow-card cursor-pointer group"
    >
      <SafeImage
        src={event.cover}
        alt={event.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition duration-500"
      />
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-card/95 backdrop-blur text-caption font-medium text-ink shadow-sm">
          <CalendarDays size={13} />
          {day} · {time}
        </span>
        <button
          type="button"
          aria-label={saved ? 'Remove from saved' : 'Save event'}
          aria-pressed={saved}
          onClick={(ev) => {
            ev.stopPropagation();
            onToggleSave();
          }}
          className="w-9 h-9 rounded-full bg-card/95 backdrop-blur flex items-center justify-center shadow-sm cursor-pointer"
        >
          <Heart size={16} className={saved ? 'fill-danger text-danger' : 'text-ink'} />
        </button>
      </div>

      <div className="absolute left-2.5 right-2.5 bottom-2.5 rounded-[22px] bg-card p-3.5 shadow-card">
        <div className="flex items-center gap-2 mb-1.5">
          <AvatarStack srcs={ATTENDEE_FACES} />
          <span className="text-meta text-ink-3">{formatCount(event.attendees)}+ joined</span>
          {registered && (
            <span className="ml-auto inline-flex items-center gap-1 text-meta font-semibold text-success">
              <Check size={12} /> Registered
            </span>
          )}
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-body font-semibold text-ink truncate">{event.title}</h3>
            <p className="text-meta text-ink-3 mt-0.5 flex items-center gap-1 truncate">
              {event.online ? <Video size={11} /> : <MapPin size={11} />}
              <span className="truncate">{event.location}</span>
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-body font-semibold text-ink">{formatFee(event.fee)}</p>
            <p className="text-meta text-ink-3">Entry fee</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function EventRow({ event, registered, onOpen }) {
  const { day, time } = formatEventDate(event.startsAt);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-card border border-line hover:bg-subtle/60 text-left transition cursor-pointer"
    >
      <SafeImage src={event.cover} alt={event.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-meta font-medium text-brand-ink">{event.category}</p>
        <p className="text-body font-semibold text-ink truncate">{event.title}</p>
        <p className="text-meta text-ink-3 mt-0.5 truncate">
          {day} · {time} · {event.online ? 'Online' : event.location.split('·')[0].trim()}
        </p>
      </div>
      <div className="text-right shrink-0 pr-1">
        {registered ? (
          <span className="inline-flex items-center gap-1 text-meta font-semibold text-success">
            <Check size={12} /> Going
          </span>
        ) : (
          <span className="text-caption font-semibold text-ink">{formatFee(event.fee)}</span>
        )}
      </div>
    </button>
  );
}

function OngoingEventCard({ event, joined, onJoin, onOpen }) {
  const total = new Date(event.endsAt) - new Date(event.startedAt);
  const elapsed = Date.now() - new Date(event.startedAt);
  const progress = Math.min(100, Math.max(4, (elapsed / total) * 100));
  return (
    <div className="p-3 rounded-2xl bg-card border border-line">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onOpen} className="shrink-0 cursor-pointer">
          <SafeImage src={event.cover} alt={event.title} className="w-14 h-14 rounded-xl object-cover" />
        </button>
        <button type="button" onClick={onOpen} className="flex-1 min-w-0 text-left cursor-pointer">
          <span className="inline-flex items-center gap-1.5 text-meta font-semibold text-danger">
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" /> Live
            <span className="text-ink-3 font-normal">· {formatRemaining(event.endsAt)}</span>
          </span>
          <p className="text-body font-semibold text-ink truncate">{event.title}</p>
          <p className="text-meta text-ink-3 truncate">
            {formatCount(event.attendees)} attending · {event.online ? 'Online' : event.location.split('·')[1]?.trim() || event.location}
          </p>
        </button>
        <Button size="sm" variant={joined ? 'soft' : 'primary'} onClick={onJoin}>
          {joined ? 'Joined' : 'Join'}
        </Button>
      </div>
      <div className="mt-3 h-1 rounded-full bg-subtle overflow-hidden">
        <div className="h-full bg-brand rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function RoomCard({ room, joined, onAction }) {
  const type = ROOM_TYPES[room.type];
  const isFull = room.status === 'full' && !joined;
  const isScheduled = room.status === 'scheduled';
  const statusLabel = joined ? 'Joined' : isFull ? 'Full' : isScheduled ? `Opens ${room.opensAt}` : 'Open';
  const statusTone = joined
    ? 'text-brand-ink bg-brand-soft'
    : isFull || isScheduled
    ? 'text-ink-3 bg-subtle'
    : 'text-success bg-success/10';

  return (
    <div className="p-3.5 rounded-2xl bg-card border border-line flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="w-9 h-9 rounded-full bg-subtle flex items-center justify-center text-base" aria-hidden>
          {type.icon}
        </span>
        <span className={cx('h-6 px-2 rounded-full text-meta font-medium inline-flex items-center', statusTone)}>
          {statusLabel}
        </span>
      </div>
      <p className="text-caption font-semibold text-ink leading-snug line-clamp-2">{room.name}</p>
      <p className="text-meta text-ink-3 mt-0.5 truncate">{room.topic}</p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
        <span className="text-meta text-ink-3 inline-flex items-center gap-1">
          <Users size={12} />
          {room.participants + (joined ? 1 : 0)}/{room.capacity}
        </span>
        <button
          type="button"
          disabled={isFull || isScheduled}
          onClick={onAction}
          className={cx(
            'text-caption font-semibold transition cursor-pointer disabled:cursor-not-allowed',
            isFull || isScheduled ? 'text-ink-3' : 'text-brand-ink hover:underline'
          )}
        >
          {joined ? 'Enter' : isFull ? 'Full' : isScheduled ? 'Soon' : 'Join'}
        </button>
      </div>
    </div>
  );
}

function EventDetailSheet({ event, registered, joinedLive, onClose, onRegister, onJoinLive }) {
  if (!event) return null;
  const isLive = Boolean(event.live);
  const when = isLive ? formatRemaining(event.endsAt) : formatEventDate(event.startsAt).full;
  const full = !isLive && event.capacity && event.attendees >= event.capacity && !registered;

  return (
    <Sheet
      open
      onClose={onClose}
      title={isLive ? 'Live event' : 'Event details'}
      footer={
        isLive ? (
          <Button size="lg" className="w-full" variant={joinedLive ? 'soft' : 'primary'} onClick={onJoinLive}>
            {joinedLive ? 'Leave event' : 'Join now'}
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full"
            variant={registered ? 'outline' : 'primary'}
            disabled={full}
            onClick={onRegister}
          >
            {registered ? 'Cancel registration' : full ? 'Event full' : event.fee ? `Register · ${formatFee(event.fee)}` : 'Register for free'}
          </Button>
        )
      }
    >
      <SafeImage src={event.cover} alt={event.title} className="w-full h-40 rounded-2xl object-cover" />
      <div className="mt-4">
        <span className="text-meta font-medium text-brand-ink">{event.category}</span>
        <h4 className="text-title text-ink mt-0.5">{event.title}</h4>
        <p className="text-caption text-ink-3 mt-1">Hosted by {event.host}</p>
      </div>
      <dl className="mt-4 rounded-2xl border border-line divide-y divide-line">
        <DetailRow icon={isLive ? Clock : CalendarDays} label={isLive ? 'Status' : 'Date & time'} value={when} />
        <DetailRow icon={event.online ? Video : MapPin} label={event.online ? 'Online' : 'Location'} value={event.location} />
        <DetailRow
          icon={Users}
          label="Attendees"
          value={`${formatCount(event.attendees + (registered ? 1 : 0))}${event.capacity ? ` / ${formatCount(event.capacity)}` : ''}`}
        />
        {!isLive && <DetailRow icon={Ticket} label="Entry fee" value={formatFee(event.fee)} />}
      </dl>
      <p className="text-body text-ink-2 mt-4">{event.description}</p>
      {registered && !isLive && (
        <p className="mt-3 text-caption text-success inline-flex items-center gap-1">
          <Check size={13} /> You're registered. We'll remind you before it starts.
        </p>
      )}
    </Sheet>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-3">
      <Icon size={16} className="text-ink-3 shrink-0" />
      <dt className="text-caption text-ink-3 w-24 shrink-0">{label}</dt>
      <dd className="text-caption text-ink font-medium flex-1 text-right truncate">{value}</dd>
    </div>
  );
}
