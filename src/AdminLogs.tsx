/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useMemo } from 'react';
import { ActivityLog } from './types';

interface AdminLogsProps {
  logs: ActivityLog[];
}

export const AdminLogs: React.FC<AdminLogsProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.toLowerCase().trim();
    return logs.filter(
      (l) =>
        l.tindakan.toLowerCase().includes(q) ||
        l.peran.toLowerCase().includes(q) ||
        l.waktu.toLowerCase().includes(q)
    );
  }, [logs, searchQuery]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
          Log Aktivitas
        </h1>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari log..."
            className="w-full h-10 px-3 rounded-lg bg-[#1A1A22] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-sm"
          />
        </div>
      </div>

      {paginatedLogs.length > 0 ? (
        <div className="bg-[#1A1A22] rounded-xl border border-[#34343F] overflow-x-auto">
          <table className="w-full text-left text-sm text-[#F5F1E8]">
            <thead className="bg-[#24242E] text-xs uppercase tracking-wider text-[#B8B2A5] border-b border-[#34343F]">
              <tr>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Peran</th>
                <th className="py-3 px-4">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#34343F]">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#24242E]/50 transition-colors">
                  <td className="py-3 px-4 text-xs font-mono text-[#B8B2A5] whitespace-nowrap">
                    {log.waktu}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#E8B04A] whitespace-nowrap">
                    {log.peran}
                  </td>
                  <td className="py-3 px-4 text-[#F5F1E8]">
                    {log.tindakan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-[#1A1A22] rounded-xl border border-[#34343F]">
          <h2 className="font-serif text-xl font-medium text-[#B8B2A5]">
            Belum ada data
          </h2>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-between pt-2">
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
    </div>
  );
};
