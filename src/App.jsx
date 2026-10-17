import React, { useState } from 'react';
import {
  INITIAL_USER,
  MOCK_PROFILES,
  INITIAL_CONVERSATIONS
} from './data/mockData';
import BottomNav from './components/BottomNav';
import ReportBlockModal from './components/ReportBlockModal';

// Splash Screen + 11 PRD Screens
import SplashScreen from './screens/SplashScreen';
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

import { Bell } from 'lucide-react';

export default function App() {
  // Starts with Splash Screen displaying the BeeMate Logo before Loading
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [user, setUser] = useState(INITIAL_USER);
  const [profiles] = useState(MOCK_PROFILES);
  const [swipedIds, setSwipedIds] = useState([]);
  const [blockedIds, setBlockedIds] = useState([]);
  const [dailyLikesLeft, setDailyLikesLeft] = useState(15);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState('c1');
  const [newlyMatchedProfile, setNewlyMatchedProfile] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const [notificationToast, setNotificationToast] = useState(null);

  const showToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 3200);
  };

  const handleUpdateUser = (patch) => {
    setUser((prev) => ({ ...prev, ...patch }));
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
    setSwipedIds((prev) => [...prev, profile.id]);
  };

  const handleSwipeRight = (profile) => {
    if (dailyLikesLeft <= 0) {
      showToast('Kuota suka harian kamu sudah habis.');
      return;
    }
    setDailyLikesLeft((d) => d - 1);
    setSwipedIds((prev) => [...prev, profile.id]);

    if (profile.likedMe) {
      setNewlyMatchedProfile(profile);
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
            `Hai ${profile.name.split(' ')[0]}! Topik "${profile.promptAnswer}" menarik banget!`
          ],
          messages: []
        };
        setConversations((prev) => [newConv, ...prev]);
      }
    } else {
      showToast(`Kamu menyukai ${profile.name.split(' ')[0]}! Menunggu respon match.`);
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

  // Real-time Chat & Streak Logic
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
          showToast('🔥 Streak 3 Hari Tercapai! Video Call 1-on-1 sekarang terbuka!');
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
    showToast('Percakapan dihapus.');
  };

  const handleConfirmReport = (targetId, reason) => {
    setSwipedIds((prev) => [...prev, targetId]);
    showToast(`Laporan dikirim ke Admin (${reason}).`);
  };

  const handleConfirmBlock = (targetId) => {
    setBlockedIds((prev) => [...prev, targetId]);
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

  const showBottomNav = ['home', 'matching', 'messages', 'profile'].includes(
    currentScreen
  );

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-0 sm:p-4">
      {/* Native Mobile App Frame — NO Top Navigation Bar */}
      <div className="w-full max-w-[420px] h-screen sm:h-[820px] bg-[#0A0A0E] sm:rounded-[44px] shadow-2xl shadow-black overflow-hidden flex flex-col relative sm:border-[6px] sm:border-[#1E1E2A]">
        {/* Global Notification Toast */}
        {notificationToast && (
          <div className="absolute top-4 left-4 right-4 z-50 bg-[#15151E]/95 backdrop-blur-md text-white px-4 py-3 rounded-full shadow-2xl border border-[#FF4D8D]/50 flex items-center gap-2.5 text-xs animate-in fade-in duration-200">
            <Bell size={15} className="text-[#FF4D8D] shrink-0" />
            <span className="font-semibold truncate">{notificationToast}</span>
          </div>
        )}

        {/* Active Screen Viewport */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {currentScreen === 'splash' && (
            <SplashScreen onFinish={() => setCurrentScreen('login')} />
          )}

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
                showToast('Selamat datang di BeeMate!');
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
                showToast('Kamu telah keluar dari akun.');
                setCurrentScreen('login');
              }}
              onDeleteAccount={() => {
                setUser(INITIAL_USER);
                setConversations([]);
                showToast('Akun berhasil dihapus permanen.');
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
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-5">
            <div className="bg-[#15151E] border-2 border-[#FF4D8D] rounded-5xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl">
              <span className="inline-block px-4 py-1 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-xs font-extrabold -rotate-2">
                IT&apos;S A BEE-MATCH!
              </span>
              <h3 className="font-display text-lg font-extrabold text-white">
                Kamu & {newlyMatchedProfile.name.split(' ')[0]} Cocok!
              </h3>
              <p className="text-xs text-[#9494A8]">
                Mulai percakapan sekarang dan bangun streak 3 hari untuk membuka Video Call.
              </p>
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleOpenChatFromMatch(newlyMatchedProfile.id)}
                  className="w-full py-3 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-xs font-extrabold cursor-pointer"
                >
                  Kirim Pesan Sekarang
                </button>
                <button
                  type="button"
                  onClick={() => setNewlyMatchedProfile(null)}
                  className="w-full py-2.5 rounded-full bg-[#1E1E2A] text-[#9494A8] text-xs font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
}
