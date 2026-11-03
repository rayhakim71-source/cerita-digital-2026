/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { Menu } from 'lucide-react';

interface MobileSidebarTriggerProps {
  onClick: () => void;
  isOpen: boolean;
}

export const MobileSidebarTrigger: React.FC<MobileSidebarTriggerProps> = ({ onClick, isOpen }) => {
  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Buka Menu"
      className="md:hidden fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center rounded-r-md bg-[#1A1A22]/90 hover:bg-[#24242E] text-[#E8B04A] border-y border-r border-[#34343F] shadow-lg transition-all"
      style={{
        height: '120px',
        width: '25px',
      }}
    >
      <Menu className="w-4 h-4" />
    </button>
  );
};
