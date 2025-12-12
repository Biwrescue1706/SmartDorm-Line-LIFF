// src/lib/liff.ts
import liff from "@line/liff";
import Swal from "sweetalert2";
import { VITE_LIFF_ID } from "../config";

let initialized = false;

/* ============================================================
   1️⃣ เตรียม LIFF ให้พร้อม (ต้องเรียกก่อนใช้งานทุกอย่าง)
============================================================ */
export async function ensureLiffReady(): Promise<boolean> {
  try {
    if (!initialized) {
      await liff.init({
        liffId: VITE_LIFF_ID,
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
    console.error("❌ ensureLiffReady error:", err);
    return false;
  }
}

/* ============================================================
   2️⃣ ดึง accessToken (ตัวเดียวที่ backend ต้องการ)
============================================================ */
export function getAccessToken(): string | null {
  try {
    return liff.getAccessToken() || null;
  } catch (err) {
    console.error("❌ getAccessToken error:", err);
    return null;
  }
}

/* ============================================================
   3️⃣ ดึง token แบบปลอดภัย (หาย → refresh → login ใหม่)
============================================================ */
export async function getSafeAccessToken(): Promise<string | null> {
  try {
    const ready = await ensureLiffReady();
    if (!ready) return null;

    let token = liff.getAccessToken();

    if (!token) {
      console.warn("⚠️ accessToken หาย → re-init LIFF");
      await liff.init({
        liffId: VITE_LIFF_ID,
        withLoginOnExternalBrowser: true,
      });
      token = liff.getAccessToken();
    }

    if (!token) {
      console.error("❌ token หมดอายุ → login ใหม่");
      await logoutLiff(false);
      liff.login();
      return null;
    }

    return token;
  } catch (err) {
    console.error("❌ getSafeAccessToken error:", err);
    return null;
  }
}

/* ============================================================
   4️⃣ ดึงข้อมูลผู้ใช้ (ใช้แสดงชื่อ ไม่จำเป็นต่อ backend)
============================================================ */
export async function getUserProfile() {
  try {
    await ensureLiffReady();
    return await liff.getProfile();
  } catch (err) {
    console.error("❌ getUserProfile error:", err);
    return null;
  }
}

/* ============================================================
   5️⃣ ออกจากระบบ (Return Room ใช้บ่อย)
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
      await Swal.fire({
        icon: "success",
        title: "ออกจากระบบแล้ว",
        text: "ขอบคุณที่ใช้บริการ SmartDorm",
        confirmButtonText: "ตกลง",
      });
    }

    window.location.href = "/";
  } catch (err) {
    console.error("❌ logoutLiff error:", err);
  }
}