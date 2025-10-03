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

      // 🔄 แสดงสถานะกำลังโหลด
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

      // ✅ แจ้งผลลัพธ์สำเร็จ (Toast)
      if (isMounted.current) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `✅ ห้อง ${roomNumber} ถูกจองเรียบร้อยแล้ว`,
          showConfirmButton: false,
          timer: 2500,
        });
      }

      return true;
    } catch (err: any) {
      console.error("❌ Error:", err);
      if (isMounted.current) {
        Swal.fire({
          icon: "error",
          title: "❌ ข้อผิดพลาด",
          text: err.message || "เกิดข้อผิดพลาดในการจอง",
        });
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
