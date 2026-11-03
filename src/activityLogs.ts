/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import { ActivityLog } from './types';

const STORAGE_KEY_LOGS = 'dsg_activity_logs_v1';

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    waktu: '2026-10-23 09:12:00',
    peran: 'Admin',
    tindakan: 'Setujui ST-0015 (The Lighthouse Keeper Cat)',
  },
  {
    id: 'log-2',
    waktu: '2026-10-22 14:35:00',
    peran: 'Admin',
    tindakan: 'Periksa ST-0021 (Format salah)',
  },
  {
    id: 'log-3',
    waktu: '2026-10-22 11:00:00',
    peran: 'Admin',
    tindakan: 'Sembunyikan ST-0020 (Voices of the Coral Reef)',
  },
  {
    id: 'log-4',
    waktu: '2026-10-21 13:20:00',
    peran: 'Admin',
    tindakan: 'Tolak ST-0019 (Speed Racer Challenge)',
  },
  {
    id: 'log-5',
    waktu: '2026-10-20 16:00:00',
    peran: 'Superadmin',
    tindakan: 'Simpan Pengaturan Identitas',
  },
];

export function getStoredLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return INITIAL_LOGS;
}

export function addActivityLog(peran: 'Admin' | 'Superadmin', tindakan: string): void {
  try {
    const logs = getStoredLogs();
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      waktu: formatted,
      peran,
      tindakan,
    };
    logs.unshift(newLog);
    const trimmed = logs.slice(0, 200);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}
