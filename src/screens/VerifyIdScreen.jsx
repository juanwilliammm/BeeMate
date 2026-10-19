import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  XCircle,
  Lock,
  ScanLine,
  Trash2,
  Database,
  ShieldCheck
} from 'lucide-react';
import {
  saveStudentIdRecord,
  getStudentIdRecord,
  deleteStudentIdRecord
} from '../utils/studentIdDb';
import {
  INTEREST_OPTIONS,
  MIN_INTERESTS,
  normalizeInterests
} from '../data/mockData';

export default function VerifyIdScreen({ user, onUpdateUser, onCompleteRegistration, onBack }) {
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [uploadMeta, setUploadMeta] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Onboarding sub-step after Student ID upload ('id-upload' | 'interests')
  const [subStep, setSubStep] = useState('id-upload');
  const [selectedInterests, setSelectedInterests] = useState(() =>
    normalizeInterests(user.interests)
  );

  // Sync changes into persistent user state immediately so selections are preserved across back/forward navigation
  useEffect(() => {
    setSelectedInterests(normalizeInterests(user.interests));
  }, [user.interests]);

  const status = user.verificationStatus || (photoDataUrl ? 'Menunggu' : 'Belum Diunggah');

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    getStudentIdRecord(user.nim).then((saved) => {
      if (mounted && saved && saved.imageData) {
        setPhotoDataUrl(saved.imageData);
        setUploadMeta({
          fileName: saved.fileName,
          source: saved.source,
          savedAt: saved.updatedAt,
          verificationHash: saved.verificationHash,
          isCloudSynced: saved.isCloudSynced
        });
      } else if (mounted && user.studentIdPhoto) {
        setPhotoDataUrl(user.studentIdPhoto);
      }
    });
    return () => {
      mounted = false;
      stopLiveCamera();
    };
  }, [user.nim, user.studentIdPhoto]);

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startLiveCamera = async () => {
    setCameraError('');
    setUploadError('');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        streamRef.current = stream;
        setCameraActive(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 100);
      } else if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    } catch {
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        setCameraError('Tidak dapat membuka kamera langsung. Gunakan pilih foto galeri di bawah.');
      }
    }
  };

  const captureFromLiveCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 400;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopLiveCamera();
    processAndSavePhoto(dataUrl, `CAM_${user.nim}.jpg`, 'Kamera Langsung');
  };

  const handleFilePicked = (e, sourceLabel) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    const reader = new FileReader();
    reader.onload = (ev) => {
      const resultUrl = ev.target?.result;
      if (typeof resultUrl === 'string') {
        processAndSavePhoto(resultUrl, file.name, sourceLabel);
      }
    };
    reader.readAsDataURL(file);
  };

  const processAndSavePhoto = async (dataUrl, fileName, sourceLabel) => {
    setIsScanning(true);
    setPhotoDataUrl(dataUrl);

    const hashId = `BINUS-${(user.nim || '2802').slice(0, 4)}-${Math.floor(100000 + Math.random() * 900000)}`;
    const record = await saveStudentIdRecord({
      nim: user.nim,
      email: user.email,
      name: user.name,
      major: user.major,
      batch: user.batch,
      imageData: dataUrl,
      fileName,
      source: sourceLabel,
      verificationHash: hashId
    });

    const finalPhotoUrl = record.imageData || dataUrl;
    setPhotoDataUrl(finalPhotoUrl);

    setTimeout(() => {
      setIsScanning(false);
      setUploadMeta({
        fileName: record.fileName,
        source: record.source,
        savedAt: record.updatedAt,
        verificationHash: hashId,
        isCloudSynced: record.isCloudSynced
      });
      onUpdateUser({
        verificationStatus: 'Menunggu',
        verified: false,
        studentIdPhoto: finalPhotoUrl
      });
    }, 650);
  };

  const handleClearPhoto = async () => {
    await deleteStudentIdRecord(user.nim);
    setPhotoDataUrl(null);
    setUploadMeta(null);
    onUpdateUser({
      verificationStatus: 'Menunggu',
      verified: false,
      studentIdPhoto: null
    });
  };

  const toggleInterest = (label) => {
    const next = selectedInterests.includes(label)
      ? selectedInterests.filter((i) => i !== label)
      : [...selectedInterests, label];
    setSelectedInterests(next);
    // Persist immediately so navigating backward and returning preserves selection
    onUpdateUser({ interests: next });
  };

  const handleProceedToInterests = () => {
    if (!photoDataUrl) {
      setUploadError('Silakan unggah foto Binusian Card terlebih dahulu melalui Kamera atau Galeri.');
      return;
    }
    setUploadError('');
    setSubStep('interests');
  };

  const canContinue = selectedInterests.length >= MIN_INTERESTS;

  const handleFinishAll = () => {
    if (!canContinue) return;
    onUpdateUser({ interests: selectedInterests });
    onCompleteRegistration();
  };

  /* ---------- Sub-step 2: Minimal Interest Selection (Reference Image 4) ---------- */
  if (subStep === 'interests') {
    return (
      <div className="flex flex-col h-full bg-surface text-ink">
        {/* Top bar */}
        <div className="px-5 pt-6 pb-2 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => setSubStep('id-upload')}
            aria-label="Back"
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink hover:bg-subtle transition cursor-pointer"
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
          <span className="text-meta text-ink-3 font-medium">
            {selectedInterests.length} selected
          </span>
        </div>

        {/* Scrollable tag cloud */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-2 pb-6">
          <div className="text-center max-w-xs mx-auto mb-6">
            <h1 className="text-title text-ink font-semibold">
              Let’s select your interests.
            </h1>
            <p className="text-caption text-ink-3 mt-1.5">
              Please select two or more to proceed.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {INTEREST_OPTIONS.map(({ label, icon }) => {
              const selected = selectedInterests.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleInterest(label)}
                  className={`h-10 px-4 rounded-full border text-caption font-medium inline-flex items-center gap-2 transition-all cursor-pointer select-none ${
                    selected
                      ? 'border-brand bg-brand-soft text-brand-ink shadow-xs'
                      : 'border-line bg-card text-ink hover:border-ink-3'
                  }`}
                >
                  <span className="text-sm leading-none" aria-hidden>
                    {icon}
                  </span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky bottom Continue CTA */}
        <div className="px-5 pt-3 pb-safe bg-card border-t border-line shrink-0">
          <button
            type="button"
            disabled={!canContinue}
            onClick={handleFinishAll}
            className={`w-full h-12 rounded-full text-body font-semibold transition cursor-pointer disabled:cursor-not-allowed ${
              canContinue
                ? 'bg-brand text-brand-on hover:brightness-105 shadow-card'
                : 'bg-subtle text-ink-3'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Sub-step 1: Student ID Upload ---------- */
  return (
    <div className="flex flex-col h-full bg-[#0F1115] text-white justify-between p-5 overflow-y-auto no-scrollbar">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFilePicked(e, 'Kamera HP')}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFilePicked(e, 'Galeri HP')}
        className="hidden"
      />

      <div className="space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              stopLiveCamera();
              onBack();
            }}
            aria-label="Kembali"
            className="w-10 h-10 rounded-full bg-[#181B22] border border-[#2E3440] flex items-center justify-center text-white hover:border-[#F59E0B] transition cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs font-bold text-[#F59E0B]">
            Langkah 3 dari 3 · Binusian Card
          </span>
          <button
            type="button"
            onClick={() => setSubStep('interests')}
            className="text-xs font-semibold text-[#94A3B8] hover:text-white cursor-pointer"
          >
            Interests
          </button>
        </div>

        <div className="flex gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-[#F59E0B]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#F59E0B]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#F59E0B]" />
        </div>
      </div>

      <div className="space-y-4 my-auto py-4">
        <div>
          <h1 className="font-display text-xl font-extrabold">
            Unggah <span className="text-[#F59E0B]">Binusian Card</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
            Unggah foto kartu mahasiswa kamu untuk ditinjau Admin (maksimal 1x24 jam). Foto akan dihapus otomatis setelah status disetujui.
          </p>
        </div>

        <div className="bg-[#181B22] border border-[#2E3440] rounded-4xl p-4 space-y-3.5">
          {cameraActive ? (
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#F59E0B] bg-black aspect-[1.58/1] flex flex-col justify-between keep-dark-overlay">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-10 p-3 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
                <span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
                  Posisikan Binusian Card di dalam kotak
                </span>
                <button
                  type="button"
                  onClick={stopLiveCamera}
                  className="text-xs bg-black/70 text-white px-2.5 py-1 rounded-full border border-white/20"
                >
                  Tutup
                </button>
              </div>
              <div className="relative z-10 p-3 flex justify-center bg-gradient-to-t from-black/80 to-transparent">
                <button
                  type="button"
                  onClick={captureFromLiveCamera}
                  className="px-5 py-2 rounded-full bg-[#F59E0B] text-[#0F1115] font-extrabold text-xs shadow-lg cursor-pointer"
                >
                  Jepret Foto Kartu
                </button>
              </div>
            </div>
          ) : photoDataUrl ? (
            <div className="space-y-3">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#38BDF8] bg-black aspect-[1.58/1] shadow-2xl keep-dark-overlay">
                <img
                  src={photoDataUrl}
                  alt="Uploaded Student ID"
                  className="w-full h-full object-cover"
                />

                {isScanning && (
                  <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
                    <ScanLine size={32} className="text-[#F59E0B] animate-bounce" />
                    <span className="text-xs font-extrabold text-white">
                      Mengenkripsi & Menyimpan ke Antrean Verifikasi...
                    </span>
                  </div>
                )}

                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#38BDF8]/60 text-[11px] font-extrabold text-[#38BDF8]">
                    <ShieldCheck size={13} className="text-[#38BDF8]" />
                    <span>ID TERSIMPAN</span>
                  </span>

                  {uploadMeta?.verificationHash && (
                    <span className="px-2.5 py-1 rounded-full bg-[#181B22]/90 text-[#38BDF8] border border-[#38BDF8]/40 font-mono text-[11px] font-bold">
                      {uploadMeta.verificationHash}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 flex items-end justify-between">
                  <div>
                    <span className="text-[11px] text-[#38BDF8] font-bold uppercase block">
                      {user.name} · Binusian {user.batch}
                    </span>
                    <span className="text-[11px] text-white/80 font-medium">
                      {uploadMeta?.fileName || 'student_id.jpg'} ({uploadMeta?.source || 'Tersimpan'})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    title="Hapus & Ganti Foto"
                    className="p-2 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0F1115] border border-[#2E3440] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#38BDF8]">
                  <Database size={14} className="text-[#38BDF8] shrink-0" />
                  <span>
                    {uploadMeta?.isCloudSynced
                      ? 'Tersimpan di Supabase Cloud (Sinkron HP & Laptop)'
                      : 'Tersimpan di Database Lokal & Siap Sinkron Cloud'}
                  </span>
                </div>
                <span className="text-[11px] text-[#F59E0B] font-bold">● Siap Ditinjau</span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => galleryInputRef.current?.click()}
              className="relative rounded-3xl border-2 border-dashed border-[#2E3440] hover:border-[#F59E0B] bg-[#0F1115] aspect-[1.58/1] flex flex-col items-center justify-center p-5 text-center cursor-pointer transition group"
            >
              <div className="w-12 h-12 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <ScanLine size={24} />
              </div>
              <p className="text-xs font-extrabold text-white">
                Unggah Foto Binusian Card (Wajib)
              </p>
              <p className="text-xs text-[#94A3B8] mt-1 max-w-[230px]">
                Klik tombol <strong>Buka Kamera</strong> atau <strong>Pilih Foto Galeri</strong> di bawah untuk memilih file gambar kartu mahasiswa.
              </p>
            </div>
          )}

          {cameraError && (
            <p className="text-xs text-rose-400 text-center">{cameraError}</p>
          )}
          {uploadError && (
            <p className="text-xs text-rose-400 text-center font-semibold">{uploadError}</p>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={startLiveCamera}
              className="py-3 px-3 rounded-full bg-[#222631] hover:bg-[#2E3440] text-white border border-[#2E3440] flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer"
            >
              <Camera size={15} className="text-[#F59E0B]" />
              <span>Buka Kamera</span>
            </button>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="py-3 px-3 rounded-full bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0F1115] flex items-center justify-center gap-2 text-xs font-extrabold shadow-lg shadow-[#F59E0B]/20 transition cursor-pointer"
            >
              <ImageIcon size={15} />
              <span>Pilih Foto Galeri</span>
            </button>
          </div>
        </div>

        <div className="bg-[#181B22] border border-[#2E3440] rounded-4xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Status Verifikasi Admin</span>
            <span className="text-[11px] font-semibold text-[#38BDF8]">SLA Maks. 1x24 Jam</span>
          </div>

          {status === 'Menunggu' || status === 'Belum Diunggah' ? (
            <div className="p-3 rounded-3xl bg-[#222631] border border-[#2E3440] flex items-start gap-2.5 text-xs text-[#FBBF24]">
              <Clock size={16} className="shrink-0 mt-0.5 text-[#F59E0B]" />
              <p className="leading-relaxed">
                {photoDataUrl
                  ? 'Menunggu Tinjauan Admin (1x24 jam). Kamu tetap bisa lanjut mengatur minat kolaborasi sekarang.'
                  : 'Silakan unggah foto Binusian Card terlebih dahulu agar masuk ke antrean verifikasi Admin.'}
              </p>
            </div>
          ) : null}

          {status === 'Disetujui' && (
            <div className="p-3 rounded-3xl bg-[#38BDF8]/15 border border-[#38BDF8]/40 flex items-start gap-2.5 text-xs text-[#38BDF8]">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[#38BDF8]" />
              <p className="leading-relaxed font-semibold">
                Binusian Card Disetujui! Badge Verified Binusian aktif & file foto kartu telah dihapus otomatis sesuai UU PDP.
              </p>
            </div>
          )}

          {status === 'Ditolak' && (
            <div className="p-3 rounded-3xl bg-rose-500/15 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-200">
              <XCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <p className="leading-relaxed">
                Ditolak: Foto kartu buram atau NIM tidak terbaca. Silakan unggah ulang foto yang jelas.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-2 text-xs text-[#94A3B8]">
          <Lock size={14} className="text-[#38BDF8] shrink-0" />
          <span>Kepatuhan UU PDP: Foto kartu hanya untuk verifikasi & tidak ditampilkan ke publik.</span>
        </div>

        <button
          type="button"
          disabled={status === 'Ditolak' || isScanning}
          onClick={() => {
            stopLiveCamera();
            handleProceedToInterests();
          }}
          className="w-full py-3.5 rounded-full bg-[#F59E0B] hover:bg-[#FBBF24] disabled:bg-[#2E3440] disabled:text-[#94A3B8] text-[#0F1115] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F59E0B]/25 transition cursor-pointer"
        >
          <span>Continue to Select Interests</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
