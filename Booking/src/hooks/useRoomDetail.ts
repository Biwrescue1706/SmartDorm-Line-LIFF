// src/hooks/useRoomDetail.ts
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Room } from "../types/Room";
import { API_BASE } from "../config";

export function useRoomDetail() {
  const { state } = useLocation();
  const { roomId } = useParams();

  const [room, setRoom] = useState<Room | undefined>(state as Room | undefined);
  const [loading, setLoading] = useState(!state && !!roomId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state) return; // ถ้ามี state แล้วไม่ต้อง fetch

    if (roomId) {
      setLoading(true);
      fetch(`${API_BASE}/room/${roomId}`, {
        method: "GET",
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลห้องได้");
          const data: Room = await res.json();
          setRoom(data);
        })
        .catch((err) => {
          console.error("❌ Fetch room error:", err);
          setError("โหลดข้อมูลห้องไม่สำเร็จ");
        })
        .finally(() => setLoading(false));
    }
  }, [roomId, state]);

  return { room, roomId, loading, error };
}
