/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.
/**
 * PERMANENT DESIGN CONSTITUTION FOR DIGITAL STORYTELLING GALLERY
 *
 * 1. PRINSIP: Minimalis, bersih, ringkas, dan jelas, tampil seperti produk jadi yang profesional.
 * 2. TANPA TEKS PANJANG: DILARANG paragraf instruksi, tips, teks bantuan, atau penjelasan fungsi
 *    di seluruh tampilan, formulir, dan pengaturan CMS, termasuk penjelasan teknis
 *    (Drive, Apps Script, spreadsheet, format dan batas file).
 * 3. TEKS HANYA LABEL SINGKAT: 1-3 kata. Placeholder dikosongkan atau berisi contoh isi murni, bukan instruksi.
 * 4. TOMBOL AKSI: Tegas, langsung, fungsional, label kata kerja singkat (Simpan, Hapus, Setujui, Tolak, Cari).
 * 5. SETIAP KOLOM GAMBAR: Selalu punya tombol "Hapus Gambar" di samping pratinjau.
 * 6. TEKS BANNER: Boleh dikosongkan dengan tombol "Kosongkan". Jika kosong, tampilkan gambar murni.
 * 7. SEMUA INPUT TEKS & TEXTAREA: Otomatis membesar ke bawah mengikuti isinya, tanpa bilah gulir internal.
 * 8. TIDAK ADA GAMBAR BAWAAN TERTULIS MATI: Semua gambar dibaca dari data/pengaturan, kerangka netral jika kosong.
 * 9. TIDAK ADA PENGALIH TEMA: Hanya satu tema gelap sinematik.
 * 10. NOTIFIKASI HASIL AKSI: Tampil tepat 500 ms (0,5 detik) lalu hilang otomatis, tanpa tombol tutup.
 * 11. TAMPILAN HP (MOBILE FIRST 360-430px):
 *     - Header HP HANYA logo/nama. Tidak ada tombol hamburger atau menu di header.
 *     - Tombol pembuka sidebar di tepi kiri layar, pas di tengah tinggi (top 50%), ukuran 120px x 25px,
 *       fixed (tidak ikut ter-scroll), transparan modern tema, hanya ada 1 ikon hamburger fungsional.
 *     - Saat sidebar dibuka: latar terkunci (no background scroll), ada overlay gelap, ketuk luar menutup.
 *     - Item menu di sidebar: satu kolom, teks saja (tanpa ikon dekoratif), min 48px, font min 16px.
 *     - Item "Masuk" / "Dasbor": item biasa paling terakhir di daftar menu.
 * 12. LARANGAN PILL BADGE & TOMBOL PALSU: Dilarang membungkus teks metadata dalam bentuk kapsul lonjong/chip/badge
 *     yang menyerupai tombol tapi tidak bisa diklik. Teks status/penegas adalah teks biasa tanpa bingkai.
 * 13. LARANGAN IKON DEKORATIF: Dilarang ikon pemanis visual di atas kartu, judul, atau teks.
 *     Ikon HANYA untuk kontrol interaktif fungsional (navigasi carousel, chevron akordeon, tombol edit/hapus).
 * 14. DATA DI GOOGLE SHEETS & APPS SCRIPT: Diproses secara bersih, kuota hemat, filter privasi di server.
 */

export const DESIGN_SYSTEM = {
  colors: {
    bgMain: '#0F0F14',
    cardSurface: '#1A1A22',
    cardSecondary: '#24242E',
    textPrimary: '#F5F1E8',
    textSecondary: '#B8B2A5',
    accentGold: '#E8B04A',
    textOnAccent: '#0F0F14',
    border: '#34343F',
    danger: '#D9534F',
  },
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  radii: {
    card: '12px',
    button: '8px',
    input: '8px',
  },
  toastDurationMs: 500, // 0.5 detik auto-dismiss
  mobileTrigger: {
    height: '120px',
    width: '25px',
  },
} as const;
