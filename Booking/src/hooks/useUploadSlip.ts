// src/hooks/useUploadSlip.ts
import { useState } from "react";
import { API_BASE } from "../config";
import { getLineAccessToken } from "../lib/liff";

export const useUploadSlip = () => {
  const [loading, setLoading] = useState(false);

  async function submitSlip(formData: FormData) {
    try {
      setLoading(true);

      const token = getLineAccessToken();
      if (!token) throw new Error("ยังไม่ได้ล็อกอินผ่าน LINE");

      console.log("📦 Uploading booking form:", [...formData.entries()]);

      const res = await fetch(`${API_BASE}/bookings/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ แนบ token
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "อัปโหลดไม่สำเร็จ");

      console.log("✅ Upload success:", data);
      return true;
    } catch (err: any) {
      console.error("❌ SubmitSlip error:", err.message);
      alert("อัปโหลดสลิปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { submitSlip, loading };
};
