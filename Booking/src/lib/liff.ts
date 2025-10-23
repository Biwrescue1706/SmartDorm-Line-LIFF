// src/lib/liff.ts
import liff from "@line/liff";

/** 🔐 เริ่มต้นระบบ LIFF */
export async function initLIFF() {
  try {
    const liffId = import.meta.env.VITE_LIFF_ID || "2008099518-VNxlErdq";
    await liff.init({ liffId });

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    const accessToken = liff.getAccessToken();
    if (!accessToken) throw new Error("ไม่พบ accessToken จาก LINE");

    // ✅ เก็บ token ชั่วคราว (จะหายเมื่อปิดแท็บ)
    sessionStorage.setItem("line_access_token", accessToken);

    console.log("✅ LIFF initialized and token stored");
  } catch (err) {
    console.error("❌ LIFF init error:", err);
  }
}

/** 📦 ดึง token เพื่อใช้แนบใน API */
export function getLineAccessToken(): string | null {
  return sessionStorage.getItem("line_access_token");
}

/** 🚪 ออกจากระบบ */
export function logoutLIFF() {
  sessionStorage.removeItem("line_access_token");
  if (liff.isLoggedIn()) {
    liff.logout();
    window.location.reload();
  }
}
