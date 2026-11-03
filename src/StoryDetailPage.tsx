/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { CMSSettings, Story } from './types';
import { VideoPlayer } from './VideoPlayer';
import { StoryCard } from './StoryCard';

interface StoryDetailPageProps {
  story: Story;
  allStories: Story[];
  cms: CMSSettings;
  onNavigate: (path: string) => void;
  onSelectStory: (story: Story) => void;
}

export const StoryDetailPage: React.FC<StoryDetailPageProps> = ({
  story,
  allStories,
  cms,
  onNavigate,
  onSelectStory,
}) => {
  const { tombol, fitur } = cms;

  const moreStories = allStories
    .filter((s) => s.id !== story.id && s.kelas.toLowerCase() === story.kelas.toLowerCase())
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10">
      <div>
        <button
          type="button"
          onClick={() => onNavigate('#/gallery')}
          className="text-sm font-semibold text-[#E8B04A] hover:underline"
        >
          &larr; {tombol.backToGallery.label || 'Back to Gallery'}
        </button>
      </div>

      <section>
        {fitur.pemutarTertanam ? (
          <VideoPlayer
            videoId={story.videoId}
            title={story.judul}
            watchLabel={tombol.watch.label}
          />
        ) : null}
      </section>

      <section className="space-y-4 border-b border-[#34343F] pb-8">
        <div className="text-sm text-[#E8B04A] font-medium tracking-wide">
          Grade {story.kelas} &bull; {story.namaTampil}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F1E8] leading-tight">
          {story.judul}
        </h1>

        <p className="text-base sm:text-lg text-[#B8B2A5] leading-relaxed whitespace-pre-line">
          {story.deskripsi}
        </p>

        {story.urlYouTube && tombol.watchYouTube.visible ? (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => window.open(story.urlYouTube, '_blank', 'noopener,noreferrer')}
              className="h-11 px-5 rounded-lg bg-[#24242E] hover:bg-[#34343F] text-[#F5F1E8] border border-[#34343F] text-sm font-semibold transition-colors inline-flex items-center justify-center"
            >
              {tombol.watchYouTube.label || 'Watch on YouTube'}
            </button>
          </div>
        ) : null}
      </section>

      {story.pesanMoral ? (
        <section className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 sm:p-8 space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#E8B04A]">
            Moral Value
          </h2>
          <p className="text-base text-[#F5F1E8] italic font-serif leading-relaxed">
            &ldquo;{story.pesanMoral}&rdquo;
          </p>
        </section>
      ) : null}

      {fitur.moreFromGrade && moreStories.length > 0 ? (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-[#34343F] pb-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F5F1E8]">
              More from Grade {story.kelas}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate(`#/gallery?grade=${story.kelas}`)}
              className="text-sm font-semibold text-[#E8B04A] hover:underline"
            >
              View Grade {story.kelas}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {moreStories.map((other) => (
              <StoryCard
                key={other.id}
                story={other}
                onSelect={onSelectStory}
                watchLabel={tombol.watch.label}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};
