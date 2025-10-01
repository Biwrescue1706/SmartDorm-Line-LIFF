import { useLocation, useNavigate } from "react-router-dom";
import UploadSlipForm from "../components/UploadSlip/UploadSlipForm";
import type { Room } from "../types/Room";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function UploadSlip() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room;

  // ✅ ตรวจสอบ login ก่อนเข้า UploadSlip
  useEffect(() => {
    const userId = localStorage.getItem("liff_userId");
    if (!userId) {
      Swal.fire("⚠️ กรุณาเข้าสู่ระบบผ่าน LINE", "", "warning").then(() => {
        nav("/"); // redirect กลับหน้าแรก
      });
    }
  }, [nav]);

  // ✅ ป้องกันไม่ให้ render form ถ้าไม่มีข้อมูลห้อง
  if (!room) {
    return (
      <div className="text-center py-10">
        <h2 className="text-lg font-semibold text-red-600">
          ❌ ไม่พบข้อมูลห้อง
        </h2>
        <button
          className="btn btn-primary mt-4"
          onClick={() => nav("/")}
        >
          กลับหน้าแรก
        </button>
      </div>
    );
  }

  return (
    <div className="uploadslip-container py-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        อัปโหลดสลิปชำระเงิน
      </h1>

      <UploadSlipForm
        room={room}
        onSuccess={() => {
          Swal.fire("✅ สำเร็จ", "ทำการจองเรียบร้อยแล้ว", "success").then(
            () => nav("/")
          );
        }}
      />
    </div>
  );
}
