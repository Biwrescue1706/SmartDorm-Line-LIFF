// src/pages/Bookings.tsx
import { useNavigate } from "react-router-dom";
import RoomGrid from "../components/Bookings/RoomGrid";
import { useRooms } from "../hooks/useRooms";
import type { Room } from "../types/Room";
import { useState } from "react";

export default function Bookings() {
  const { rooms, loading } = useRooms(true);
  const nav = useNavigate();

  const [floor, setFloor] = useState(1); // ชั้นที่เลือก เริ่มต้นชั้น 1

  const handleSelect = (room: Room) => {
    nav(`/bookings/${room.roomId}`, { state: room });
  };

  //  ฟังก์ชันกรองห้องตามชั้น
  const getRoomsByFloor = (floor: number) => {
    const start = floor * 100 + 1; // เช่น ชั้น 1 → 101
    const end = floor * 100 + 100; // เช่น ชั้น 1 → 120
    return rooms.filter((r) => {
      const num = parseInt(r.number, 10);
      return num >= start && num <= end;
    });
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="text-center mb-3">
            <strong>เลือกห้อง</strong>
          </h2>

          {/*  ปุ่มเลือกชั้น */}
          <div className="d-flex justify-content-center mb-3 flex-wrap">
            <div className="btn-group">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((f) => (
                <button
                  key={f}
                  className={`btn btn-outline-primary ${
                    floor === f ? "active" : ""
                  }`}
                  onClick={() => setFloor(f)}
                >
                  ชั้น {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center text-muted">⏳ กำลังโหลด...</div>
          ) : getRoomsByFloor(floor).length === 0 ? (
            <div className="text-center text-muted">
              ❌ ไม่มีห้องในชั้น {floor} ให้แสดง
            </div>
          ) : (
            <RoomGrid rooms={getRoomsByFloor(floor)} onSelect={handleSelect} />
          )}
        </div>
      </div>
    </div>
  );
}
