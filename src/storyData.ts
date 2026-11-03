/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import { Story } from './types';
import { formatDisplayName, extractYouTubeId } from './security';

const STORAGE_KEY_STORIES = 'dsg_stories_data_v2';
const SPREADSHEET_ID = '1LxUk3nvskNh1RzqJBpQDyxHlVBwTr3icsrkwq5AyWQg';

export const INITIAL_STORIES: Story[] = [
  {
    id: 'ST-0001',
    timestamp: '2026-11-03T13:34:47Z',
    nama: 'GOREL',
    namaTampil: formatDisplayName('GOREL'),
    kelas: '8A',
    judul: 'MALIANG',
    deskripsi: 'MALIANG',
    urlYouTube: 'https://www.youtube.com/watch?v=VA_bQPivusc',
    videoId: extractYouTubeId('https://www.youtube.com/watch?v=VA_bQPivusc') || 'VA_bQPivusc',
    pesanMoral: "DON'T BE GREEDY",
    izinPublikasi: 'Ya',
    status: 'Disetujui',
    catatanGuru: '',
    hasilCek: 'Tersedia',
  },
  {
    id: 'ST-0002',
    timestamp: '2026-11-03T14:20:23Z',
    nama: 'MBUH',
    namaTampil: formatDisplayName('MBUH'),
    kelas: '8B',
    judul: 'MBUH',
    deskripsi: 'MBUH',
    urlYouTube: 'https://www.youtube.com/watch?v=U5D_wmVvfVI',
    videoId: extractYouTubeId('https://www.youtube.com/watch?v=U5D_wmVvfVI') || 'U5D_wmVvfVI',
    pesanMoral: 'MBUH',
    izinPublikasi: 'Ya',
    status: 'Disetujui',
    catatanGuru: '',
    hasilCek: 'Tersedia',
  },
];

export function getStoredStories(): Story[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return INITIAL_STORIES;
}

export function saveStoredStories(stories: Story[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(stories));
  } catch {
    // ignore
  }
}

/**
 * Fetch live Google Sheets CSV and merge with local state
 */
export async function fetchLiveGoogleSheetStories(): Promise<Story[]> {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;
    const res = await fetch(csvUrl);
    if (!res.ok) return getStoredStories();
    const csvText = await res.text();
    const rows = parseCSV(csvText);
    if (rows.length <= 1) return getStoredStories();

    const existingStories = getStoredStories();
    const existingMap = new Map(existingStories.map((s) => [s.urlYouTube.trim().toLowerCase(), s]));

    const newStories: Story[] = [];
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      if (cols.length < 6) continue;
      const timestamp = cols[0] || new Date().toISOString();
      const nama = cols[1] || 'Siswa';
      const kelas = (cols[2] || '8A').trim().toUpperCase();
      const judul = cols[3] || 'Tanpa Judul';
      const deskripsi = cols[4] || '';
      const urlYouTube = cols[5] || '';
      const pesanMoral = cols[6] || '';
      const izinPublikasi = (cols[7] || 'Ya').trim() as 'Ya' | 'Tidak';

      const trimmedUrl = urlYouTube.trim();
      if (!trimmedUrl) continue;

      const videoId = extractYouTubeId(trimmedUrl) || '';
      const id = `ST-${String(i).padStart(4, '0')}`;

      // Check if already exists in local storage
      const existing = existingMap.get(trimmedUrl.toLowerCase());
      if (existing) {
        newStories.push({
          ...existing,
          nama: nama || existing.nama,
          namaTampil: formatDisplayName(nama || existing.nama),
          kelas: kelas || existing.kelas,
          judul: judul || existing.judul,
          deskripsi: deskripsi || existing.deskripsi,
          pesanMoral: pesanMoral || existing.pesanMoral,
          izinPublikasi: izinPublikasi || existing.izinPublikasi,
        });
      } else {
        newStories.push({
          id,
          timestamp,
          nama,
          namaTampil: formatDisplayName(nama),
          kelas,
          judul,
          deskripsi,
          urlYouTube: trimmedUrl,
          videoId,
          pesanMoral,
          izinPublikasi,
          status: izinPublikasi === 'Ya' ? 'Disetujui' : 'Menunggu',
          catatanGuru: '',
          hasilCek: videoId ? 'Tersedia' : 'Format salah',
        });
      }
    }

    if (newStories.length > 0) {
      saveStoredStories(newStories);
      return newStories;
    }
  } catch {
    // fallback to local stored
  }
  return getStoredStories();
}

function parseCSV(text: string): string[][] {
  const lines = text.split('\n');
  const result: string[][] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const row: string[] = [];
    let inQuotes = false;
    let currentVal = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(currentVal.trim().replace(/^"|"$/g, ''));
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    row.push(currentVal.trim().replace(/^"|"$/g, ''));
    result.push(row);
  }
  return result;
}

export function getPublicStories(allStories: Story[]): Story[] {
  return allStories
    .filter((s) => s.status === 'Disetujui')
    .map((s) => ({
      ...s,
      nama: '',
      catatanGuru: '',
      izinPublikasi: 'Ya',
      hasilCek: 'Tersedia',
    }));
}
