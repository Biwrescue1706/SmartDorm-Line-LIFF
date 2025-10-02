import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import type { Room } from "../types/Room";

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

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

  return { rooms, loading, reload: load };
}
