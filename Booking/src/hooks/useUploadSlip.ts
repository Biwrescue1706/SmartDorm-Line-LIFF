// src/hooks/useUploadSlip.ts
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { API_BASE } from "../config";

/**
 * Hook สำหรับอัปโหลดสลิปการจองห้อง
 * @param _roomId ID ของห้อง
 * @param roomNumber หมายเลขห้อง (ไว้แสดงในข้อความแจ้งเตือน)
 */
export function useUploadSlip(_roomId: string, roomNumber: string) {
  const [loading, setLoading] = useState(false);

  // ✅ ตรวจสอบว่า component mount อยู่จริง ๆ ก่อน update UI
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ฟังก์ชันส่งข้อมูลจองห้อง
  const submitSlip = async (formData: FormData) => {
    try {
      setLoading(true);

      // 🔄 แสดงสถานะกำลังโหลด (เช็คว่า mount อยู่ก่อน)
      if (isMounted.current) {
        Swal.fire({
          title: "⏳ กำลังส่งข้อมูล...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
      }

      // 📤 ส่งไป backend
      const res = await fetch(`${API_BASE}/booking/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || errData.error || "❌ การจองล้มเหลว");
      }

      const data = await res.json();
      console.log("📤 ส่งข้อมูล:", data);

      // ✅ แจ้งผลลัพธ์สำเร็จ
      if (isMounted.current) {
        await Swal.fire({
          icon: "success",
          title: "✅ ยืนยันการจองสำเร็จ",
          text: `ห้อง ${roomNumber} ถูกจองเรียบร้อยแล้ว`,
          confirmButtonText: "ตกลง",
        });
      }

      return true;
    } catch (err: any) {
      console.error("❌ Error:", err);
      if (isMounted.current) {
        Swal.fire(
          "❌ ข้อผิดพลาด",
          err.message || "เกิดข้อผิดพลาดในการจอง",
          "error"
        );
      }
      return false;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return { loading, submitSlip };
}
