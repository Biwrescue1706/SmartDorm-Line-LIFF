import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import type { Room } from "../types/Room";
import RoomGrid from "../components/Bookings/RoomGrid";
import "../css/Bookings.css";

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

      // ✅ ห้องว่างเท่านั้น
      const available = data
        .filter((r) => r.status === 0)
        .sort(
          (a, b) =>
            (parseInt(a.number, 10) || 0) - (parseInt(b.number, 10) || 0)
        );

      setRooms(available);
    } catch (error) {
      console.error("Error loading rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 12 * 60 * 1000); // reload ทุก 12 นาที
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (room: Room) => {
    nav(`/bookings/${room.roomId}`, { state: room });
  };

  return (
    <div className="bookings-container">
      <div className="bookings-card">
        <h3 className="text-center mb-3">เลือกห้อง</h3>
        {loading ? (
          <div>⏳ กำลังโหลด...</div>
        ) : rooms.length === 0 ? (
          <div className="text-center text-muted">❌ ไม่มีห้องว่างในขณะนี้</div>
        ) : (
          <RoomGrid rooms={rooms} onSelect={handleSelect} />
        )}
      </div>
    </div>
  );
}
