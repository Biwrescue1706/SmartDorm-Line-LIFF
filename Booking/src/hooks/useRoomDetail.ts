
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Room } from "../types/Room";
import { API_BASE } from "../config";
import { GetRoomById } from "../apis/endpoint.api";
import Swal from "sweetalert2";

export function useRoomDetail() {
  const { state } = useLocation();
  const { roomId } = useParams();
  const [room, setRoom] = useState<Room | null>((state as Room) || null);
  const [loading, setLoading] = useState(!state && !!roomId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state) return; // ถ้ามีข้อมูลจากหน้า Bookings แล้วไม่ต้องโหลดใหม่

    if (!roomId) {
      setError("ไม่พบรหัสห้อง");
      return;
    }

    setLoading(true);
    fetch(`${API_BASE}${GetRoomById(roomId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลห้องได้");
        const data: Room = await res.json();
        setRoom(data);
      })
      .catch(() => {
        setError("โหลดข้อมูลห้องไม่สำเร็จ");
        Swal.fire({
          icon: "error",
          title: "โหลดข้อมูลห้องไม่สำเร็จ",
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .finally(() => setLoading(false));
  }, [roomId, state]);

  return { room, roomId, loading, error };
}
