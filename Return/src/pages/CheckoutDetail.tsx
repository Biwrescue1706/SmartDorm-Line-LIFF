// src/pages/CheckoutDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { API_BASE } from "../config";
import { getSafeAccessToken } from "../lib/liff";
import LiffNav from "../components/LiffNav";

/* =======================
   Types
======================= */
type Room = {
  number: string;
};

type Booking = {
  bookingId: string;
  fullName?: string;
  cphone?: string;
  checkout?: string | null;
  createdAt?: string;
  room?: Room | null;
};

/* =======================
   Page
======================= */
export default function CheckoutDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [checkoutDate, setCheckoutDate] = useState("");

  /* =======================
     1️⃣ ตรวจสอบสิทธิ์ LIFF
  ======================= */
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

  /* =======================
     2️⃣ โหลดข้อมูล Booking
  ======================= */
  const fetchBooking = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/booking/${bookingId}`);
      setBooking(res.data);

      if (res.data?.checkout) {
        setCheckoutDate(res.data.checkout.slice(0, 10));
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

  /* =======================
     3️⃣ ส่งคำขอคืนห้อง
  ======================= */
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
        requestedCheckout: checkoutDate,
      });

      // ✅ ไปหน้า ThankYou
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

  /* =======================
     Loading Guard
  ======================= */
  if (checkingAuth || loading || !booking) {
    return (
      <>
        <LiffNav />
        <div
          style={{
            height: "100vh",
            paddingTop: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
          }}
        >
          กำลังโหลดข้อมูล…
        </div>
      </>
    );
  }

  /* =======================
     Render
  ======================= */
  return (
    <>
      <LiffNav />

      <div
        style={{
          padding: 20,
          paddingTop: 90, // ✅ กันโดน nav
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <h3 style={{ marginBottom: 16 }}>รายละเอียดการคืนห้อง</h3>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <strong>ห้อง:</strong> {booking.room?.number ?? "-"}
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>ชื่อผู้เช่า:</strong> {booking.fullName || "-"}
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>เบอร์โทร:</strong> {booking.cphone || "-"}
          </div>

          <div style={{ marginBottom: 16 }}>
            <strong>วันที่คืนห้อง</strong>
            <input
              type="date"
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
              style={{
                marginTop: 6,
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            onClick={submitCheckout}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 12,
              border: "none",
              background: "#4A0080",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ยืนยันขอคืนห้อง
          </button>

          {/* 🔙 ย้อนกลับ → กลับหน้า / เท่านั้น */}
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: 10,
              width: "100%",
              padding: "10px 0",
              borderRadius: 12,
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    </>
  );
}
