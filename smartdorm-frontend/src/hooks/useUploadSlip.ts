import { useState } from "react";
import Swal from "sweetalert2";
import { API_BASE } from "../config";

export function useUploadSlip(_roomId: string, roomNumber: string) {
  const [loading, setLoading] = useState(false);

  const uploadSlip = async (formData: FormData) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/booking/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("❌ การจองล้มเหลว");

      await Swal.fire("✅ สำเร็จ", `ห้อง ${roomNumber} ถูกจองแล้ว`, "success");
      return true;
    } catch (err) {
      Swal.fire("❌ เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { uploadSlip, loading };
}
