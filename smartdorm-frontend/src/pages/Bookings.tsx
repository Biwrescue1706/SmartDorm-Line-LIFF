// src/pages/Bookings.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";   // ✅ ใช้ API_BASE โดยตรง
import "../css/Bookings.css";

interface Room {
  id: string;
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

  // โหลดข้อมูลห้อง
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/room/getall`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("โหลดข้อมูลล้มเหลว");
      const data: Room[] = await res.json();

      const available = data
        .filter((r) => r.status === 0)
        .sort((a, b) => Number(a.number) - Number(b.number));

      setRooms(available);
    } catch (error) {
      console.error("Error loading rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 👉 ส่งไปหน้ารายละเอียดห้อง
  const handleSelect = (room: Room) => {
    nav(`/bookings/${room.id}`, { state: room });
  };

  return (
    <div className="bookings-container">
      <h3 className="text-center mb-3">เลือกห้อง</h3>
      {loading ? (
        <div>กำลังโหลด...</div>
      ) : (
        <div className="bookings-grid">
          {rooms.map((room) => (
            <button
              key={room.id}
              className="btn btn-secondary bookings-button"
              onClick={() => handleSelect(room)}
            >
              {room.number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
