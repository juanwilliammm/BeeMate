import React, { useState, useEffect } from 'react';
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
  Camera
} from 'lucide-react';

export default function VideoCallScreen({
  user,
  partner,
  onEndCall,
  onOpenReportModal
}) {
  const [permissionState, setPermissionState] = useState('granted');
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [frontCamera, setFrontCamera] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('Stabil');

  useEffect(() => {
    if (permissionState !== 'granted' || connectionQuality === 'Reconnecting') return;
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [permissionState, connectionQuality]);

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!partner) return null;

  return (
    <div className="flex flex-col h-full bg-[#0A0A0E] text-white relative overflow-hidden justify-between p-5">
      {/* Remote Video Feed */}
      <div className="absolute inset-0">
        <img
          src={partner.avatar}
          alt={partner.name}
          className={`w-full h-full object-cover transition duration-500 ${
            connectionQuality === 'Reconnecting' ? 'blur-md opacity-35' : 'opacity-85'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0E]/85 via-transparent to-[#0A0A0E]/95" />
      </div>

      {/* Top Overlay */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="bg-[#15151E]/85 backdrop-blur-md border border-[#2A2A3A] rounded-full px-4 py-2 flex items-center gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xs font-extrabold">{partner.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-[10px] font-extrabold">
                {formatDuration(seconds)}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {connectionQuality === 'Reconnecting' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400">
                  <WifiOff size={11} />
                  <span>Menyambung ulang...</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#FF85B3]">
                  <Wifi size={11} />
                  <span>Koneksi {connectionQuality}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenReportModal(partner)}
          title="Laporkan Pelanggaran (FR-45)"
          className="w-10 h-10 rounded-full bg-[#15151E]/85 hover:bg-[#FF4D8D] text-white hover:text-[#0A0A0E] border border-[#2A2A3A] backdrop-blur-md flex items-center justify-center transition cursor-pointer"
        >
          <Flag size={15} />
        </button>
      </div>

      {/* Middle PiP & Simulation Pill Triggers */}
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => setPermissionState('denied')}
            className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-[#FF85B3]"
          >
            Simulasi Izin Kamera
          </button>
          <button
            type="button"
            onClick={() => setConnectionQuality('Reconnecting')}
            className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-rose-300"
          >
            Simulasi Sinyal Putus
          </button>
        </div>

        <div className="self-end w-28 h-38 rounded-3xl overflow-hidden border-2 border-[#FF4D8D] bg-[#15151E] shadow-2xl relative">
          {camOff ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#9494A8] p-2 text-center">
              <VideoOff size={20} />
              <span className="text-[9px] mt-1">Kamera Mati</span>
            </div>
          ) : (
            <img
              src={user.avatar}
              alt="Saya"
              className={`w-full h-full object-cover ${!frontCamera ? 'scale-x-[-1]' : ''}`}
            />
          )}
        </div>
      </div>

      {/* Permission Denied Modal (FR-46) */}
      {permissionState === 'denied' && (
        <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex items-center justify-center p-5">
          <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-6 max-w-xs w-full space-y-3.5 text-center">
            <div className="w-14 h-14 rounded-full bg-[#FF4D8D]/20 text-[#FF4D8D] flex items-center justify-center mx-auto">
              <Camera size={26} />
            </div>
            <h3 className="font-display text-sm font-extrabold">
              Aktifkan Kamera & Mikrofon
            </h3>
            <p className="text-xs text-[#9494A8] leading-relaxed">
              Izinkan akses kamera dan mikrofon di pengaturan browser/HP agar kamu dan {partner.name} dapat berdiskusi.
            </p>
            <button
              type="button"
              onClick={() => setPermissionState('granted')}
              className="w-full py-3 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-xs font-extrabold cursor-pointer"
            >
              Izinkan Sekarang
            </button>
          </div>
        </div>
      )}

      {/* Reconnecting Modal (FR-47) */}
      {connectionQuality === 'Reconnecting' && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex items-center justify-center p-5">
          <div className="bg-[#15151E] border border-[#FF4D8D]/50 rounded-4xl p-6 max-w-xs w-full space-y-3.5 text-center">
            <div className="w-14 h-14 rounded-full bg-[#FF4D8D]/20 text-[#FF4D8D] flex items-center justify-center mx-auto animate-spin">
              <RefreshCw size={24} />
            </div>
            <h3 className="font-display text-sm font-extrabold">Koneksi Terputus</h3>
            <p className="text-xs text-[#9494A8] leading-relaxed">
              Mencoba menyambung ulang panggilan dengan {partner.name}...
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConnectionQuality('Stabil')}
                className="flex-1 py-2.5 rounded-full bg-[#1E1E2A] text-white text-xs font-bold"
              >
                Coba Lagi
              </button>
              <button
                type="button"
                onClick={() => onEndCall('Koneksi video call terputus. Diskusi dilanjutkan di Chat.')}
                className="flex-1 py-2.5 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-xs font-extrabold"
              >
                Ke Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Pill Control Dock (FR-43) */}
      <div className="relative z-10 bg-[#15151E]/90 backdrop-blur-md border border-[#2A2A3A] rounded-full p-2.5 flex items-center justify-around">
        <button
          type="button"
          onClick={() => setMicMuted(!micMuted)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
            micMuted ? 'bg-[#FF4D8D] text-[#0A0A0E]' : 'bg-[#1E1E2A] text-white'
          }`}
        >
          {micMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button
          type="button"
          onClick={() => setCamOff(!camOff)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
            camOff ? 'bg-[#FF4D8D] text-[#0A0A0E]' : 'bg-[#1E1E2A] text-white'
          }`}
        >
          {camOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        <button
          type="button"
          onClick={() => setFrontCamera(!frontCamera)}
          className="w-12 h-12 rounded-full bg-[#1E1E2A] text-white flex items-center justify-center transition cursor-pointer"
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
