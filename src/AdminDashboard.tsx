/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { Story } from './types';
import { BarChart } from './BarChart';

interface AdminDashboardProps {
  stories: Story[];
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ stories, onNavigateTab }) => {
  const totalStories = stories.length;
  const approvedCount = stories.filter((s) => s.status === 'Disetujui').length;
  const pendingCount = stories.filter((s) => s.status === 'Menunggu').length;
  const reviewCount = stories.filter(
    (s) =>
      s.hasilCek === 'Format salah' ||
      s.hasilCek === 'Tidak tersedia' ||
      s.izinPublikasi === 'Tidak'
  ).length;

  const grades = ['8A', '8B', '8C', '8D', '8E'];
  const chartData = grades.map((g) => ({
    label: `Grade ${g}`,
    count: stories.filter((s) => s.status === 'Disetujui' && s.kelas.toLowerCase() === g.toLowerCase()).length,
  }));

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
        Dasbor
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-5">
          <div className="text-xs uppercase tracking-wider text-[#B8B2A5] font-semibold">
            Total Karya
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#F5F1E8] mt-2 font-serif">
            {totalStories}
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('semua')}
          className="cursor-pointer bg-[#1A1A22] border border-[#34343F] hover:border-[#E8B04A] rounded-xl p-5 transition-colors"
        >
          <div className="text-xs uppercase tracking-wider text-[#E8B04A] font-semibold">
            Disetujui
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#E8B04A] mt-2 font-serif">
            {approvedCount}
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('persetujuan')}
          className="cursor-pointer bg-[#1A1A22] border border-[#34343F] hover:border-[#E8B04A] rounded-xl p-5 transition-colors"
        >
          <div className="text-xs uppercase tracking-wider text-[#B8B2A5] font-semibold">
            Menunggu
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#F5F1E8] mt-2 font-serif">
            {pendingCount}
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('perlu-diperiksa')}
          className="cursor-pointer bg-[#1A1A22] border border-[#34343F] hover:border-[#D9534F] rounded-xl p-5 transition-colors"
        >
          <div className="text-xs uppercase tracking-wider text-[#D9534F] font-semibold">
            Perlu Diperiksa
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#D9534F] mt-2 font-serif">
            {reviewCount}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-serif text-lg font-bold text-[#F5F1E8]">
          Karya Disetujui per Kelas
        </h2>
        <BarChart data={chartData} />
      </div>
    </div>
  );
};
