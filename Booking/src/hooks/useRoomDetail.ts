// src/hooks/useRoomDetail.ts
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Room } from "../types/Room";
import { API_BASE } from "../config";
import { GetRoomById } from "../apis/endpoint.api";
import Swal from "sweetalert2";

export function useRoomDetail() {
  const { state } = useLocation();
  const { roomId } = useParams();

  const [room, setRoom] = useState<Room | undefined>(state as Room | undefined);
  const [loading, setLoading] = useState(!state && !!roomId);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (state) return; // ถ้ามี state จาก nav แล้ว ไม่ต้อง fetch

    if (roomId) {
      setLoading(true);
      fetch(`${API_BASE}${GetRoomById(roomId)}`, {
        method: "GET",
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลห้องได้");
          const data: Room = await res.json();
          setRoom(data);
        })
        .catch(() => {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "โหลดข้อมูลห้องไม่สำเร็จ",
            showConfirmButton: false,
            timer: 2000,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [roomId, state]);

  return { room, roomId, loading, error };
}
