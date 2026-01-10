// src/hooks/useCheckoutDetail.ts
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE } from "../config";
import { getSafeAccessToken } from "../lib/liff";
import type { Booking } from "../types/checkout";

export function useCheckoutDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [checkoutDate, setCheckoutDate] = useState("");

  // ตรวจสอบสิทธิ์ LIFF
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
        Swal.fire(
          "ไม่สามารถตรวจสอบสิทธิ์ได้",
          "กรุณาเปิดผ่าน LINE เท่านั้น",
          "warning"
        );
        setCheckingAuth(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // โหลดข้อมูล Booking
  const fetchBooking = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/booking/${bookingId}`);
      const data: Booking = res.data;

      setBooking(data);

      const existingCheckout =
        data.checkout || data.checkouts?.[0]?.checkout || null;

      if (existingCheckout) {
        setCheckoutDate(existingCheckout.slice(0, 10));
      }
    } catch (err: any) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        err?.response?.data?.error || "ไม่พบข้อมูลการจอง",
        "error"
      );
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checkingAuth && bookingId) {
      fetchBooking();
    }
  }, [checkingAuth, bookingId]);

  // ส่งคำขอคืนห้อง
  const submitCheckout = async () => {
    try {
      if (!checkoutDate) {
        return Swal.fire("กรุณาเลือกวันที่คืนห้อง");
      }

      const token = await getSafeAccessToken();
      if (!token) return;

      setLoading(true);

      await axios.put(`${API_BASE}/checkout/${bookingId}/request`, {
        accessToken: token,
        checkout: checkoutDate,
      });

      navigate("/thank-you");
    } catch (err: any) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        err?.response?.data?.error || "ไม่สามารถส่งคำขอคืนได้",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    checkingAuth,
    loading,
    booking,
    checkoutDate,
    setCheckoutDate,
    submitCheckout,
  };
}
