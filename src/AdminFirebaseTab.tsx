/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';

export const AdminFirebaseTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
          Firebase
        </h1>

        <span className="text-sm font-medium text-[#B8B2A5]">
          Belum aktif
        </span>
      </div>

      <div className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 space-y-4 opacity-50 pointer-events-none select-none">
        <div>
          <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
            Project ID
          </label>
          <input
            type="text"
            disabled
            value=""
            className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#B8B2A5] border border-[#34343F] text-base"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
            API Key
          </label>
          <input
            type="password"
            disabled
            value=""
            className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#B8B2A5] border border-[#34343F] text-base"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            disabled
            className="h-10 px-6 rounded-lg bg-[#24242E] text-[#B8B2A5] text-sm font-semibold border border-[#34343F]"
          >
            Sinkronkan
          </button>
        </div>
      </div>
    </div>
  );
};
