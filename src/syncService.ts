/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

export const APPS_SCRIPT_CODE_TEMPLATE = `/**
 * GOOGLE APPS SCRIPT - DIGITAL STORYTELLING GALLERY
 * SMP NEGERI 1 BENGKALIS
 * 
 * Pengaturan Utama:
 */
const CONFIG = {
  TOKEN: "GANTI_DENGAN_TOKEN_AMAN",
  SPREADSHEET_ID: "GANTI_DENGAN_ID_SPREADSHEET",
  DRIVE_FOLDER_ID: "GANTI_DENGAN_ID_FOLDER_DRIVE",
  SHEET_KARYA: "KaryaSiswa",
  SHEET_AUTH: "Autentikasi",
  SHEET_CMS: "PengaturanCMS",
  SHEET_LOGS: "LogAktivitas"
};

/**
 * Handle HTTP GET Requests
 */
function doGet(e) {
  try {
    const action = e.parameter.action || "ping";
    
    if (action === "ping") {
      return jsonResponse({ status: "success", message: "pong" });
    }
    
    if (action === "getStories") {
      const token = e.parameter.token;
      const isAdmin = (token === CONFIG.TOKEN);
      const stories = fetchStoriesFromSheet(isAdmin);
      return jsonResponse({ status: "success", data: stories });
    }
    
    if (action === "getImage") {
      const fileId = e.parameter.fileId;
      if (!fileId) return jsonResponse({ status: "error", message: "fileId required" });
      const file = DriveApp.getFileById(fileId);
      const bytes = file.getBlob().getBytes();
      const base64 = Utilities.base64Encode(bytes);
      const mime = file.getMimeType();
      return jsonResponse({ status: "success", base64: "data:" + mime + ";base64," + base64 });
    }
    
    if (action === "getCMS") {
      const cms = fetchCMSFromSheet();
      return jsonResponse({ status: "success", data: cms });
    }
    
    return jsonResponse({ status: "error", message: "Unknown action" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Handle HTTP POST Requests
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const token = postData.token;
    
    if (action === "verifyLogin") {
      const typedHash = postData.passwordHash;
      const role = verifyPasswordAgainstSheet(typedHash);
      if (role) {
        return jsonResponse({ status: "success", role: role });
      } else {
        return jsonResponse({ status: "error", message: "Unauthorized" });
      }
    }
    
    if (token !== CONFIG.TOKEN) {
      return jsonResponse({ status: "error", message: "Invalid token" });
    }
    
    if (action === "updateStoryStatus") {
      const { id, status, catatanGuru } = postData;
      updateStoryStatusInSheet(id, status, catatanGuru);
      return jsonResponse({ status: "success" });
    }
    
    if (action === "updateStory") {
      updateStoryInSheet(postData.story);
      return jsonResponse({ status: "success" });
    }
    
    if (action === "saveCMS") {
      saveCMSToSheet(postData.tab, postData.data);
      return jsonResponse({ status: "success" });
    }
    
    if (action === "uploadImage") {
      const { fileName, base64Data, mimeType } = postData;
      const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
      const decoded = Utilities.base64Decode(base64Data);
      const blob = Utilities.newBlob(decoded, mimeType, fileName);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return jsonResponse({ status: "success", fileId: file.getId(), url: file.getUrl() });
    }
    
    if (action === "deleteFile") {
      const fileId = postData.fileId;
      DriveApp.getFileById(fileId).setTrashed(true);
      return jsonResponse({ status: "success" });
    }
    
    if (action === "changePassword") {
      const { targetRole, newHash } = postData;
      updatePasswordInSheet(targetRole, newHash);
      return jsonResponse({ status: "success" });
    }
    
    if (action === "addLog") {
      appendLogToSheet(postData.peran, postData.tindakan);
      return jsonResponse({ status: "success" });
    }
    
    return jsonResponse({ status: "error", message: "Unknown action" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function fetchStoriesFromSheet(isAdmin) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEET_KARYA);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  
  const list = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const status = row[9] || "Menunggu";
    
    if (!isAdmin && status !== "Disetujui") {
      continue;
    }
    
    if (!isAdmin) {
      list.push({
        id: row[8],
        namaTampil: row[10],
        kelas: row[2],
        judul: row[3],
        deskripsi: row[4],
        urlYouTube: row[5],
        videoId: extractYouTubeId(row[5]),
        pesanMoral: row[6],
        status: "Disetujui"
      });
    } else {
      list.push({
        id: row[8] || ("ST-" + ("0000" + i).slice(-4)),
        timestamp: row[0],
        nama: row[1],
        kelas: row[2],
        judul: row[3],
        deskripsi: row[4],
        urlYouTube: row[5],
        videoId: extractYouTubeId(row[5]),
        pesanMoral: row[6],
        izinPublikasi: row[7] || "Tidak",
        status: status,
        namaTampil: row[10] || generateDisplayName(row[1]),
        catatanGuru: row[11] || "",
        hasilCek: row[12] || "Tersedia"
      });
    }
  }
  return list;
}

function generateDisplayName(fullName) {
  if (!fullName) return "";
  const parts = String(fullName).trim().split(/\\s+/);
  if (parts.length <= 1) return parts[0];
  return parts[0] + " " + parts[parts.length - 1].charAt(0).toUpperCase() + ".";
}

function extractYouTubeId(url) {
  if (!url) return "";
  const m = String(url).match(/(?:youtube\\.com\\/(?:watch\\?v=|embed\\/)|youtu\\.be\\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : "";
}

function verifyPasswordAgainstSheet(hash) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEET_AUTH);
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === hash) {
      return data[i][0];
    }
  }
  return null;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export async function testAppsScriptConnection(url: string, token: string): Promise<boolean> {
  if (!url) return false;
  try {
    const testUrl = `${url.trim()}?action=ping&token=${encodeURIComponent(token.trim())}`;
    const res = await fetch(testUrl, { method: 'GET', mode: 'cors' });
    if (res.ok) {
      const data = await res.json();
      return data.status === 'success';
    }
  } catch {
    // fallback
  }
  return false;
}
