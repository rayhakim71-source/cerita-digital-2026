/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useEffect } from 'react';
import { UserRole } from './types';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  isExternal?: boolean;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  activeId: string;
  onSelect: (item: MenuItem) => void;
  role: UserRole;
  onOpenLogin: () => void;
  onLogout: () => void;
  appName: string;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  items,
  activeId,
  onSelect,
  role,
  onOpenLogin,
  onLogout,
  appName,
}) => {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 flex">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0F0F14]/80 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-[280px] max-w-[85vw] h-full bg-[#1A1A22] border-r border-[#34343F] flex flex-col z-10 shadow-2xl">
        <div className="p-5 border-b border-[#34343F]">
          <h2 className="font-serif text-lg font-bold text-[#F5F1E8] tracking-wide">
            {appName}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-1">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className={`w-full min-h-[48px] px-4 rounded-lg text-left text-base font-medium transition-colors flex items-center ${
                  isActive
                    ? 'bg-[#24242E] text-[#E8B04A]'
                    : 'text-[#F5F1E8] hover:bg-[#24242E] hover:text-[#E8B04A]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {role === 'publik' ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="w-full min-h-[48px] px-4 rounded-lg text-left text-base font-medium text-[#F5F1E8] hover:bg-[#24242E] hover:text-[#E8B04A] transition-colors flex items-center mt-auto pt-2 border-t border-[#34343F]"
            >
              Masuk
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full min-h-[48px] px-4 rounded-lg text-left text-base font-medium text-[#D9534F] hover:bg-[#24242E] transition-colors flex items-center mt-auto pt-2 border-t border-[#34343F]"
            >
              Keluar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
