/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  confirmLabel: string;
  isDangerous?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  confirmLabel,
  isDangerous = false,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-[#0F0F14]/85 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-sm rounded-xl bg-[#1A1A22] border border-[#34343F] p-6 shadow-2xl z-10">
        <h2 className="font-serif text-lg font-bold text-[#F5F1E8] mb-6">
          {title}
        </h2>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 px-4 rounded-lg border border-[#34343F] text-sm font-medium text-[#B8B2A5] hover:text-[#F5F1E8] transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-10 px-5 rounded-lg text-sm font-semibold transition-all ${
              isDangerous
                ? 'bg-[#D9534F] text-white hover:opacity-90'
                : 'bg-[#E8B04A] text-[#0F0F14] hover:opacity-90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
