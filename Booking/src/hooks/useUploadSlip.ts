import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE } from "../config";
import { CreateBooking } from "../apis/endpoint.api";

export const useUploadSlip = () => {
  const [loading, setLoading] = useState(false);

  /**
   * 📤 ส่งข้อมูลสลิปและรายละเอียดการจองไปยัง backend
   * - ต้องแนบ accessToken ของ LINE (มาจาก LIFF)
   * - ต้องมี roomId, checkin, slip
   */
  async function submitSlip(formData: FormData) {
    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE}${CreateBooking}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      //  ถ้าสำเร็จ
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "อัปโหลดสลิปสำเร็จ",
        showConfirmButton: false,
        timer: 2000,
      });

      return res.data;
    } catch (err: any) {
      // ถ้าผิดพลาด
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "อัปโหลดสลิปไม่สำเร็จ",
        text:
          err.response?.data?.error ||
          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง",
        showConfirmButton: false,
        timer: 2500,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { submitSlip, loading };
};
