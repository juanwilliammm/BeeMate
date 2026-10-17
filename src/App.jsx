import React, { useState } from 'react';
import {
  INITIAL_USER,
  MOCK_PROFILES,
  INITIAL_CONVERSATIONS
} from './data/mockData';
import BottomNav from './components/BottomNav';
import ReportBlockModal from './components/ReportBlockModal';

// 11 PRD Screens
import LoginScreen from './screens/LoginScreen';
import VerifyNimScreen from './screens/VerifyNimScreen';
import VerifyIdScreen from './screens/VerifyIdScreen';
import VerifyOtpScreen from './screens/VerifyOtpScreen';
import HomeScreen from './screens/HomeScreen';
import MatchingScreen from './screens/MatchingScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import VideoCallScreen from './screens/VideoCallScreen';
import IncomingCallScreen from './screens/IncomingCallScreen';

import { Layers, Bell, Type, ChevronDown, ChevronUp } from 'lucide-react';

const ALL_SCREENS = [
  { id: 'login', num: 1, label: '1. Login' },
  { id: 'verify-nim', num: 2, label: '2. Verifikasi NIM' },
  { id: 'verify-id', num: 3, label: '3. Student ID' },
  { id: 'verify-otp', num: 4, label: '4. Kode OTP' },
  { id: 'home', num: 5, label: '5. Beranda' },
  { id: 'matching', num: 6, label: '6. Matching' },
  { id: 'messages', num: 7, label: '7. Pesan' },
  { id: 'chat', num: 8, label: '8. Chat & Streak' },
  { id: 'profile', num: 9, label: '9. Profil' },
  { id: 'video-call', num: 10, label: '10. Video Call' },
  { id: 'incoming-call', num: 11, label: '11. Call Masuk' }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState(INITIAL_USER);
  const [profiles, setProfiles] = useState(MOCK_PROFILES);
  const [swipedIds, setSwipedIds] = useState([]);
  const [blockedIds, setBlockedIds] = useState([]);
  const [dailyLikesLeft, setDailyLikesLeft] = useState(15);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState('c1');
  const [newlyMatchedProfile, setNewlyMatchedProfile] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const [notificationToast, setNotificationToast] = useState(null);
  const [largeTextMode, setLargeTextMode] = useState(false); // Section 9 Accessibility
  const [showNavigator, setShowNavigator] = useState(true);

  const showToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 3500);
  };

  const handleUpdateUser = (patch) => {
    setUser((prev) => ({ ...prev, ...patch }));
  };

  // Available profiles excluding blocked users (Section 8)
  const visibleProfiles = profiles.filter((p) => !blockedIds.includes(p.id));

  // Active conversation & partner for Screen 8, 10, 11
  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activePartner =
    visibleProfiles.find((p) => p.id === activeConversation?.partnerId) ||
    MOCK_PROFILES[0];

  const unreadTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  // Matching Logic (Section 8 & FR-24, FR-27)
  const handleSwipeLeft = (profile) => {
    setSwipedIds((prev) => [...prev, profile.id]);
  };

  const handleSwipeRight = (profile) => {
    if (dailyLikesLeft <= 0) {
      showToast('Batas kuota suka harian gratis telah habis (Aturan Matching Bagian 8).');
      return;
    }
    setDailyLikesLeft((d) => d - 1);
    setSwipedIds((prev) => [...prev, profile.id]);

    // Check if mutual match
    if (profile.likedMe) {
      setNewlyMatchedProfile(profile);
      // Create conversation if not exists
      const existing = conversations.find((c) => c.partnerId === profile.id);
      if (!existing) {
        const newConv = {
          id: `c-${Date.now()}`,
          partnerId: profile.id,
          streakDays: 0,
          streakExpiringSoon: false,
          unreadCount: 0,
          lastUpdated: 'Baru saja',
          icebreakers: [
            `Halo ${profile.name.split(' ')[0]}! Kita sama-sama ingin ${profile.goal}, yuk diskusi!`,
            `Hai ${profile.name.split(' ')[0]}! Topik "${profile.promptAnswer}" menarik banget, boleh cerita lebih lanjut?`
          ],
          messages: []
        };
        setConversations((prev) => [newConv, ...prev]);
      }
    } else {
      showToast(`Kamu menyukai profil ${profile.name.split(' ')[0]}. Menunggu respon match!`);
    }
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

  // Chat & Streak Logic (FR-34, FR-52, FR-54)
  const handleSendMessage = (convId, text, sender = 'me') => {
    const nowTime = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const nextStreak = c.streakDays === 0 ? 1 : c.streakDays;
        return {
          ...c,
          streakDays: nextStreak,
          streakExpiringSoon: false,
          lastUpdated: nowTime,
          messages: [
            ...c.messages,
            {
              id: `m-${Date.now()}`,
              sender,
              text,
              time: nowTime,
              status: 'read'
            }
          ]
        };
      })
    );

    // Simulate real-time partner reply after 1.2s (FR-34 & FR-54 mutual reply)
    if (sender === 'me') {
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== convId) return c;
            return {
              ...c,
              lastUpdated: 'Baru saja',
              messages: [
                ...c.messages,
                {
                  id: `m-reply-${Date.now()}`,
                  sender: 'partner',
                  text: 'Siap! Aku setuju banget, yuk kita jadwalkan diskusi lebih lanjut.',
                  time: 'Baru saja',
                  status: 'read'
                }
              ]
            };
          })
        );
      }, 1000);
    }
  };

  const handleIncrementStreak = (convId) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const nextDays = c.streakDays + 1;
        if (nextDays === 3) {
          showToast('🔥 Streak 3 Hari Tercapai! Fitur Video Call 1-on-1 sekarang terbuka!');
        }
        return {
          ...c,
          streakDays: nextDays,
          streakExpiringSoon: false
        };
      })
    );
  };

  const handleDeleteConversation = (convId) => {
    const remaining = conversations.filter((c) => c.id !== convId);
    setConversations(remaining);
    if (remaining.length > 0) {
      setActiveConvId(remaining[0].id);
    }
    setCurrentScreen('messages');
    showToast('Percakapan telah dihapus.');
  };

  // Report & Block Handlers (FR-29, FR-35, FR-45)
  const handleConfirmReport = (targetId, reason) => {
    setSwipedIds((prev) => [...prev, targetId]);
    showToast(`Laporan terkirim ke Admin BeeMate (${reason}).`);
  };

  const handleConfirmBlock = (targetId) => {
    setBlockedIds((prev) => [...prev, targetId]);
    setConversations((prev) => prev.filter((c) => c.partnerId !== targetId));
    if (currentScreen === 'chat' || currentScreen === 'video-call') {
      setCurrentScreen('home');
    }
    showToast('Pengguna telah diblokir dan dihapus dari daftar.');
  };

  // Incoming Call Handlers (FR-48, FR-49, FR-50)
  const handleDeclineMissedCall = () => {
    if (activeConversation) {
      handleSendMessage(
        activeConversation.id,
        '📞 Panggilan video tidak terjawab',
        'system'
      );
    }
    showToast('🔔 Panggilan tidak terjawab tercatat di layar Chat (FR-50).');
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
    showToast('Pesan balasan cepat terkirim ke Chat (FR-49).');
    setCurrentScreen('chat');
  };

  const showBottomNav = ['home', 'matching', 'messages', 'profile'].includes(
    currentScreen
  );

  return (
    <div
      className={`min-h-screen bg-slate-900 flex flex-col items-center justify-start md:justify-center p-0 md:p-4 ${
        largeTextMode ? 'text-[106%]' : ''
      }`}
    >
      {/* Top PRD 11-Screen Quick Switcher Bar (Helpful for Presentation & Evaluator Demo on Vercel) */}
      <div className="w-full max-w-md bg-slate-800 text-white border-b md:border border-slate-700 md:rounded-t-3xl px-3 py-2 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Layers size={14} />
            <span>Navigasi Cepat 11 Layar PRD</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setLargeTextMode(!largeTextMode)}
              title="Aksesibilitas: Perbesar Ukuran Teks (Bagian 9)"
              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                largeTextMode ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300'
              }`}
            >
              <Type size={11} />
              <span>A+</span>
            </button>
            <button
              type="button"
              onClick={() => setShowNavigator(!showNavigator)}
              className="p-1 rounded bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Sembunyikan/Tampilkan Navigasi PRD"
            >
              {showNavigator ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>

        {showNavigator && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-0.5">
            {ALL_SCREENS.map((scr) => (
              <button
                key={scr.id}
                type="button"
                onClick={() => setCurrentScreen(scr.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition cursor-pointer ${
                  currentScreen === scr.id
                    ? 'bg-binus-orange text-slate-950 shadow-xs'
                    : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {scr.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile App Viewport Frame */}
      <div className="w-full max-w-md h-[calc(100vh-44px)] md:h-[780px] bg-white md:rounded-b-3xl shadow-2xl overflow-hidden flex flex-col relative border-x border-b border-slate-800">
        {/* Global Notification Toast */}
        {notificationToast && (
          <div className="absolute top-3 left-3 right-3 z-50 bg-slate-900/95 text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2 text-xs animate-in slide-in-from-top-3 duration-200">
            <Bell size={15} className="text-amber-400 shrink-0" />
            <span className="font-medium leading-snug">{notificationToast}</span>
          </div>
        )}

        {/* Active Screen Content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {currentScreen === 'login' && (
            <LoginScreen
              onSuccessLogin={(email) => {
                handleUpdateUser({ email });
                setCurrentScreen('verify-nim');
              }}
              onQuickSkipToHome={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'verify-nim' && (
            <VerifyNimScreen
              user={user}
              onUpdateUser={handleUpdateUser}
              onNext={() => setCurrentScreen('verify-id')}
              onBack={() => setCurrentScreen('login')}
            />
          )}

          {currentScreen === 'verify-id' && (
            <VerifyIdScreen
              user={user}
              onUpdateUser={handleUpdateUser}
              onNext={() => setCurrentScreen('verify-otp')}
              onBack={() => setCurrentScreen('verify-nim')}
            />
          )}

          {currentScreen === 'verify-otp' && (
            <VerifyOtpScreen
              user={user}
              onUpdateUser={handleUpdateUser}
              onCompleteVerification={() => {
                showToast('Selamat datang di BeeMate! Akun Binusian kamu kini aktif.');
                setCurrentScreen('home');
              }}
              onBack={() => setCurrentScreen('verify-id')}
            />
          )}

          {currentScreen === 'home' && (
            <HomeScreen
              user={user}
              profiles={visibleProfiles}
              conversations={conversations}
              onNavigate={setCurrentScreen}
              onOpenChat={handleOpenChat}
              onLikeProfile={(profile) => {
                handleSwipeRight(profile);
                if (!profile.likedMe) {
                  setCurrentScreen('matching');
                }
              }}
              onTriggerIncomingCall={() => setCurrentScreen('incoming-call')}
            />
          )}

          {currentScreen === 'matching' && (
            <MatchingScreen
              user={user}
              profiles={visibleProfiles}
              swipedIds={swipedIds}
              dailyLikesLeft={dailyLikesLeft}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onResetSwipes={() => {
                setSwipedIds([]);
                setDailyLikesLeft(15);
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
              onIncrementStreak={handleIncrementStreak}
              onStartVideoCall={() => setCurrentScreen('video-call')}
              onDeleteConversation={handleDeleteConversation}
              onOpenReportModal={(target) => setReportTarget(target)}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              user={user}
              conversations={conversations}
              onUpdateUser={handleUpdateUser}
              onLogout={() => {
                showToast('Kamu telah keluar dari sesi BeeMate.');
                setCurrentScreen('login');
              }}
              onDeleteAccount={() => {
                setUser(INITIAL_USER);
                setConversations([]);
                showToast('Akun dan data pribadi telah dihapus permanen.');
                setCurrentScreen('login');
              }}
            />
          )}

          {currentScreen === 'video-call' && (
            <VideoCallScreen
              user={user}
              partner={activePartner}
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
              userDndMode={user.dndMode}
              onToggleDnd={() => handleUpdateUser({ dndMode: !user.dndMode })}
              onAcceptCall={() => setCurrentScreen('video-call')}
              onDeclineMissedCall={handleDeclineMissedCall}
              onQuickReplyWithMessage={handleQuickReplyFromCall}
            />
          )}
        </main>

        {/* Global Match Modal if triggered from HomeScreen */}
        {currentScreen === 'home' && newlyMatchedProfile && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-5">
            <div className="bg-white rounded-3xl max-w-xs w-full p-6 text-center space-y-3 shadow-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold">
                IT&apos;S A BEE-MATCH! (FR-27)
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Kamu & {newlyMatchedProfile.name} Cocok!
              </h3>
              <p className="text-xs text-slate-500">
                Mulai percakapan sekarang dan bangun streak 3 hari untuk membuka Video Call.
              </p>
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenChatFromMatch(newlyMatchedProfile.id)}
                  className="w-full py-2.5 rounded-xl bg-binus-blue text-white text-xs font-bold"
                >
                  Kirim Pesan Sekarang
                </button>
                <button
                  type="button"
                  onClick={() => setNewlyMatchedProfile(null)}
                  className="w-full py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Bottom Navigation (FR-22) */}
        {showBottomNav && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
            unreadTotal={unreadTotal}
          />
        )}

        {/* Global Report / Block Modal (FR-29, FR-35, FR-45) */}
        {reportTarget && (
          <ReportBlockModal
            targetUser={reportTarget}
            onClose={() => setReportTarget(null)}
            onConfirmReport={handleConfirmReport}
            onConfirmBlock={handleConfirmBlock}
          />
        )}
      </div>
    </div>
  );
}
