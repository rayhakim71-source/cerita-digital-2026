/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useMemo, useEffect } from 'react';
import { CMSSettings, Story } from './types';
import { StoryCard } from './StoryCard';

interface GalleryPageProps {
  cms: CMSSettings;
  stories: Story[];
  initialGrade?: string;
  onSelectStory: (story: Story) => void;
  onGradeChange?: (grade: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  cms,
  stories,
  initialGrade = 'All',
  onSelectStory,
  onGradeChange,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>(initialGrade);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'title'>(cms.galeri.urutanAwal || 'newest');
  const [visibleCount, setVisibleCount] = useState<number>(cms.galeri.kartuPerTahap || 12);

  useEffect(() => {
    if (initialGrade) {
      setSelectedGrade(initialGrade);
    }
  }, [initialGrade]);

  const grades = useMemo(() => {
    return ['All', ...(cms.galeri.daftarKelas || ['8A', '8B', '8C', '8D', '8E'])];
  }, [cms.galeri.daftarKelas]);

  const handleGradeSelect = (g: string) => {
    setSelectedGrade(g);
    setVisibleCount(cms.galeri.kartuPerTahap || 12);
    if (onGradeChange) {
      onGradeChange(g);
    }
  };

  const filteredStories = useMemo(() => {
    let result = [...stories];

    if (selectedGrade && selectedGrade !== 'All') {
      result = result.filter(
        (s) => s.kelas.toLowerCase() === selectedGrade.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.judul.toLowerCase().includes(q) ||
          s.namaTampil.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.judul.localeCompare(b.judul));
    }

    return result;
  }, [stories, selectedGrade, searchQuery, sortBy]);

  const visibleStories = filteredStories.slice(0, visibleCount);
  const hasMore = visibleCount < filteredStories.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F1E8]">
          Gallery
        </h1>

        <div className="flex items-center gap-6 border-b border-[#34343F] overflow-x-auto no-scrollbar pb-1">
          {grades.map((grade) => {
            const isActive = selectedGrade.toLowerCase() === grade.toLowerCase();
            return (
              <button
                key={grade}
                type="button"
                onClick={() => handleGradeSelect(grade)}
                className={`text-base font-medium pb-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-[#E8B04A] border-b-2 border-[#E8B04A]'
                    : 'text-[#B8B2A5] hover:text-[#F5F1E8]'
                }`}
              >
                {grade === 'All' ? 'All Classes' : `Grade ${grade}`}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {cms.fitur.pencarian ? (
          <div className="flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or student name..."
              className="w-full h-11 px-4 rounded-lg bg-[#1A1A22] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
            />
          </div>
        ) : <div />}

        {cms.fitur.pilihanUrutan ? (
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'title')}
              className="h-11 px-4 rounded-lg bg-[#1A1A22] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base font-medium cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        ) : null}
      </div>

      {visibleStories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onSelect={onSelectStory}
              watchLabel={cms.tombol.watch.label}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="font-serif text-xl font-medium text-[#B8B2A5]">
            No stories found
          </h3>
        </div>
      )}

      {hasMore ? (
        <div className="flex justify-center pt-8">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + (cms.galeri.kartuPerTahap || 12))}
            className="h-11 px-8 rounded-lg bg-[#24242E] hover:bg-[#34343F] border border-[#34343F] text-[#F5F1E8] font-medium text-sm transition-colors"
          >
            Load More
          </button>
        </div>
      ) : null}
    </div>
  );
};
