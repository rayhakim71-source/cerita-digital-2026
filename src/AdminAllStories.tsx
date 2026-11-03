/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useMemo } from 'react';
import { Story, StoryStatus } from './types';
import { AutoExpandingTextarea } from './AutoExpandingTextarea';
import { ConfirmModal } from './ConfirmModal';

interface AdminAllStoriesProps {
  stories: Story[];
  onUpdateStory: (story: Story) => void;
  onUpdateStatus: (id: string, newStatus: StoryStatus) => void;
}

export const AdminAllStories: React.FC<AdminAllStoriesProps> = ({
  stories,
  onUpdateStory,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Story | null>(null);

  const filteredStories = useMemo(() => {
    let result = [...stories];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.judul.toLowerCase().includes(q) ||
          s.nama.toLowerCase().includes(q) ||
          s.namaTampil.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((s) => s.status === statusFilter);
    }

    if (gradeFilter !== 'All') {
      result = result.filter((s) => s.kelas.toLowerCase() === gradeFilter.toLowerCase());
    }

    result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return result;
  }, [stories, searchQuery, statusFilter, gradeFilter]);

  const totalPages = Math.ceil(filteredStories.length / pageSize) || 1;
  const paginatedStories = filteredStories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    onUpdateStory(editingStory);
    setEditingStory(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
        Semua Karya
      </h1>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari judul, nama siswa, atau ID..."
            className="w-full h-11 px-4 rounded-lg bg-[#1A1A22] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 px-3 rounded-lg bg-[#1A1A22] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-sm font-medium cursor-pointer"
          >
            <option value="All">Semua Status</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Ditolak">Ditolak</option>
            <option value="Disembunyikan">Disembunyikan</option>
            <option value="Diarsipkan">Diarsipkan</option>
          </select>

          <select
            value={gradeFilter}
            onChange={(e) => {
              setGradeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 px-3 rounded-lg bg-[#1A1A22] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-sm font-medium cursor-pointer"
          >
            <option value="All">Semua Kelas</option>
            <option value="8A">Kelas 8A</option>
            <option value="8B">Kelas 8B</option>
            <option value="8C">Kelas 8C</option>
            <option value="8D">Kelas 8D</option>
            <option value="8E">Kelas 8E</option>
          </select>
        </div>
      </div>

      {paginatedStories.length > 0 ? (
        <div className="space-y-3">
          {paginatedStories.map((story) => (
            <div
              key={story.id}
              className="bg-[#1A1A22] rounded-xl border border-[#34343F] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-[#E8B04A]">{story.id}</span>
                  <span className="text-[#B8B2A5]">&bull;</span>
                  <span className="text-[#F5F1E8]">Kelas {story.kelas}</span>
                  <span className="text-[#B8B2A5]">&bull;</span>
                  <span
                    className={`font-medium ${
                      story.status === 'Disetujui'
                        ? 'text-[#E8B04A]'
                        : story.status === 'Ditolak'
                        ? 'text-[#D9534F]'
                        : 'text-[#B8B2A5]'
                    }`}
                  >
                    {story.status}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#F5F1E8]">
                  {story.judul}
                </h3>

                <p className="text-sm text-[#B8B2A5]">
                  {story.nama} ({story.namaTampil})
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#34343F]">
                <button
                  type="button"
                  onClick={() => setEditingStory({ ...story })}
                  className="h-9 px-3 rounded-lg border border-[#34343F] text-xs font-medium text-[#F5F1E8] hover:bg-[#24242E] transition-colors"
                >
                  Edit
                </button>

                {story.status !== 'Disetujui' ? (
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(story.id, 'Disetujui')}
                    className="h-9 px-3 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-xs font-semibold hover:opacity-90 transition-all"
                  >
                    Setujui
                  </button>
                ) : null}

                {story.status !== 'Disembunyikan' && story.status !== 'Diarsipkan' ? (
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(story.id, 'Disembunyikan')}
                    className="h-9 px-3 rounded-lg border border-[#34343F] text-xs font-medium text-[#B8B2A5] hover:text-[#F5F1E8] transition-colors"
                  >
                    Sembunyikan
                  </button>
                ) : null}

                {(story.status === 'Ditolak' || story.status === 'Disembunyikan') ? (
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(story.id, 'Menunggu')}
                    className="h-9 px-3 rounded-lg border border-[#34343F] text-xs font-medium text-[#E8B04A] hover:bg-[#24242E] transition-colors"
                  >
                    Pulihkan
                  </button>
                ) : null}

                {story.status !== 'Diarsipkan' ? (
                  <button
                    type="button"
                    onClick={() => setArchiveTarget(story)}
                    className="h-9 px-3 rounded-lg border border-[#34343F] text-xs font-medium text-[#D9534F] hover:bg-[#D9534F]/10 transition-colors"
                  >
                    Hapus ke arsip
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#1A1A22] rounded-xl border border-[#34343F]">
          <h2 className="font-serif text-xl font-medium text-[#B8B2A5]">
            Belum ada data
          </h2>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="h-9 px-4 rounded-lg border border-[#34343F] text-xs font-medium text-[#F5F1E8] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#24242E] transition-colors"
          >
            Sebelumnya
          </button>
          <span className="text-xs text-[#B8B2A5]">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="h-9 px-4 rounded-lg border border-[#34343F] text-xs font-medium text-[#F5F1E8] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#24242E] transition-colors"
          >
            Berikutnya
          </button>
        </div>
      ) : null}

      {editingStory ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setEditingStory(null)}
            className="fixed inset-0 bg-[#0F0F14]/85 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-[#1A1A22] border border-[#34343F] p-6 shadow-2xl z-10 space-y-5">
            <h2 className="font-serif text-xl font-bold text-[#F5F1E8]">
              Edit Karya ({editingStory.id})
            </h2>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
                  Judul *
                </label>
                <input
                  type="text"
                  value={editingStory.judul}
                  onChange={(e) => setEditingStory({ ...editingStory, judul: e.target.value })}
                  required
                  className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
                    Kelas *
                  </label>
                  <select
                    value={editingStory.kelas}
                    onChange={(e) => setEditingStory({ ...editingStory, kelas: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base font-medium cursor-pointer"
                  >
                    <option value="8A">8A</option>
                    <option value="8B">8B</option>
                    <option value="8C">8C</option>
                    <option value="8D">8D</option>
                    <option value="8E">8E</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
                    Nama Tampil *
                  </label>
                  <input
                    type="text"
                    value={editingStory.namaTampil}
                    onChange={(e) => setEditingStory({ ...editingStory, namaTampil: e.target.value })}
                    required
                    className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
                  Deskripsi
                </label>
                <AutoExpandingTextarea
                  value={editingStory.deskripsi}
                  onValueChange={(val) => setEditingStory({ ...editingStory, deskripsi: val })}
                  minRows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
                  Pesan Moral
                </label>
                <AutoExpandingTextarea
                  value={editingStory.pesanMoral}
                  onValueChange={(val) => setEditingStory({ ...editingStory, pesanMoral: val })}
                  minRows={2}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#34343F]">
                <button
                  type="button"
                  onClick={() => setEditingStory(null)}
                  className="h-10 px-4 rounded-lg border border-[#34343F] text-sm font-medium text-[#B8B2A5] hover:text-[#F5F1E8] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 transition-all"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        isOpen={Boolean(archiveTarget)}
        title="Arsipkan karya ini?"
        confirmLabel="Arsipkan"
        isDangerous={true}
        onCancel={() => setArchiveTarget(null)}
        onConfirm={() => {
          if (archiveTarget) {
            onUpdateStatus(archiveTarget.id, 'Diarsipkan');
            setArchiveTarget(null);
          }
        }}
      />
    </div>
  );
};
