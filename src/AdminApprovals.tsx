/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { Story, StoryStatus } from './types';
import { isValidYouTubeUrl } from './security';
import { AutoExpandingTextarea } from './AutoExpandingTextarea';
import { ConfirmModal } from './ConfirmModal';

interface AdminApprovalsProps {
  stories: Story[];
  onUpdateStatus: (id: string, newStatus: StoryStatus, note?: string) => void;
  onBulkUpdate: (ids: string[], newStatus: StoryStatus) => void;
}

export const AdminApprovals: React.FC<AdminApprovalsProps> = ({
  stories,
  onUpdateStatus,
  onBulkUpdate,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    action: () => void;
    isDangerous: boolean;
  }>({
    isOpen: false,
    title: '',
    action: () => {},
    isDangerous: false,
  });

  const pendingStories = stories
    .filter((s) => s.status === 'Menunggu')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const approvedUrls = new Set(
    stories.filter((s) => s.status === 'Disetujui').map((s) => s.urlYouTube.trim().toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === pendingStories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingStories.map((s) => s.id));
    }
  };

  const handleApprove = (story: Story) => {
    onUpdateStatus(story.id, 'Disetujui', notes[story.id] || story.catatanGuru);
  };

  const handleRejectPrompt = (story: Story) => {
    setConfirmModal({
      isOpen: true,
      title: 'Tolak karya ini?',
      action: () => onUpdateStatus(story.id, 'Ditolak', notes[story.id] || story.catatanGuru),
      isDangerous: true,
    });
  };

  const handleHidePrompt = (story: Story) => {
    setConfirmModal({
      isOpen: true,
      title: 'Sembunyikan karya ini?',
      action: () => onUpdateStatus(story.id, 'Disembunyikan', notes[story.id] || story.catatanGuru),
      isDangerous: false,
    });
  };

  const handleBulkApprove = () => {
    onBulkUpdate(selectedIds, 'Disetujui');
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    setConfirmModal({
      isOpen: true,
      title: `Tolak ${selectedIds.length} karya terpilih?`,
      action: () => {
        onBulkUpdate(selectedIds, 'Ditolak');
        setSelectedIds([]);
      },
      isDangerous: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
          Persetujuan
        </h1>

        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBulkApprove}
              className="h-10 px-4 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-95 transition-all"
            >
              Setujui ({selectedIds.length})
            </button>
            <button
              type="button"
              onClick={handleBulkReject}
              className="h-10 px-4 rounded-lg bg-[#24242E] border border-[#34343F] text-[#D9534F] text-sm font-semibold hover:bg-[#34343F] transition-all"
            >
              Tolak ({selectedIds.length})
            </button>
          </div>
        ) : null}
      </div>

      {pendingStories.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-sm text-[#B8B2A5]">
            <button
              type="button"
              onClick={selectAll}
              className="hover:text-[#F5F1E8] font-medium transition-colors"
            >
              {selectedIds.length === pendingStories.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
            </button>
            <span>{pendingStories.length} Menunggu</span>
          </div>

          <div className="space-y-4">
            {pendingStories.map((story) => {
              const isSelected = selectedIds.includes(story.id);
              const isUrlValid = isValidYouTubeUrl(story.urlYouTube);
              const isDuplicate = approvedUrls.has(story.urlYouTube.trim().toLowerCase());
              const hasPermission = story.izinPublikasi === 'Ya';
              const canApprove = hasPermission && isUrlValid && !isDuplicate;
              const noteValue = notes[story.id] !== undefined ? notes[story.id] : story.catatanGuru;

              return (
                <div
                  key={story.id}
                  className={`bg-[#1A1A22] rounded-xl border p-5 sm:p-6 transition-all space-y-4 ${
                    isSelected ? 'border-[#E8B04A]' : 'border-[#34343F]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(story.id)}
                        className="w-5 h-5 rounded bg-[#24242E] border-[#34343F] text-[#E8B04A] focus:ring-0 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-semibold text-[#E8B04A]">
                          {story.id} &bull; Kelas {story.kelas}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-[#F5F1E8]">
                          {story.judul}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right text-xs space-y-0.5">
                      <div className={hasPermission ? 'text-[#B8B2A5]' : 'text-[#D9534F] font-semibold'}>
                        Izin: {story.izinPublikasi}
                      </div>
                      <div className={isUrlValid && !isDuplicate ? 'text-[#B8B2A5]' : 'text-[#D9534F] font-semibold'}>
                        {isDuplicate ? 'Tautan Ganda' : isUrlValid ? 'Tautan Valid' : 'Format Salah'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <span className="text-xs text-[#B8B2A5]">Nama Siswa</span>
                      <p className="text-[#F5F1E8] font-medium">{story.nama} ({story.namaTampil})</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-[#B8B2A5]">Tautan Video</span>
                      <p className="truncate">
                        <a
                          href={story.urlYouTube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E8B04A] hover:underline"
                        >
                          {story.urlYouTube}
                        </a>
                      </p>
                    </div>
                  </div>

                  {story.deskripsi ? (
                    <div className="text-sm space-y-1">
                      <span className="text-xs text-[#B8B2A5]">Deskripsi</span>
                      <p className="text-[#B8B2A5] leading-relaxed">{story.deskripsi}</p>
                    </div>
                  ) : null}

                  {story.pesanMoral ? (
                    <div className="text-sm space-y-1">
                      <span className="text-xs text-[#B8B2A5]">Pesan Moral</span>
                      <p className="text-[#F5F1E8] italic font-serif">&ldquo;{story.pesanMoral}&rdquo;</p>
                    </div>
                  ) : null}

                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-medium text-[#F5F1E8]">
                      Catatan Guru
                    </label>
                    <AutoExpandingTextarea
                      value={noteValue}
                      onValueChange={(val) => setNotes({ ...notes, [story.id]: val })}
                      placeholder=""
                      minRows={1}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#34343F]">
                    <button
                      type="button"
                      onClick={() => handleHidePrompt(story)}
                      className="h-10 px-4 rounded-lg border border-[#34343F] text-sm font-medium text-[#B8B2A5] hover:text-[#F5F1E8] transition-colors"
                    >
                      Sembunyikan
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectPrompt(story)}
                      className="h-10 px-4 rounded-lg border border-[#34343F] text-sm font-semibold text-[#D9534F] hover:bg-[#D9534F]/10 transition-colors"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      disabled={!canApprove}
                      onClick={() => handleApprove(story)}
                      className={`h-10 px-6 rounded-lg text-sm font-semibold transition-all ${
                        canApprove
                          ? 'bg-[#E8B04A] text-[#0F0F14] hover:opacity-95 shadow-md'
                          : 'bg-[#24242E] text-[#B8B2A5]/50 border border-[#34343F] cursor-not-allowed'
                      }`}
                    >
                      Setujui
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-[#1A1A22] rounded-xl border border-[#34343F]">
          <h2 className="font-serif text-xl font-medium text-[#B8B2A5]">
            Belum ada data
          </h2>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        confirmLabel="Lanjutkan"
        isDangerous={confirmModal.isDangerous}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => {
          confirmModal.action();
          setConfirmModal({ ...confirmModal, isOpen: false });
        }}
      />
    </div>
  );
};
