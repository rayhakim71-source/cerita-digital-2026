/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

export const SALT_ADMIN = 'dsg_bengkalis_admin_salt_87a';
export const SALT_SUPERADMIN = 'dsg_bengkalis_superadmin_salt_91b';

/**
 * Rules for public display name:
 * First name + initial of first letter of last word + dot.
 * Single word name is displayed as-is.
 * E.g. "Raka Putra" -> "Raka P.", "Muhammad Rizky Pratama" -> "Muhammad P.", "Aulia" -> "Aulia"
 */
export function formatDisplayName(fullName: string): string {
  if (!fullName) return '';
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return parts[0] || '';
  }
  const firstName = parts[0];
  const lastPart = parts[parts.length - 1];
  const initial = lastPart.charAt(0).toUpperCase();
  return `${firstName} ${initial}.`;
}

/**
 * Extracts YouTube Video ID from various YouTube URL formats
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

/**
 * Hash password with salt using SHA-256 Web Crypto
 */
export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
