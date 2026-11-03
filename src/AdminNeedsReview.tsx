/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { Story, StoryStatus } from './types';
import { isValidYouTubeUrl } from './security';

interface AdminNeedsReviewProps {
  stories: Story[];
  onUpdateStory: (story: Story) => void;
  onUpdateStatus: (id: string, newStatus: StoryStatus) => void;
  onRefreshAllChecks: () => void;
}

export const AdminNeedsReview: React.FC<AdminNeedsReviewProps> = ({
  stories,
  onUpdateStory,
  onUpdateStatus,
  onRefreshAllChecks,
}) => {
  const [checkingId, setCheckingId] = useState<string | null>(null);

  const problematicStories = stories.filter((s) => {
    const isUrlValid = isValidYouTubeUrl(s.urlYouTube);
    const hasPermission = s.izinPublikasi === 'Ya';
    const isProblematicStatus = s.hasilCek === 'Format salah' || s.hasilCek === 'Tidak tersedia';
    return !isUrlValid || !hasPermission || isProblematicStatus;
  });

  const handleCheckSingle = (story: Story) => {
    setCheckingId(story.id);
    setTimeout(() => {
      const valid = isValidYouTubeUrl(story.urlYouTube);
      const updated: Story = {
        ...story,
        hasilCek: valid ? 'Tersedia' : 'Format salah',
      };
      onUpdateStory(updated);
      setCheckingId(null);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
          Perlu Diperiksa
        </h1>

        <button
          type="button"
          onClick={onRefreshAllChecks}
          className="h-10 px-5 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 transition-all self-start sm:self-auto"
        >
          Periksa Semua
        </button>
      </div>

      {problematicStories.length > 0 ? (
        <div className="space-y-4">
          {problematicStories.map((story) => {
            const isUrlValid = isValidYouTubeUrl(story.urlYouTube);
            const reasons: string[] = [];
            if (!isUrlValid) reasons.push('Format tautan YouTube tidak valid');
            if (story.izinPublikasi !== 'Ya') reasons.push('Izin publikasi Tidak');
            if (story.hasilCek === 'Tidak tersedia') reasons.push('Video tidak tersedia');

            return (
              <div
                key={story.id}
                className="bg-[#1A1A22] rounded-xl border border-[#34343F] p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-[#E8B04A]">
                      {story.id} &bull; Kelas {story.kelas}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#F5F1E8]">
                      {story.judul}
                    </h3>
                    <p className="text-sm text-[#B8B2A5] mt-0.5">
                      {story.nama} ({story.namaTampil})
                    </p>
                  </div>

                  <div className="text-left sm:text-right space-y-0.5">
                    {reasons.map((r, i) => (
                      <div key={i} className="text-xs text-[#D9534F] font-semibold">
                        {r}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <span className="text-xs text-[#B8B2A5]">Tautan Video</span>
                  <p className="truncate text-[#B8B2A5] font-mono text-xs">
                    {story.urlYouTube || '(kosong)'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#34343F]">
                  <button
                    type="button"
                    disabled={checkingId === story.id}
                    onClick={() => handleCheckSingle(story)}
                    className="h-9 px-4 rounded-lg border border-[#34343F] text-xs font-medium text-[#F5F1E8] hover:bg-[#24242E] transition-colors flex items-center gap-1.5"
                  >
                    {checkingId === story.id ? 'Memeriksa...' : 'Periksa Ulang'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateStatus(story.id, 'Ditolak')}
                    className="h-9 px-4 rounded-lg border border-[#34343F] text-xs font-semibold text-[#D9534F] hover:bg-[#D9534F]/10 transition-colors"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#1A1A22] rounded-xl border border-[#34343F]">
          <h2 className="font-serif text-xl font-medium text-[#B8B2A5]">
            Belum ada data
          </h2>
        </div>
      )}
    </div>
  );
};
