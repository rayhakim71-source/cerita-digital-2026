/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

export type UserRole = 'publik' | 'admin' | 'superadmin';

export type StoryStatus = 'Disetujui' | 'Menunggu' | 'Ditolak' | 'Disembunyikan' | 'Diarsipkan';
export type CheckResult = 'Tersedia' | 'Tidak tersedia' | 'Format salah';
export type PublicationPermission = 'Ya' | 'Tidak';

export interface Story {
  id: string; // ST-0001
  timestamp: string;
  nama: string; // Admin only
  namaTampil: string; // Public (e.g. "Raka P.")
  kelas: string; // "8A", "8B", etc.
  judul: string;
  deskripsi: string;
  urlYouTube: string;
  videoId: string;
  pesanMoral: string;
  izinPublikasi: PublicationPermission;
  status: StoryStatus;
  catatanGuru: string;
  hasilCek: CheckResult;
}

export interface ImageSource {
  tipe: 'tautan' | 'drive';
  nilai: string;
}

export interface CMSSettings {
  identitas: {
    namaAplikasi: string;
    slogan: string;
    namaSekolah: string;
    lokasi: string;
    logo: ImageSource;
    favicon: ImageSource;
    seoJudul: string;
    seoDeskripsi: string;
  };
  tema: {
    warnaLatar: string;
    warnaPermukaan: string;
    warnaPermukaanSekunder: string;
    warnaTeks: string;
    warnaTeksSekunder: string;
    warnaAksen: string;
    warnaTombol: string;
    jenisHurufJudul: string;
    jenisHurufIsi: string;
    sudutMembulat: string;
  };
  navigasi: Array<{
    id: string;
    label: string;
    path: string;
    visible: boolean;
  }>;
  tombol: {
    exploreGallery: { label: string; visible: boolean };
    submitWork: { label: string; visible: boolean };
    watch: { label: string; visible: boolean };
    watchYouTube: { label: string; visible: boolean };
    backToGallery: { label: string; visible: boolean };
  };
  bagianHalaman: {
    banner: {
      gambar: ImageSource;
      judul: string;
      subjudul: string;
      sekolah: string;
      visible: boolean;
    };
    sambutan: {
      judul: string;
      isi: string;
      visible: boolean;
    };
    navigasiKelas: {
      visible: boolean;
    };
    karyaTerbaru: {
      judul: string;
      visible: boolean;
      limit: number;
    };
    aboutProject: {
      judul: string;
      tujuan: string;
      tahap: string[];
      moralValueJudul: string;
      moralValueIsi: string;
    };
  };
  galeri: {
    tautanGoogleForm: string;
    daftarKelas: string[];
    kartuPerTahap: number;
    urutanAwal: 'newest' | 'title';
  };
  fitur: {
    pencarian: boolean;
    pilihanUrutan: boolean;
    pemutarTertanam: boolean;
    moreFromGrade: boolean;
    pengindeksanMesinPencari: boolean;
  };
  footerKontak: {
    alamat: string;
    telepon: string;
    email: string;
    mediaSosial: string;
    hakCipta: string;
  };
  sinkronisasi: {
    urlWebApp: string;
    token: string;
    idFolderDrive: string;
    idSpreadsheet: string;
    namaSheet: string;
    terakhirSinkron: string;
  };
}

export interface ActivityLog {
  id: string;
  waktu: string;
  peran: 'Admin' | 'Superadmin';
  tindakan: string;
}
