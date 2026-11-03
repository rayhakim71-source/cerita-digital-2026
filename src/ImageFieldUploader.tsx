/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useRef } from 'react';
import { ImageSource } from './types';
import { Trash2 } from 'lucide-react';

interface ImageFieldUploaderProps {
  label: string;
  value: ImageSource;
  onChange: (newValue: ImageSource) => void;
  required?: boolean;
}

export const ImageFieldUploader: React.FC<ImageFieldUploaderProps> = ({
  label,
  value,
  onChange,
  required = false,
}) => {
  const [activeTab, setActiveTab] = useState<'Unggah' | 'Tautan'>(value.tipe === 'drive' ? 'Unggah' : 'Tautan');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setIsUploading(false);
      onChange({ tipe: 'drive', nilai: dataUrl });
    };
    reader.onerror = () => {
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange({ tipe: activeTab === 'Unggah' ? 'drive' : 'tautan', nilai: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-[#F5F1E8]">
        {label} {required && <span className="text-[#D9534F]">*</span>}
      </div>

      <div className="flex border-b border-[#34343F] mb-3">
        <button
          type="button"
          onClick={() => setActiveTab('Unggah')}
          className={`pb-2 px-3 text-sm font-medium transition-colors ${
            activeTab === 'Unggah'
              ? 'text-[#E8B04A] border-b-2 border-[#E8B04A]'
              : 'text-[#B8B2A5] hover:text-[#F5F1E8]'
          }`}
        >
          Unggah
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('Tautan')}
          className={`pb-2 px-3 text-sm font-medium transition-colors ${
            activeTab === 'Tautan'
              ? 'text-[#E8B04A] border-b-2 border-[#E8B04A]'
              : 'text-[#B8B2A5] hover:text-[#F5F1E8]'
          }`}
        >
          Tautan
        </button>
      </div>

      {activeTab === 'Unggah' ? (
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-10 px-4 bg-[#24242E] hover:bg-[#34343F] border border-[#34343F] rounded-lg text-sm font-medium text-[#F5F1E8] transition-colors flex items-center justify-center min-w-[120px]"
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-[#E8B04A] border-t-transparent rounded-full animate-spin" />
            ) : (
              'Pilih Gambar'
            )}
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={value.nilai}
            onChange={(e) => onChange({ tipe: 'tautan', nilai: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
          />
        </div>
      )}

      {value.nilai ? (
        <div className="flex items-center gap-3 pt-2">
          <div className="w-24 h-16 rounded-md bg-[#24242E] border border-[#34343F] overflow-hidden flex items-center justify-center shrink-0">
            <img
              src={value.nilai}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleClear}
            aria-label="Hapus Gambar"
            className="h-9 px-3 rounded-md border border-[#34343F] hover:bg-[#D9534F] hover:text-white text-[#B8B2A5] transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Gambar
          </button>
        </div>
      ) : null}
    </div>
  );
};
