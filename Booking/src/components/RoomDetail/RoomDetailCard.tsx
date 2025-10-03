// src/components/RoomDetail/RoomDetailCard.tsx
import type { Room } from "../../types/Room";
import RoomDetailTable from "./RoomDetailTable";
import { useNavigate } from "react-router-dom";

interface Props {
  room: Room;
}

export default function RoomDetailCard({ room }: Props) {
  const nav = useNavigate();
  const total = room.rent + room.deposit + room.bookingFee;

  const handleConfirm = () => {
    nav("/payment", { state: room });
  };

  return (
    <div className="card bg-light shadow-sm p-3">
      <h4 className="mb-3 text-center fw-bold">รายละเอียดห้องพัก</h4>

      {/* ตารางรายละเอียดห้อง */}
      <RoomDetailTable room={room} />

      {/* ปุ่ม */}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-danger px-4 fw-semibold"
          onClick={() => nav(-1)}
        >
          ❌ ยกเลิก
        </button>
        <button
          className="btn btn-outline-success px-4 fw-semibold"
          onClick={handleConfirm}
        >
          ✅ ยืนยัน
        </button>
      </div>
    </div>
  );
}
