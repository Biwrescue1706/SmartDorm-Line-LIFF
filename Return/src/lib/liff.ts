// src/lib/liff.ts
import liff from "@line/liff";
import Swal from "sweetalert2";

// ✅ ใช้ env ตรง ๆ (ถูกต้องกับ Vite)
const LIFF_ID = import.meta.env.VITE_LIFF_ID as string;

let initialized = false;

/* ============================================================
   1️⃣ เตรียม LIFF ให้พร้อม
============================================================ */
export async function ensureLiffReady(): Promise<boolean> {
  try {
    if (!initialized) {
      await liff.init({
        liffId: LIFF_ID,
        withLoginOnExternalBrowser: true,
      });
      initialized = true;
    }

    if (!liff.isLoggedIn()) {
      liff.login();
      return false;
    }

    return true;
  } catch (err) {
    console.error("ensureLiffReady error:", err);
    return false;
  }
}

/* ============================================================
   2️⃣ ดึง accessToken ปกติ
============================================================ */
export function getAccessToken(): string | null {
  try {
    return liff.getAccessToken() || null;
  } catch {
    return null;
  }
}

/* ============================================================
   3️⃣ ดึง token แบบปลอดภัย (ตัวหลัก)
============================================================ */
export async function getSafeAccessToken(): Promise<string | null> {
  try {
    const ready = await ensureLiffReady();
    if (!ready) return null;

    let token = liff.getAccessToken();

    if (!token) {
      await liff.init({
        liffId: LIFF_ID,
        withLoginOnExternalBrowser: true,
      });
      token = liff.getAccessToken();
    }

    if (!token) {
      await logoutLiff(false);
      liff.login();
      return null;
    }

    return token;
  } catch {
    return null;
  }
}

/* ============================================================
   ✅ alias ให้ตรงกับที่หน้าอื่นเรียก
   (แก้ error TS2305 ตรงนี้)
============================================================ */
export const refreshLiffToken = getSafeAccessToken;

/* ============================================================
   4️⃣ ดึงข้อมูลผู้ใช้ (optional)
============================================================ */
export async function getUserProfile() {
  try {
    await ensureLiffReady();
    return await liff.getProfile();
  } catch {
    return null;
  }
}

/* ============================================================
   5️⃣ logout
============================================================ */
export async function logoutLiff(showAlert = true) {
  try {
    if (liff.isLoggedIn()) liff.logout();
    localStorage.clear();
    sessionStorage.clear();

    if (liff.isInClient()) {
      liff.closeWindow();
      return;
    }

    if (showAlert) {
      await Swal.fire(
        "ออกจากระบบแล้ว",
        "กรุณาเข้าสู่ระบบใหม่",
        "warning"
      );
    }

    window.location.href = "/";
  } catch (err) {
    console.error("logoutLiff error:", err);
  }
}