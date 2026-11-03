/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { UserRole } from './types';
import { updateAdminPassword, forceSetPassword } from './authData';
import { addActivityLog } from './activityLogs';

interface AdminPasswordProps {
  role: UserRole;
  onSuccessToast: (msg: string) => void;
}

export const AdminPassword: React.FC<AdminPasswordProps> = ({ role, onSuccessToast }) => {
  const isSuperadmin = role === 'superadmin';

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [targetRole, setTargetRole] = useState<'admin' | 'superadmin'>('admin');
  const [superNewPass, setSuperNewPass] = useState('');
  const [superConfirmPass, setSuperConfirmPass] = useState('');
  const [superErrorMsg, setSuperErrorMsg] = useState('');

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Semua kolom wajib diisi');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg('Kata sandi minimal 8 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok');
      return;
    }

    const ok = await updateAdminPassword(oldPassword, newPassword);
    if (ok) {
      addActivityLog('Admin', 'Ubah Kata Sandi');
      onSuccessToast('Berhasil disimpan');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg('');
    } else {
      setErrorMsg('Kata sandi lama salah');
    }
  };

  const handleSuperadminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!superNewPass || !superConfirmPass) {
      setSuperErrorMsg('Semua kolom wajib diisi');
      return;
    }
    if (superNewPass.length < 8) {
      setSuperErrorMsg('Kata sandi minimal 8 karakter');
      return;
    }
    if (superNewPass !== superConfirmPass) {
      setSuperErrorMsg('Konfirmasi kata sandi tidak cocok');
      return;
    }

    const ok = await forceSetPassword(targetRole, superNewPass);
    if (ok) {
      addActivityLog('Superadmin', `Ubah Kata Sandi (${targetRole})`);
      onSuccessToast('Berhasil disimpan');
      setSuperNewPass('');
      setSuperConfirmPass('');
      setSuperErrorMsg('');
    }
  };

  return (
    <div className="max-w-md space-y-6">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
        {isSuperadmin ? 'Akun dan Kata Sandi' : 'Kata Sandi'}
      </h1>

      {isSuperadmin ? (
        <form onSubmit={handleSuperadminSubmit} className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
              Pilih Peran *
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as 'admin' | 'superadmin')}
              className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base cursor-pointer"
            >
              <option value="admin">Admin (Guru)</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
              Kata Sandi Baru *
            </label>
            <input
              type="password"
              value={superNewPass}
              onChange={(e) => {
                setSuperNewPass(e.target.value);
                if (superErrorMsg) setSuperErrorMsg('');
              }}
              className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
              Ulangi Kata Sandi Baru *
            </label>
            <input
              type="password"
              value={superConfirmPass}
              onChange={(e) => {
                setSuperConfirmPass(e.target.value);
                if (superErrorMsg) setSuperErrorMsg('');
              }}
              className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
            />
          </div>

          {superErrorMsg ? (
            <p className="text-xs text-[#D9534F] font-medium">{superErrorMsg}</p>
          ) : null}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="h-10 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 transition-all"
            >
              Simpan
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleAdminSubmit} className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
              Kata Sandi Lama *
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
              Kata Sandi Baru *
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
              Ulangi Kata Sandi Baru *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
            />
          </div>

          {errorMsg ? (
            <p className="text-xs text-[#D9534F] font-medium">{errorMsg}</p>
          ) : null}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="h-10 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 transition-all"
            >
              Simpan
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
