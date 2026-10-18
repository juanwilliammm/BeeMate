import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  RefreshCw,
  PhoneOff,
  Flag,
  Wifi,
  WifiOff,
  Camera,
  Lock,
  BadgeCheck
} from 'lucide-react';

export default function VideoCallScreen({
  user,
  partner,
  conversation,
  onEndCall,
  onOpenReportModal
}) {
  const [permissionState, setPermissionState] = useState('granted');
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [frontCamera, setFrontCamera] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('Stabil');
  const [hasLiveWebcam, setHasLiveWebcam] = useState(false);

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  const isUnlocked = (conversation?.streakDays || 0) >= 3;

  // Real WebRTC getUserMedia camera feed for local PiP box
  useEffect(() => {
    if (!isUnlocked || camOff || permissionState !== 'granted') {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      setHasLiveWebcam(false);
      return;
    }

    let active = true;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: frontCamera ? 'user' : 'environment' },
          audio: false
        })
        .then((stream) => {
          if (!active) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          localStreamRef.current = stream;
          setHasLiveWebcam(true);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setHasLiveWebcam(false);
        });
    }

    return () => {
      active = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, [isUnlocked, camOff, frontCamera, permissionState]);

  useEffect(() => {
    if (!isUnlocked || permissionState !== 'granted' || connectionQuality === 'Reconnecting') return;
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isUnlocked, permissionState, connectionQuality]);

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!partner) return null;

  // Hard Guard: Prevent any bypass if streakDays < 3 (KP7 Fix)
  if (!isUnlocked) {
    return (
      <div className="flex flex-col h-full bg-[#0F1115] text-white items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center">
          <Lock size={28} />
        </div>
        <h2 className="font-display text-lg font-extrabold">
          Video Call Terkunci (Syarat Streak 3 Hari)
        </h2>
        <p className="text-xs text-[#94A3B8] max-w-xs leading-relaxed">
          Streak diskusi kamu dengan <strong>{partner.name}</strong> saat ini baru{' '}
          <strong className="text-[#F59E0B]">{conversation?.streakDays || 0} hari</strong>. Bangun streak chat dua arah selama 3 hari berturut-turut untuk membuka panggilan video.
        </p>
        <button
          type="button"
          onClick={() => onEndCall()}
          className="px-6 py-3 rounded-full bg-[#F59E0B] text-[#0F1115] text-xs font-extrabold cursor-pointer"
        >
          Kembali ke Ruang Diskusi
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0F1115] text-white relative overflow-hidden justify-between p-5 keep-dark-overlay">
      {/* Remote Video Feed */}
      <div className="absolute inset-0">
        <img
          src={partner.avatar}
          alt={partner.name}
          className={`w-full h-full object-cover transition duration-500 ${
            connectionQuality === 'Reconnecting' ? 'blur-md opacity-35' : 'opacity-85'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1115]/85 via-transparent to-[#0F1115]/95" />
      </div>

      {/* Top Overlay */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="bg-[#181B22]/90 backdrop-blur-md border border-[#2E3440] rounded-full px-4 py-2 flex items-center gap-2.5">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-display text-xs font-extrabold">{partner.name}</h1>
              <BadgeCheck size={14} className="text-[#38BDF8]" />
              <span className="px-2 py-0.5 rounded-full bg-[#F59E0B] text-[#0F1115] text-[11px] font-extrabold">
                {formatDuration(seconds)}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {connectionQuality === 'Reconnecting' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                  <WifiOff size={11} />
                  <span>Menyambung ulang...</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#38BDF8]">
                  <Wifi size={11} />
                  <span>{partner.major} · Koneksi {connectionQuality}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenReportModal(partner)}
          title="Laporkan Pelanggaran (FR-45)"
          className="w-10 h-10 rounded-full bg-[#181B22]/90 hover:bg-[#F59E0B] text-white hover:text-[#0F1115] border border-[#2E3440] backdrop-blur-md flex items-center justify-center transition cursor-pointer"
        >
          <Flag size={15} />
        </button>
      </div>

      {/* Local Camera PiP with Real WebRTC Video Element */}
      <div className="relative z-10 flex flex-col gap-3">
        <div className="self-end w-28 h-40 rounded-3xl overflow-hidden border-2 border-[#F59E0B] bg-[#181B22] shadow-2xl relative">
          {camOff ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#94A3B8] p-2 text-center">
              <VideoOff size={20} />
              <span className="text-[11px] mt-1">Kamera Mati</span>
            </div>
          ) : (
            <>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${
                  hasLiveWebcam ? 'block' : 'hidden'
                } ${frontCamera ? 'scale-x-[-1]' : ''}`}
              />
              {!hasLiveWebcam && (
                <img
                  src={user.avatar}
                  alt="Saya"
                  className={`w-full h-full object-cover ${!frontCamera ? 'scale-x-[-1]' : ''}`}
                />
              )}
              <span className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded-full bg-black/70 text-[10px] font-bold text-[#F59E0B]">
                {hasLiveWebcam ? '● Live Cam' : 'Anda'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Permission Denied Modal (FR-46) */}
      {permissionState === 'denied' && (
        <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex items-center justify-center p-5">
          <div className="bg-[#181B22] border border-[#2E3440] rounded-4xl p-6 max-w-xs w-full space-y-3.5 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center mx-auto">
              <Camera size={26} />
            </div>
            <h3 className="font-display text-sm font-extrabold">
              Aktifkan Kamera & Mikrofon
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Izinkan akses kamera dan mikrofon di pengaturan browser/HP agar kamu dan {partner.name} dapat berdiskusi.
            </p>
            <button
              type="button"
              onClick={() => setPermissionState('granted')}
              className="w-full py-3 rounded-full bg-[#F59E0B] text-[#0F1115] text-xs font-extrabold cursor-pointer"
            >
              Izinkan Sekarang
            </button>
          </div>
        </div>
      )}

      {/* Reconnecting Modal (FR-47) */}
      {connectionQuality === 'Reconnecting' && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex items-center justify-center p-5">
          <div className="bg-[#181B22] border border-[#F59E0B]/50 rounded-4xl p-6 max-w-xs w-full space-y-3.5 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center mx-auto animate-spin">
              <RefreshCw size={24} />
            </div>
            <h3 className="font-display text-sm font-extrabold">Koneksi Terputus</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Mencoba menyambung ulang panggilan diskusi dengan {partner.name}...
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConnectionQuality('Stabil')}
                className="flex-1 py-2.5 rounded-full bg-[#222631] text-white text-xs font-bold cursor-pointer"
              >
                Coba Lagi
              </button>
              <button
                type="button"
                onClick={() => onEndCall('Koneksi video call terputus. Diskusi dilanjutkan di Chat.')}
                className="flex-1 py-2.5 rounded-full bg-[#F59E0B] text-[#0F1115] text-xs font-extrabold cursor-pointer"
              >
                Ke Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Pill Control Dock (FR-43) */}
      <div className="relative z-10 bg-[#181B22]/90 backdrop-blur-md border border-[#2E3440] rounded-full p-2.5 flex items-center justify-around">
        <button
          type="button"
          onClick={() => setMicMuted(!micMuted)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
            micMuted ? 'bg-[#F59E0B] text-[#0F1115]' : 'bg-[#222631] text-white'
          }`}
        >
          {micMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button
          type="button"
          onClick={() => setCamOff(!camOff)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
            camOff ? 'bg-[#F59E0B] text-[#0F1115]' : 'bg-[#222631] text-white'
          }`}
        >
          {camOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        <button
          type="button"
          onClick={() => setFrontCamera(!frontCamera)}
          className="w-12 h-12 rounded-full bg-[#222631] text-white flex items-center justify-center transition cursor-pointer"
        >
          <RefreshCw size={20} />
        </button>

        <button
          type="button"
          onClick={() => onEndCall()}
          className="w-14 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg cursor-pointer"
        >
          <PhoneOff size={22} />
        </button>
      </div>
    </div>
  );
}
