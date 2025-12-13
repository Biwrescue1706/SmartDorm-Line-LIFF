import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { API_BASE } from "../config";
import { getSafeAccessToken } from "../lib/liff";
import LiffNav from "../components/LiffNav";

/* =======================
   SCB THEME
======================= */
const SCB_PURPLE = "#4A0080";
const SCB_GOLD = "#F7C600";
const BG_SOFT = "#F6F2FB";
const CARD_BG = "#FFFFFF";
const TEXT_DARK = "#2D1A47";

/* =======================
   Types
======================= */
type Room = {
  number: string;
};

type Booking = {
  bookingId: string;
  createdAt?: string;
  room?: Room | null;
};

/* =======================
   Page
======================= */
export default function ReturnableRooms() {
  const nav = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  /* =======================
     1️⃣ ตรวจสอบสิทธิ์
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
        Swal.fire("ไม่สามารถตรวจสอบสิทธิ์ได้", "กรุณาลองใหม่", "warning");
        setCheckingAuth(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================
     2️⃣ โหลดห้องที่คืนได้
  ======================= */
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

  /* =======================
     Loading Guard
  ======================= */
  if (checkingAuth) {
    return (
      <>
        <LiffNav />
        <div
          style={{
            height: "100vh",
            paddingTop: 80,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 600,
            color: SCB_PURPLE,
          }}
        >
          กำลังตรวจสอบสิทธิ์…
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
          minHeight: "100vh",
          background: BG_SOFT,
          padding: 20,
          paddingTop: 90,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2
            style={{
              color: SCB_PURPLE,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            🏠 ห้องที่สามารถขอคืนได้
          </h2>

          <p style={{ color: "#666", marginBottom: 24 }}>
            เลือกห้องที่ต้องการดำเนินการคืน
          </p>

          {loading ? (
            <div style={{ color: SCB_PURPLE }}>กำลังโหลดข้อมูล…</div>
          ) : bookings.length === 0 ? (
            <div style={{ color: "#777" }}>ไม่พบห้องที่สามารถขอคืนได้</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 18,
              }}
            >
              {bookings.map((b) => (
                <div
                  key={b.bookingId}
                  style={{
                    background: CARD_BG,
                    borderRadius: 18,
                    padding: 18,
                    boxShadow: "0 6px 16px rgba(74,0,128,0.08)",
                    border: `1px solid ${SCB_PURPLE}15`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        color: SCB_PURPLE,
                        fontWeight: 700,
                      }}
                    >
                      ห้อง {b.room?.number ?? "-"}
                    </h3>

                    <div
                      style={{
                        fontSize: 14,
                        marginTop: 6,
                        color: TEXT_DARK,
                      }}
                    >
                      วันที่จอง: {formatDate(b.createdAt)}
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    onClick={() => nav(`/checkout/${b.bookingId}`)}
                    style={{
                      marginTop: 16,
                      padding: "12px 0",
                      borderRadius: 14,
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${SCB_PURPLE}, #6A1BB1)`,
                      color: SCB_GOLD,
                    }}
                  >
                    คืนห้อง
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
