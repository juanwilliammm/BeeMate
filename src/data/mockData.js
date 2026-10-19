export const FACULTY_MAJORS_MAP = {
  'School of Computer Science': [
    'Computer Science',
    'Information Systems',
    'Data Science',
    'Cyber Security'
  ],
  'Binus Business School': [
    'Management',
    'Digital Business Innovation'
  ],
  'School of Design': [
    'Visual Communication Design',
    'Interior Design'
  ],
  'Faculty of Engineering': [
    'Industrial Engineering'
  ],
  'Faculty of Humanities': [
    'Psychology',
    'International Relations'
  ]
};

export const FACULTIES = [
  'Semua',
  ...Object.keys(FACULTY_MAJORS_MAP)
];

export const MAJORS = [
  'Semua',
  ...Object.values(FACULTY_MAJORS_MAP).flat()
];

export const BATCHES = ['Semua', '2023', '2024', '2025', '2026'];

export const GOALS = [
  'Semua',
  'Cari teman belajar',
  'Cari partner lomba',
  'Partner tugas kelompok',
  'Kolaborasi organisasi',
  'Sekadar ngobrol'
];

// Display labels for goals (stored values stay unchanged for data compatibility)
export const GOAL_LABELS = {
  Semua: 'All goals',
  'Cari teman belajar': 'Study buddy',
  'Cari partner lomba': 'Competition teammate',
  'Partner tugas kelompok': 'Group project partner',
  'Kolaborasi organisasi': 'Organization collab',
  'Sekadar ngobrol': 'Just networking'
};

export const goalLabel = (g) => GOAL_LABELS[g] || g;

// Interest tags shown on the Interest Selection screen (label + small icon)
export const INTEREST_OPTIONS = [
  { label: 'Programming', icon: '💻' },
  { label: 'Web Development', icon: '🌐' },
  { label: 'Mobile App', icon: '📱' },
  { label: 'UI/UX Design', icon: '🎨' },
  { label: 'Graphic Design', icon: '🖌️' },
  { label: 'Machine Learning', icon: '🤖' },
  { label: 'Data Analytics', icon: '📊' },
  { label: 'Cyber Security', icon: '🔐' },
  { label: 'Technology', icon: '⚙️' },
  { label: 'Hackathon', icon: '🏆' },
  { label: 'Business Case', icon: '💼' },
  { label: 'Entrepreneurship', icon: '🚀' },
  { label: 'Finance', icon: '💰' },
  { label: 'Public Speaking', icon: '🎤' },
  { label: 'Copywriting', icon: '✍️' },
  { label: 'Academic Research', icon: '🔬' },
  { label: 'Mathematics', icon: '📐' },
  { label: 'Photography', icon: '📷' },
  { label: 'Music', icon: '🎵' },
  { label: 'Gaming', icon: '🎮' },
  { label: 'Sports', icon: '🏀' },
  { label: 'Fitness', icon: '💪' },
  { label: 'Travel', icon: '✈️' }
];

export const INTERESTS_LIST = INTEREST_OPTIONS.map((o) => o.label);

export const MIN_INTERESTS = 2;

// Older builds stored Indonesian labels — map them so saved data keeps matching.
const LEGACY_INTEREST_ALIASES = {
  Fotografi: 'Photography',
  'Musik & Band': 'Music',
  'Riset Akademik': 'Academic Research',
  'E-Sports': 'Gaming'
};

export function normalizeInterests(list = []) {
  const mapped = (list || []).map((i) => LEGACY_INTEREST_ALIASES[i] || i);
  return [...new Set(mapped)];
}

export function getInterestIcon(label) {
  return INTEREST_OPTIONS.find((o) => o.label === label)?.icon || '•';
}

// Single source of truth for Match Compatibility Score across Home & Matching screens
export function calculateMatchScore(user, candidate) {
  if (!user || !candidate) return 75;
  const userInterests = normalizeInterests(user.interests);
  const candidateInterests = normalizeInterests(candidate.interests);
  const sharedCount = candidateInterests.filter((i) =>
    userInterests.includes(i)
  ).length;
  const sameGoalBonus = candidate.goal === user.goal ? 25 : 8;
  const sameFacultyBonus = candidate.faculty === user.faculty ? 10 : 5;
  const baseScore = 32;
  return Math.min(98, baseScore + sharedCount * 14 + sameGoalBonus + sameFacultyBonus);
}

// Contextual auto-reply generator based on partner profile
export function generatePartnerReply(partner, userMessage = '') {
  if (!partner) {
    return 'Siap! Yuk kita jadwalkan waktu buat diskusi bareng di kampus.';
  }
  const lower = userMessage.toLowerCase();
  if (lower.includes('jadwal') || lower.includes('kapan') || lower.includes('diskusi')) {
    return `Boleh banget! Aku biasanya di kampus ${partner.campus || 'Anggrek'} sekitar jam 1 siang habis kelas ${partner.major}. Kita ketemu di library atau coworking space yuk?`;
  }
  if (lower.includes('lomba') || lower.includes('tim') || lower.includes('kompetisi') || lower.includes('kolab')) {
    return `Pas banget! Kebetulan fokusku sekarang "${partner.promptAnswer}". Kalau kita gabungin skill kita buat ${partner.goal.toLowerCase()}, pasti solid banget timnya!`;
  }
  const replies = [
    `Halo! Senang bisa terhubung. Aku lihat kita punya ketertarikan yang nyambung buat ${partner.goal.toLowerCase()}. Lagi fokus proyek atau mata kuliah apa semester ini?`,
    `Setuju banget! Kebetulan aku lagi mendalami "${partner.promptAnswer}" di ${partner.major}. Kapan-kapan kita bahas bareng di ${partner.campus} yuk!`,
    `Mantap! Aku simpan catatannya ya. Kalau ada draf ide atau repo/Figma yang mau dibahas bareng, kabari aja!`
  ];
  const idx = (userMessage.length + partner.name.length) % replies.length;
  return replies[idx];
}

export const INITIAL_USER = {
  name: 'Rafi Pratama',
  email: 'rafi.pratama@binus.ac.id',
  nim: '2802419283',
  major: 'Computer Science',
  faculty: 'School of Computer Science',
  batch: '2024',
  graduationYear: '2028',
  campus: 'Kemanggisan (Anggrek)',
  verified: true,
  verificationStatus: 'Disetujui', // 'Menunggu' | 'Disetujui' | 'Ditolak'
  bio: 'Suka eksplor front-end development dan lagi nyari tim buat lomba GEMASTIK & Hackathon tahun ini. Ayo diskusi bareng di Perpus Anggrek!',
  goal: 'Cari partner lomba',
  promptQuestion: 'Target kolaborasi semester ini',
  promptAnswer: 'Lolos final GEMASTIK divisi Pengembangan Perangkat Lunak',
  interests: ['Web Development', 'UI/UX Design', 'Hackathon', 'Mobile App'],
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  dndMode: false,
  streakNotif: true,
  hideBatch: false,
  disableVideoCall: false,
};

export const MOCK_PROFILES = [
  {
    id: 'p1',
    name: 'Nadya Kusuma',
    faculty: 'School of Design',
    major: 'Visual Communication Design',
    batch: '2024',
    verified: true,
    campus: 'Kemanggisan (Anggrek)',
    goal: 'Cari partner lomba',
    bio: 'UI/UX enthusiast yang butuh partner developer buat bikin produk digital & ikut lomba UI/UX nasional. Sering nongkrong di coworking space Syahdan!',
    interests: ['UI/UX Design', 'Hackathon', 'Photography', 'Copywriting'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    likedMe: true,
    online: true,
    promptQuestion: 'Topik kuliah & riset favorit',
    promptAnswer: 'Interactive Media Design & Design Thinking untuk Smart Campus',
    portfolioTag: 'Juara 2 UI/UX Design Challenge 2025'
  },
  {
    id: 'p2',
    name: 'Kevin Wijaya',
    faculty: 'Binus Business School',
    major: 'Digital Business Innovation',
    batch: '2024',
    verified: true,
    campus: 'Alam Sutera',
    goal: 'Cari partner lomba',
    bio: 'Fokus di pitching, market research, dan business model canvas. Lagi cari Hustler/Hacker buat tim kompetisi Startup & Business Case.',
    interests: ['Business Case', 'Public Speaking', 'Hackathon', 'Data Analytics'],
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    likedMe: true,
    online: true,
    promptQuestion: 'Proyek impian selama di Binus',
    promptAnswer: 'Bikin EdTech startup bareng anak SoCS & DKV!',
    portfolioTag: 'Finalis National Business Plan Competition'
  },
  {
    id: 'p3',
    name: 'Alya Putri Maharani',
    faculty: 'School of Computer Science',
    major: 'Data Science',
    batch: '2025',
    verified: true,
    campus: 'Kemanggisan (Anggrek)',
    goal: 'Cari teman belajar',
    bio: 'Mahasiswa semester 3 yang lagi mendalami Python, Machine Learning, dan Kalkulus. Cari teman belajar bareng menjelang UTS/UAS.',
    interests: ['Machine Learning', 'Data Analytics', 'Academic Research', 'Programming'],
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    likedMe: true,
    online: false,
    promptQuestion: 'Spot belajar & fokus diskusi',
    promptAnswer: 'Lantai 4 Library Anggrek — Bedah dataset Kaggle & NLP',
    portfolioTag: 'Asisten Lab Algoritma & Pemrograman'
  },
  {
    id: 'p4',
    name: 'Bima Sakti Nugroho',
    faculty: 'School of Computer Science',
    major: 'Cyber Security',
    batch: '2023',
    verified: true,
    campus: 'Kemanggisan (Syahdan)',
    goal: 'Partner tugas kelompok',
    bio: 'Aktif di CSC (Cyber Security Community). Suka bahas CTF, Network Security, dan Cloud Architecture. Santai diajak diskusi proyek.',
    interests: ['Cyber Security', 'Web Development', 'Hackathon', 'Gaming'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    likedMe: false,
    online: true,
    promptQuestion: 'Topik kuliah yang paling kamu suka',
    promptAnswer: 'Ethical Hacking, Penetration Testing & DevSecOps',
    portfolioTag: 'Top 10 Nasional Capture The Flag (CTF)'
  },
  {
    id: 'p5',
    name: 'Clarissa Tan',
    faculty: 'Faculty of Humanities',
    major: 'Psychology',
    batch: '2026',
    verified: true,
    campus: 'Kemanggisan (Kijang)',
    goal: 'Kolaborasi organisasi',
    bio: 'Mahasiswa Psikologi 2026! Pengen kenal teman lintas jurusan buat kepanitiaan event kampus dan UX Research perilaku pengguna.',
    interests: ['UI/UX Design', 'Public Speaking', 'Academic Research', 'Music'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    likedMe: true,
    online: true,
    promptQuestion: 'Alasan gabung BeeMate',
    promptAnswer: 'Kolaborasi riset psikologi kognitif & UX dengan anak IT/Desain!',
    portfolioTag: 'Koordinator Divisi Acara Himpunan Mahasiswa'
  },
  {
    id: 'p6',
    name: 'Dionisius Hendra',
    faculty: 'Faculty of Engineering',
    major: 'Industrial Engineering',
    batch: '2024',
    verified: true,
    campus: 'Bekasi',
    goal: 'Sekadar ngobrol',
    bio: 'Tertarik sama supply chain, optimasi sistem, dan manajemen produk. Kapan saja siap diajak diskusi sambil bahas persiapan magang.',
    interests: ['Data Analytics', 'Business Case', 'Finance', 'Photography'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    likedMe: true,
    online: false,
    promptQuestion: 'Topik kuliah yang paling kamu suka',
    promptAnswer: 'System Simulation, Operations Research & Product Management',
    portfolioTag: 'Product Management Intern Cohort'
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: 'c1',
    partnerId: 'p1',
    streakDays: 4, // >= 3 days -> Video Call Unlocked!
    streakExpiringSoon: false,
    sentByMeToday: true,
    sentByPartnerToday: true,
    streakIncrementedToday: true,
    unreadCount: 1,
    lastUpdated: '19:45',
    icebreakers: [
      'Halo Nadya! Lihat kamu suka UI/UX & Hackathon, lagi persiapan lomba apa nih?',
      'Desain sistem atau prototyping di Figma biasanya bagian favoritmu?',
      'Kapan-kapan belajar bareng di Library Anggrek yuk!'
    ],
    messages: [
      {
        id: 'm1',
        sender: 'partner',
        text: 'Halo Rafi! Salam kenal ya, aku lihat di profilmu kamu fokus Web Dev & Mobile App.',
        time: '3 hari lalu',
        status: 'read'
      },
      {
        id: 'm2',
        sender: 'me',
        text: 'Halo Nadya! Iya betul, aku lagi nyari UI/UX Designer buat tim lomba GEMASTIK bulan depan.',
        time: '2 hari lalu',
        status: 'read'
      },
      {
        id: 'm3',
        sender: 'partner',
        text: 'Wah kebetulan banget! Aku udah ada beberapa riset studi kasus Smart Campus nih.',
        time: 'Kemarin',
        status: 'read'
      },
      {
        id: 'm4',
        sender: 'me',
        text: 'Keren banget! Karena streak chat kita udah 4 hari, kita udah bisa diskusi lewat Video Call di BeeMate lho.',
        time: '19:42',
        status: 'read'
      },
      {
        id: 'm5',
        sender: 'partner',
        text: 'Siap Rafi! Malam ini aku free kok kalau mau singkat bahas wireframe-nya lewat video call.',
        time: '19:45',
        status: 'read'
      }
    ]
  },
  {
    id: 'c2',
    partnerId: 'p2',
    streakDays: 2, // < 3 days -> Video Call Locked (Sisa 1 hari)
    streakExpiringSoon: true, // Shows hourglass icon (FR-56)
    sentByMeToday: false,
    sentByPartnerToday: false,
    streakIncrementedToday: false,
    unreadCount: 0,
    lastUpdated: 'Kemarin',
    icebreakers: [
      'Halo Kevin! Lagi nyiapin deck buat kompetisi Business Case apa sekarang?',
      'Gimana kalau kita kolaborasi bikin MVP produk buat lomba startup?'
    ],
    messages: [
      {
        id: 'm201',
        sender: 'me',
        text: 'Hai Kevin! Tertarik banget lihat profilmu dari Digital Business Innovation.',
        time: '2 hari lalu',
        status: 'read'
      },
      {
        id: 'm202',
        sender: 'partner',
        text: 'Halo bro Rafi! Wah anak Computer Science nih, pas banget kita bisa kolaborasi.',
        time: 'Kemarin',
        status: 'read'
      }
    ]
  },
  {
    id: 'c3',
    partnerId: 'p3',
    streakDays: 0, // New match, no messages yet (FR-31)
    streakExpiringSoon: false,
    sentByMeToday: false,
    sentByPartnerToday: false,
    streakIncrementedToday: false,
    unreadCount: 0,
    lastUpdated: 'Baru saja',
    icebreakers: [
      'Hai Alya! Kita sama-sama tertarik Web Development nih, lagi ambil mata kuliah apa semester ini?',
      'Halo Alya! Biasanya belajar bareng di Library Anggrek hari apa?'
    ],
    messages: []
  }
];
