// src/pages/UploadSlip.tsx
import { useLocation, useNavigate } from "react-router-dom";
import type { Room } from "../types/Room";
import { useUploadSlip } from "../hooks/useUploadSlip";
import UploadSlipForm from "../components/UploadSlip/UploadSlipForm";
import Swal from "sweetalert2";
import { useEffect } from "react";

export default function UploadSlip() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room;

  // ✅ hook upload
  const { uploadSlip, loading } = useUploadSlip(room.roomId, room.number);

  // ✅ เช็ค login ก่อนเข้า
  useEffect(() => {
    const userId = localStorage.getItem("liff_userId");
    if (!userId) {
      Swal.fire("⚠️ กรุณาเข้าสู่ระบบผ่าน LINE", "", "warning").then(() => {
        nav("/");
      });
    }
  }, [nav]);

  // ✅ handle submit
  const handleSubmit = async (formData: FormData) => {
    const success = await uploadSlip(formData);
    if (success) {
      nav("/"); // กลับหน้าแรกถ้าสำเร็จ
    }
  };

  return (
    <div className="uploadslip-container max-w-md mx-auto py-6">
      <h2 className="text-xl font-semibold text-center mb-4">
        อัปโหลดสลิปชำระเงิน
      </h2>

      <div className="mb-3 text-center">
        <h3 className="text-lg">ห้อง {room.number}</h3>
      </div>

      <UploadSlipForm
        onSubmit={handleSubmit}
        loading={loading}
        nav={nav}
        roomId={room.roomId}
      />
    </div>
  );
}
