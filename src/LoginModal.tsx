/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { verifyLoginPassword } from './authData';
import { UserRole } from './types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('Kata sandi wajib diisi');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    try {
      const role = await verifyLoginPassword(password);
      setIsLoading(false);
      if (role) {
        setPassword('');
        onSuccess(role);
        onClose();
      } else {
        setErrorMsg('Kata sandi salah');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('Gagal memverifikasi');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0F0F14]/85 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-sm rounded-xl bg-[#1A1A22] border border-[#34343F] p-6 shadow-2xl z-10">
        <h2 className="font-serif text-xl font-bold text-[#F5F1E8] mb-5">
          Masuk
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#F5F1E8] mb-1.5">
              Kata Sandi *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                autoFocus
                className="w-full h-11 pl-3 pr-10 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#B8B2A5] hover:text-[#F5F1E8] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errorMsg ? (
              <p className="mt-1.5 text-xs text-[#D9534F] font-medium">{errorMsg}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-lg border border-[#34343F] text-sm font-medium text-[#B8B2A5] hover:text-[#F5F1E8] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="h-10 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-95 transition-all flex items-center justify-center min-w-[80px]"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#0F0F14] border-t-transparent rounded-full animate-spin" />
              ) : (
                'Masuk'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
