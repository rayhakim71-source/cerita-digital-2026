/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { Story } from './types';

interface AdminRecapProps {
  stories: Story[];
}

export const AdminRecap: React.FC<AdminRecapProps> = ({ stories }) => {
  const grades = ['8A', '8B', '8C', '8D', '8E'];

  const recapData = grades.map((g) => {
    const classStories = stories.filter((s) => s.kelas.toLowerCase() === g.toLowerCase());
    return {
      grade: g,
      total: classStories.length,
      disetujui: classStories.filter((s) => s.status === 'Disetujui').length,
      menunggu: classStories.filter((s) => s.status === 'Menunggu').length,
      ditolak: classStories.filter((s) => s.status === 'Ditolak').length,
      disembunyikan: classStories.filter((s) => s.status === 'Disembunyikan').length,
    };
  });

  const totals = {
    total: recapData.reduce((acc, r) => acc + r.total, 0),
    disetujui: recapData.reduce((acc, r) => acc + r.disetujui, 0),
    menunggu: recapData.reduce((acc, r) => acc + r.menunggu, 0),
    ditolak: recapData.reduce((acc, r) => acc + r.ditolak, 0),
    disembunyikan: recapData.reduce((acc, r) => acc + r.disembunyikan, 0),
  };

  const handleDownloadCSV = () => {
    const headers = ['Kode', 'Timestamp', 'Nama Siswa', 'Nama Tampil', 'Kelas', 'Judul', 'URL YouTube', 'Status', 'Izin Publikasi', 'Catatan Guru'];
    const rows = stories.map((s) => [
      `"${s.id}"`,
      `"${s.timestamp}"`,
      `"${s.nama.replace(/"/g, '""')}"`,
      `"${s.namaTampil.replace(/"/g, '""')}"`,
      `"${s.kelas}"`,
      `"${s.judul.replace(/"/g, '""')}"`,
      `"${s.urlYouTube}"`,
      `"${s.status}"`,
      `"${s.izinPublikasi}"`,
      `"${s.catatanGuru.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekap-digital-storytelling-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
          Rekap
        </h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="h-10 px-4 rounded-lg bg-[#24242E] hover:bg-[#34343F] border border-[#34343F] text-[#F5F1E8] text-sm font-semibold transition-colors"
          >
            Unduh CSV
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="h-10 px-4 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 transition-all"
          >
            Cetak
          </button>
        </div>
      </div>

      <div className="bg-[#1A1A22] rounded-xl border border-[#34343F] overflow-x-auto">
        <table className="w-full text-left text-sm text-[#F5F1E8]">
          <thead className="bg-[#24242E] text-xs uppercase tracking-wider text-[#B8B2A5] border-b border-[#34343F]">
            <tr>
              <th className="py-3.5 px-4">Kelas</th>
              <th className="py-3.5 px-4 text-center">Disetujui</th>
              <th className="py-3.5 px-4 text-center">Menunggu</th>
              <th className="py-3.5 px-4 text-center">Ditolak</th>
              <th className="py-3.5 px-4 text-center">Disembunyikan</th>
              <th className="py-3.5 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#34343F]">
            {recapData.map((row) => (
              <tr key={row.grade} className="hover:bg-[#24242E]/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#E8B04A]">
                  Grade {row.grade}
                </td>
                <td className="py-3 px-4 text-center font-medium text-[#E8B04A]">
                  {row.disetujui}
                </td>
                <td className="py-3 px-4 text-center font-medium text-[#F5F1E8]">
                  {row.menunggu}
                </td>
                <td className="py-3 px-4 text-center font-medium text-[#D9534F]">
                  {row.ditolak}
                </td>
                <td className="py-3 px-4 text-center font-medium text-[#B8B2A5]">
                  {row.disembunyikan}
                </td>
                <td className="py-3 px-4 text-right font-bold text-[#F5F1E8]">
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#24242E] font-bold border-t border-[#34343F]">
            <tr>
              <td className="py-3.5 px-4">Total</td>
              <td className="py-3.5 px-4 text-center text-[#E8B04A]">{totals.disetujui}</td>
              <td className="py-3.5 px-4 text-center">{totals.menunggu}</td>
              <td className="py-3.5 px-4 text-center text-[#D9534F]">{totals.ditolak}</td>
              <td className="py-3.5 px-4 text-center text-[#B8B2A5]">{totals.disembunyikan}</td>
              <td className="py-3.5 px-4 text-right text-[#E8B04A]">{totals.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
