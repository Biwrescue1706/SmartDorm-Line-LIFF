// src/lib/liff.ts
import liff from "@line/liff";
import { VITE_LIFF_ID } from "../config";
import Swal from "sweetalert2";

let liffInitialized = false;

/* ============================================================
   ✅ เริ่มต้น LIFF และตรวจสอบสถานะล็อกอิน
   ============================================================ */
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

/* ============================================================
   ✅ ดึง Access Token สำหรับส่งไป Backend
   ============================================================ */
export function getAccessToken(): string | null {
  try {
    return liff.getAccessToken() || null;
  } catch {
    return null;
  }
}

/* ============================================================
   ✅ รีเฟรช Access Token อัตโนมัติ (ถ้า token หมดอายุ/หาย)
   ============================================================ */
export async function refreshLiffToken(): Promise<string | null> {
  try {
    if (!liffInitialized) {
      await liff.init({ liffId: VITE_LIFF_ID });
      liffInitialized = true;
    }

    // ถ้ายังไม่ได้ล็อกอิน → ให้ login ก่อน
    if (!liff.isLoggedIn()) {
      liff.login();
      return null;
    }

    let token = liff.getAccessToken();

    // ⚠️ ถ้า token หาย (บางครั้ง LIFF คืนค่า null)
    if (!token) {
      console.log("⚠️ AccessToken หาย พยายาม re-init LIFF...");
      await liff.init({ liffId: VITE_LIFF_ID });
      token = liff.getAccessToken();
    }

    // ❌ ถ้ายังไม่มีจริง ๆ → รีเซ็ต LIFF และ login ใหม่
    if (!token) {
      console.log("❌ Token หมดอายุหรือไม่ถูกต้อง → รีเซ็ต LIFF");
      await logoutLiff();
      liff.login();
      return null;
    }

    return token;
  } catch (err) {
    console.error("❌ refreshLiffToken error:", err);
    return null;
  }
}

/* ============================================================
   ✅ ดึงข้อมูลโปรไฟล์ผู้ใช้ (ชื่อ + userId)
   ============================================================ */
export async function getUserProfile() {
  try {
    return await liff.getProfile();
  } catch (err) {
    console.error("❌ ไม่สามารถดึงโปรไฟล์ได้:", err);
    return null;
  }
}

/* ============================================================
   🚪 ออกจากระบบ LIFF (เคลียร์ session ทั้งหมด)
   ============================================================ */
export async function logoutLiff() {
  try {
    if (liff.isLoggedIn()) {
      liff.logout();
    }

    localStorage.clear();
    sessionStorage.clear();

    if (liff.isInClient()) {
      // ✅ ปิดหน้าต่างอัตโนมัติถ้าอยู่ใน LINE
      liff.closeWindow();
    } else {
      Swal.fire({
        title: "ออกจากระบบสำเร็จ",
        text: "ขอบคุณที่ใช้บริการ SmartDorm!",
        icon: "success",
        confirmButtonText: "กลับหน้าหลัก",
      }).then(() => {
        window.location.href = "/";
      });
    }

    console.log("✅ ออกจากระบบ LIFF สำเร็จ");
  } catch (err) {
    console.error("❌ logoutLiff error:", err);
  }
}
