import React, { useState } from 'react';
import {
  BadgeCheck,
  Edit3,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  Trash2,
  Target,
  Flame,
  Users,
  CheckCircle2,
  Moon
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
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-6">
      {/* Top Profile Header (FR-38 & FR-39) */}
      <div className="bg-white border-b border-slate-200 p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-binus-blue"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold text-slate-900">{user.name}</h1>
                {user.verified && (
                  <span
                    title="Lencana Mahasiswa Terverifikasi Binus (FR-39)"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-binus-blue border border-blue-200 text-[10px] font-extrabold"
                  >
                    <BadgeCheck size={13} />
                    <span>Terverifikasi</span>
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {user.major} {!user.hideBatch && `· Angkatan ${user.batch}`}
              </p>
              <p className="text-[11px] font-mono text-slate-400">
                NIM: {user.nim} · {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <Edit3 size={14} />
            <span>{isEditing ? 'Batal' : 'Edit'}</span>
          </button>
        </div>

        {savedBanner && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>Perubahan profil berhasil disimpan!</span>
          </div>
        )}

        {/* Short Statistics (FR-40) */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <div className="flex items-center justify-center gap-1 text-binus-blue font-extrabold text-sm">
              <Users size={15} />
              <span>{conversations.length}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              Total Match
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <div className="flex items-center justify-center gap-1 text-binus-orange font-extrabold text-sm">
              <Flame size={15} />
              <span>{activeStreaksCount}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              Streak Aktif (3+ hr)
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <div className="flex items-center justify-center gap-1 text-emerald-600 font-extrabold text-sm">
              <span>{highestStreak} hr</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              Rekor Streak Chat
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Edit or View Profile Details (FR-38) */}
        {isEditing ? (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3"
          >
            <h2 className="text-xs font-extrabold text-slate-800 uppercase">
              Edit Profil Networking (FR-38)
            </h2>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Jurusan
                </label>
                <select
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {MAJORS.filter((m) => m !== 'Semua').map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Angkatan
                </label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {['2023', '2024', '2025', '2026'].map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tujuan Bergabung
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {GOALS.filter((g) => g !== 'Semua').map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Bio Singkat
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                Minat & Keahlian
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INTERESTS_LIST.map((tag) => {
                  const active = interests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        active
                          ? 'bg-binus-blue text-white'
                          : 'bg-slate-100 text-slate-600'
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
              className="w-full py-2.5 rounded-xl bg-binus-blue text-white text-xs font-bold cursor-pointer"
            >
              Simpan Perubahan Profil
            </button>
          </form>
        ) : (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800">
                Tentang & Tujuan Networking
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                <Target size={12} className="text-binus-orange" />
                <span>{user.goal}</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{user.bio}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {user.interests.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-blue-50 text-binus-blue text-[11px] font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Settings: Privacy, Notifications, DND, Streak Notification, Logout, Delete Account (FR-41, FR-51, FR-57) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Pengaturan & Privasi (FR-41, FR-51, FR-57)
          </h2>

          {/* FR-51: Do Not Disturb Mode */}
          <label className="flex items-center justify-between py-1.5 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Moon size={16} className="text-indigo-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Mode Jangan Ganggu (FR-51)
                </span>
                <span className="text-[10px] text-slate-500">
                  Senyapkan panggilan video masuk saat sedang kuliah
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={user.dndMode}
              onChange={(e) => onUpdateUser({ dndMode: e.target.checked })}
              className="w-4 h-4 accent-binus-blue"
            />
          </label>

          {/* FR-57: Turn off streak notifications */}
          <label className="flex items-center justify-between py-1.5 border-t border-slate-100 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Bell size={16} className="text-binus-orange" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Notifikasi Pengingat Streak (FR-57)
                </span>
                <span className="text-[10px] text-slate-500">
                  Ingatkan saat jam pasir muncul sebelum 24 jam berakhir
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={user.streakNotif}
              onChange={(e) => onUpdateUser({ streakNotif: e.target.checked })}
              className="w-4 h-4 accent-binus-blue"
            />
          </label>

          {/* Section 10 Privacy: Hide Batch */}
          <label className="flex items-center justify-between py-1.5 border-t border-slate-100 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Shield size={16} className="text-binus-blue" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Sembunyikan Tahun Angkatan
                </span>
                <span className="text-[10px] text-slate-500">
                  Hanya tampilkan jurusan pada kartu profil kamu
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={user.hideBatch}
              onChange={(e) => onUpdateUser({ hideBatch: e.target.checked })}
              className="w-4 h-4 accent-binus-blue"
            />
          </label>

          {/* Help & UU PDP Notice */}
          <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
            <HelpCircle size={15} className="text-slate-400 shrink-0 mt-0.5" />
            <span>
              Data pribadi dikelola sesuai <strong>UU No. 27 Tahun 2022 (UU PDP)</strong>. Foto Binusian Card telah dihapus setelah verifikasi selesai.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={onLogout}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Keluar (FR-41)</span>
            </button>
            <button
              type="button"
              onClick={() => setConfirmDeleteModal(true)}
              className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Hapus Akun</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal (FR-41 & Section 9 Privacy) */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-extrabold text-rose-600">
              Hapus Akun & Data Pribadi?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sesuai UU Pelindungan Data Pribadi, seluruh data NIM, profil, dan riwayat percakapan kamu akan dihapus permanen.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmDeleteModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDeleteModal(false);
                  onDeleteAccount();
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
