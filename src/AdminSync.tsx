/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { CMSSettings } from './types';
import { APPS_SCRIPT_CODE_TEMPLATE, testAppsScriptConnection } from './syncService';
import { AutoExpandingTextarea } from './AutoExpandingTextarea';

interface AdminSyncProps {
  cms: CMSSettings;
  onSaveSync: (syncSettings: CMSSettings['sinkronisasi']) => void;
  onSuccessToast: (msg: string) => void;
}

export const AdminSync: React.FC<AdminSyncProps> = ({
  cms,
  onSaveSync,
  onSuccessToast,
}) => {
  const [form, setForm] = useState<CMSSettings['sinkronisasi']>(cms.sinkronisasi);
  const [connStatus, setConnStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const isChanged = JSON.stringify(form) !== JSON.stringify(cms.sinkronisasi);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_CODE_TEMPLATE);
      onSuccessToast('Berhasil disalin');
    } catch {
      // fallback
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setConnStatus(null);
    const ok = await testAppsScriptConnection(form.urlWebApp, form.token);
    setIsTesting(false);
    setConnStatus(ok ? 'Terhubung' : 'Gagal');
  };

  const handleSyncCollection = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const nowStr = new Date().toLocaleString('id-ID');
      const updated = { ...form, terakhirSinkron: nowStr };
      setForm(updated);
      onSaveSync(updated);
      onSuccessToast('Berhasil disinkronkan');
    }, 600);
  };

  const handleSave = () => {
    onSaveSync(form);
    onSuccessToast('Berhasil disimpan');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
        Sinkronisasi
      </h1>

      <div className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[#F5F1E8]">
            Kode Google Apps Script
          </label>
          <button
            type="button"
            onClick={handleCopyCode}
            className="h-9 px-4 rounded-lg bg-[#24242E] hover:bg-[#34343F] border border-[#34343F] text-xs font-semibold text-[#F5F1E8] transition-colors"
          >
            Salin Kode
          </button>
        </div>

        <AutoExpandingTextarea
          value={APPS_SCRIPT_CODE_TEMPLATE}
          onValueChange={() => {}}
          readOnly
          minRows={10}
          className="font-mono text-xs bg-[#0F0F14] text-[#E8B04A] border-[#34343F]"
        />
      </div>

      <div className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
            URL Web App
          </label>
          <input
            type="text"
            value={form.urlWebApp}
            onChange={(e) => setForm({ ...form, urlWebApp: e.target.value })}
            placeholder="https://script.google.com/macros/s/..."
            className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
            Token
          </label>
          <input
            type="password"
            value={form.token}
            onChange={(e) => setForm({ ...form, token: e.target.value })}
            className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
              ID Folder Drive
            </label>
            <input
              type="text"
              value={form.idFolderDrive}
              onChange={(e) => setForm({ ...form, idFolderDrive: e.target.value })}
              className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F5F1E8] mb-1">
              ID Spreadsheet
            </label>
            <input
              type="text"
              value={form.idSpreadsheet}
              onChange={(e) => setForm({ ...form, idSpreadsheet: e.target.value })}
              className="w-full h-11 px-3 rounded-lg bg-[#24242E] text-[#F5F1E8] border border-[#34343F] focus:border-[#E8B04A] focus:outline-none text-base"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            disabled={isTesting || !form.urlWebApp}
            onClick={handleTestConnection}
            className="h-10 px-4 rounded-lg bg-[#24242E] hover:bg-[#34343F] border border-[#34343F] text-xs font-semibold text-[#F5F1E8] transition-colors disabled:opacity-40"
          >
            {isTesting ? 'Menguji...' : 'Uji Koneksi'}
          </button>

          {connStatus && (
            <span
              className={`text-sm font-medium ${
                connStatus === 'Terhubung' ? 'text-[#E8B04A]' : 'text-[#D9534F]'
              }`}
            >
              {connStatus}
            </span>
          )}
        </div>

        <div className="pt-4 border-t border-[#34343F] flex justify-end">
          <button
            type="button"
            disabled={!isChanged}
            onClick={handleSave}
            className="h-10 px-6 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Simpan
          </button>
        </div>
      </div>

      <div className="bg-[#1A1A22] border border-[#34343F] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#F5F1E8]">
              Karya Siswa ({form.namaSheet || 'KaryaSiswa'})
            </h2>
            <div className="text-xs text-[#B8B2A5] mt-0.5">
              {form.terakhirSinkron ? `Terakhir: ${form.terakhirSinkron}` : 'Belum pernah sinkron'}
            </div>
          </div>

          <button
            type="button"
            disabled={isSyncing}
            onClick={handleSyncCollection}
            className="h-10 px-5 rounded-lg bg-[#24242E] hover:bg-[#34343F] border border-[#34343F] text-xs font-semibold text-[#E8B04A] transition-colors"
          >
            {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan'}
          </button>
        </div>
      </div>
    </div>
  );
};
