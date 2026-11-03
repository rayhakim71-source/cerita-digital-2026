/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { CMSSettings, Story } from './types';
import { StoryCard } from './StoryCard';

interface HomePageProps {
  cms: CMSSettings;
  stories: Story[];
  onNavigate: (path: string) => void;
  onSelectStory: (story: Story) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  cms,
  stories,
  onNavigate,
  onSelectStory,
}) => {
  const { bagianHalaman, tombol, galeri } = cms;
  const banner = bagianHalaman.banner;
  const sambutan = bagianHalaman.sambutan;
  const navigasiKelas = bagianHalaman.navigasiKelas;
  const karyaTerbaru = bagianHalaman.karyaTerbaru;

  const hasBannerText = Boolean(banner.judul?.trim() || banner.subjudul?.trim() || banner.sekolah?.trim());
  const isFormAvailable = Boolean(galeri.tautanGoogleForm && galeri.tautanGoogleForm.trim() !== '');

  const latestStories = [...stories]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, karyaTerbaru.limit || 6);

  const gradeList = galeri.daftarKelas || ['8A', '8B', '8C', '8D', '8E'];
  const gradeCounts = gradeList.map((gr) => {
    const count = stories.filter((s) => s.kelas.toLowerCase() === gr.toLowerCase()).length;
    return { grade: gr, count };
  });

  return (
    <div className="space-y-16 pb-12">
      {banner.visible ? (
        <section className="relative w-full overflow-hidden min-h-[420px] md:min-h-[500px] flex items-center justify-center bg-[#1A1A22] border-b border-[#34343F]">
          {banner.gambar.nilai ? (
            <img
              src={banner.gambar.nilai}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : null}

          {hasBannerText ? (
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
              <div className="space-y-3">
                {banner.sekolah ? (
                  <span className="text-xs uppercase tracking-widest text-[#E8B04A] font-semibold">
                    {banner.sekolah}
                  </span>
                ) : null}
                {banner.judul ? (
                  <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#F5F1E8] tracking-tight leading-tight">
                    {banner.judul}
                  </h1>
                ) : null}
                {banner.subjudul ? (
                  <p className="text-base sm:text-lg md:text-xl text-[#B8B2A5] max-w-2xl mx-auto leading-relaxed italic font-serif">
                    &ldquo;{banner.subjudul}&rdquo;
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                {tombol.exploreGallery.visible ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('#/gallery')}
                    className="h-12 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] font-semibold text-base shadow-lg hover:brightness-110 active:scale-95 transition-all"
                  >
                    {tombol.exploreGallery.label || 'Explore Gallery'}
                  </button>
                ) : null}

                {isFormAvailable && tombol.submitWork.visible ? (
                  <button
                    type="button"
                    onClick={() => window.open(galeri.tautanGoogleForm, '_blank', 'noopener,noreferrer')}
                    className="h-12 px-6 rounded-lg bg-[#24242E]/90 hover:bg-[#24242E] text-[#F5F1E8] border border-[#34343F] font-semibold text-base transition-all"
                  >
                    {tombol.submitWork.label || 'Submit Work'}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {hasBannerText ? <div className="absolute inset-0 bg-[#0F0F14]/75 backdrop-blur-[2px]" /> : null}
        </section>
      ) : null}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {sambutan.visible ? (
          <section className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
              {sambutan.judul}
            </h2>
            <p className="text-base sm:text-lg text-[#B8B2A5] leading-relaxed">
              {sambutan.isi}
            </p>
          </section>
        ) : null}

        {navigasiKelas.visible ? (
          <section className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {gradeCounts.map((item) => (
                <div
                  key={item.grade}
                  onClick={() => onNavigate(`#/gallery?grade=${item.grade}`)}
                  className="cursor-pointer bg-[#1A1A22] border border-[#34343F] hover:border-[#E8B04A] rounded-xl p-5 text-center transition-all group"
                >
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F5F1E8] group-hover:text-[#E8B04A] transition-colors">
                    Grade {item.grade}
                  </h3>
                  <div className="text-sm text-[#B8B2A5] mt-1">
                    {item.count} {item.count === 1 ? 'story' : 'stories'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {karyaTerbaru.visible ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#34343F] pb-3">
              <h2 className="font-serif text-2xl font-bold text-[#F5F1E8]">
                {karyaTerbaru.judul}
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('#/gallery')}
                className="text-sm font-semibold text-[#E8B04A] hover:underline"
              >
                All Stories
              </button>
            </div>

            {latestStories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onSelect={onSelectStory}
                    watchLabel={tombol.watch.label}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[#B8B2A5]">
                <h3 className="text-base font-medium">No stories found</h3>
              </div>
            )}
          </section>
        ) : null}
      </div>
    </div>
  );
};
