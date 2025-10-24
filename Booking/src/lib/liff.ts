import liff from "@line/liff";
import { VITE_LIFF_ID } from "../config";

// ตัวแปรสถานะภายใน module (ป้องกัน init ซ้ำ)
let liffInitialized = false;

/**
 * ✅ เริ่มต้น LIFF
 * - เรียก init ครั้งเดียวก่อนใช้งาน
 * - ถ้ายังไม่ login ให้ redirect ไป LINE Login
 */
export async function initLiff() {
  try {
    if (!liffInitialized) {
      await liff.init({ liffId: VITE_LIFF_ID });
      liffInitialized = true; // ✅ mark ว่า init แล้ว
    }

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }
  } catch (err) {
    console.error("❌ ไม่สามารถเริ่ม LIFF ได้:", err);
    throw err;
  }
}

/**
 * ✅ ดึง accessToken จาก LINE (ใช้สำหรับ backend verify)
 */
export function getAccessToken(): string | null {
  try {
    return liff.getAccessToken() || null;
  } catch {
    return null;
  }
}

/**
 * ✅ ดึงข้อมูลโปรไฟล์ผู้ใช้ (เช่น userId, displayName)
 */
export async function getUserProfile() {
  try {
    return await liff.getProfile();
  } catch (err) {
    console.error("ไม่สามารถดึงโปรไฟล์ได้:", err);
    return null;
  }
}
