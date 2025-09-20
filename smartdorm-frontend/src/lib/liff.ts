import liff from "@line/liff";

export async function initLIFF(liffId: string) {
  try {
    await liff.init({ liffId });

    if (!liff.isLoggedIn()) {
      liff.login();
    } else {
      const profile = await liff.getProfile();

      // เก็บ userId + displayName ลง localStorage
      localStorage.setItem("userId", profile.userId);
      localStorage.setItem("displayName", profile.displayName);

      console.log("✅ Logged in as:", profile.displayName);
    }
  } catch (err) {
    console.error("❌ LIFF init error:", err);
  }
}
