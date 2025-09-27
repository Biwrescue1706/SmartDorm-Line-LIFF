// src/pages/Bookings.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import "../css/Bookings.css";

interface Room {
  roomId: string;
  number: string;
  size: string;
  rent: number;
  deposit: number;
  bookingFee: number;
  status: number; // 0=ว่าง, 1=จองแล้ว, 2=ไม่ว่าง
}

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
    const interval = setInterval(load, 12 * 60 * 1000); // ทุก 12 นาที
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (room: Room) => {
    nav(`/booking`, { state: room });
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
          <div className="bookings-grid">
            {rooms.map((room) => (
              <button
                key={room.roomId}
                className="bookings-button"
                onClick={() => handleSelect(room)}
              >
                {room.number}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
