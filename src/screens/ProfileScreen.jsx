import React, { useState, useRef, useEffect } from 'react';
import {
  BadgeCheck,
  Edit3,
  Shield,
  Bell,
  LogOut,
  Trash2,
  Flame,
  Users,
  CheckCircle2,
  Moon,
  Sun,
  Plus,
  Target,
  BookOpen,
  X,
  Cloud
} from 'lucide-react';
import { GOALS, INTERESTS_LIST, FACULTY_MAJORS_MAP } from '../data/mockData';
import { uploadPhotoToSupabase } from '../utils/supabaseClient';

const FACULTY_LIST = Object.keys(FACULTY_MAJORS_MAP);

export default function ProfileScreen({
  user,
  conversations,
  theme = 'light',
  isCloudConnected = false,
  onOpenCloudConfig,
  onToggleTheme,
  onUpdateUser,
  onOpenInterests,
  onLogout,
  onDeleteAccount
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [faculty, setFaculty] = useState(user.faculty || FACULTY_LIST[0]);
  const [major, setMajor] = useState(user.major);
  const [bio, setBio] = useState(user.bio);
  const [goal, setGoal] = useState(user.goal);
  const [promptAnswer, setPromptAnswer] = useState(
    user.promptAnswer || 'Lolos final GEMASTIK divisi Pengembangan Perangkat Lunak'
  );
  const [interests, setInterests] = useState(user.interests);
  const [extraPhotos, setExtraPhotos] = useState(user.extraPhotos || [null, null, null]);
  const [activeSlotIdx, setActiveSlotIdx] = useState(0);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  const slotInputRef = useRef(null);

  useEffect(() => {
    setName(user.name);
    setFaculty(user.faculty || FACULTY_LIST[0]);
    setMajor(user.major);
    setBio(user.bio);
    setGoal(user.goal);
    setPromptAnswer(user.promptAnswer || '');
    setInterests(user.interests || []);
    setExtraPhotos(user.extraPhotos || [null, null, null]);
  }, [user]);

  const availableMajors = FACULTY_MAJORS_MAP[faculty] || [];

  const handleFacultyChange = (newFac) => {
    setFaculty(newFac);
    const list = FACULTY_MAJORS_MAP[newFac] || [];
    if (!list.includes(major)) {
      setMajor(list[0] || '');
    }
  };

  const activeStreaksCount = conversations.filter((c) => c.streakDays >= 3).length;
  const highestStreak = conversations.reduce(
    (max, c) => (c.streakDays > max ? c.streakDays : max),
    0
  );

  const toggleInterest = (tag) => {
    if (interests.includes(tag)) {
      if (interests.length > 1) {
        setInterests(interests.filter((i) => i !== tag));
      }
    } else {
      setInterests([...interests, tag]);
    }
  };

  const handleTriggerPhotoSlot = (slotIdx) => {
    setActiveSlotIdx(slotIdx);
    slotInputRef.current?.click();
  };

  const handlePhotoSlotPicked = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const url = ev.target?.result;
      if (typeof url === 'string') {
        const uploaded = await uploadPhotoToSupabase(
          url,
          'avatars',
          `${user.nim || 'user'}_slot_${activeSlotIdx}`
        );
        const finalUrl = uploaded.url || url;
        if (activeSlotIdx === -1) {
          onUpdateUser({ avatar: finalUrl });
        } else {
          const next = [...extraPhotos];
          next[activeSlotIdx] = finalUrl;
          setExtraPhotos(next);
          onUpdateUser({ extraPhotos: next });
        }
        setSavedBanner(true);
        setTimeout(() => setSavedBanner(false), 2500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveExtraPhoto = (idx, e) => {
    e.stopPropagation();
    const next = [...extraPhotos];
    next[idx] = null;
    setExtraPhotos(next);
    onUpdateUser({ extraPhotos: next });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateUser({
      name,
      faculty,
      major,
      bio,
      goal,
      promptAnswer,
      interests
    });
    setIsEditing(false);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0F1115] text-white overflow-y-auto no-scrollbar px-5 pt-5 pb-4 space-y-4">
      {/* Hidden File Input for Adding Profile Photos */}
      <input
        ref={slotInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoSlotPicked}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <h1 className="font-display text-xl font-extrabold text-white">
          Profil <span className="text-[#F59E0B]">Akademik</span>
        </h1>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-1.5 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 transition cursor-pointer ${
            isEditing
              ? 'bg-[#F59E0B] text-[#0F1115]'
              : 'bg-[#181B22] hover:bg-[#F59E0B] text-white hover:text-[#0F1115] border border-[#2E3440]'
          }`}
        >
          <Edit3 size={13} />
          <span>{isEditing ? 'Tutup Edit' : 'Edit Profil'}</span>
        </button>
      </div>

      {savedBanner && (
        <div className="p-3 rounded-3xl bg-[#F59E0B]/20 border border-[#F59E0B] text-white text-xs flex items-center gap-2 shrink-0">
          <CheckCircle2 size={15} className="text-[#F59E0B]" />
          <span>Perubahan profil tersimpan otomatis!</span>
        </div>
      )}

      {/* Bento Profile Card: 1 Main Photo + Three "+" Slots */}
      <div className="bg-[#181B22] border border-[#2E3440] rounded-4xl p-4 space-y-4 shrink-0">
        <div className="grid grid-cols-4 gap-2">
          {/* Slot 1: Main Profile Photo */}
          <div
            onClick={() => handleTriggerPhotoSlot(-1)}
            title="Klik untuk ganti foto utama"
            className="relative h-20 rounded-2xl overflow-hidden border-2 border-[#F59E0B] cursor-pointer group"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
          </div>

          {/* Slots 2, 3, 4: "+" Photo Upload Slots */}
          {extraPhotos.map((photoUrl, idx) => (
            <div
              key={idx}
              onClick={() => handleTriggerPhotoSlot(idx)}
              className="relative h-20 rounded-2xl bg-[#222631] hover:bg-[#2E3440] border border-dashed border-[#2E3440] hover:border-[#F59E0B] flex items-center justify-center text-[#94A3B8] hover:text-[#F59E0B] cursor-pointer overflow-hidden transition"
            >
              {photoUrl ? (
                <>
                  <img
                    src={photoUrl}
                    alt={`Foto ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleRemoveExtraPhoto(idx, e)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 text-white flex items-center justify-center"
                  >
                    <X size={11} />
                  </button>
                </>
              ) : (
                <Plus size={18} />
              )}
            </div>
          ))}
        </div>

        {/* Identity Pill Box — Academic Blue strictly for Verified Campus / Faculty / Batch */}
        <div className="bg-[#222631] border border-[#2E3440] rounded-3xl p-3.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-extrabold text-sm text-white truncate">
                {user.name}
              </h2>
              {user.verified && (
                <BadgeCheck size={16} className="text-[#38BDF8] shrink-0" />
              )}
            </div>
            <p className="text-xs text-[#38BDF8] font-bold mt-0.5 truncate">
              {user.major}
            </p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              {user.hideBatch
                ? '🔒 Angkatan Disembunyikan dari Publik'
                : `Binusian Angkatan ${user.batch} · ${user.email}`}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold shrink-0 ${
              user.verified
                ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40'
                : 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40'
            }`}
          >
            {user.verificationStatus || 'Disetujui'}
          </span>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#0F1115] border border-[#2E3440] p-2.5 rounded-3xl">
            <div className="flex items-center justify-center gap-1 text-[#38BDF8] font-extrabold text-sm">
              <Users size={14} />
              <span>{conversations.length}</span>
            </div>
            <span className="text-[11px] text-[#94A3B8] block mt-0.5">Koneksi</span>
          </div>
          <div className="bg-[#0F1115] border border-[#2E3440] p-2.5 rounded-3xl">
            <div className="flex items-center justify-center gap-1 text-[#F59E0B] font-extrabold text-sm">
              <Flame size={14} className="fill-[#F59E0B]" />
              <span>{activeStreaksCount}</span>
            </div>
            <span className="text-[11px] text-[#94A3B8] block mt-0.5">Streak 3+</span>
          </div>
          <div className="bg-[#0F1115] border border-[#2E3440] p-2.5 rounded-3xl">
            <span className="text-white font-extrabold text-sm block">
              {highestStreak} hr
            </span>
            <span className="text-[11px] text-[#94A3B8] block mt-0.5">Rekor</span>
          </div>
        </div>
      </div>

      {/* Edit Form or Bio & Interests Bento Card */}
      {isEditing ? (
        <form
          onSubmit={handleSaveProfile}
          className="bg-[#181B22] border border-[#2E3440] rounded-4xl p-4 space-y-3 shrink-0"
        >
          <div className="bg-[#222631] rounded-3xl px-4 py-2.5 border border-[#2E3440]">
            <label className="block text-[11px] font-bold text-[#94A3B8]">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-white mt-0.5 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div className="bg-[#222631] rounded-3xl px-4 py-2.5 border border-[#2E3440]">
              <label className="block text-[11px] font-bold text-[#38BDF8]">Fakultas</label>
              <select
                value={faculty}
                onChange={(e) => handleFacultyChange(e.target.value)}
                className="w-full bg-[#222631] text-xs font-bold text-white mt-0.5 focus:outline-none"
              >
                {FACULTY_LIST.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div className="bg-[#222631] rounded-3xl px-4 py-2.5 border border-[#2E3440]">
              <label className="block text-[11px] font-bold text-[#38BDF8]">Jurusan (Sesuai Fakultas)</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full bg-[#222631] text-xs font-bold text-white mt-0.5 focus:outline-none"
              >
                {availableMajors.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="bg-[#222631] rounded-3xl px-4 py-2.5 border border-[#2E3440]">
              <label className="block text-[11px] font-bold text-[#94A3B8]">Tujuan Kolaborasi</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-[#222631] text-xs font-bold text-white mt-0.5 focus:outline-none"
              >
                {GOALS.filter((g) => g !== 'Semua').map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-[#222631] rounded-3xl px-4 py-2.5 border border-[#2E3440]">
            <label className="block text-[11px] font-bold text-[#38BDF8]">
              Target Proyek / Kompetisi Semester Ini
            </label>
            <input
              type="text"
              value={promptAnswer}
              onChange={(e) => setPromptAnswer(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-white mt-0.5 focus:outline-none"
            />
          </div>

          <div className="bg-[#222631] rounded-3xl px-4 py-2.5 border border-[#2E3440]">
            <label className="block text-[11px] font-bold text-[#94A3B8]">Bio Singkat</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-transparent text-xs text-white mt-0.5 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-[#94A3B8] px-1">
              Pilih Keahlian & Minat
            </label>
            <div className="flex flex-wrap gap-1.5">
              {INTERESTS_LIST.map((tag) => {
                const active = interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer ${
                      active
                        ? 'bg-[#F59E0B] text-[#0F1115]'
                        : 'bg-[#222631] text-[#94A3B8]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0F1115] text-xs font-extrabold cursor-pointer"
          >
            Simpan Profil
          </button>
        </form>
      ) : (
        <div className="bg-[#181B22] border border-[#2E3440] rounded-4xl p-4 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white">Fokus & Minat Akademik</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F59E0B] text-[#0F1115] text-[11px] font-extrabold">
              <Target size={11} />
              <span>{user.goal}</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0F1115] border border-[#2E3440] space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#38BDF8]">
              <BookOpen size={12} />
              <span>{user.promptQuestion || 'Target Kolaborasi Semester Ini'}</span>
            </span>
            <p className="text-xs font-bold text-white">
              &ldquo;{user.promptAnswer || 'Lolos final GEMASTIK divisi Pengembangan Perangkat Lunak'}&rdquo;
            </p>
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed">{user.bio}</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#94A3B8]">Interests</span>
              {onOpenInterests && (
                <button
                  type="button"
                  onClick={onOpenInterests}
                  className="text-[11px] font-bold text-[#F59E0B] hover:underline cursor-pointer"
                >
                  Edit Interests →
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.interests.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-[#222631] border border-[#2E3440] text-white text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy & Settings Card */}
      <div className="bg-[#181B22] border border-[#2E3440] rounded-4xl p-4 space-y-3 shrink-0">
        <span className="text-xs font-extrabold text-white block">
          Pengaturan & Privasi
        </span>

        {/* Interactive Light & Dark Mode Switcher */}
        <div
          onClick={onToggleTheme}
          className="flex items-center justify-between p-3 rounded-3xl bg-[#222631] cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            {theme === 'light' ? (
              <Sun size={16} className="text-[#F59E0B]" />
            ) : (
              <Moon size={16} className="text-[#F59E0B]" />
            )}
            <div>
              <span className="text-xs font-bold text-white block">
                Tema Tampilan Aplikasi
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                Saat ini: {theme === 'light' ? 'Light Mode (Terang)' : 'Dark Mode (Gelap)'}
              </span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#F59E0B] text-[#0F1115] text-[11px] font-extrabold">
            {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
          </span>
        </div>

        <label className="flex items-center justify-between p-3 rounded-3xl bg-[#222631] cursor-pointer">
          <div className="flex items-center gap-2.5">
            <Moon size={16} className="text-[#F59E0B]" />
            <div>
              <span className="text-xs font-bold text-white block">
                Mode Jangan Ganggu (DND)
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                Blokir layar panggilan masuk saat jam kuliah
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={user.dndMode}
            onChange={(e) => onUpdateUser({ dndMode: e.target.checked })}
            className="w-4 h-4 accent-[#F59E0B]"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-3xl bg-[#222631] cursor-pointer">
          <div className="flex items-center gap-2.5">
            <Bell size={16} className="text-[#F59E0B]" />
            <div>
              <span className="text-xs font-bold text-white block">
                Pengingat Streak Diskusi
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                Notifikasi saat jam pasir muncul
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={user.streakNotif}
            onChange={(e) => onUpdateUser({ streakNotif: e.target.checked })}
            className="w-4 h-4 accent-[#F59E0B]"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-3xl bg-[#222631] cursor-pointer">
          <div className="flex items-center gap-2.5">
            <Shield size={16} className="text-[#38BDF8]" />
            <div>
              <span className="text-xs font-bold text-white block">
                Sembunyikan Angkatan
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                Privasi sesuai UU PDP No. 27 Tahun 2022
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={user.hideBatch}
            onChange={(e) => onUpdateUser({ hideBatch: e.target.checked })}
            className="w-4 h-4 accent-[#F59E0B]"
          />
        </label>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onLogout}
            className="py-3 rounded-full bg-[#222631] hover:bg-[#2E3440] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Keluar</span>
          </button>
          <button
            type="button"
            onClick={() => setConfirmDeleteModal(true)}
            className="py-3 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Hapus Akun</span>
          </button>
        </div>
      </div>

      {confirmDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-[#181B22] border border-[#2E3440] rounded-4xl max-w-xs w-full p-6 space-y-3 text-center">
            <h3 className="text-sm font-extrabold text-rose-400">
              Hapus Akun Permanen?
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Seluruh data NIM, profil, dan riwayat percakapan kamu akan dihapus dari penyimpanan lokal sesuai UU PDP.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteModal(false)}
                className="flex-1 py-2.5 rounded-full bg-[#222631] text-white text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDeleteModal(false);
                  onDeleteAccount();
                }}
                className="flex-1 py-2.5 rounded-full bg-[#F59E0B] text-[#0F1115] text-xs font-extrabold cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
