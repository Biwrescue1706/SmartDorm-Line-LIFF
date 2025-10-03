// src/pages/Bookings.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import RoomGrid from "../components/Bookings/RoomGrid";
import type { Room } from "../types/Room";

export default function Bookings() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const load = async () => {
    try {
      const res = await fetch(`${API_BASE}/room/getall`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("โหลดข้อมูลล้มเหลว");

      const data: Room[] = await res.json();

      // ✅ โชว์ทั้งห้องว่าง (0) และ จองแล้ว (1)
      const allRooms = data
        .filter((r) => r.status === 0 || r.status === 1) // ✅ เก็บทั้งว่างและจองแล้ว
        .sort(
          (a, b) =>
            (parseInt(a.number, 10) || 0) - (parseInt(b.number, 10) || 0)
        );

      setRooms(allRooms);
    } catch (error) {
      console.error("Error loading rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 12 * 60 * 1000); // ทุก 12 นาที
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (room: Room) => {
    nav(`/bookings/${room.roomId}`, { state: room });
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="text-center mb-3">เลือกห้อง</h3>

          {loading ? (
            <div className="text-center text-muted">⏳ กำลังโหลด...</div>
          ) : rooms.length === 0 ? (
            <div className="text-center text-muted">
              ❌ ไม่มีห้องให้แสดงในขณะนี้
            </div>
          ) : (
            <RoomGrid rooms={rooms} onSelect={handleSelect} />
          )}
        </div>
      </div>
    </div>
  );
}
