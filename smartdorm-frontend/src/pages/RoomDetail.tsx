// src/pages/RoomDetail.tsx
import { useNavigate } from "react-router-dom";
import { useRoomDetail } from "../hooks/useRoomDetail";
import RoomDetailTable from "../components/RoomDetail/RoomDetailTable";
import { useUploadSlip } from "../hooks/useUploadSlip";
import UploadSlipForm from "../components/UploadSlip/UploadSlipForm";

export default function RoomDetail() {
  const nav = useNavigate();
  const { room, loading, error } = useRoomDetail();

  // ✅ state การโหลด / error
  if (loading) return <p className="text-center py-6">⏳ กำลังโหลดข้อมูล...</p>;
  if (error) return <p className="text-center text-red-500 py-6">{error}</p>;
  if (!room) return <p className="text-center text-gray-500 py-6">❌ ไม่พบข้อมูลห้อง</p>;

  // ✅ hook สำหรับอัปโหลด slip
  const { uploadSlip, loading: bookingLoading } = useUploadSlip(
    room.roomId,
    room.number
  );

  const handleSubmit = async (formData: FormData) => {
    const success = await uploadSlip(formData);
    if (success) nav("/"); // กลับหน้าแรกถ้าสำเร็จ
  };

  return (
    <div className="max-w-lg mx-auto py-6 px-4">
      <h2 className="text-xl font-semibold text-center mb-4">
        รายละเอียดห้องพัก
      </h2>

      {/* ✅ ตารางรายละเอียดห้อง */}
      <div className="border rounded-lg shadow p-4 mb-6 bg-white">
        <RoomDetailTable room={room} />
      </div>

      {/* ✅ ฟอร์มอัปโหลด slip เพื่อจอง */}
      <div className="border rounded-lg shadow p-4 bg-white">
        <h3 className="text-lg font-medium mb-3 text-center">จองห้องพัก</h3>
        <UploadSlipForm
          onSubmit={handleSubmit}
          loading={bookingLoading}
          nav={nav}
          roomId={room.roomId}
        />
      </div>
    </div>
  );
}
