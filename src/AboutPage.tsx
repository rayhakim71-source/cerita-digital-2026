/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { CMSSettings } from './types';

interface AboutPageProps {
  cms: CMSSettings;
}

export const AboutPage: React.FC<AboutPageProps> = ({ cms }) => {
  const { aboutProject } = cms.bagianHalaman;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-14">
      <section className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5F1E8] tracking-tight">
          {aboutProject.judul}
        </h1>
        <p className="text-lg text-[#B8B2A5] leading-relaxed">
          {aboutProject.tujuan}
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-[#F5F1E8] border-b border-[#34343F] pb-3">
          Process
        </h2>

        <div className="space-y-4">
          {aboutProject.tahap.map((step, index) => (
            <div
              key={index}
              className="bg-[#1A1A22] rounded-xl border border-[#34343F] p-5 flex items-start gap-5"
            >
              <div className="font-serif text-2xl font-bold text-[#E8B04A] w-8 shrink-0">
                0{index + 1}
              </div>
              <div className="text-base sm:text-lg font-medium text-[#F5F1E8] pt-0.5">
                {step}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-8 space-y-3">
        <h2 className="font-serif text-xl font-bold text-[#E8B04A]">
          {aboutProject.moralValueJudul || 'Moral Value'}
        </h2>
        <p className="text-base sm:text-lg text-[#F5F1E8] leading-relaxed">
          {aboutProject.moralValueIsi}
        </p>
      </section>
    </div>
  );
};
