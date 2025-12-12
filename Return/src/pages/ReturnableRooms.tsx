import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { API_BASE } from "../config";
import { refreshLiffToken, logoutLiff } from "../lib/liff";

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
   Component
======================= */
export default function ReturnableRooms() {
  const nav = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [query, setQuery] = useState("");

  /* =======================
     1️⃣ ตรวจสอบสิทธิ์ LIFF + /user/me
  ======================= */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) throw new Error("no token");

        const res = await axios.post(`${API_BASE}/user/me`, {
          accessToken: token,
        });

        if (!res.data?.success) {
          throw new Error("unauthorized");
        }

        if (!cancelled) {
          setCheckingAuth(false); // ✅ ผ่าน
        }
      } catch (err) {
        await logoutLiff(false);
        Swal.fire(
          "หมดเวลาการใช้งาน",
          "กรุณาล็อกอินใหม่อีกครั้ง",
          "warning"
        );
        nav("/");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [nav]);

  /* =======================
     2️⃣ โหลดห้องที่คืนได้
  ======================= */
  const fetchReturnableRooms = async () => {
    try {
      setLoading(true);

      const token = await refreshLiffToken();
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

  /* โหลดหลัง auth ผ่าน */
  useEffect(() => {
    if (!checkingAuth) {
      fetchReturnableRooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const d = new Date(iso);
    return d.toLocaleString("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
          background: "#F4F1FA",
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
      <h3 style={{ marginBottom: 12 }}>ห้องที่สามารถขอคืนได้</h3>

      <div style={{ marginBottom: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาเลขห้อง"
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            width: 200,
          }}
        />
      </div>

      {loading ? (
        <div>กำลังโหลดข้อมูล…</div>
      ) : filtered.length === 0 ? (
        <div>ไม่พบห้องที่สามารถขอคืนได้</div>
      ) : (
        <ul style={{ paddingLeft: 16 }}>
          {filtered.map((b) => (
            <li key={b.bookingId} style={{ marginBottom: 8 }}>
              ห้อง {b.room?.number || "-"} —{" "}
              <small>{formatDate(b.createdAt)}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}