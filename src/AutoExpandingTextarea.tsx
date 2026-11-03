/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useEffect, useRef } from 'react';

interface AutoExpandingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onValueChange: (val: string) => void;
  minRows?: number;
}

export const AutoExpandingTextarea: React.FC<AutoExpandingTextareaProps> = ({
  value,
  onValueChange,
  minRows = 2,
  className = '',
  placeholder = '',
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      rows={minRows}
      value={value}
      onChange={(e) => {
        onValueChange(e.target.value);
        resize();
      }}
      placeholder={placeholder}
      className={`auto-expand w-full px-3 py-2.5 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none transition-colors duration-150 text-base leading-relaxed ${className}`}
      {...props}
    />
  );
};
