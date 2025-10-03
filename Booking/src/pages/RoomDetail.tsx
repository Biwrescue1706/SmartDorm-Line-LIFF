// src/pages/RoomDetail.tsx
import { useRoomDetail } from "../hooks/useRoomDetail";
import RoomDetailCard from "../components/RoomDetail/RoomDetailCard";

export default function RoomDetail() {
  const { room, roomId, loading, error } = useRoomDetail();

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
