// src/hooks/useUploadSlip.ts
import { useState } from "react";
import { API_BASE } from "../config";
import { getLineAccessToken } from "../lib/liff";
import Swal from "sweetalert2";
import { CreateBooking } from "../apis/endpoint.api";

export const useUploadSlip = () => {
  const [loading, setLoading] = useState(false);

  async function submitSlip(formData: FormData) {
    try {
      setLoading(true);

      const token = getLineAccessToken();
      if (!token) throw new Error("ยังไม่ได้ล็อกอินผ่าน LINE");

      const res = await fetch(`${API_BASE}${CreateBooking}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "อัปโหลดไม่สำเร็จ");

      return true;
    } catch (err: any) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "อัปโหลดสลิปไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { submitSlip, loading };
};
