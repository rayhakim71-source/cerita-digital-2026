/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useEffect } from 'react';
import { DESIGN_SYSTEM } from './designSystem';

interface ToastProps {
  message: string | null;
  onClear: () => void;
  type?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, onClear, type = 'success' }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClear();
    }, DESIGN_SYSTEM.toastDurationMs); // 500ms auto dismiss

    return () => clearTimeout(timer);
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 px-4 py-2 text-sm font-medium rounded-md shadow-lg pointer-events-none transition-opacity duration-200"
      style={{
        backgroundColor: type === 'error' ? DESIGN_SYSTEM.colors.danger : DESIGN_SYSTEM.colors.accentGold,
        color: DESIGN_SYSTEM.colors.textOnAccent,
      }}
    >
      {message}
    </div>
  );
};
