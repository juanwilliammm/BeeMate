import React, { useState, useEffect } from 'react';
import {
  INITIAL_USER,
  MOCK_PROFILES,
  INITIAL_CONVERSATIONS,
  generatePartnerReply
} from './data/mockData';
import BottomNav from './components/BottomNav';
import ReportBlockModal from './components/ReportBlockModal';

// Splash Screen + 11 PRD Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import VerifyOtpScreen from './screens/VerifyOtpScreen';
import VerifyNimScreen from './screens/VerifyNimScreen';
import VerifyIdScreen from './screens/VerifyIdScreen';
import HomeScreen from './screens/HomeScreen';
import MatchingScreen from './screens/MatchingScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import VideoCallScreen from './screens/VideoCallScreen';
import IncomingCallScreen from './screens/IncomingCallScreen';

import {
  Bell,
  SlidersHorizontal,
  X,
  Flame,
  PhoneIncoming,
  RotateCcw,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';

const STORAGE_PREFIX = 'beemate_v2_';

function usePersistentState(key, initialValue) {
  const storageKey = `${STORAGE_PREFIX}${key}`;
  const [state, setState] = useState(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback to initialValue if localStorage is unavailable
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Ignore quota errors
    }
  }, [storageKey, state]);

  return [state, setState];
}

function purgeVerifiedStudentIdFromIdb(nim) {
  try {
    if (!window.indexedDB || !nim) return;
    const req = window.indexedDB.open('beemate_secure_idb', 1);
    req.onsuccess = () => {
      const db = req.result;
      if (db.objectStoreNames.contains('student_ids')) {
        const tx = db.transaction('student_ids', 'readwrite');
        tx.objectStore('student_ids').delete(nim);
      }
    };
  } catch {
    // Ignore IDB errors
  }
}

const VALID_SCREENS = [
  'splash',
  'login',
  'verify-otp',
  'verify-nim',
  'verify-id',
  'home',
  'matching',
  'messages',
  'chat',
  'profile',
  'video-call',
  'incoming-call'
];

export default function App() {
  const [currentScreen, setCurrentScreenState] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return VALID_SCREENS.includes(hash) ? hash : 'splash';
  });

  const [theme, setTheme] = usePersistentState('theme', 'light');
  const [user, setUser] = usePersistentState('user', INITIAL_USER);
  const [profiles] = useState(MOCK_PROFILES);
  const [swipedIds, setSwipedIds] = usePersistentState('swipedIds', []);
  const [blockedIds, setBlockedIds] = usePersistentState('blockedIds', []);
  const [reports, setReports] = usePersistentState('reports', []);
  const [dailyLikesLeft, setDailyLikesLeft] = usePersistentState('dailyLikesLeft', 15);
  const [conversations, setConversations] = usePersistentState(
    'conversations',
    INITIAL_CONVERSATIONS
  );
  const [activeConvId, setActiveConvId] = usePersistentState('activeConvId', 'c1');

  const [focusedProfileId, setFocusedProfileId] = useState(null);
  const [newlyMatchedProfile, setNewlyMatchedProfile] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const [notificationToast, setNotificationToast] = useState(null);
  const [showDemoDrawer, setShowDemoDrawer] = useState(false);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sync currentScreen with URL hash for native browser Back/Forward support
  const setCurrentScreen = (nextScreen) => {
    setCurrentScreenState(nextScreen);
    if (window.location.hash !== `#${nextScreen}`) {
      window.history.pushState(null, '', `#${nextScreen}`);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (VALID_SCREENS.includes(hash)) {
        setCurrentScreenState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 3400);
  };

  const handleUpdateUser = (patch) => {
    setUser((prev) => {
      const updated = { ...prev, ...patch };
      if (patch.verificationStatus === 'Disetujui') {
        purgeVerifiedStudentIdFromIdb(updated.nim);
      }
      return updated;
    });
  };

  const visibleProfiles = profiles.filter((p) => !blockedIds.includes(p.id));

  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activePartner =
    visibleProfiles.find((p) => p.id === activeConversation?.partnerId) ||
    MOCK_PROFILES[0];

  const unreadTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  // Matching Swipe Logic
  const handleSwipeLeft = (profile) => {
    setSwipedIds((prev) => (prev.includes(profile.id) ? prev : [...prev, profile.id]));
    if (focusedProfileId === profile.id) {
      setFocusedProfileId(null);
    }
  };

  const handleSwipeRight = (profile) => {
    if (dailyLikesLeft <= 0) {
      showToast('Kuota ajak kolaborasi harian kamu sudah habis.');
      return;
    }
    setDailyLikesLeft((d) => Math.max(0, d - 1));
    setSwipedIds((prev) => (prev.includes(profile.id) ? prev : [...prev, profile.id]));
    if (focusedProfileId === profile.id) {
      setFocusedProfileId(null);
    }

    if (profile.likedMe) {
      setNewlyMatchedProfile(profile);
      const existing = conversations.find((c) => c.partnerId === profile.id);
      if (!existing) {
        const newConv = {
          id: `c-${Date.now()}`,
          partnerId: profile.id,
          streakDays: 0,
          streakExpiringSoon: false,
          sentByMeToday: false,
          sentByPartnerToday: false,
          streakIncrementedToday: false,
          unreadCount: 0,
          lastUpdated: 'Baru saja',
          icebreakers: [
            `Halo ${profile.name.split(' ')[0]}! Kita sama-sama ingin ${profile.goal}, yuk diskusi!`,
            `Hai ${profile.name.split(' ')[0]}! Topik "${profile.promptAnswer}" menarik banget!`
          ],
          messages: []
        };
        setConversations((prev) => [newConv, ...prev]);
      }
    } else {
      showToast(
        `Ajakan kolaborasi dikirim ke ${profile.name.split(' ')[0]}! Menunggu respon.`
      );
    }
  };

  const handleInspectProfileInDeck = (profileId) => {
    setFocusedProfileId(profileId);
    setCurrentScreen('matching');
  };

  const handleOpenChat = (convId) => {
    setActiveConvId(convId);
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    );
    setCurrentScreen('chat');
  };

  const handleOpenChatFromMatch = (partnerId) => {
    const conv = conversations.find((c) => c.partnerId === partnerId);
    setNewlyMatchedProfile(null);
    if (conv) {
      handleOpenChat(conv.id);
    } else {
      setCurrentScreen('messages');
    }
  };

  // Real-time Chat & Two-Way Streak Calculation
  const handleSendMessage = (convId, text, sender = 'me', imageUrl = null) => {
    const nowTime = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;

        const nextSentByMe = sender === 'me' ? true : Boolean(c.sentByMeToday);
        const nextSentByPartner =
          sender === 'partner' ? true : Boolean(c.sentByPartnerToday);
        const shouldIncrementStreak =
          nextSentByMe && nextSentByPartner && !c.streakIncrementedToday;
        const nextStreak = shouldIncrementStreak ? c.streakDays + 1 : c.streakDays;

        return {
          ...c,
          streakDays: nextStreak,
          streakExpiringSoon: false,
          sentByMeToday: nextSentByMe,
          sentByPartnerToday: nextSentByPartner,
          streakIncrementedToday:
            Boolean(c.streakIncrementedToday) || shouldIncrementStreak,
          lastUpdated: nowTime,
          messages: [
            ...c.messages,
            {
              id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              sender,
              text,
              imageUrl,
              time: nowTime,
              status: 'read'
            }
          ]
        };
      })
    );

    if (sender === 'me') {
      const targetConv = conversations.find((c) => c.id === convId);
      const partnerObj =
        visibleProfiles.find((p) => p.id === targetConv?.partnerId) || activePartner;
      const contextualReply = generatePartnerReply(partnerObj, text);

      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        });

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== convId) return c;
            const nextSentByMe = Boolean(c.sentByMeToday);
            const nextSentByPartner = true;
            const shouldIncrementStreak =
              nextSentByMe && nextSentByPartner && !c.streakIncrementedToday;
            const nextStreak = shouldIncrementStreak
              ? c.streakDays + 1
              : c.streakDays;

            return {
              ...c,
              streakDays: nextStreak,
              streakExpiringSoon: false,
              sentByMeToday: nextSentByMe,
              sentByPartnerToday: true,
              streakIncrementedToday:
                Boolean(c.streakIncrementedToday) || shouldIncrementStreak,
              lastUpdated: replyTime,
              messages: [
                ...c.messages,
                {
                  id: `m-reply-${Date.now()}`,
                  sender: 'partner',
                  text: contextualReply,
                  time: replyTime,
                  status: 'read'
                }
              ]
            };
          })
        );
      }, 950);
    }
  };

  const handleIncrementStreak = (convId) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const nextDays = c.streakDays + 1;
        if (nextDays === 3) {
          showToast('🔥 Streak 3 Hari Tercapai! Video Call 1-on-1 sekarang terbuka!');
        } else {
          showToast(`🔥 Simulasi: Streak bertambah menjadi ${nextDays} hari.`);
        }
        return {
          ...c,
          streakDays: nextDays,
          streakExpiringSoon: false,
          sentByMeToday: true,
          sentByPartnerToday: true,
          streakIncrementedToday: true
        };
      })
    );
  };

  // Enforce 3-Day Streak & DND Guard on Incoming Video Call
  const handleTriggerIncomingCall = () => {
    if (user.dndMode) {
      showToast('Mode Jangan Ganggu (DND) aktif: Panggilan masuk diheningkan.');
      return;
    }

    const eligibleConv =
      activeConversation?.streakDays >= 3
        ? activeConversation
        : conversations.find((c) => c.streakDays >= 3);

    if (!eligibleConv) {
      showToast(
        '🔒 Video Call terkunci: Belum ada partner dengan Streak minimal 3 hari.'
      );
      return;
    }

    setActiveConvId(eligibleConv.id);
    setCurrentScreen('incoming-call');
  };

  const handleDeleteConversation = (convId) => {
    const remaining = conversations.filter((c) => c.id !== convId);
    setConversations(remaining);
    if (remaining.length > 0) {
      setActiveConvId(remaining[0].id);
    }
    setCurrentScreen('messages');
    showToast('Percakapan dihapus.');
  };

  const handleConfirmReport = (targetId, reason) => {
    setSwipedIds((prev) => (prev.includes(targetId) ? prev : [...prev, targetId]));
    setReports((prev) => [
      ...prev,
      {
        id: `rep-${Date.now()}`,
        targetId,
        reason,
        createdAt: new Date().toISOString()
      }
    ]);
    showToast(`Laporan dikirim ke Admin (${reason}).`);
  };

  const handleConfirmBlock = (targetId) => {
    setBlockedIds((prev) => (prev.includes(targetId) ? prev : [...prev, targetId]));
    setConversations((prev) => prev.filter((c) => c.partnerId !== targetId));
    if (currentScreen === 'chat' || currentScreen === 'video-call') {
      setCurrentScreen('home');
    }
    showToast('Pengguna telah diblokir.');
  };

  const handleDeclineMissedCall = () => {
    if (activeConversation) {
      handleSendMessage(
        activeConversation.id,
        '📞 Panggilan video tidak terjawab',
        'system'
      );
    }
    showToast('Panggilan tak terjawab tercatat di Chat.');
    setCurrentScreen('chat');
  };

  const handleQuickReplyFromCall = (replyText) => {
    if (activeConversation) {
      handleSendMessage(
        activeConversation.id,
        '📞 Panggilan video ditolak dengan pesan',
        'system'
      );
      setTimeout(() => {
        handleSendMessage(activeConversation.id, replyText, 'me');
      }, 150);
    }
    showToast('Balasan cepat terkirim ke Chat.');
    setCurrentScreen('chat');
  };

  const handleResetDemoData = () => {
    try {
      Object.keys(window.localStorage).forEach((k) => {
        if (k.startsWith(STORAGE_PREFIX)) {
          window.localStorage.removeItem(k);
        }
      });
    } catch {
      // ignore
    }
    setUser(INITIAL_USER);
    setSwipedIds([]);
    setBlockedIds([]);
    setReports([]);
    setDailyLikesLeft(15);
    setConversations(INITIAL_CONVERSATIONS);
    setActiveConvId('c1');
    setFocusedProfileId(null);
    setShowDemoDrawer(false);
    showToast('Data demo berhasil direset ke kondisi awal.');
  };

  const showBottomNav = ['home', 'matching', 'messages', 'profile'].includes(
    currentScreen
  );

  return (
    <div
      className={`min-h-screen bg-[#08090C] flex items-center justify-center p-0 sm:p-4 transition-colors duration-300 ${
        theme === 'light' ? 'theme-light' : 'theme-dark'
      }`}
    >
      {/* Native Mobile App Frame */}
      <div className="w-full max-w-[420px] h-screen sm:h-[820px] bg-[#0F1115] sm:rounded-[40px] shadow-2xl shadow-black/40 overflow-hidden flex flex-col relative sm:border-[5px] sm:border-[#222631] transition-colors duration-300">
        {/* Global Notification Toast */}
        {notificationToast && (
          <div className="absolute top-12 left-4 right-4 z-50 bg-[#181B22]/95 backdrop-blur-md text-[#F3F4F6] px-4 py-3 rounded-2xl shadow-2xl border border-[#F59E0B]/50 flex items-center gap-2.5 text-xs animate-in fade-in duration-200">
            <Bell size={15} className="text-[#F59E0B] shrink-0" />
            <span className="font-semibold leading-snug">{notificationToast}</span>
          </div>
        )}

        {/* Floating Quick Controls: Theme Toggle (Light/Dark) + Demo Panel */}
        {currentScreen !== 'splash' && (
          <div className="absolute top-3 right-3 z-40 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleTheme}
              title={
                theme === 'light'
                  ? 'Ganti ke Dark Mode (Gelap)'
                  : 'Ganti ke Light Mode (Terang)'
              }
              className="px-2.5 py-1.5 rounded-full bg-[#181B22]/90 backdrop-blur-md border border-[#2E3440] text-[#F3F4F6] hover:border-[#F59E0B]/60 flex items-center gap-1.5 text-[11px] font-bold shadow-lg cursor-pointer transition-all"
            >
              {theme === 'light' ? (
                <>
                  <Sun size={12} className="text-[#F59E0B]" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon size={12} className="text-[#F59E0B]" />
                  <span>Dark</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowDemoDrawer(true)}
              title="Panel Simulasi Demo Dosen/Penguji"
              className="px-2.5 py-1.5 rounded-full bg-[#181B22]/90 backdrop-blur-md border border-[#2E3440] text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-[#F59E0B]/50 flex items-center gap-1.5 text-[11px] font-bold shadow-lg cursor-pointer transition-all"
            >
              <SlidersHorizontal size={12} className="text-[#F59E0B]" />
              <span>Demo</span>
            </button>
          </div>
        )}

        {/* Active Screen Viewport */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {currentScreen === 'splash' && (
            <SplashScreen
              theme={theme}
              onFinish={() => setCurrentScreen('login')}
            />
          )}

          {currentScreen === 'login' && (
            <LoginScreen
              theme={theme}
              onLoginSuccess={(email) => {
                handleUpdateUser({ email });
                showToast('Berhasil masuk ke akun BeeMate!');
                setCurrentScreen('home');
              }}
              onRegisterStart={(email) => {
                handleUpdateUser({
                  email,
                  verificationStatus: 'Menunggu'
                });
                setCurrentScreen('verify-otp');
              }}
              onQuickSkipToHome={() => setCurrentScreen('home')}
            />
          )}

          {/* Step 1 of 3: Verify Campus Email OTP */}
          {currentScreen === 'verify-otp' && (
            <VerifyOtpScreen
              user={user}
              onVerifiedOtp={() => {
                showToast('Email kampus terverifikasi! Lanjut isi NIM.');
                setCurrentScreen('verify-nim');
              }}
              onBack={() => setCurrentScreen('login')}
            />
          )}

          {/* Step 2 of 3: Verify 10-Digit NIM & Faculty/Major */}
          {currentScreen === 'verify-nim' && (
            <VerifyNimScreen
              user={user}
              onUpdateUser={handleUpdateUser}
              onNext={() => setCurrentScreen('verify-id')}
              onBack={() => setCurrentScreen('verify-otp')}
            />
          )}

          {/* Step 3 of 3: Upload Student ID & Select Collaboration Interests */}
          {currentScreen === 'verify-id' && (
            <VerifyIdScreen
              user={user}
              onUpdateUser={handleUpdateUser}
              onCompleteRegistration={() => {
                showToast(
                  'Pendaftaran selesai! Kartu Binusian sedang ditinjau Admin (1x24 jam).'
                );
                setCurrentScreen('home');
              }}
              onBack={() => setCurrentScreen('verify-nim')}
            />
          )}

          {currentScreen === 'home' && (
            <HomeScreen
              user={user}
              theme={theme}
              profiles={visibleProfiles}
              swipedIds={swipedIds}
              conversations={conversations}
              onNavigate={setCurrentScreen}
              onOpenChat={handleOpenChat}
              onInspectProfileInDeck={handleInspectProfileInDeck}
              onTriggerIncomingCall={handleTriggerIncomingCall}
            />
          )}

          {currentScreen === 'matching' && (
            <MatchingScreen
              user={user}
              profiles={visibleProfiles}
              swipedIds={swipedIds}
              focusedProfileId={focusedProfileId}
              dailyLikesLeft={dailyLikesLeft}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onResetSwipes={() => {
                setSwipedIds([]);
                setDailyLikesLeft(15);
                setFocusedProfileId(null);
              }}
              onOpenReportModal={(target) => setReportTarget(target)}
              newlyMatchedProfile={newlyMatchedProfile}
              onClearNewMatch={() => setNewlyMatchedProfile(null)}
              onOpenChatFromMatch={handleOpenChatFromMatch}
            />
          )}

          {currentScreen === 'messages' && (
            <MessagesScreen
              conversations={conversations}
              profiles={visibleProfiles}
              onOpenChat={handleOpenChat}
              onNavigateMatching={() => setCurrentScreen('matching')}
            />
          )}

          {currentScreen === 'chat' && (
            <ChatScreen
              conversation={activeConversation}
              partner={activePartner}
              onBack={() => setCurrentScreen('messages')}
              onSendMessage={handleSendMessage}
              onStartVideoCall={() => {
                if ((activeConversation?.streakDays || 0) < 3) {
                  showToast('🔒 Video Call hanya terbuka setelah Streak 3 hari.');
                  return;
                }
                setCurrentScreen('video-call');
              }}
              onDeleteConversation={handleDeleteConversation}
              onOpenReportModal={(target) => setReportTarget(target)}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              user={user}
              conversations={conversations}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onUpdateUser={handleUpdateUser}
              onLogout={() => {
                showToast('Kamu telah keluar dari akun.');
                setCurrentScreen('login');
              }}
              onDeleteAccount={() => {
                handleResetDemoData();
                setCurrentScreen('login');
              }}
            />
          )}

          {currentScreen === 'video-call' && (
            <VideoCallScreen
              user={user}
              partner={activePartner}
              conversation={activeConversation}
              onEndCall={(reasonMsg) => {
                if (reasonMsg && activeConversation) {
                  handleSendMessage(activeConversation.id, `📹 ${reasonMsg}`, 'system');
                }
                setCurrentScreen('chat');
              }}
              onOpenReportModal={(target) => setReportTarget(target)}
            />
          )}

          {currentScreen === 'incoming-call' && (
            <IncomingCallScreen
              caller={activePartner}
              theme={theme}
              streakDays={activeConversation?.streakDays || 3}
              userDndMode={user.dndMode}
              onToggleDnd={() => handleUpdateUser({ dndMode: !user.dndMode })}
              onAcceptCall={() => setCurrentScreen('video-call')}
              onDeclineMissedCall={handleDeclineMissedCall}
              onQuickReplyWithMessage={handleQuickReplyFromCall}
            />
          )}
        </main>

        {/* Floating Pill Bottom Navigation Dock */}
        {showBottomNav && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
            unreadTotal={unreadTotal}
          />
        )}

        {/* Global Report / Block Modal */}
        {reportTarget && (
          <ReportBlockModal
            targetUser={reportTarget}
            onClose={() => setReportTarget(null)}
            onConfirmReport={handleConfirmReport}
            onConfirmBlock={handleConfirmBlock}
          />
        )}

        {/* Separated QA / Lecturer Demo Drawer */}
        {showDemoDrawer && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="bg-[#181B22] border border-[#2E3440] rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#2E3440] pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-[#F59E0B]" />
                  <div>
                    <h3 className="font-display font-extrabold text-sm text-[#F3F4F6]">
                      Panel Simulasi Demo (QA)
                    </h3>
                    <p className="text-[11px] text-[#9CA3AF]">
                      Khusus pengujian skenario presentasi
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDemoDrawer(false)}
                  className="w-8 h-8 rounded-full bg-[#222631] flex items-center justify-center text-[#9CA3AF] hover:text-white cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* 0. Theme Mode Switcher */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3F4F6] flex items-center gap-1.5">
                  {theme === 'light' ? (
                    <Sun size={14} className="text-[#F59E0B]" />
                  ) : (
                    <Moon size={14} className="text-[#F59E0B]" />
                  )}
                  Mode Tampilan (Light / Dark):
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      theme === 'light'
                        ? 'bg-[#F59E0B] text-[#0F1115] border-[#F59E0B]'
                        : 'bg-[#222631] text-[#9CA3AF] border-[#2E3440]'
                    }`}
                  >
                    <Sun size={13} />
                    <span>Light Mode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      theme === 'dark'
                        ? 'bg-[#F59E0B] text-[#0F1115] border-[#F59E0B]'
                        : 'bg-[#222631] text-[#9CA3AF] border-[#2E3440]'
                    }`}
                  >
                    <Moon size={13} />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>

              {/* 1. Admin Student ID Verification Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3F4F6] flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#38BDF8]" />
                  Simulasi Keputusan Admin (Student ID):
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Menunggu', 'Disetujui', 'Ditolak'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        handleUpdateUser({ verificationStatus: st });
                        showToast(`Status verifikasi diubah ke: ${st}`);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                        user.verificationStatus === st
                          ? 'bg-[#F59E0B] text-[#0F1115] border-[#F59E0B]'
                          : 'bg-[#222631] text-[#9CA3AF] border-[#2E3440]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Fast-Forward Active Chat Streak */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3F4F6] flex items-center gap-1.5">
                  <Flame size={14} className="text-[#F59E0B]" />
                  Simulasi Streak Chat Aktif ({activePartner?.name?.split(' ')[0]} —{' '}
                  {activeConversation?.streakDays || 0} Hari):
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (activeConversation) {
                      handleIncrementStreak(activeConversation.id);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#222631] hover:bg-[#2E3440] border border-[#F59E0B]/40 text-[#F59E0B] text-xs font-bold cursor-pointer transition-all"
                >
                  +1 Hari Streak (Fast-Forward 24 Jam)
                </button>
              </div>

              {/* 3. Trigger Incoming Call */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3F4F6] flex items-center gap-1.5">
                  <PhoneIncoming size={14} className="text-[#10B981]" />
                  Simulasi Panggilan Video Masuk (Syarat Streak ≥ 3):
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowDemoDrawer(false);
                    handleTriggerIncomingCall();
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#222631] hover:bg-[#2E3440] border border-[#2E3440] text-[#F3F4F6] text-xs font-bold cursor-pointer transition-all"
                >
                  Picu Panggilan Masuk Sekarang
                </button>
              </div>

              {/* 4. Reset All Persistent Storage */}
              <div className="pt-2 border-t border-[#2E3440] flex items-center justify-between">
                <span className="text-[11px] text-[#9CA3AF]">
                  Laporan tersimpan: {reports.length}
                </span>
                <button
                  type="button"
                  onClick={handleResetDemoData}
                  className="px-3 py-2 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#EF4444]/25"
                >
                  <RotateCcw size={12} /> Reset Data Demo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
