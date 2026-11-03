/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { CMSSettings, UserRole } from './types';
import { AutoExpandingTextarea } from './AutoExpandingTextarea';
import { ImageFieldUploader } from './ImageFieldUploader';

interface AdminCMSProps {
  cms: CMSSettings;
  role: UserRole;
  onSaveCMS: (newCMS: CMSSettings) => void;
  onSuccessToast: (msg: string) => void;
  onPreview: () => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  cms,
  role,
  onSaveCMS,
  onSuccessToast,
  onPreview,
}) => {
  const isSuperadmin = role === 'superadmin';

  const allowedTabs = isSuperadmin
    ? ['Identitas', 'Tema', 'Navigasi', 'Tombol', 'Bagian Halaman', 'Galeri', 'Fitur', 'Footer dan Kontak', 'Pratinjau']
    : ['Bagian Halaman', 'Footer dan Kontak', 'Pratinjau'];

  const [activeTab, setActiveTab] = useState<string>(allowedTabs[0]);

  const [draft, setDraft] = useState<CMSSettings>(JSON.parse(JSON.stringify(cms)));

  const isIdentitasChanged = JSON.stringify(draft.identitas) !== JSON.stringify(cms.identitas);
  const isTemaChanged = JSON.stringify(draft.tema) !== JSON.stringify(cms.tema);
  const isNavigasiChanged = JSON.stringify(draft.navigasi) !== JSON.stringify(cms.navigasi);
  const isTombolChanged = JSON.stringify(draft.tombol) !== JSON.stringify(cms.tombol);
  const isBagianChanged = JSON.stringify(draft.bagianHalaman) !== JSON.stringify(cms.bagianHalaman);
  const isGaleriChanged = JSON.stringify(draft.galeri) !== JSON.stringify(cms.galeri);
  const isFiturChanged = JSON.stringify(draft.fitur) !== JSON.stringify(cms.fitur);
  const isFooterChanged = JSON.stringify(draft.footerKontak) !== JSON.stringify(cms.footerKontak);

  const handleSaveTab = () => {
    onSaveCMS(draft);
    onSuccessToast('Berhasil disimpan');
  };

  const handleClearBannerText = () => {
    setDraft({
      ...draft,
      bagianHalaman: {
        ...draft.bagianHalaman,
        banner: {
          ...draft.bagianHalaman.banner,
          judul: '',
          subjudul: '',
          sekolah: '',
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
          CMS
        </h1>

        <button
          type="button"
          onClick={onPreview}
          className="h-10 px-4 rounded-lg bg-[#24242E] hover:bg-[#34343F] border border-[#34343F] text-[#F5F1E8] text-sm font-semibold transition-colors self-start sm:self-auto"
        >
          Pratinjau
        </button>
      </div>

      <div className="flex items-center gap-6 border-b border-[#34343F] overflow-x-auto no-scrollbar pb-1">
        {allowedTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                if (tab === 'Pratinjau') {
                  onPreview();
                } else {
                  setActiveTab(tab);
                }
              }}
              className={`text-sm font-medium pb-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'text-[#E8B04A] border-b-2 border-[#E8B04A]'
                  : 'text-[#B8B2A5] hover:text-[#F5F1E8]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === 'Identitas' && isSuperadmin && (
        <div className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 space-y-5 max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Nama Aplikasi *</label>
              <input
                type="text"
                value={draft.identitas.namaAplikasi}
                onChange={(e) => setDraft({ ...draft, identitas: { ...draft.identitas, namaAplikasi: e.target.value } })}
                className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Slogan</label>
              <input
                type="text"
                value={draft.identitas.slogan}
                onChange={(e) => setDraft({ ...draft, identitas: { ...draft.identitas, slogan: e.target.value } })}
                className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Nama Sekolah *</label>
                <input
                  type="text"
                  value={draft.identitas.namaSekolah}
                  onChange={(e) => setDraft({ ...draft, identitas: { ...draft.identitas, namaSekolah: e.target.value } })}
                  className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Lokasi</label>
                <input
                  type="text"
                  value={draft.identitas.lokasi}
                  onChange={(e) => setDraft({ ...draft, identitas: { ...draft.identitas, lokasi: e.target.value } })}
                  className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
                />
              </div>
            </div>

            <ImageFieldUploader
              label="Logo"
              value={draft.identitas.logo}
              onChange={(val) => setDraft({ ...draft, identitas: { ...draft.identitas, logo: val } })}
            />

            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Judul SEO</label>
              <input
                type="text"
                value={draft.identitas.seoJudul}
                onChange={(e) => setDraft({ ...draft, identitas: { ...draft.identitas, seoJudul: e.target.value } })}
                className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Deskripsi SEO</label>
              <AutoExpandingTextarea
                value={draft.identitas.seoDeskripsi}
                onValueChange={(val) => setDraft({ ...draft, identitas: { ...draft.identitas, seoDeskripsi: val } })}
                minRows={2}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#34343F] flex justify-end">
            <button
              type="button"
              disabled={!isIdentitasChanged}
              onClick={handleSaveTab}
              className="h-10 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Tema' && isSuperadmin && (
        <div className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 space-y-5 max-w-2xl">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Warna Latar</label>
                <input
                  type="text"
                  value={draft.tema.warnaLatar}
                  onChange={(e) => setDraft({ ...draft, tema: { ...draft.tema, warnaLatar: e.target.value } })}
                  className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Warna Permukaan</label>
                <input
                  type="text"
                  value={draft.tema.warnaPermukaan}
                  onChange={(e) => setDraft({ ...draft, tema: { ...draft.tema, warnaPermukaan: e.target.value } })}
                  className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Warna Aksen</label>
                <input
                  type="text"
                  value={draft.tema.warnaAksen}
                  onChange={(e) => setDraft({ ...draft, tema: { ...draft.tema, warnaAksen: e.target.value } })}
                  className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Warna Teks</label>
                <input
                  type="text"
                  value={draft.tema.warnaTeks}
                  onChange={(e) => setDraft({ ...draft, tema: { ...draft.tema, warnaTeks: e.target.value } })}
                  className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Jenis Huruf Judul</label>
                <select
                  value={draft.tema.jenisHurufJudul}
                  onChange={(e) => setDraft({ ...draft, tema: { ...draft.tema, jenisHurufJudul: e.target.value } })}
                  className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
                >
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Cinzel">Cinzel</option>
                  <option value="Merriweather">Merriweather</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Jenis Huruf Isi</label>
                <select
                  value={draft.tema.jenisHurufIsi}
                  onChange={(e) => setDraft({ ...draft, tema: { ...draft.tema, jenisHurufIsi: e.target.value } })}
                  className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#34343F] flex justify-end">
            <button
              type="button"
              disabled={!isTemaChanged}
              onClick={handleSaveTab}
              className="h-10 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Navigasi' && isSuperadmin && (
        <div className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 space-y-5 max-w-2xl">
          <div className="space-y-3">
            {draft.navigasi.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-[#24242E] rounded-lg border border-[#34343F]">
                <input
                  type="checkbox"
                  checked={item.visible}
                  onChange={(e) => {
                    const updated = [...draft.navigasi];
                    updated[idx].visible = e.target.checked;
                    setDraft({ ...draft, navigasi: updated });
                  }}
                  className="w-5 h-5 rounded bg-[#1A1A22] border-[#34343F] text-[#E8B04A]"
                />
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const updated = [...draft.navigasi];
                    updated[idx].label = e.target.value;
                    setDraft({ ...draft, navigasi: updated });
                  }}
                  className="flex-1 h-9 px-3 rounded-md bg-[#1A1A22] text-[#F5F1E8] border border-[#34343F] text-sm"
                />
                <span className="text-xs text-[#B8B2A5]">{item.path}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#34343F] flex justify-end">
            <button
              type="button"
              disabled={!isNavigasiChanged}
              onClick={handleSaveTab}
              className="h-10 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Tombol' && isSuperadmin && (
        <div className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 space-y-5 max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Label Explore Gallery</label>
              <input
                type="text"
                value={draft.tombol.exploreGallery.label}
                onChange={(e) => setDraft({ ...draft, tombol: { ...draft.tombol, exploreGallery: { ...draft.tombol.exploreGallery, label: e.target.value } } })}
                className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Label Submit Work</label>
              <input
                type="text"
                value={draft.tombol.submitWork.label}
                onChange={(e) => setDraft({ ...draft, tombol: { ...draft.tombol, submitWork: { ...draft.tombol.submitWork, label: e.target.value } } })}
                className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Label Watch</label>
              <input
                type="text"
                value={draft.tombol.watch.label}
                onChange={(e) => setDraft({ ...draft, tombol: { ...draft.tombol, watch: { ...draft.tombol.watch, label: e.target.value } } })}
                className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Label Watch on YouTube</label>
              <input
                type="text"
                value={draft.tombol.watchYouTube.label}
                onChange={(e) => setDraft({ ...draft, tombol: { ...draft.tombol, watchYouTube: { ...draft.tombol.watchYouTube, label: e.target.value } } })}
                className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#34343F] flex justify-end">
            <button
              type="button"
              disabled={!isTombolChanged}
              onClick={handleSaveTab}
              className="h-10 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Bagian Halaman' && (
        <div className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 space-y-6 max-w-2xl">
          <div className="space-y-4 pb-4 border-b border-[#34343F]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#F5F1E8]">Banner Utama</h3>
              <button
                type="button"
                onClick={handleClearBannerText}
                className="h-8 px-3 rounded-md border border-[#34343F] text-xs font-medium text-[#B8B2A5] hover:text-[#F5F1E8]"
              >
                Kosongkan
              </button>
            </div>

            <ImageFieldUploader
              label="Gambar Banner"
              value={draft.bagianHalaman.banner.gambar}
              onChange={(val) =>
                setDraft({
                  ...draft,
                  bagianHalaman: {
                    ...draft.bagianHalaman,
                    banner: { ...draft.bagianHalaman.banner, gambar: val },
                  },
                })
              }
            />

            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Judul Banner</label>
              <input
                type="text"
                value={draft.bagianHalaman.banner.judul}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    bagianHalaman: {
                      ...draft.bagianHalaman,
                      banner: { ...draft.bagianHalaman.banner, judul: e.target.value },
                    },
                  })
                }
                className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Subjudul</label>
              <input
                type="text"
                value={draft.bagianHalaman.banner.subjudul}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    bagianHalaman: {
                      ...draft.bagianHalaman,
                      banner: { ...draft.bagianHalaman.banner, subjudul: e.target.value },
                    },
                  })
                }
                className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
              />
            </div>
          </div>

          <div className="space-y-4 pb-4 border-b border-[#34343F]">
            <h3 className="font-serif text-lg font-bold text-[#F5F1E8]">Sambutan Beranda</h3>
            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Judul Sambutan</label>
              <input
                type="text"
                value={draft.bagianHalaman.sambutan.judul}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    bagianHalaman: {
                      ...draft.bagianHalaman,
                      sambutan: { ...draft.bagianHalaman.sambutan, judul: e.target.value },
                    },
                  })
                }
                className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Isi Sambutan</label>
              <AutoExpandingTextarea
                value={draft.bagianHalaman.sambutan.isi}
                onValueChange={(val) =>
                  setDraft({
                    ...draft,
                    bagianHalaman: {
                      ...draft.bagianHalaman,
                      sambutan: { ...draft.bagianHalaman.sambutan, isi: val },
                    },
                  })
                }
                minRows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#F5F1E8]">Halaman About</h3>
            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Tujuan Proyek</label>
              <AutoExpandingTextarea
                value={draft.bagianHalaman.aboutProject.tujuan}
                onValueChange={(val) =>
                  setDraft({
                    ...draft,
                    bagianHalaman: {
                      ...draft.bagianHalaman,
                      aboutProject: { ...draft.bagianHalaman.aboutProject, tujuan: val },
                    },
                  })
                }
                minRows={3}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#34343F] flex justify-end">
            <button
              type="button"
              disabled={!isBagianChanged}
              onClick={handleSaveTab}
              className="h-10 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Galeri' && isSuperadmin && (
        <div className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 space-y-5 max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Tautan Google Form</label>
              <input
                type="text"
                value={draft.galeri.tautanGoogleForm}
                onChange={(e) => setDraft({ ...draft, galeri: { ...draft.galeri, tautanGoogleForm: e.target.value } })}
                placeholder="https://docs.google.com/forms/d/..."
                className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Kartu per Tahap</label>
                <input
                  type="number"
                  value={draft.galeri.kartuPerTahap}
                  onChange={(e) => setDraft({ ...draft, galeri: { ...draft.galeri, kartuPerTahap: Number(e.target.value) || 12 } })}
                  className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Urutan Awal</label>
                <select
                  value={draft.galeri.urutanAwal}
                  onChange={(e) => setDraft({ ...draft, galeri: { ...draft.galeri, urutanAwal: e.target.value as 'newest' | 'title' } })}
                  className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#34343F] flex justify-end">
            <button
              type="button"
              disabled={!isGaleriChanged}
              onClick={handleSaveTab}
              className="h-10 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Fitur' && isSuperadmin && (
        <div className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 space-y-5 max-w-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#24242E] rounded-lg">
              <span className="text-sm font-medium text-[#F5F1E8]">Pencarian</span>
              <input
                type="checkbox"
                checked={draft.fitur.pencarian}
                onChange={(e) => setDraft({ ...draft, fitur: { ...draft.fitur, pencarian: e.target.checked } })}
                className="w-5 h-5 rounded bg-[#1A1A22] border-[#34343F] text-[#E8B04A]"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#24242E] rounded-lg">
              <span className="text-sm font-medium text-[#F5F1E8]">Pilihan Urutan</span>
              <input
                type="checkbox"
                checked={draft.fitur.pilihanUrutan}
                onChange={(e) => setDraft({ ...draft, fitur: { ...draft.fitur, pilihanUrutan: e.target.checked } })}
                className="w-5 h-5 rounded bg-[#1A1A22] border-[#34343F] text-[#E8B04A]"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#24242E] rounded-lg">
              <span className="text-sm font-medium text-[#F5F1E8]">Pemutar Tertanam</span>
              <input
                type="checkbox"
                checked={draft.fitur.pemutarTertanam}
                onChange={(e) => setDraft({ ...draft, fitur: { ...draft.fitur, pemutarTertanam: e.target.checked } })}
                className="w-5 h-5 rounded bg-[#1A1A22] border-[#34343F] text-[#E8B04A]"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#24242E] rounded-lg">
              <span className="text-sm font-medium text-[#F5F1E8]">Rekomendasi Kelas Sama</span>
              <input
                type="checkbox"
                checked={draft.fitur.moreFromGrade}
                onChange={(e) => setDraft({ ...draft, fitur: { ...draft.fitur, moreFromGrade: e.target.checked } })}
                className="w-5 h-5 rounded bg-[#1A1A22] border-[#34343F] text-[#E8B04A]"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#24242E] rounded-lg">
              <span className="text-sm font-medium text-[#F5F1E8]">Izinkan Pengindeksan Mesin Pencari</span>
              <input
                type="checkbox"
                checked={draft.fitur.pengindeksanMesinPencari}
                onChange={(e) => setDraft({ ...draft, fitur: { ...draft.fitur, pengindeksanMesinPencari: e.target.checked } })}
                className="w-5 h-5 rounded bg-[#1A1A22] border-[#34343F] text-[#E8B04A]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#34343F] flex justify-end">
            <button
              type="button"
              disabled={!isFiturChanged}
              onClick={handleSaveTab}
              className="h-10 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Footer dan Kontak' && (
        <div className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 space-y-5 max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Alamat</label>
              <AutoExpandingTextarea
                value={draft.footerKontak.alamat}
                onValueChange={(val) => setDraft({ ...draft, footerKontak: { ...draft.footerKontak, alamat: val } })}
                minRows={2}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Telepon</label>
                <input
                  type="text"
                  value={draft.footerKontak.telepon}
                  onChange={(e) => setDraft({ ...draft, footerKontak: { ...draft.footerKontak, telepon: e.target.value } })}
                  className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Email</label>
                <input
                  type="email"
                  value={draft.footerKontak.email}
                  onChange={(e) => setDraft({ ...draft, footerKontak: { ...draft.footerKontak, email: e.target.value } })}
                  className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Tautan Media Sosial</label>
              <input
                type="text"
                value={draft.footerKontak.mediaSosial}
                onChange={(e) => setDraft({ ...draft, footerKontak: { ...draft.footerKontak, mediaSosial: e.target.value } })}
                className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F1E8] mb-1">Teks Hak Cipta</label>
              <input
                type="text"
                value={draft.footerKontak.hakCipta}
                onChange={(e) => setDraft({ ...draft, footerKontak: { ...draft.footerKontak, hakCipta: e.target.value } })}
                className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] text-base"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#34343F] flex justify-end">
            <button
              type="button"
              disabled={!isFooterChanged}
              onClick={handleSaveTab}
              className="h-10 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
