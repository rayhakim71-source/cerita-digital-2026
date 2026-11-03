/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { CMSSettings } from './types';

interface FooterProps {
  cms: CMSSettings;
}

export const Footer: React.FC<FooterProps> = ({ cms }) => {
  const { identitas, footerKontak } = cms;

  return (
    <footer className="w-full bg-[#1A1A22] border-t border-[#34343F] py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-bold text-[#F5F1E8]">
              {identitas.namaSekolah}
            </h4>
            {identitas.lokasi ? (
              <p className="text-sm text-[#B8B2A5]">{identitas.lokasi}</p>
            ) : null}
            {footerKontak.alamat ? (
              <p className="text-sm text-[#B8B2A5]">{footerKontak.alamat}</p>
            ) : null}
          </div>

          <div className="space-y-1 text-sm text-[#B8B2A5]">
            {footerKontak.telepon ? <p>{footerKontak.telepon}</p> : null}
            {footerKontak.email ? <p>{footerKontak.email}</p> : null}
            {footerKontak.mediaSosial ? (
              <a
                href={footerKontak.mediaSosial}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8B04A] transition-colors block"
              >
                Instagram
              </a>
            ) : null}
          </div>
        </div>

        {footerKontak.hakCipta ? (
          <div className="pt-6 border-t border-[#34343F] text-xs text-[#B8B2A5] flex justify-between">
            <span>{footerKontak.hakCipta}</span>
          </div>
        ) : null}
      </div>
    </footer>
  );
};
