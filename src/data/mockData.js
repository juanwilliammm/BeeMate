export const FACULTIES = [
  'Semua',
  'School of Computer Science',
  'Binus Business School',
  'School of Design',
  'Faculty of Engineering',
  'Faculty of Humanities'
];

export const MAJORS = [
  'Semua',
  'Computer Science',
  'Information Systems',
  'Data Science',
  'Cyber Security',
  'Management',
  'Digital Business Innovation',
  'Visual Communication Design',
  'Interior Design',
  'Industrial Engineering',
  'Psychology',
  'International Relations'
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

export const INTERESTS_LIST = [
  'UI/UX Design',
  'Web Development',
  'Machine Learning',
  'Hackathon',
  'Business Case',
  'Data Analytics',
  'Mobile App',
  'Public Speaking',
  'Cyber Security',
  'Copywriting',
  'Fotografi',
  'E-Sports',
  'Musik & Band',
  'Riset Akademik'
];

export const INITIAL_USER = {
  name: 'Rafi Pratama',
  email: 'rafi.pratama@binus.ac.id',
  nim: '2802419283',
  major: 'Computer Science',
  faculty: 'School of Computer Science',
  batch: '2024',
  graduationYear: '2028',
  verified: true,
  verificationStatus: 'Disetujui', // 'Menunggu' | 'Disetujui' | 'Ditolak'
  bio: 'Suka eksplor front-end development dan lagi nyari tim buat lomba GEMASTIK & Hackathon tahun ini. Ayo diskusi bareng di Perpus Anggrek!',
  goal: 'Cari partner lomba',
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
    nim: '2801928371',
    faculty: 'School of Design',
    major: 'Visual Communication Design',
    batch: '2024',
    verified: true,
    campus: 'Kemanggisan (Anggrek)',
    goal: 'Cari partner lomba',
    bio: 'UI/UX enthusiast yang butuh partner developer buat bikin produk digital & ikut lomba UI/UX nasional. Sering nongkrong di coworking space Syahdan!',
    interests: ['UI/UX Design', 'Hackathon', 'Fotografi', 'Copywriting'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    likedMe: true,
    online: true,
    promptQuestion: 'Topik kuliah yang paling kamu suka',
    promptAnswer: 'Interactive Media Design & Design Thinking'
  },
  {
    id: 'p2',
    name: 'Kevin Wijaya',
    nim: '2805518290',
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
    promptAnswer: 'Bikin EdTech startup bareng anak SoCS & DKV!'
  },
  {
    id: 'p3',
    name: 'Alya Putri Maharani',
    nim: '2901827364',
    faculty: 'School of Computer Science',
    major: 'Data Science',
    batch: '2025',
    verified: true,
    campus: 'Kemanggisan (Anggrek)',
    goal: 'Cari teman belajar',
    bio: 'Mahasiswa semester 3 yang lagi mendalami Python, Machine Learning, dan Kalkulus. Cari teman belajar bareng menjelang UTS/UAS.',
    interests: ['Machine Learning', 'Data Analytics', 'Riset Akademik', 'Web Development'],
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    likedMe: true,
    online: false,
    promptQuestion: 'Spot belajar favorit di kampus',
    promptAnswer: 'Lantai 4 Library Anggrek dekat jendela'
  },
  {
    id: 'p4',
    name: 'Bima Sakti Nugroho',
    nim: '2709182736',
    faculty: 'School of Computer Science',
    major: 'Cyber Security',
    batch: '2023',
    verified: true,
    campus: 'Kemanggisan (Syahdan)',
    goal: 'Partner tugas kelompok',
    bio: 'Aktif di CSC (Cyber Security Community). Suka bahas CTF, Network Security, dan Cloud Architecture. Santai diajak diskusi proyek.',
    interests: ['Cyber Security', 'Web Development', 'Hackathon', 'E-Sports'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    likedMe: false,
    online: true,
    promptQuestion: 'Topik kuliah yang paling kamu suka',
    promptAnswer: 'Ethical Hacking & Penetration Testing'
  },
  {
    id: 'p5',
    name: 'Clarissa Tan',
    nim: '3001928345',
    faculty: 'Faculty of Humanities',
    major: 'Psychology',
    batch: '2026',
    verified: true,
    campus: 'Kemanggisan (Kijang)',
    goal: 'Kolaborasi organisasi',
    bio: 'Maba Psikologi 2026! Pengen kenal teman lintas jurusan buat kepanitiaan event kampus dan riset perilaku pengguna aplikasi.',
    interests: ['UI/UX Design', 'Public Speaking', 'Riset Akademik', 'Musik & Band'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    likedMe: true,
    online: true,
    promptQuestion: 'Alasan gabung BeeMate',
    promptAnswer: 'Pengen punya teman dari luar jurusan Psikologi!'
  },
  {
    id: 'p6',
    name: 'Dionisius Hendra',
    nim: '2803948571',
    faculty: 'Faculty of Engineering',
    major: 'Industrial Engineering',
    batch: '2024',
    verified: true,
    campus: 'Bekasi',
    goal: 'Sekadar ngobrol',
    bio: 'Tertarik sama supply chain, optimasi sistem, dan manajemen produk. Kapan saja siap diajak ngopi sambil bahas prospek magang.',
    interests: ['Data Analytics', 'Business Case', 'Mobile App', 'Fotografi'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    likedMe: true,
    online: false,
    promptQuestion: 'Topik kuliah yang paling kamu suka',
    promptAnswer: 'System Simulation & Engineering Economy'
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: 'c1',
    partnerId: 'p1',
    streakDays: 4, // >= 3 days -> Video Call Unlocked!
    streakExpiringSoon: false,
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
    unreadCount: 0,
    lastUpdated: 'Baru saja',
    icebreakers: [
      'Hai Alya! Kita sama-sama tertarik Web Development nih, lagi ambil mata kuliah apa semester ini?',
      'Halo Alya! Biasanya belajar bareng di Library Anggrek hari apa?'
    ],
    messages: []
  }
];
