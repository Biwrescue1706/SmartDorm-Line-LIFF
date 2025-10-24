import liff from "@line/liff";
import { VITE_LIFF_ID } from "../config";

let liffInitialized = false;

/**
 * ✅ ตรวจสอบและเริ่ม LIFF ให้พร้อมใช้งาน
 * - เรียกครั้งเดียวตอนเปิดเว็บ
 * - ถ้ายังไม่ login จะ redirect ไปหน้า LINE Login
 */
export async function ensureLiffReady() {
  try {
    if (!liffInitialized) {
      await liff.init({ liffId: VITE_LIFF_ID });
      liffInitialized = true;
    }

    if (!liff.isLoggedIn()) {
      liff.login();
      return false;
    }

    return true;
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดขณะเริ่ม LIFF:", err);
    return false;
  }
}

/**
 * ✅ ดึง Access Token สำหรับส่งไปตรวจสอบกับ Backend
 */
export function getAccessToken(): string | null {
  try {
    return liff.getAccessToken() || null;
  } catch {
    return null;
  }
}

/**
 * ✅ ดึงข้อมูลโปรไฟล์ผู้ใช้ (ชื่อ, userId)
 */
export async function getUserProfile() {
  try {
    return await liff.getProfile();
  } catch (err) {
    console.error("❌ ไม่สามารถดึงโปรไฟล์ได้:", err);
    return null;
  }
}
