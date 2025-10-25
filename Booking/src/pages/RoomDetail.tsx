// src/pages/RoomDetail.tsx
import { useNavigate } from "react-router-dom";
import { useRoomDetail } from "../hooks/useRoomDetail";
import RoomDetailCard from "../components/RoomDetail/RoomDetailCard";

export default function RoomDetail() {
  const { room, roomId, loading, error } = useRoomDetail();
  const nav = useNavigate();
  if (loading)
    return (
      <div className="container p-4 text-muted text-center">
        ⏳ กำลังโหลดข้อมูลห้อง...
      </div>
    );

  if (error)
    return (
      <div className="container p-4 text-danger text-center">
        ❌ {error} (ID: {roomId})
      </div>
    );

  if (!room)
    return (
      <div className="container p-4 text-center">
        ❌ ไม่พบข้อมูลห้อง {roomId}
        <div>
          <button className="btn btn-primary mt-3" onClick={() => nav("/")}>
            กลับหน้าแรก
          </button>
        </div>
      </div>
    );

  return (
    <div className="container my-4">
      <RoomDetailCard room={room} />
    </div>
  );
}
