import React, { useMemo, useState } from 'react';
import {
  Search,
  User,
  X,
  Code2,
  Palette,
  Dumbbell,
  Gamepad2,
  BarChart3,
  Briefcase,
  Users,
  FileText,
  FolderOpen,
  Check
} from 'lucide-react';
import { MOCK_GROUP_FILES, GROUP_CATEGORIES } from '../data/communityData';
import QuickActionMenu from '../components/QuickActionMenu';
import { BeeMateWordmark } from './MessagesScreen';
import {
  AvatarStack,
  Button,
  Chip,
  EmptyState,
  IconButton,
  SafeImage,
  SectionHeader,
  Sheet,
  Skeleton,
  formatCount,
  useMockResource
} from '../components/ui';

const GROUP_ICONS = {
  Code2,
  Palette,
  Dumbbell,
  Gamepad2,
  BarChart3,
  Briefcase
};

export function GroupAvatar({ icon, tint = '#6366F1', size = 44 }) {
  const Icon = GROUP_ICONS[icon] || Users;
  return (
    <span
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: `${tint}1F`,
        color: tint
      }}
    >
      <Icon size={Math.round(size * 0.45)} strokeWidth={2} />
    </span>
  );
}

export default function GroupsScreen({
  theme,
  user,
  groups = [],
  onJoinGroup,
  onLeaveGroup,
  onDismissGroup,
  onSendGroupMessage,
  onCreateGroup,
  onNavigate,
  quickActions = {}
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dismissedIds, setDismissedIds] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeFileGroup, setActiveFileGroup] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Simulate async loading for Group Files
  const { status: filesStatus, data: groupFiles } = useMockResource(() => MOCK_GROUP_FILES, [], 320);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups.filter((g) => {
      if (dismissedIds.includes(g.id)) return false;
      if (categoryFilter !== 'All' && g.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        (g.admins || []).some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [groups, query, categoryFilter, dismissedIds]);

  const myGroups = filtered.filter((g) => g.joined);
  const exploreGroups = filtered.filter((g) => !g.joined);

  const mergedQuickActions = {
    ...quickActions,
    onCreateGroup: () => setCreateOpen(true)
  };

  return (
    <div className="relative h-full flex flex-col bg-surface text-ink">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Header */}
        <header className="px-5 pt-6 pb-3 flex items-center justify-between">
          <BeeMateWordmark theme={theme} />
          <div className="flex items-center gap-2">
            <IconButton
              label={searchOpen ? 'Close search' : 'Search groups'}
              onClick={() => {
                setSearchOpen((v) => !v);
                setQuery('');
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search groups, categories or admins"
                className="w-full h-11 pl-10 pr-4 rounded-full bg-card border border-line text-body text-ink placeholder:text-ink-3 focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        )}

        {/* 1. My Groups */}
        <section className="pt-2 px-5" aria-labelledby="my-groups-h">
          <SectionHeader
            title="My Groups"
            actionLabel={myGroups.length ? `${myGroups.length} joined` : undefined}
            className="mb-2"
          />
          {myGroups.length > 0 ? (
            <ul className="divide-y divide-line">
              {myGroups.map((g) => (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onJoinGroup?.(g.id, true); // clears unread
                      setActiveGroup(g);
                    }}
                    className="w-full flex items-center gap-3 py-3 text-left cursor-pointer group"
                  >
                    <div className="relative">
                      <GroupAvatar icon={g.icon} tint={g.tint} size={46} />
                      <span
                        className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card"
                        style={{ backgroundColor: g.unread ? '#10B981' : '#F59E0B' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-body font-semibold text-ink truncate">{g.name}</span>
                        <span className="text-meta text-ink-3 shrink-0">· {g.category}</span>
                      </div>
                      <p className={`text-caption truncate mt-0.5 ${g.unread ? 'text-ink font-medium' : 'text-ink-3'}`}>
                        {g.lastMessage || `${formatCount(g.members)} members · Tap to open group`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-meta text-ink-3">{g.lastTime || 'Active'}</span>
                      {g.unread > 0 ? (
                        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand text-brand-on text-meta font-semibold flex items-center justify-center">
                          {g.unread}
                        </span>
                      ) : (
                        <span className="h-5" />
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Users}
              title="No joined groups yet"
              text="Join a study circle or campus community below to collaborate."
            />
          )}
        </section>

        {/* 2. Explore Groups */}
        <section className="pt-6" aria-labelledby="explore-groups-h">
          <SectionHeader
            title="Explore Groups"
            actionLabel={dismissedIds.length ? 'Reset hidden' : 'Create group'}
            onAction={() => {
              if (dismissedIds.length) setDismissedIds([]);
              else setCreateOpen(true);
            }}
            className="px-5 mb-2.5"
          />

          <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-3">
            {['All', ...GROUP_CATEGORIES].map((cat) => (
              <Chip key={cat} active={categoryFilter === cat} onClick={() => setCategoryFilter(cat)}>
                {cat}
              </Chip>
            ))}
          </div>

          {exploreGroups.length > 0 ? (
            <div className="px-5 grid grid-cols-2 gap-3">
              {exploreGroups.map((g) => (
                <div
                  key={g.id}
                  className="p-3.5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-2.5">
                      <GroupAvatar icon={g.icon} tint={g.tint} size={40} />
                      <div className="min-w-0">
                        <h3 className="text-body font-semibold text-ink truncate">{g.name}</h3>
                        <p className="text-meta text-ink-3 mt-0.5">
                          {formatCount(g.members)} members · {g.category}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-meta font-semibold text-ink-2">Admin</p>
                      <div className="mt-1 flex items-center gap-1.5 min-w-0">
                        <AvatarStack srcs={g.adminAvatars || []} size={20} />
                        <span className="text-meta text-ink-2 truncate">
                          {(g.admins || ['Campus Admin']).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onJoinGroup?.(g.id)}
                      className="flex-1 h-8 px-3 rounded-full bg-brand-soft text-brand-ink hover:bg-brand hover:text-brand-on text-caption font-semibold transition cursor-pointer"
                    >
                      Join Group
                    </button>
                    <button
                      type="button"
                      aria-label={`Hide ${g.name}`}
                      onClick={() => {
                        setDismissedIds((prev) => [...prev, g.id]);
                        onDismissGroup?.(g.id);
                      }}
                      className="w-8 h-8 rounded-full text-danger hover:bg-subtle flex items-center justify-center transition cursor-pointer shrink-0"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5">
              <EmptyState
                icon={Users}
                title="All matching groups joined"
                text="Create a new group or switch category filters."
                actionLabel="Create a group"
                onAction={() => setCreateOpen(true)}
              />
            </div>
          )}
        </section>

        {/* 3. Group Files */}
        <section className="pt-6 px-5 pb-4" aria-labelledby="group-files-h">
          <SectionHeader title="Group Files" className="mb-3" />
          {filesStatus === 'loading' ? (
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-[136px]" />
              <Skeleton className="h-[136px]" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {groups
                .filter((g) => g.joined || groupFiles?.[g.id])
                .slice(0, 4)
                .map((g) => {
                  const bundle = groupFiles?.[g.id] || {
                    count: 18,
                    items: [
                      { id: `${g.id}-1`, name: 'syllabus.pdf', kind: 'pdf' },
                      { id: `${g.id}-2`, name: 'notes.docx', kind: 'doc' }
                    ]
                  };
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setActiveFileGroup({ group: g, bundle })}
                      className="p-3.5 rounded-2xl bg-card border border-line shadow-card text-left hover:bg-subtle/50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <GroupAvatar icon={g.icon} tint={g.tint} size={36} />
                        <div className="min-w-0">
                          <p className="text-caption font-semibold text-ink truncate">
                            {g.name.split('·')[0].trim()}
                          </p>
                          <p className="text-meta text-ink-3">{bundle.count} files</p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-1.5">
                        {bundle.items.slice(0, 3).map((item) =>
                          item.thumb ? (
                            <SafeImage
                              key={item.id}
                              src={item.thumb}
                              alt={item.name}
                              className="w-full h-12 rounded-xl object-cover"
                            />
                          ) : (
                            <div
                              key={item.id}
                              className="h-12 rounded-xl bg-subtle flex flex-col items-center justify-center text-ink-2"
                            >
                              <FileText size={15} />
                              <span className="text-[10px] uppercase mt-0.5">{item.kind}</span>
                            </div>
                          )
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </section>
      </div>

      <QuickActionMenu {...mergedQuickActions} />

      {/* Active group sheet */}
      <GroupDetailSheet
        group={activeGroup ? groups.find((x) => x.id === activeGroup.id) || activeGroup : null}
        user={user}
        onClose={() => setActiveGroup(null)}
        onSendMessage={onSendGroupMessage}
        onLeave={(id) => {
          onLeaveGroup?.(id);
          setActiveGroup(null);
        }}
      />

      {/* Group files sheet */}
      <Sheet
        open={Boolean(activeFileGroup)}
        onClose={() => setActiveFileGroup(null)}
        title={activeFileGroup ? `${activeFileGroup.group.name} · Files` : 'Files'}
      >
        {activeFileGroup && (
          <div className="space-y-2.5">
            <p className="text-caption text-ink-3">
              {activeFileGroup.bundle.count} shared resources in this group
            </p>
            {activeFileGroup.bundle.items.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-subtle/60 border border-line"
              >
                {f.thumb ? (
                  <SafeImage src={f.thumb} alt={f.name} className="w-11 h-11 rounded-xl object-cover" />
                ) : (
                  <span className="w-11 h-11 rounded-xl bg-card border border-line flex items-center justify-center text-ink-2">
                    <FolderOpen size={18} />
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-body font-medium text-ink truncate">{f.name}</p>
                  <p className="text-meta text-ink-3 uppercase">{f.kind} resource</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Sheet>

      {/* Create group sheet */}
      <CreateGroupSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(payload) => {
          onCreateGroup?.(payload);
          setCreateOpen(false);
        }}
      />
    </div>
  );
}

function GroupDetailSheet({ group, user, onClose, onSendMessage, onLeave }) {
  const [draft, setDraft] = useState('');
  if (!group) return null;

  const messages = group.messages || [
    {
      id: 'gm-1',
      sender: (group.admins && group.admins[0]) || 'Admin',
      text: group.lastMessage || `Welcome to ${group.name}! Share your study goals here.`,
      time: group.lastTime || '19:25'
    }
  ];

  const submit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSendMessage?.(group.id, draft.trim(), user?.name?.split(' ')[0] || 'You');
    setDraft('');
  };

  return (
    <Sheet
      open={Boolean(group)}
      onClose={onClose}
      title={group.name}
      footer={
        <form onSubmit={submit} className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${group.name}...`}
            className="flex-1 h-10 px-4 rounded-full bg-subtle border border-line text-body text-ink placeholder:text-ink-3 focus:outline-none focus:border-brand"
          />
          <Button type="submit" size="md" disabled={!draft.trim()}>
            Send
          </Button>
        </form>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-subtle">
          <div className="flex items-center gap-2.5">
            <GroupAvatar icon={group.icon} tint={group.tint} size={40} />
            <div>
              <p className="text-caption font-semibold text-ink">
                {group.category} · {formatCount(group.members)} members
              </p>
              <p className="text-meta text-ink-3">
                Admin: {(group.admins || ['Campus Admin']).join(', ')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onLeave(group.id)}
            className="text-caption font-medium text-danger hover:underline cursor-pointer"
          >
            Leave
          </button>
        </div>

        <div className="space-y-2.5">
          {messages.map((m) => (
            <div key={m.id} className="p-3 rounded-2xl bg-card border border-line">
              <div className="flex items-center justify-between">
                <span className="text-caption font-semibold text-ink">{m.sender}</span>
                <span className="text-meta text-ink-3">{m.time}</span>
              </div>
              <p className="text-body text-ink-2 mt-1">{m.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

function CreateGroupSheet({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(GROUP_CATEGORIES[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), category });
    setName('');
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Create a group"
      footer={
        <Button size="lg" className="w-full" disabled={!name.trim()} onClick={handleSubmit}>
          <Check size={16} /> Create Group
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-caption font-medium text-ink-2">Group name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Calculus Study Group"
            className="mt-1.5 w-full h-11 px-3.5 rounded-xl bg-subtle border border-line text-body text-ink placeholder:text-ink-3 focus:outline-none focus:border-brand"
          />
        </label>
        <div>
          <span className="text-caption font-medium text-ink-2 block mb-2">Category</span>
          <div className="flex flex-wrap gap-2">
            {GROUP_CATEGORIES.map((cat) => (
              <Chip key={cat} active={category === cat} onClick={() => setCategory(cat)}>
                {cat}
              </Chip>
            ))}
          </div>
        </div>
      </form>
    </Sheet>
  );
}
