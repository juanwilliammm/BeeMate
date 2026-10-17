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
  ShieldAlert,
  Camera
} from 'lucide-react';

export default function VideoCallScreen({
  user,
  partner,
  onEndCall,
  onOpenReportModal
}) {
  // FR-46: Camera & Microphone permission prompt with explanation
  const [permissionState, setPermissionState] = useState('granted'); // 'prompt' | 'granted' | 'denied'
  const [micMuted, setMicMuted] = useState(false); // FR-43
  const [camOff, setCamOff] = useState(false); // FR-43
  const [frontCamera, setFrontCamera] = useState(true); // FR-43
  const [seconds, setSeconds] = useState(0); // FR-44
  const [connectionQuality, setConnectionQuality] = useState('Stabil'); // 'Stabil' | 'Lemah' | 'Reconnecting' (FR-44, FR-47)

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

  // FR-47: Simulate connection drop -> reconnect -> fallback to chat
  const simulateDisconnect = () => {
    setConnectionQuality('Reconnecting');
  };

  if (!partner) return null;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white relative overflow-hidden justify-between">
      {/* Remote Video Feed (Partner) */}
      <div className="absolute inset-0">
        <img
          src={partner.avatar}
          alt={partner.name}
          className={`w-full h-full object-cover transition duration-500 ${
            connectionQuality === 'Reconnecting' ? 'blur-md opacity-40' : 'opacity-85'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90" />
      </div>

      {/* Top Overlay: Partner Info, Duration, Connection Quality, Report Button (FR-44, FR-45) */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold">{partner.name}</h1>
            <span className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-[10px] font-mono font-bold">
              {formatDuration(seconds)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {connectionQuality === 'Reconnecting' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400">
                <WifiOff size={12} />
                <span>Terputus · Mencoba menyambung ulang...</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                <Wifi size={12} />
                <span>Koneksi {connectionQuality} · Enkripsi 1-on-1</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenReportModal(partner)}
            title="Laporkan Pelanggaran Selama Panggilan (FR-45)"
            aria-label="Laporkan Pengguna"
            className="p-2.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white backdrop-blur-xs transition cursor-pointer"
          >
            <Flag size={15} />
          </button>
        </div>
      </div>

      {/* Community Guidelines & Demo Simulator Bar */}
      <div className="relative z-10 px-4 flex flex-col gap-2">
        <div className="bg-slate-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 flex items-center justify-between text-[10px] text-slate-300">
          <span>🛡️ Dilarang merekam panggilan (Panduan Komunitas BeeMate)</span>
          <div className="flex gap-1.5 shrink-0 ml-2">
            <button
              type="button"
              onClick={() => setPermissionState('denied')}
              className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-amber-300 font-bold"
            >
              Uji Izin Ditolak (FR-46)
            </button>
            <button
              type="button"
              onClick={simulateDisconnect}
              className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-rose-300 font-bold"
            >
              Uji Putus (FR-47)
            </button>
          </div>
        </div>

        {/* Self Preview PiP (FR-43) */}
        <div className="self-end mt-2 w-24 h-32 rounded-2xl overflow-hidden border-2 border-white/30 bg-slate-800 shadow-xl relative">
          {camOff ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2 text-center">
              <VideoOff size={18} />
              <span className="text-[9px] mt-1">Kamera Mati</span>
            </div>
          ) : (
            <img
              src={user.avatar}
              alt="Kamera Saya"
              className={`w-full h-full object-cover ${
                !frontCamera ? 'scale-x-[-1]' : ''
              }`}
            />
          )}
          <span className="absolute bottom-1 left-1.5 text-[9px] bg-slate-900/70 px-1.5 py-0.2 rounded text-white">
            {frontCamera ? 'Depan' : 'Belakang'}
          </span>
        </div>
      </div>

      {/* FR-46: Permission Denied Modal */}
      {permissionState === 'denied' && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-5">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-xs w-full space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Camera size={24} />
            </div>
            <h3 className="text-sm font-extrabold">
              Izin Kamera & Mikrofon Diperlukan (FR-46)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              BeeMate membutuhkan akses kamera dan mikrofon agar kamu dan {partner.name} dapat berdiskusi secara langsung.
            </p>
            <div className="bg-slate-800 p-3 rounded-xl text-left text-[11px] text-slate-300 space-y-1">
              <p className="font-bold text-amber-300">Cara Mengaktifkan Izin:</p>
              <p>1. Buka Pengaturan Perangkat / Browser</p>
              <p>2. Pilih Izin Situs / Aplikasi &rarr; Kamera & Mikrofon</p>
              <p>3. Ubah status menjadi &ldquo;Izinkan (Allow)&rdquo;</p>
            </div>
            <button
              type="button"
              onClick={() => setPermissionState('granted')}
              className="w-full py-2.5 rounded-xl bg-binus-blue text-white text-xs font-bold"
            >
              Izinkan Kamera & Mikrofon Sekarang
            </button>
          </div>
        </div>
      )}

      {/* FR-47: Reconnecting / Connection Lost Modal */}
      {connectionQuality === 'Reconnecting' && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-5 max-w-xs w-full space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto animate-spin">
              <RefreshCw size={22} />
            </div>
            <h3 className="text-sm font-extrabold">
              Koneksi Terputus (FR-47)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sedang mencoba menyambung ulang panggilan video dengan {partner.name}... Jika sinyal tidak stabil, kamu dapat kembali melanjutkan diskusi lewat Chat.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConnectionQuality('Stabil')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Sambung Ulang
              </button>
              <button
                type="button"
                onClick={() => onEndCall('Koneksi video call terputus. Diskusi dilanjutkan melalui Chat.')}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Kembali ke Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Call Controls (FR-43: Mute Mic, Toggle Cam, Flip Cam, End Call) */}
      <div className="relative z-10 p-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setMicMuted(!micMuted)}
          aria-label={micMuted ? 'Nyalakan Mikrofon' : 'Matikan Mikrofon'}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
            micMuted
              ? 'bg-rose-600 text-white'
              : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md'
          }`}
        >
          {micMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button
          type="button"
          onClick={() => setCamOff(!camOff)}
          aria-label={camOff ? 'Nyalakan Kamera' : 'Matikan Kamera'}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
            camOff
              ? 'bg-rose-600 text-white'
              : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md'
          }`}
        >
          {camOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        <button
          type="button"
          onClick={() => setFrontCamera(!frontCamera)}
          aria-label="Balik Kamera"
          title="Balik Kamera Depan/Belakang (FR-43)"
          className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer"
        >
          <RefreshCw size={20} />
        </button>

        <button
          type="button"
          onClick={() => onEndCall()}
          aria-label="Akhiri Panggilan"
          className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition cursor-pointer"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
}
