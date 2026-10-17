import React, { useState } from 'react';
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
  Plus,
  Sparkles
} from 'lucide-react';
import { GOALS, INTERESTS_LIST, MAJORS } from '../data/mockData';

export default function ProfileScreen({
  user,
  conversations,
  onUpdateUser,
  onLogout,
  onDeleteAccount
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [major, setMajor] = useState(user.major);
  const [batch, setBatch] = useState(user.batch);
  const [bio, setBio] = useState(user.bio);
  const [goal, setGoal] = useState(user.goal);
  const [interests, setInterests] = useState(user.interests);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateUser({
      name,
      major,
      batch,
      bio,
      goal,
      interests
    });
    setIsEditing(false);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0E] text-white overflow-y-auto no-scrollbar px-5 pt-5 pb-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-extrabold">
          Profil <span className="text-[#FF4D8D]">Binusian</span>
        </h1>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-1.5 rounded-full bg-[#15151E] hover:bg-[#FF4D8D] text-white hover:text-[#0A0A0E] border border-[#2A2A3A] text-xs font-extrabold inline-flex items-center gap-1.5 transition cursor-pointer"
        >
          <Edit3 size={13} />
          <span>{isEditing ? 'Selesai' : 'Edit Profil'}</span>
        </button>
      </div>

      {savedBanner && (
        <div className="p-3 rounded-3xl bg-[#FF4D8D]/20 border border-[#FF4D8D] text-white text-xs flex items-center gap-2">
          <CheckCircle2 size={15} className="text-[#FF4D8D]" />
          <span>Profil berhasil diperbarui!</span>
        </div>
      )}

      {/* Bento Profile Card (Inspired by Reference Center-Left Form & Photo Slots Card!) */}
      <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-4 space-y-4">
        {/* Photo Slots Row like Reference UI */}
        <div className="grid grid-cols-4 gap-2">
          <div className="relative h-20 rounded-2xl overflow-hidden border-2 border-[#FF4D8D]">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative h-20 rounded-2xl overflow-hidden bg-[#1E1E2A] border border-[#2A2A3A] flex items-center justify-center">
            <img
              src="/beemate-logo.png"
              alt="BeeMate"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="h-20 rounded-2xl bg-[#1E1E2A] border border-dashed border-[#2A2A3A] flex items-center justify-center text-[#9494A8]">
            <Plus size={18} />
          </div>
          <div className="h-20 rounded-2xl bg-[#1E1E2A] border border-dashed border-[#2A2A3A] flex items-center justify-center text-[#9494A8]">
            <Plus size={18} />
          </div>
        </div>

        {/* Identity Pill Box */}
        <div className="bg-[#1E1E2A] border border-[#2A2A3A] rounded-3xl p-3.5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-extrabold text-sm text-white">
                {user.name}
              </h2>
              {user.verified && (
                <BadgeCheck size={16} className="text-[#FF4D8D]" />
              )}
            </div>
            <p className="text-xs text-[#FF85B3] font-semibold mt-0.5">
              {user.major} {!user.hideBatch && `· Binusian ${user.batch}`}
            </p>
            <p className="text-[10px] text-[#9494A8] font-mono mt-0.5">
              NIM {user.nim}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-[10px] font-extrabold">
            Verified
          </span>
        </div>

        {/* Statistics Row (FR-40) */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#0A0A0E] border border-[#2A2A3A] p-2.5 rounded-3xl">
            <div className="flex items-center justify-center gap-1 text-[#FF4D8D] font-extrabold text-sm">
              <Users size={14} />
              <span>{conversations.length}</span>
            </div>
            <span className="text-[10px] text-[#9494A8] block mt-0.5">Match</span>
          </div>
          <div className="bg-[#0A0A0E] border border-[#2A2A3A] p-2.5 rounded-3xl">
            <div className="flex items-center justify-center gap-1 text-[#FF85B3] font-extrabold text-sm">
              <Flame size={14} />
              <span>{activeStreaksCount}</span>
            </div>
            <span className="text-[10px] text-[#9494A8] block mt-0.5">Streak 3+</span>
          </div>
          <div className="bg-[#0A0A0E] border border-[#2A2A3A] p-2.5 rounded-3xl">
            <span className="text-white font-extrabold text-sm block">
              {highestStreak} hr
            </span>
            <span className="text-[10px] text-[#9494A8] block mt-0.5">Rekor</span>
          </div>
        </div>
      </div>

      {/* Edit Form or Bio & Interests Bento Card */}
      {isEditing ? (
        <form
          onSubmit={handleSaveProfile}
          className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-4 space-y-3"
        >
          <div className="bg-[#1E1E2A] rounded-3xl px-4 py-2.5 border border-[#2A2A3A]">
            <label className="block text-[10px] font-bold text-[#9494A8]">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-white mt-0.5 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#1E1E2A] rounded-3xl px-4 py-2.5 border border-[#2A2A3A]">
              <label className="block text-[10px] font-bold text-[#9494A8]">Jurusan</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full bg-[#1E1E2A] text-xs font-bold text-white mt-0.5 focus:outline-none"
              >
                {MAJORS.filter((m) => m !== 'Semua').map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="bg-[#1E1E2A] rounded-3xl px-4 py-2.5 border border-[#2A2A3A]">
              <label className="block text-[10px] font-bold text-[#9494A8]">Tujuan</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-[#1E1E2A] text-xs font-bold text-white mt-0.5 focus:outline-none"
              >
                {GOALS.filter((g) => g !== 'Semua').map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-[#1E1E2A] rounded-3xl px-4 py-2.5 border border-[#2A2A3A]">
            <label className="block text-[10px] font-bold text-[#9494A8]">Bio Singkat</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-transparent text-xs text-white mt-0.5 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-[#9494A8] px-1">
              Pilih Minat
            </label>
            <div className="flex flex-wrap gap-1.5">
              {INTERESTS_LIST.map((tag) => {
                const active = interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      active
                        ? 'bg-[#FF4D8D] text-[#0A0A0E]'
                        : 'bg-[#1E1E2A] text-[#9494A8]'
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
            className="w-full py-3 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-xs font-extrabold cursor-pointer"
          >
            Simpan Profil
          </button>
        </form>
      ) : (
        <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white">Tujuan & Minat</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF4D8D]/15 text-[#FF85B3] border border-[#FF4D8D]/40 text-[11px] font-bold">
              <Sparkles size={11} className="text-[#FF4D8D]" />
              <span>{user.goal}</span>
            </span>
          </div>

          <p className="text-xs text-[#9494A8] leading-relaxed">{user.bio}</p>

          <div className="flex flex-wrap gap-1.5">
            {user.interests.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-[#1E1E2A] border border-[#2A2A3A] text-[#FF85B3] text-[11px] font-bold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Privacy & Settings Card (FR-41, FR-51, FR-57) */}
      <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl p-4 space-y-3">
        <span className="text-xs font-extrabold text-white block">
          Pengaturan & Privasi
        </span>

        <label className="flex items-center justify-between p-3 rounded-3xl bg-[#1E1E2A] cursor-pointer">
          <div className="flex items-center gap-2.5">
            <Moon size={16} className="text-[#FF4D8D]" />
            <div>
              <span className="text-xs font-bold text-white block">
                Mode Jangan Ganggu
              </span>
              <span className="text-[10px] text-[#9494A8]">
                Senyapkan panggilan masuk saat kuliah
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={user.dndMode}
            onChange={(e) => onUpdateUser({ dndMode: e.target.checked })}
            className="w-4 h-4 accent-[#FF4D8D]"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-3xl bg-[#1E1E2A] cursor-pointer">
          <div className="flex items-center gap-2.5">
            <Bell size={16} className="text-[#FF85B3]" />
            <div>
              <span className="text-xs font-bold text-white block">
                Pengingat Streak Chat
              </span>
              <span className="text-[10px] text-[#9494A8]">
                Notifikasi saat jam pasir muncul
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={user.streakNotif}
            onChange={(e) => onUpdateUser({ streakNotif: e.target.checked })}
            className="w-4 h-4 accent-[#FF4D8D]"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-3xl bg-[#1E1E2A] cursor-pointer">
          <div className="flex items-center gap-2.5">
            <Shield size={16} className="text-[#FF4D8D]" />
            <div>
              <span className="text-xs font-bold text-white block">
                Sembunyikan Angkatan
              </span>
              <span className="text-[10px] text-[#9494A8]">
                Privasi sesuai UU PDP No. 27 Tahun 2022
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={user.hideBatch}
            onChange={(e) => onUpdateUser({ hideBatch: e.target.checked })}
            className="w-4 h-4 accent-[#FF4D8D]"
          />
        </label>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onLogout}
            className="py-3 rounded-full bg-[#1E1E2A] hover:bg-[#2A2A3A] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
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
          <div className="bg-[#15151E] border border-[#2A2A3A] rounded-4xl max-w-xs w-full p-6 space-y-3 text-center">
            <h3 className="text-sm font-extrabold text-[#FF4D8D]">
              Hapus Akun Permanen?
            </h3>
            <p className="text-xs text-[#9494A8] leading-relaxed">
              Seluruh data NIM, profil, dan riwayat percakapan kamu akan dihapus sesuai UU PDP.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteModal(false)}
                className="flex-1 py-2.5 rounded-full bg-[#1E1E2A] text-white text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDeleteModal(false);
                  onDeleteAccount();
                }}
                className="flex-1 py-2.5 rounded-full bg-[#FF4D8D] text-[#0A0A0E] text-xs font-extrabold"
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
