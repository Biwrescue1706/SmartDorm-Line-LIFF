// src/lib/liff.ts
import liff from "@line/liff";

/**
 * 🔹 เริ่มต้น LIFF
 */
export async function initLIFF() {
  try {
    await liff.init({ liffId: "2008099518-23vqwKZY" });

    if (!liff.isLoggedIn()) {
      // 👉 redirect ไปหน้า login ของ LINE
      liff.login();
      return;
    }

    // 👉 ถ้า login แล้ว ดึง profile
    const profile = await liff.getProfile();

    // ✅ เก็บ userId/displayName ใน localStorage
    localStorage.setItem("liff_userId", profile.userId);
    localStorage.setItem("liff_displayName", profile.displayName);

    console.log("✅ Logged in as:", profile.displayName);
    console.log("✅ Logged in userId:", profile.userId);
  } catch (err) {
    console.error("❌ LIFF init error:", err);
  }
}

/**
 * 🔹 ดึงข้อมูล user ที่ login ผ่าน LIFF
 */
export function getLiffUser() {
  const userId = localStorage.getItem("liff_userId");
  const displayName = localStorage.getItem("liff_displayName");
  return { userId, displayName };
}

/**
 * 🔹 Logout ออกจาก LIFF + ลบข้อมูลใน localStorage
 */
export function logoutLIFF() {
  liff.logout();
  localStorage.removeItem("liff_userId");
  localStorage.removeItem("liff_displayName");
  window.location.reload();
}
