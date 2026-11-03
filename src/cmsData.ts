/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import { CMSSettings } from './types';

const STORAGE_KEY_CMS = 'dsg_cms_settings_v1';

export const INITIAL_CMS_SETTINGS: CMSSettings = {
  identitas: {
    namaAplikasi: 'Digital Storytelling Gallery',
    slogan: 'Where our stories come to life',
    namaSekolah: 'SMP Negeri 1 Bengkalis',
    lokasi: 'Bengkalis, Riau',
    logo: { tipe: 'tautan', nilai: '' },
    favicon: { tipe: 'tautan', nilai: '' },
    seoJudul: 'Digital Storytelling Gallery - SMP Negeri 1 Bengkalis',
    seoDeskripsi: 'Digital Storytelling Gallery of Grade 8 students at SMP Negeri 1 Bengkalis.',
  },
  tema: {
    warnaLatar: '#0F0F14',
    warnaPermukaan: '#1A1A22',
    warnaPermukaanSekunder: '#24242E',
    warnaTeks: '#F5F1E8',
    warnaTeksSekunder: '#B8B2A5',
    warnaAksen: '#E8B04A',
    warnaTombol: '#E8B04A',
    jenisHurufJudul: 'Playfair Display',
    jenisHurufIsi: 'Inter',
    sudutMembulat: '12px',
  },
  navigasi: [
    { id: 'home', label: 'Home', path: '#/', visible: true },
    { id: 'gallery', label: 'Gallery', path: '#/gallery', visible: true },
    { id: 'about', label: 'About', path: '#/about', visible: true },
    { id: 'submit', label: 'Submit Work', path: 'google-form', visible: true },
  ],
  tombol: {
    exploreGallery: { label: 'Explore Gallery', visible: true },
    submitWork: { label: 'Submit Work', visible: true },
    watch: { label: 'Watch', visible: true },
    watchYouTube: { label: 'Watch on YouTube', visible: true },
    backToGallery: { label: 'Back to Gallery', visible: true },
  },
  bagianHalaman: {
    banner: {
      gambar: {
        tipe: 'tautan',
        nilai: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop',
      },
      judul: 'Digital Storytelling Gallery',
      subjudul: 'Where our stories come to life',
      sekolah: 'SMP Negeri 1 Bengkalis',
      visible: true,
    },
    sambutan: {
      judul: 'Welcome to our gallery',
      isi: 'Welcome to the Digital Storytelling Gallery of SMP Negeri 1 Bengkalis. Here, our Grade 8 students share the stories they imagined, wrote, illustrated, and narrated in their own voices. Take a seat, press play, and enjoy the show.',
      visible: true,
    },
    navigasiKelas: {
      visible: true,
    },
    karyaTerbaru: {
      judul: 'Latest Stories',
      visible: true,
      limit: 6,
    },
    aboutProject: {
      judul: 'About the Project',
      tujuan:
        'This digital storytelling project empowers Grade 8 students to develop their English language fluency, narrative structure skills, and creative confidence by crafting complete multimedia stories from scratch.',
      tahap: [
        'Choose an idea',
        'Create characters and setting',
        'Plan the plot (orientation, complication, resolution)',
        'Write the script in English',
        'Illustrate every part',
        'Record your narration',
        'Edit into a video story',
      ],
      moralValueJudul: 'Moral Value',
      moralValueIsi:
        'Every story carries an essential moral value, fostering respect, courage, kindness, honesty, and empathy in our school and community.',
    },
  },
  galeri: {
    tautanGoogleForm: 'https://docs.google.com/forms',
    daftarKelas: ['8A', '8B', '8C', '8D', '8E'],
    kartuPerTahap: 12,
    urutanAwal: 'newest',
  },
  fitur: {
    pencarian: true,
    pilihanUrutan: true,
    pemutarTertanam: true,
    moreFromGrade: true,
    pengindeksanMesinPencari: false,
  },
  footerKontak: {
    alamat: 'Jl. Stuart No. 1, Bengkalis, Riau 28712',
    telepon: '+62 766 21156',
    email: 'smpn1bengkalis@gmail.com',
    mediaSosial: 'https://instagram.com/smpn1bengkalis',
    hakCipta: 'SMP Negeri 1 Bengkalis. All rights reserved.',
  },
  sinkronisasi: {
    urlWebApp: '',
    token: '',
    idFolderDrive: '',
    idSpreadsheet: '',
    namaSheet: 'KaryaSiswa',
    terakhirSinkron: '',
  },
};

export function getStoredCMS(): CMSSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CMS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_CMS_SETTINGS,
        ...parsed,
        identitas: { ...INITIAL_CMS_SETTINGS.identitas, ...parsed.identitas },
        tema: { ...INITIAL_CMS_SETTINGS.tema, ...parsed.tema },
        tombol: { ...INITIAL_CMS_SETTINGS.tombol, ...parsed.tombol },
        bagianHalaman: {
          ...INITIAL_CMS_SETTINGS.bagianHalaman,
          ...parsed.bagianHalaman,
          banner: { ...INITIAL_CMS_SETTINGS.bagianHalaman.banner, ...parsed.bagianHalaman?.banner },
          sambutan: { ...INITIAL_CMS_SETTINGS.bagianHalaman.sambutan, ...parsed.bagianHalaman?.sambutan },
          aboutProject: { ...INITIAL_CMS_SETTINGS.bagianHalaman.aboutProject, ...parsed.bagianHalaman?.aboutProject },
        },
        galeri: {
          ...INITIAL_CMS_SETTINGS.galeri,
          ...parsed.galeri,
          tautanGoogleForm: parsed.galeri?.tautanGoogleForm || INITIAL_CMS_SETTINGS.galeri.tautanGoogleForm,
        },
        fitur: { ...INITIAL_CMS_SETTINGS.fitur, ...parsed.fitur },
        footerKontak: { ...INITIAL_CMS_SETTINGS.footerKontak, ...parsed.footerKontak },
        sinkronisasi: { ...INITIAL_CMS_SETTINGS.sinkronisasi, ...parsed.sinkronisasi },
      };
    }
  } catch {
    // ignore
  }
  return INITIAL_CMS_SETTINGS;
}

export function saveStoredCMS(settings: CMSSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_CMS, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
