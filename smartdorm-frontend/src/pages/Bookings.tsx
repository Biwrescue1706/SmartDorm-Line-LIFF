// src/pages/Bookings.tsx
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/fetch";

interface Room {
  id: string;
  number: string;
  status: number; // 0=ว่าง, 1=จองแล้ว, 2=ไม่ว่าง
}

export default function Bookings() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Room[]>("/room/getall");
      // ✅ กรองห้อง status 0 (ว่าง) เท่านั้น และเรียงตามเลขห้อง
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

  const handleSelect = (room: Room) => {
    alert(`คุณเลือกห้อง ${room.number}`);
    // 👉 ต่อไปตรงนี้สามารถส่ง API /booking/create เพื่อจองห้อง
  };

  return (
    <div className="container py-4">
      <h3 className="text-center mb-3">เลือกห้อง</h3>
      {loading ? (
        <div>กำลังโหลด...</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "10px",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          {rooms.map((room) => (
            <button
              key={room.id}
              className="btn btn-secondary"
              style={{ height: "60px" }}
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
