// src/hooks/useUploadSlip.ts
import { useState } from "react";
import Swal from "sweetalert2";
import { API_BASE } from "../config";

export function useUploadSlip(room: { roomId: string; number: string }, nav: any) {
  const [loading, setLoading] = useState(false);

  const uploadSlip = async (
    cname: string,
    csurname: string,
    cphone: string,
    cmumId: string,
    checkin: string,
    slip: File | null
  ) => {
    if (!slip) {
      Swal.fire("❌ ข้อผิดพลาด", "กรุณาแนบสลิป", "error");
      return false;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("❌ ไม่พบ userId");

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("roomId", room.roomId);
      formData.append("cname", cname);
      formData.append("csurname", csurname);
      formData.append("cphone", cphone);
      formData.append("mumId", cmumId);
      formData.append("checkin", checkin);
      formData.append("slip", slip);

      const res = await fetch(`${API_BASE}/booking/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error();

      await Swal.fire("✅ สำเร็จ", `ห้อง ${room.number} ถูกจองแล้ว`, "success");
      nav("/");
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
