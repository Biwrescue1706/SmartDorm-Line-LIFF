// src/hooks/useRooms.ts
import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import type { Room } from "../types/Room";
import { GetAllRoom } from "../apis/endpoint.api";
import Swal from "sweetalert2";

export function useRooms(includeBooked = false) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${GetAllRoom}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("โหลดข้อมูลล้มเหลว");

      const data: Room[] = await res.json();

      const filtered = data
        .filter((r) =>
          includeBooked ? r.status === 0 || r.status === 1 : r.status === 0
        )
        .sort(
          (a, b) =>
            (parseInt(a.number, 10) || 0) - (parseInt(b.number, 10) || 0)
        );

      setRooms(filtered);
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "โหลดข้อมูลห้องไม่สำเร็จ",
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 12 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { rooms, loading, reload: load };
}
