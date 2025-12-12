import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { API_BASE } from "../config";
import { getSafeAccessToken } from "../lib/liff";

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

        if (!cancelled) {
          setCheckingAuth(false);
        }
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
     2️⃣ โหลดห้องคืนได้
  ======================= */
  const fetchReturnableRooms = async () => {
    try {
      setLoading(true);

      const token = await getSafeAccessToken();
      if (!token) return;

      const res = await axios.post(
        `${API_BASE}/user/bookings/returnable`,
        { accessToken: token }
      );

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
      (b.room?.number || "").includes(query.trim())
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
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
        }}
      >
        กำลังตรวจสอบสิทธิ์…
      </div>
    );
  }

  /* =======================
     Render
  ======================= */
  return (
    <div style={{ padding: 20 }}>
      <h3>ห้องที่สามารถขอคืนได้</h3>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ค้นหาเลขห้อง"
        style={{ padding: 8, marginBottom: 12 }}
      />

      {loading ? (
        <div>กำลังโหลด…</div>
      ) : filtered.length === 0 ? (
        <div>ไม่พบห้องที่สามารถขอคืนได้</div>
      ) : (
        <ul>
          {filtered.map((b) => (
            <li key={b.bookingId}>
              ห้อง {b.room?.number} — {formatDate(b.createdAt)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}