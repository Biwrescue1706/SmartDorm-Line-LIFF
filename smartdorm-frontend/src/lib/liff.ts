// src/lib/liff.ts
import liff from "@line/liff";

export async function initLIFF() {
  try {
    await liff.init({ liffId: "2008099518-23vqwKZY" });

    if (!liff.isLoggedIn()) {
      liff.login();
    } else {
      const profile = await liff.getProfile();

      // ✅ เก็บ userId ลง localStorage
      localStorage.setItem("userId", profile.userId);
      localStorage.setItem("displayName", profile.displayName);

      console.log("✅ Logged in as:", profile.displayName, profile.userId);
    }
  } catch (err) {
    console.error("❌ LIFF init error:", err);
  }
}
