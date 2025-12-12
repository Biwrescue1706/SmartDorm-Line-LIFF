import liff from "@line/liff";
import Swal from "sweetalert2";
import { VITE_LIFF_ID } from "../config";

let initialized = false;

/* ===============================
   1️⃣ เตรียม LIFF
================================ */
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
    console.error("LIFF init error", err);
    return false;
  }
}

/* ===============================
   2️⃣ token ที่ปลอดภัย
================================ */
export async function getSafeAccessToken(): Promise<string | null> {
  try {
    const ready = await ensureLiffReady();
    if (!ready) return null;

    const token = liff.getAccessToken();
    if (!token) return null;

    return token;
  } catch (err) {
    console.error("getSafeAccessToken error", err);
    return null;
  }
}

/* ===============================
   3️⃣ logout (เรียกเฉพาะ user กด)
================================ */
export async function logoutLiff(showAlert = true) {
  try {
    if (liff.isLoggedIn()) liff.logout();
    localStorage.clear();
    sessionStorage.clear();

    if (showAlert) {
      await Swal.fire({
        icon: "success",
        title: "ออกจากระบบแล้ว",
        text: "ขอบคุณที่ใช้บริการ SmartDorm",
      });
    }

    if (liff.isInClient()) {
      liff.closeWindow();
    } else {
      window.location.href = "/";
    }
  } catch (err) {
    console.error("logoutLiff error", err);
  }
}