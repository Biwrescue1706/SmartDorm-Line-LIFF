import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import RoomGrid from "../components/Bookings/RoomGrid";
import { useRooms } from "../hooks/useRooms";
import type { Room } from "../types/Room";

export default function Bookings() {
  const { rooms, loading } = useRooms(true);
  const nav = useNavigate();
  const [floor, setFloor] = useState(1);

  // ✅ กรองห้องตามชั้นแบบ memoized (ป้องกัน re-render ซ้ำ)
  const roomsByFloor = useMemo(() => {
    const start = floor * 100 + 1;
    const end = floor * 100 + 100;
    return rooms.filter((r) => {
      const num = parseInt(r.number, 10);
      return num >= start && num <= end;
    });
  }, [rooms, floor]);

  const handleSelect = (room: Room) => {
    if (room.status !== 0) return; // ป้องกันจองห้องเต็ม
    nav(`/bookings/${room.roomId}`, { state: room });
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h2 className="text-center mb-3 fw-bold">เลือกห้อง</h2>

          {/* 🔹 ปุ่มเลือกชั้น */}
          <div className="d-flex justify-content-center mb-3 flex-wrap gap-2">
            {[...Array(10)].map((_, i) => {
              const f = i + 1;
              return (
                <button
                  key={f}
                  className={`btn btn-outline-primary ${
                    floor === f ? "active" : ""
                  }`}
                  onClick={() => setFloor(f)}
                >
                  ชั้น {f}
                </button>
              );
            })}
          </div>

          {/* 🔹 แสดงผลตามสถานะ */}
          {loading ? (
            <div className="text-center text-muted py-4">
              ⏳ กำลังโหลดข้อมูลห้อง...
            </div>
          ) : roomsByFloor.length === 0 ? (
            <div className="text-center text-muted py-4">
              ❌ ไม่มีห้องในชั้น {floor} ให้แสดง
            </div>
          ) : (
            <RoomGrid rooms={roomsByFloor} onSelect={handleSelect} />
          )}
        </div>
      </div>
    </div>
  );
}
