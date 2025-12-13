import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [query, setQuery] = useState("");

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

        if (!res.data?.success) {
          throw new Error("unauthorized");
        }

        if (!cancelled) setCheckingAuth(false);
      } catch (err) {
        console.error("auth error", err);
        Swal.fire(
          "ไม่สามารถตรวจสอบสิทธิ์ได้",
          "กรุณาลองใหม่อีกครั้ง",
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
    if (!checkingAuth) {
      fetchReturnableRooms();
    }
  }, [checkingAuth]);

  /* =======================
     Helpers
  ======================= */
  const filtered = useMemo(() => {
    if (!query.trim()) return bookings;
    return bookings.filter((b) =>
      (b.room?.number ?? "").includes(query.trim())
    );
  }, [bookings, query]);

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("th-TH");
  };

  /* =======================
     Render Guards
  ======================= */
  if (checkingAuth) {
    return (
      <>
        <LiffNav />
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            paddingTop: 80,
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
          padding: 20,
          paddingTop: 90, // ✅ เว้นที่ให้ Nav
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>ห้องที่สามารถขอคืนได้</h3>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาเลขห้อง"
          style={{
            padding: 10,
            marginBottom: 16,
            width: "100%",
            maxWidth: 320,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        {loading ? (
          <div>กำลังโหลด…</div>
        ) : filtered.length === 0 ? (
          <div>ไม่พบห้องที่สามารถขอคืนได้</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {filtered.map((b) => (
              <div
                key={b.bookingId}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 14,
                  padding: 16,
                  background: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                <h4 style={{ margin: "0 0 8px" }}>
                  ห้อง {b.room?.number ?? "-"}
                </h4>

                <div
                  style={{
                    fontSize: 14,
                    color: "#666",
                    marginBottom: 12,
                  }}
                >
                  วันที่จอง: {formatDate(b.createdAt)}
                </div>

                <button
                  disabled={loading}
                  onClick={() => nav(`/checkout/${b.bookingId}`)}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderRadius: 10,
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    background: "#4A0080",
                    color: "#fff",
                    fontWeight: 600,
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  คืนห้อง
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
