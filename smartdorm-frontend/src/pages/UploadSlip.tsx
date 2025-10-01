import { useLocation, useNavigate } from "react-router-dom";
import UploadSlipForm from "../components/UploadSlip/UploadSlipForm"; // ✅ ใช้ path ที่ถูกต้อง
import type { Room } from "../types/Room";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function UploadSlip() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room;

  // ✅ ตรวจสอบ login ก่อน
  useEffect(() => {
    const userId = localStorage.getItem("liff_userId");
    if (!userId) {
      Swal.fire("⚠️ กรุณาเข้าสู่ระบบผ่าน LINE", "", "warning").then(() => {
        nav("/");
      });
    }
  }, [nav]);

  return (
    <div className="uploadslip-container py-4">
      <UploadSlipForm room={room} onSuccess={() => nav("/")} />
    </div>
  );
}
