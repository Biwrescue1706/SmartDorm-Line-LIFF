import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE } from "../config";

type Room = { number: string };

type Booking = {
  bookingId: string;
  createdAt?: string;
  room?: Room | null;
};

export default function ReturnableRooms() {
  const SCB_PURPLE = "#4A0080";
  const SCB_GOLD = "#FFC800";
  const BG = "#F4F1FA";
  const TEXT = "#2D1A47";

  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [query, setQuery] = useState("");

  const accessToken =
    localStorage.getItem("line_access_token") ||
    sessionStorage.getItem("line_access_token") ||
    "";

  const fetchReturnables = async () => {
    try {
      if (!accessToken) {
        setBookings([]);
        return Swal.fire("ยังไม่ได้เข้าสู่ระบบ", "ไม่พบ accessToken", "warning");
      }

      setLoading(true);
      const res = await fetch(`${API_BASE}/user/bookings/returnable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error);

      setBookings(data.bookings || []);
    } catch (err: any) {
      Swal.fire("เกิดข้อผิดพลาด", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnables();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return bookings;
    return bookings.filter((b) => b.room?.number.includes(query));
  }, [bookings, query]);

  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString("th-TH", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${BG}, #ffffff)`,
        padding: "20px",
      }}
    >
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* ===== Header Card ===== */}
        <div
          style={{
            background: `linear-gradient(135deg, ${SCB_PURPLE}, #6A1BB1)`,
            borderRadius: 22,
            padding: "20px",
            color: "white",
            boxShadow: "0 15px 40px rgba(74,0,128,0.35)",
          }}
          className="mb-4"
        >
          <h4 className="fw-bold mb-1">ขอคืนห้องพัก</h4>
          <div style={{ opacity: 0.85, fontSize: 14 }}>
            ห้องที่ผ่านการอนุมัติและสามารถคืนได้
          </div>

          <div className="mt-3 d-flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาเลขห้อง"
              className="form-control"
              style={{
                borderRadius: 14,
                border: "none",
                maxWidth: 220,
              }}
            />
            <button
              onClick={fetchReturnables}
              className="btn fw-bold"
              style={{
                background: SCB_GOLD,
                color: TEXT,
                borderRadius: 14,
                padding: "0 18px",
              }}
            >
              รีเฟรช
            </button>
          </div>
        </div>

        {/* ===== Content ===== */}
        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" />
            <div className="mt-2 text-muted">กำลังโหลดข้อมูล…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center"
            style={{
              background: "white",
              borderRadius: 20,
              padding: 40,
              boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: 20 }}>😴</div>
            <div className="fw-bold mt-2" style={{ color: SCB_PURPLE }}>
              ไม่มีห้องที่สามารถขอคืนได้
            </div>
            <div className="text-muted mt-1">
              กรุณาตรวจสอบสถานะการเช็คอิน / เช็คเอาท์
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {filtered.map((b) => (
              <div
                key={b.bookingId}
                style={{
                  background: "white",
                  borderRadius: 22,
                  padding: 20,
                  position: "relative",
                  boxShadow: "0 18px 45px rgba(0,0,0,0.08)",
                  transition: "0.25s",
                }}
              >
                {/* accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 5,
                    background: `linear-gradient(90deg, ${SCB_PURPLE}, ${SCB_GOLD})`,
                    borderTopLeftRadius: 22,
                    borderTopRightRadius: 22,
                  }}
                />

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      ห้องพัก
                    </div>
                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 800,
                        color: SCB_PURPLE,
                      }}
                    >
                      {b.room?.number}
                    </div>
                  </div>

                  <span
                    style={{
                      background: "rgba(255,200,0,0.25)",
                      color: SCB_PURPLE,
                      fontWeight: 800,
                      padding: "8px 14px",
                      borderRadius: 999,
                      fontSize: 13,
                    }}
                  >
                    คืนได้
                  </span>
                </div>

                <div className="mt-2 text-muted" style={{ fontSize: 13 }}>
                  วันที่อนุมัติ: {formatDate(b.createdAt)}
                </div>

                <button
                  className="btn w-100 fw-bold mt-4"
                  style={{
                    background: `linear-gradient(135deg, ${SCB_GOLD}, #FFD966)`,
                    color: TEXT,
                    borderRadius: 16,
                    padding: "12px 0",
                    boxShadow: "0 8px 20px rgba(255,200,0,0.45)",
                  }}
                  onClick={() =>
                    Swal.fire("ขอคืนห้อง", `bookingId: ${b.bookingId}`, "info")
                  }
                >
                  ขอคืนห้อง
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}