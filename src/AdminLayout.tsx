/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { UserRole } from './types';

interface AdminLayoutProps {
  role: UserRole;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onViewPublic: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  role,
  activeTab,
  onSelectTab,
  onLogout,
  onViewPublic,
  children,
}) => {
  const isSuperadmin = role === 'superadmin';

  const menuItems = [
    { id: 'dasbor', label: 'Dasbor' },
    { id: 'persetujuan', label: 'Persetujuan' },
    { id: 'semua', label: 'Semua Karya' },
    { id: 'perlu-diperiksa', label: 'Perlu Diperiksa' },
    { id: 'rekap', label: 'Rekap' },
    { id: 'cms', label: 'CMS' },
    { id: 'kata-sandi', label: isSuperadmin ? 'Akun dan Kata Sandi' : 'Kata Sandi' },
  ];

  if (isSuperadmin) {
    menuItems.push(
      { id: 'sinkronisasi', label: 'Sinkronisasi' },
      { id: 'log', label: 'Log Aktivitas' },
      { id: 'firebase', label: 'Firebase' }
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#34343F]">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-[#E8B04A] font-semibold">
            {isSuperadmin ? 'Superadmin' : 'Admin Guru'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onViewPublic}
            className="text-xs font-semibold text-[#E8B04A] hover:underline"
          >
            Lihat Galeri &rarr;
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="text-xs font-semibold text-[#D9534F] hover:underline"
          >
            Keluar
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="hidden md:block w-56 shrink-0 bg-[#1A1A22] border border-[#34343F] rounded-xl p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full h-11 px-3.5 rounded-lg text-left text-sm font-medium transition-colors flex items-center ${
                  isActive
                    ? 'bg-[#24242E] text-[#E8B04A]'
                    : 'text-[#B8B2A5] hover:bg-[#24242E] hover:text-[#F5F1E8]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </aside>

        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
