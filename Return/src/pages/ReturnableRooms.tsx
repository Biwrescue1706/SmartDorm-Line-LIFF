// src/pages/ReturnableRooms.tsx
import { useNavigate } from "react-router-dom";
import LiffNav from "../components/LiffNav";
import { useReturnableRooms } from "../hooks/useReturnableRooms";

const SCB_PURPLE = "#4A0080";
const SCB_GOLD = "#F7C600";
const BG_SOFT = "#F6F2FB";
const CARD_BG = "#FFFFFF";
const TEXT_DARK = "#2D1A47";

export default function ReturnableRooms() {
  const nav = useNavigate();
  const { checkingAuth, loading, bookings, formatDate } =
    useReturnableRooms();

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
          <h2 style={{ color: SCB_PURPLE, fontWeight: 700, marginBottom: 6 }}>
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
                    <h2
                      style={{
                        margin: 0,
                        color: SCB_PURPLE,
                        fontWeight: 700,
                      }}
                    >
                      ห้อง {b.room?.number ?? "-"}
                    </h2>

                    <h4 style={{ fontSize: 14, marginTop: 6, color: TEXT_DARK }}>
                      วันที่จอง : {formatDate(b.bookingDate)}
                    </h4>

                    <h4 style={{ fontSize: 14, marginTop: 6, color: TEXT_DARK }}>
                      วันเข้าพักจริง : {formatDate(b.checkinAt)}
                    </h4>
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
                      fontWeight: 800,
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
