/**
 * BeeMate community mock data (events, group rooms, groups, shared files).
 *
 * ⚠️ MOCK ONLY — there is no backend for events, rooms or groups yet.
 * Everything here is static sample data; joins/registrations are persisted
 * locally (localStorage) by App.jsx. Replace these exports with API calls
 * once the corresponding Supabase tables exist.
 */

const img = (id, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=70`;

// Dates are generated relative to "now" so the demo always has upcoming/live items.
const at = (dayOffset, hour, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};
const minutesFromNow = (m) => new Date(Date.now() + m * 60000).toISOString();

export const EVENT_CATEGORIES = ['All', 'Workshop', 'Seminar', 'Competition', 'Networking', 'Organization'];

export const MOCK_EVENTS = [
  {
    id: 'e1',
    title: 'UI/UX Design Sprint: Smart Campus',
    category: 'Workshop',
    cover: img('photo-1531482615713-2afd69097998'),
    startsAt: at(2, 13, 0),
    location: 'Anggrek Campus · Room 704',
    online: false,
    attendees: 128,
    capacity: 150,
    fee: 0,
    host: 'HIMTI Binus',
    tags: ['UI/UX Design', 'Hackathon', 'Graphic Design'],
    description:
      'A hands-on 4-hour sprint where cross-major teams prototype a smart-campus feature in Figma, then pitch to mentors.'
  },
  {
    id: 'e2',
    title: 'GEMASTIK Team Formation Night',
    category: 'Networking',
    cover: img('photo-1523580494863-6f3031224c94'),
    startsAt: at(3, 18, 30),
    location: 'Syahdan Campus · Auditorium',
    online: false,
    attendees: 2140,
    capacity: 2500,
    fee: 0,
    host: 'Student Association SoCS',
    tags: ['Hackathon', 'Programming', 'Web Development'],
    description:
      'Meet developers, designers and business students looking for competition teammates. Short intros, then open networking.'
  },
  {
    id: 'e3',
    title: 'Startup Pitch Clinic',
    category: 'Seminar',
    cover: img('photo-1556761175-5973dc0f32e7'),
    startsAt: at(5, 10, 0),
    location: 'Zoom (link after registration)',
    online: true,
    attendees: 342,
    capacity: 500,
    fee: 25000,
    host: 'Binus Entrepreneurship Center',
    tags: ['Entrepreneurship', 'Business Case', 'Public Speaking'],
    description:
      'Learn how to structure a 3-minute pitch deck, with live feedback from founders and venture partners.'
  },
  {
    id: 'e4',
    title: 'Intro to Machine Learning with Python',
    category: 'Workshop',
    cover: img('photo-1517245386807-bb43f82c33c4'),
    startsAt: at(6, 15, 0),
    location: 'Alam Sutera Campus · Lab 3',
    online: false,
    attendees: 76,
    capacity: 80,
    fee: 0,
    host: 'Data Science Club',
    tags: ['Machine Learning', 'Data Analytics', 'Programming'],
    description: 'Bring your laptop. We will train a first classifier on a Kaggle dataset together.'
  },
  {
    id: 'e5',
    title: 'Business Case Competition 2026',
    category: 'Competition',
    cover: img('photo-1552664730-d307ca884978'),
    startsAt: at(9, 8, 0),
    location: 'Kijang Campus · Hall B',
    online: false,
    attendees: 410,
    capacity: 600,
    fee: 50000,
    host: 'Binus Business School',
    tags: ['Business Case', 'Finance', 'Entrepreneurship'],
    description: 'Teams of three solve a real company case in 48 hours. Top teams present to industry judges.'
  },
  {
    id: 'e6',
    title: 'Campus Photo Walk',
    category: 'Organization',
    cover: img('photo-1452587925148-ce544e77e70d'),
    startsAt: at(4, 16, 0),
    location: 'Anggrek Campus · Main Lobby',
    online: false,
    attendees: 45,
    capacity: 60,
    fee: 0,
    host: 'Binus Photography Club',
    tags: ['Photography', 'Travel'],
    description: 'A relaxed golden-hour walk around campus. Any camera (including phones) welcome.'
  }
];

export const MOCK_ONGOING_EVENTS = [
  {
    id: 'live1',
    title: 'Career Talk: Life as a Product Designer',
    category: 'Seminar',
    cover: img('photo-1475721027785-f74eccf877e2', 400),
    startedAt: minutesFromNow(-35),
    endsAt: minutesFromNow(55),
    location: 'Google Meet',
    online: true,
    attendees: 214,
    host: 'Career Center',
    description: 'Live Q&A with a senior product designer about portfolios, internships and day-to-day work.'
  },
  {
    id: 'live2',
    title: 'Weekly Hack Night',
    category: 'Networking',
    cover: img('photo-1504384308090-c894fdcc538d', 400),
    startedAt: minutesFromNow(-80),
    endsAt: minutesFromNow(100),
    location: 'Anggrek Campus · Co-working Space',
    online: false,
    attendees: 38,
    host: 'BeeMate Community',
    description: 'Drop in, work on side projects and get unstuck with help from other builders.'
  }
];

export const ROOM_TYPES = {
  study: { label: 'Study', icon: '📚' },
  project: { label: 'Project', icon: '🛠️' },
  interest: { label: 'Interest', icon: '💬' },
  casual: { label: 'Casual', icon: '☕' },
  community: { label: 'Community', icon: '🏛️' }
};

export const MOCK_ROOMS = [
  { id: 'r1', name: 'Algorithm & Programming', topic: 'Midterm prep · Recursion', type: 'study', participants: 12, capacity: 20, status: 'open' },
  { id: 'r2', name: 'GEMASTIK Squad Finder', topic: 'Software dev division', type: 'project', participants: 8, capacity: 10, status: 'open' },
  { id: 'r3', name: 'Figma Critique Corner', topic: 'Share & review your designs', type: 'interest', participants: 15, capacity: 15, status: 'full' },
  { id: 'r4', name: 'Calculus II Late Night', topic: 'Integration techniques', type: 'study', participants: 5, capacity: 12, status: 'open' },
  { id: 'r5', name: 'Coffee Break Chat', topic: 'Meet people from other majors', type: 'casual', participants: 21, capacity: 30, status: 'open' },
  { id: 'r6', name: 'Anggrek Campus Hub', topic: 'Announcements & meetups', type: 'community', participants: 0, capacity: 100, status: 'scheduled', opensAt: '19:00' }
];

export const GROUP_CATEGORIES = ['Academic', 'Hobby', 'Campus', 'Career'];

// Icon/colour pairs for group avatars (lucide icon name resolved in UI)
export const MOCK_GROUPS = [
  {
    id: 'g1',
    name: 'Web Dev Study Circle',
    category: 'Academic',
    icon: 'Code2',
    tint: '#6366F1',
    members: 1240,
    admins: ['Kevin Wijaya'],
    adminAvatars: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=60'],
    lastMessage: 'We have a meeting in 10 mins at Library L4',
    lastTime: '19:25',
    unread: 2,
    joined: true
  },
  {
    id: 'g2',
    name: 'Design Team · HIMTI',
    category: 'Campus',
    icon: 'Palette',
    tint: '#A855F7',
    members: 86,
    admins: ['Nadya Kusuma'],
    adminAvatars: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60'],
    lastMessage: 'Guys, any updates on the poster?',
    lastTime: '18:02',
    unread: 0,
    joined: true
  },
  {
    id: 'g3',
    name: 'Binus Fitness Club',
    category: 'Hobby',
    icon: 'Dumbbell',
    tint: '#F97316',
    members: 5200,
    admins: ['Dionisius Hendra'],
    adminAvatars: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60'],
    joined: false
  },
  {
    id: 'g4',
    name: 'Gaming & E-Sports',
    category: 'Hobby',
    icon: 'Gamepad2',
    tint: '#0EA5E9',
    members: 5600,
    admins: ['Bima Sakti', 'Alya Putri'],
    adminAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&auto=format&fit=crop&q=60'
    ],
    joined: false
  },
  {
    id: 'g5',
    name: 'Data Science Society',
    category: 'Academic',
    icon: 'BarChart3',
    tint: '#10B981',
    members: 2300,
    admins: ['Alya Putri'],
    adminAvatars: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&auto=format&fit=crop&q=60'],
    joined: false
  },
  {
    id: 'g6',
    name: 'Internship Hunters',
    category: 'Career',
    icon: 'Briefcase',
    tint: '#F59E0B',
    members: 3900,
    admins: ['Clarissa Tan'],
    adminAvatars: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=60'],
    joined: false
  }
];

export const MOCK_GROUP_FILES = {
  g1: {
    count: 254,
    items: [
      { id: 'f1', name: 'React-cheatsheet.pdf', kind: 'pdf' },
      { id: 'f2', name: 'wireframe.png', kind: 'image', thumb: img('photo-1581291518857-4e27b48ff24e', 200) },
      { id: 'f3', name: 'api-notes.docx', kind: 'doc' }
    ]
  },
  g2: {
    count: 82,
    items: [
      { id: 'f4', name: 'poster-v3.png', kind: 'image', thumb: img('photo-1561070791-2526d30994b5', 200) },
      { id: 'f5', name: 'moodboard.jpg', kind: 'image', thumb: img('photo-1558655146-9f40138edfeb', 200) },
      { id: 'f6', name: 'brand-guide.pdf', kind: 'pdf' }
    ]
  }
};

// Seed "stories / activity" are derived from conversations in MessagesScreen,
// so no separate mock structure is needed here.
