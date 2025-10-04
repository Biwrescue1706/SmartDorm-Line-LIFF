// src/pages/RoomDetail.tsx
import { useRoomDetail } from "../hooks/useRoomDetail";
import RoomDetailCard from "../components/RoomDetail/RoomDetailCard";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function RoomDetail() {
  const { room, roomId, loading, error } = useRoomDetail();

  // ✅ ตรวจสอบ login ก่อนเข้า UploadSlip
  useEffect(() => {
    const userId = localStorage.getItem("liff_userId");
    if (!userId) {
      Swal.fire("⚠️ กรุณาเข้าสู่ระบบผ่าน LINE", "", "warning").then(() => {
        nav("/"); // redirect กลับหน้าแรก
      });
    }
  }, [nav]);

  if (loading) {
    return (
      <div className="container p-4 text-muted">⏳ กำลังโหลดข้อมูลห้อง...</div>
    );
  }

  if (error) {
    return (
      <div className="container p-4 text-danger">
        ❌ {error} (ID: {roomId})
      </div>
    );
  }

  if (!room) {
    return <div className="container p-4">❌ ไม่พบข้อมูลห้อง {roomId}</div>;
  }

  return (
    <div className="container my-4">
      <RoomDetailCard room={room} />
    </div>
  );
}
function nav(_arg0: string) {
  throw new Error("Function not implemented.");
}

