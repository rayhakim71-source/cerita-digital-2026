/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import { UserRole } from './types';
import { hashPasswordWithSalt, SALT_ADMIN, SALT_SUPERADMIN } from './security';

const STORAGE_KEY_AUTH = 'dsg_session_auth_v1';
const STORAGE_KEY_PASSWORDS = 'dsg_passwords_hash_v1';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

interface StoredHashes {
  adminHash: string;
  superadminHash: string;
}

interface UserSession {
  role: UserRole;
  lastActive: number;
}

let cachedHashes: StoredHashes | null = null;

async function getStoredHashes(): Promise<StoredHashes> {
  if (cachedHashes) return cachedHashes;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_PASSWORDS);
    if (raw) {
      cachedHashes = JSON.parse(raw);
      return cachedHashes!;
    }
  } catch {
    // fallback
  }

  const defaultAdminHash = await hashPasswordWithSalt('admin123', SALT_ADMIN);
  const defaultSuperHash = await hashPasswordWithSalt('superadmin123', SALT_SUPERADMIN);
  cachedHashes = {
    adminHash: defaultAdminHash,
    superadminHash: defaultSuperHash,
  };
  try {
    localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(cachedHashes));
  } catch {
    // ignore
  }
  return cachedHashes;
}

export async function verifyLoginPassword(password: string): Promise<UserRole | null> {
  const hashes = await getStoredHashes();
  const testAdminHash = await hashPasswordWithSalt(password, SALT_ADMIN);
  if (testAdminHash === hashes.adminHash) {
    saveSession('admin');
    return 'admin';
  }

  const testSuperHash = await hashPasswordWithSalt(password, SALT_SUPERADMIN);
  if (testSuperHash === hashes.superadminHash) {
    saveSession('superadmin');
    return 'superadmin';
  }

  return null;
}

export function getCurrentSession(): UserRole {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (raw) {
      const session: UserSession = JSON.parse(raw);
      const now = Date.now();
      if (now - session.lastActive < SESSION_TIMEOUT_MS) {
        session.lastActive = now;
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session));
        return session.role;
      } else {
        clearSession();
      }
    }
  } catch {
    // ignore
  }
  return 'publik';
}

export function refreshActivity(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (raw) {
      const session: UserSession = JSON.parse(raw);
      session.lastActive = Date.now();
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session));
    }
  } catch {
    // ignore
  }
}

export function saveSession(role: UserRole): void {
  const session: UserSession = {
    role,
    lastActive: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  } catch {
    // ignore
  }
}

export async function updateAdminPassword(oldPass: string, newPass: string): Promise<boolean> {
  const hashes = await getStoredHashes();
  const oldTest = await hashPasswordWithSalt(oldPass, SALT_ADMIN);
  if (oldTest !== hashes.adminHash) {
    return false;
  }
  const newHash = await hashPasswordWithSalt(newPass, SALT_ADMIN);
  hashes.adminHash = newHash;
  cachedHashes = hashes;
  localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(hashes));
  return true;
}

export async function updateSuperadminPassword(oldPass: string, newPass: string): Promise<boolean> {
  const hashes = await getStoredHashes();
  const oldTest = await hashPasswordWithSalt(oldPass, SALT_SUPERADMIN);
  if (oldTest !== hashes.superadminHash) {
    return false;
  }
  const newHash = await hashPasswordWithSalt(newPass, SALT_SUPERADMIN);
  hashes.superadminHash = newHash;
  cachedHashes = hashes;
  localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(hashes));
  return true;
}

export async function forceSetPassword(targetRole: 'admin' | 'superadmin', newPass: string): Promise<boolean> {
  const hashes = await getStoredHashes();
  if (targetRole === 'admin') {
    hashes.adminHash = await hashPasswordWithSalt(newPass, SALT_ADMIN);
  } else {
    hashes.superadminHash = await hashPasswordWithSalt(newPass, SALT_SUPERADMIN);
  }
  cachedHashes = hashes;
  localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(hashes));
  return true;
}
