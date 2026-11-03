/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { Story } from './types';

interface StoryCardProps {
  story: Story;
  onSelect: (story: Story) => void;
  watchLabel?: string;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onSelect,
  watchLabel = 'Watch',
}) => {
  const [thumbError, setThumbError] = useState(false);
  const videoId = story.videoId;
  const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

  return (
    <div
      onClick={() => onSelect(story)}
      className="group cursor-pointer bg-[#1A1A22] rounded-xl border border-[#34343F] hover:border-[#E8B04A] transition-all duration-200 overflow-hidden flex flex-col h-full"
    >
      <div className="relative aspect-video w-full bg-[#24242E] overflow-hidden">
        {thumbUrl && !thumbError ? (
          <img
            src={thumbUrl}
            alt={story.judul}
            loading="lazy"
            onError={() => setThumbError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-[#24242E] flex items-center justify-center">
            <div className="w-12 h-8 rounded border border-[#34343F]" />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          <div className="text-xs text-[#E8B04A] font-medium tracking-wide">
            {story.kelas} &bull; {story.namaTampil}
          </div>

          <h3 className="font-serif text-lg font-semibold text-[#F5F1E8] line-clamp-1 group-hover:text-[#E8B04A] transition-colors">
            {story.judul}
          </h3>

          <p className="text-sm text-[#B8B2A5] line-clamp-2 leading-relaxed">
            {story.deskripsi}
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(story);
            }}
            className="h-9 px-4 rounded-lg bg-[#24242E] group-hover:bg-[#E8B04A] text-[#F5F1E8] group-hover:text-[#0F0F14] border border-[#34343F] group-hover:border-[#E8B04A] text-xs font-semibold tracking-wide transition-all"
          >
            {watchLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
