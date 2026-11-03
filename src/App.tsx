/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CMSSettings, Story, StoryStatus, UserRole, ActivityLog } from './types';
import { getStoredStories, saveStoredStories, getPublicStories } from './storyData';
import { getStoredCMS, saveStoredCMS } from './cmsData';
import { getCurrentSession, clearSession, refreshActivity } from './authData';
import { getStoredLogs, addActivityLog } from './activityLogs';

// Common Components
import { Header } from './Header';
import { Footer } from './Footer';
import { Toast } from './Toast';
import { LoginModal } from './LoginModal';
import { MobileSidebarTrigger } from './MobileSidebarTrigger';
import { MobileSidebar } from './MobileSidebar';

// Public Pages
import { HomePage } from './HomePage';
import { GalleryPage } from './GalleryPage';
import { StoryDetailPage } from './StoryDetailPage';
import { AboutPage } from './AboutPage';
import { NotFoundPage } from './NotFoundPage';

// Admin Pages
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminApprovals } from './AdminApprovals';
import { AdminAllStories } from './AdminAllStories';
import { AdminNeedsReview } from './AdminNeedsReview';
import { AdminRecap } from './AdminRecap';
import { AdminPassword } from './AdminPassword';
import { AdminCMS } from './AdminCMS';
import { AdminSync } from './AdminSync';
import { AdminLogs } from './AdminLogs';
import { AdminFirebaseTab } from './AdminFirebaseTab';

export default function App() {
  const [cms, setCms] = useState<CMSSettings>(getStoredCMS);
  const [stories, setStories] = useState<Story[]>(getStoredStories);
  const [logs, setLogs] = useState<ActivityLog[]>(getStoredLogs);

  const [role, setRole] = useState<UserRole>(getCurrentSession);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [currentHash, setCurrentHash] = useState<string>(() => {
    return window.location.hash || '#/';
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      setRole(getCurrentSession());
      refreshActivity();
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (cms.identitas.seoJudul) {
      document.title = cms.identitas.seoJudul;
    }
    const metaRobots = document.getElementById('meta-robots');
    if (metaRobots) {
      metaRobots.setAttribute(
        'content',
        cms.fitur.pengindeksanMesinPencari ? 'index, follow' : 'noindex, nofollow'
      );
    }
  }, [cms]);

  useEffect(() => {
    const interval = setInterval(() => {
      const activeRole = getCurrentSession();
      if (activeRole !== role) {
        setRole(activeRole);
        if (activeRole === 'publik' && currentHash.startsWith('#/admin')) {
          window.location.hash = '#/';
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [role, currentHash]);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToastType(type);
    setToastMessage(msg);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
    setCurrentHash(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refreshActivity();
  }, []);

  const handleLoginSuccess = (newRole: UserRole) => {
    setRole(newRole);
    showToast('Berhasil masuk');
    navigate('#/admin');
  };

  const handleLogout = () => {
    clearSession();
    setRole('publik');
    showToast('Berhasil keluar');
    navigate('#/');
  };

  const handleUpdateStatus = (id: string, newStatus: StoryStatus, note?: string) => {
    const updated = stories.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          status: newStatus,
          catatanGuru: note !== undefined ? note : s.catatanGuru,
        };
      }
      return s;
    });
    setStories(updated);
    saveStoredStories(updated);

    const targetStory = stories.find((s) => s.id === id);
    const actionLabel = `${newStatus} ${id}${targetStory ? ` (${targetStory.judul})` : ''}`;
    addActivityLog(role === 'superadmin' ? 'Superadmin' : 'Admin', actionLabel);
    setLogs(getStoredLogs());

    showToast('Berhasil disimpan');
  };

  const handleBulkUpdateStatus = (ids: string[], newStatus: StoryStatus) => {
    const idSet = new Set(ids);
    const updated = stories.map((s) => {
      if (idSet.has(s.id)) {
        return { ...s, status: newStatus };
      }
      return s;
    });
    setStories(updated);
    saveStoredStories(updated);

    addActivityLog(
      role === 'superadmin' ? 'Superadmin' : 'Admin',
      `${newStatus} massal (${ids.length} karya)`
    );
    setLogs(getStoredLogs());

    showToast('Berhasil disimpan');
  };

  const handleUpdateStory = (updatedStory: Story) => {
    const updated = stories.map((s) => (s.id === updatedStory.id ? updatedStory : s));
    setStories(updated);
    saveStoredStories(updated);

    addActivityLog(
      role === 'superadmin' ? 'Superadmin' : 'Admin',
      `Edit ${updatedStory.id} (${updatedStory.judul})`
    );
    setLogs(getStoredLogs());

    showToast('Berhasil disimpan');
  };

  const handleRefreshAllChecks = () => {
    const updated = stories.map((s) => {
      const isUrlValid = Boolean(s.urlYouTube && s.urlYouTube.includes('youtube'));
      return {
        ...s,
        hasilCek: isUrlValid ? ('Tersedia' as const) : ('Format salah' as const),
      };
    });
    setStories(updated);
    saveStoredStories(updated);
    showToast('Pengecekan selesai');
  };

  const handleSaveCMS = (newCMS: CMSSettings) => {
    setCms(newCMS);
    saveStoredCMS(newCMS);
    addActivityLog(
      role === 'superadmin' ? 'Superadmin' : 'Admin',
      'Simpan Pengaturan CMS'
    );
    setLogs(getStoredLogs());
  };

  const handleSaveSync = (syncSettings: CMSSettings['sinkronisasi']) => {
    const updated = { ...cms, sinkronisasi: syncSettings };
    setCms(updated);
    saveStoredCMS(updated);
    addActivityLog('Superadmin', 'Simpan Pengaturan Sinkronisasi');
    setLogs(getStoredLogs());
  };

  const publicStories = useMemo(() => getPublicStories(stories), [stories]);

  const route = useMemo(() => {
    const cleanHash = currentHash.startsWith('#') ? currentHash.slice(1) : currentHash;
    const [pathPart, queryPart] = cleanHash.split('?');
    const queryParams = new URLSearchParams(queryPart || '');

    return {
      path: pathPart || '/',
      grade: queryParams.get('grade') || 'All',
      raw: currentHash,
    };
  }, [currentHash]);

  const mobileMenuItems = useMemo(() => {
    if (route.path.startsWith('/admin')) {
      const isSuper = role === 'superadmin';
      const items = [
        { id: 'dasbor', label: 'Dasbor', path: '#/admin' },
        { id: 'persetujuan', label: 'Persetujuan', path: '#/admin/persetujuan' },
        { id: 'semua', label: 'Semua Karya', path: '#/admin/semua' },
        { id: 'perlu-diperiksa', label: 'Perlu Diperiksa', path: '#/admin/perlu-diperiksa' },
        { id: 'rekap', label: 'Rekap', path: '#/admin/rekap' },
        { id: 'cms', label: 'CMS', path: '#/admin/cms' },
        { id: 'kata-sandi', label: isSuper ? 'Akun dan Kata Sandi' : 'Kata Sandi', path: '#/admin/kata-sandi' },
      ];
      if (isSuper) {
        items.push(
          { id: 'sinkronisasi', label: 'Sinkronisasi', path: '#/admin/sinkronisasi' },
          { id: 'log', label: 'Log Aktivitas', path: '#/admin/log' },
          { id: 'firebase', label: 'Firebase', path: '#/admin/firebase' }
        );
      }
      return items;
    } else {
      const items: Array<{ id: string; label: string; path: string; isExternal?: boolean }> = [
        { id: 'home', label: 'Home', path: '#/' },
        { id: 'gallery', label: 'Gallery', path: '#/gallery' },
        { id: 'about', label: 'About', path: '#/about' },
      ];
      if (cms.galeri.tautanGoogleForm && cms.tombol.submitWork.visible) {
        items.push({
          id: 'submit',
          label: cms.tombol.submitWork.label || 'Submit Work',
          path: 'google-form',
          isExternal: true,
        });
      }
      return items;
    }
  }, [route.path, role, cms.galeri.tautanGoogleForm, cms.tombol.submitWork]);

  const activeMobileId = useMemo(() => {
    if (route.path.startsWith('/admin')) {
      const parts = route.path.split('/');
      return parts[2] || 'dasbor';
    }
    if (route.path === '/gallery') return 'gallery';
    if (route.path === '/about') return 'about';
    return 'home';
  }, [route.path]);

  const renderContent = () => {
    if (route.path.startsWith('/admin')) {
      if (role === 'publik') {
        return (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#F5F1E8]">
              Akses Terbatas
            </h2>
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="h-10 px-5 rounded-lg bg-[#E8B04A] text-[#0F0F14] text-sm font-semibold hover:opacity-90 transition-all"
            >
              Masuk
            </button>
          </div>
        );
      }

      const adminTab = route.path.split('/')[2] || 'dasbor';

      return (
        <AdminLayout
          role={role}
          activeTab={adminTab}
          onSelectTab={(tab) => navigate(tab === 'dasbor' ? '#/admin' : `#/admin/${tab}`)}
          onLogout={handleLogout}
          onViewPublic={() => navigate('#/')}
        >
          {adminTab === 'dasbor' && (
            <AdminDashboard
              stories={stories}
              onNavigateTab={(tab) => navigate(`#/admin/${tab}`)}
            />
          )}

          {adminTab === 'persetujuan' && (
            <AdminApprovals
              stories={stories}
              onUpdateStatus={handleUpdateStatus}
              onBulkUpdate={handleBulkUpdateStatus}
            />
          )}

          {adminTab === 'semua' && (
            <AdminAllStories
              stories={stories}
              onUpdateStory={handleUpdateStory}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {adminTab === 'perlu-diperiksa' && (
            <AdminNeedsReview
              stories={stories}
              onUpdateStory={handleUpdateStory}
              onUpdateStatus={handleUpdateStatus}
              onRefreshAllChecks={handleRefreshAllChecks}
            />
          )}

          {adminTab === 'rekap' && <AdminRecap stories={stories} />}

          {adminTab === 'cms' && (
            <AdminCMS
              cms={cms}
              role={role}
              onSaveCMS={handleSaveCMS}
              onSuccessToast={showToast}
              onPreview={() => navigate('#/')}
            />
          )}

          {adminTab === 'kata-sandi' && (
            <AdminPassword role={role} onSuccessToast={showToast} />
          )}

          {adminTab === 'sinkronisasi' && role === 'superadmin' && (
            <AdminSync
              cms={cms}
              onSaveSync={handleSaveSync}
              onSuccessToast={showToast}
            />
          )}

          {adminTab === 'log' && role === 'superadmin' && (
            <AdminLogs logs={logs} />
          )}

          {adminTab === 'firebase' && role === 'superadmin' && (
            <AdminFirebaseTab />
          )}
        </AdminLayout>
      );
    }

    if (route.path.startsWith('/story/')) {
      const storyId = route.path.split('/')[2];
      const story = publicStories.find((s) => s.id === storyId);

      if (!story) {
        return <NotFoundPage onBackHome={() => navigate('#/')} />;
      }

      return (
        <StoryDetailPage
          story={story}
          allStories={publicStories}
          cms={cms}
          onNavigate={navigate}
          onSelectStory={(s) => navigate(`#/story/${s.id}`)}
        />
      );
    }

    if (route.path === '/gallery') {
      return (
        <GalleryPage
          cms={cms}
          stories={publicStories}
          initialGrade={route.grade}
          onSelectStory={(s) => navigate(`#/story/${s.id}`)}
          onGradeChange={(g) => {
            window.location.hash = g === 'All' ? '#/gallery' : `#/gallery?grade=${g}`;
          }}
        />
      );
    }

    if (route.path === '/about') {
      return <AboutPage cms={cms} />;
    }

    if (route.path === '/' || route.path === '') {
      return (
        <HomePage
          cms={cms}
          stories={publicStories}
          onNavigate={navigate}
          onSelectStory={(s) => navigate(`#/story/${s.id}`)}
        />
      );
    }

    return <NotFoundPage onBackHome={() => navigate('#/')} />;
  };

  return (
    <div className="min-h-screen bg-[#0F0F14] text-[#F5F1E8] flex flex-col font-['Inter',sans-serif] relative">
      {!isOnline && (
        <div className="bg-[#D9534F] text-white text-xs font-semibold py-1 text-center">
          Offline
        </div>
      )}

      <Header
        cms={cms}
        currentPath={currentHash}
        onNavigate={navigate}
        role={role}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      <MobileSidebarTrigger
        onClick={() => setIsMobileSidebarOpen(true)}
        isOpen={isMobileSidebarOpen}
      />

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        items={mobileMenuItems}
        activeId={activeMobileId}
        onSelect={(item) => {
          if (item.path === 'google-form') {
            if (cms.galeri.tautanGoogleForm) {
              window.open(cms.galeri.tautanGoogleForm, '_blank', 'noopener,noreferrer');
            }
          } else {
            navigate(item.path);
          }
        }}
        role={role}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        appName={cms.identitas.namaAplikasi}
      />

      <div className="flex-1 w-full">
        {renderContent()}
      </div>

      {!route.path.startsWith('/admin') ? <Footer cms={cms} /> : null}

      <Toast
        message={toastMessage}
        onClear={() => setToastMessage(null)}
        type={toastType}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
