/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { CMSSettings, UserRole } from './types';

interface HeaderProps {
  cms: CMSSettings;
  currentPath: string;
  onNavigate: (path: string) => void;
  role: UserRole;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cms,
  currentPath,
  onNavigate,
  role,
  onOpenLogin,
}) => {
  const isFormAvailable = Boolean(cms.galeri.tautanGoogleForm && cms.galeri.tautanGoogleForm.trim() !== '');

  const publicNavItems = [
    { id: 'home', label: 'Home', path: '#/' },
    { id: 'gallery', label: 'Gallery', path: '#/gallery' },
    { id: 'about', label: 'About', path: '#/about' },
  ];

  if (isFormAvailable && cms.tombol.submitWork.visible) {
    publicNavItems.push({
      id: 'submit',
      label: cms.tombol.submitWork.label || 'Submit Work',
      path: 'google-form',
    });
  }

  const handleItemClick = (path: string) => {
    if (path === 'google-form') {
      if (cms.galeri.tautanGoogleForm) {
        window.open(cms.galeri.tautanGoogleForm, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0F0F14]/90 backdrop-blur-md border-b border-[#34343F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div
          onClick={() => onNavigate('#/')}
          className="cursor-pointer flex items-center gap-3 select-none"
        >
          {cms.identitas.logo.nilai ? (
            <img
              src={cms.identitas.logo.nilai}
              alt=""
              className="h-8 max-w-[120px] object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : null}
          <div className="flex flex-col">
            <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-[#F5F1E8]">
              {cms.identitas.namaAplikasi}
            </span>
            <span className="hidden sm:block text-[11px] text-[#B8B2A5] -mt-1 tracking-wider uppercase font-medium">
              {cms.identitas.namaSekolah}
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {publicNavItems.map((item) => {
            const isActive =
              item.path === '#/'
                ? currentPath === '#/' || currentPath === ''
                : currentPath.startsWith(item.path);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.path)}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#E8B04A] border-b-2 border-[#E8B04A] pb-0.5'
                    : 'text-[#B8B2A5] hover:text-[#F5F1E8]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {role === 'publik' ? (
            <button
              type="button"
              onClick={onOpenLogin}
              className="text-sm font-medium text-[#B8B2A5] hover:text-[#E8B04A] transition-colors"
            >
              Masuk
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('#/admin')}
              className={`text-sm font-medium transition-colors ${
                currentPath.startsWith('#/admin')
                  ? 'text-[#E8B04A] border-b-2 border-[#E8B04A] pb-0.5'
                  : 'text-[#E8B04A] hover:underline'
              }`}
            >
              Dasbor
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
