/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';

interface NotFoundPageProps {
  onBackHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBackHome }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F1E8]">
        Page Not Found
      </h1>
      <button
        type="button"
        onClick={onBackHome}
        className="h-11 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] font-semibold text-sm hover:opacity-90 transition-all"
      >
        Home
      </button>
    </div>
  );
};
