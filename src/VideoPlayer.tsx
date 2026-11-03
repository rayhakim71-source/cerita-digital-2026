/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  watchLabel?: string;
  autoPlayOnClick?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  title,
  watchLabel = 'Watch',
  autoPlayOnClick = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  const fallbackThumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

  if (isPlaying && videoId) {
    return (
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#1A1A22] border border-[#34343F]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoPlayOnClick ? 1 : 0}&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#1A1A22] border border-[#34343F] flex items-center justify-center">
      {thumbUrl && !thumbError ? (
        <img
          src={thumbUrl}
          alt={title}
          onError={(e) => {
            if ((e.target as HTMLImageElement).src !== fallbackThumbUrl) {
              (e.target as HTMLImageElement).src = fallbackThumbUrl;
            } else {
              setThumbError(true);
            }
          }}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-[#1A1A22] flex items-center justify-center" />
      )}

      <div className="absolute inset-0 bg-[#0F0F14]/40" />

      {videoId ? (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="absolute z-10 h-12 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] font-semibold text-base shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {watchLabel}
        </button>
      ) : null}
    </div>
  );
};
