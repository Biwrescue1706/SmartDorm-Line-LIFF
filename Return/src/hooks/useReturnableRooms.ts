import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE } from "../config";
import { getSafeAccessToken } from "../lib/liff";
import type { Booking } from "../types/returnable";

export function useReturnableRooms() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // ตรวจสอบสิทธิ์
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const token = await getSafeAccessToken();
        if (!token) throw new Error("no token");

        const res = await axios.post(`${API_BASE}/user/me`, {
          accessToken: token,
        });

        if (!res.data?.success) throw new Error("unauthorized");
        if (!cancelled) setCheckingAuth(false);
      } catch {
        Swal.fire("ไม่สามารถตรวจสอบสิทธิ์ได้", "กรุณาลองใหม่", "warning");
        setCheckingAuth(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // โหลดห้องที่คืนได้
  const fetchReturnableRooms = async () => {
    try {
      setLoading(true);
      const token = await getSafeAccessToken();
      if (!token) return;

      const res = await axios.post(`${API_BASE}/user/bookings/returnable`, {
        accessToken: token,
      });

      setBookings(res.data?.bookings || []);
    } catch (err: any) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        err?.response?.data?.error || "โหลดข้อมูลไม่สำเร็จ",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checkingAuth) fetchReturnableRooms();
  }, [checkingAuth]);

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return {
    checkingAuth,
    loading,
    bookings,
    formatDate,
  };
}
