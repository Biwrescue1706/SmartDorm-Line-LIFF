// src/pages/ReturnableRooms.tsx
import { useNavigate } from "react-router-dom";
import LiffNav from "../components/LiffNav";
import { useReturnableRooms } from "../hooks/useReturnableRooms";

const SCB_PURPLE = "#4A0080";
const SCB_PURPLE_LIGHT = "#F4ECFB";
const BG_SOFT = "#F7F5FA";
const CARD_BG = "#FFFFFF";
const TEXT_DARK = "#2D1A47";

export default function ReturnableRooms() {
  const nav = useNavigate();
  const { checkingAuth, loading, bookings, formatDate } = useReturnableRooms();

  if (checkingAuth) {
    return (
      <>
        <LiffNav />

        <div
          style={{
            minHeight: "100vh",
            background: BG_SOFT,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: SCB_PURPLE,
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          กำลังตรวจสอบสิทธิ์...
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
          padding: "88px 16px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 430,
            margin: "0 auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              marginBottom: 22,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 800,
                color: SCB_PURPLE,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🏠 คืนห้องพัก
            </h1>

            <p
              style={{
                marginTop: 8,
                marginBottom: 0,
                color: "#6B6480",
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              เลือกห้องที่ต้องการดำเนินการคืนห้องพัก
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div
              style={{
                background: CARD_BG,
                borderRadius: 22,
                padding: 28,
                textAlign: "center",
                color: SCB_PURPLE,
                fontWeight: 700,
                boxShadow: "0 10px 30px rgba(74,0,128,0.08)",
              }}
            >
              กำลังโหลดข้อมูล...
            </div>
          ) : bookings.length === 0 ? (
            <div
              style={{
                background: CARD_BG,
                borderRadius: 24,
                padding: 36,
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(74,0,128,0.08)",
              }}
            >
              <div style={{ fontSize: 42 }}>🏡</div>

              <h3
                style={{
                  marginTop: 14,
                  marginBottom: 8,
                  color: TEXT_DARK,
                }}
              >
                ไม่มีห้องที่สามารถคืนได้
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#7A7391",
                  fontSize: 14,
                }}
              >
                ยังไม่มีรายการห้องที่อยู่ในสถานะคืนห้อง
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              {bookings.map((b) => (
                <div
                  key={b.bookingId}
                  style={{
                    background: CARD_BG,
                    borderRadius: 26,
                    padding: 22,
                    boxShadow: "0 10px 28px rgba(74,0,128,0.08)",
                    border: "1px solid rgba(74,0,128,0.06)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Top Accent */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: 6,
                      background: `linear-gradient(90deg, ${SCB_PURPLE}, #7B2BC7)`,
                    }}
                  />

                  {/* Room */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 18,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#7E7695",
                          marginBottom: 6,
                          fontWeight: 600,
                        }}
                      >
                        ห้องพัก
                      </div>

                      <h2
                        style={{
                          margin: 0,
                          color: SCB_PURPLE,
                          fontSize: 28,
                          fontWeight: 800,
                          lineHeight: 1,
                        }}
                      >
                        {b.room?.number ?? "-"}
                      </h2>
                    </div>

                    <div
                      style={{
                        background: SCB_PURPLE_LIGHT,
                        color: SCB_PURPLE,
                        padding: "10px 14px",
                        borderRadius: 14,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      พร้อมคืน
                    </div>
                  </div>

                  {/* Info */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        background: "#FAF9FC",
                        borderRadius: 16,
                        padding: "14px 16px",
                        border: "1px solid #F0EAF7",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: "#8B84A3",
                          marginBottom: 5,
                          fontWeight: 600,
                        }}
                      >
                        วันที่จอง
                      </div>

                      <div
                        style={{
                          color: TEXT_DARK,
                          fontWeight: 700,
                          fontSize: 15,
                        }}
                      >
                        {formatDate(b.bookingDate)}
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#FAF9FC",
                        borderRadius: 16,
                        padding: "14px 16px",
                        border: "1px solid #F0EAF7",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: "#8B84A3",
                          marginBottom: 5,
                          fontWeight: 600,
                        }}
                      >
                        วันเข้าพักจริง
                      </div>

                      <div
                        style={{
                          color: TEXT_DARK,
                          fontWeight: 700,
                          fontSize: 15,
                        }}
                      >
                        {formatDate(b.checkinAt)}
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    disabled={loading}
                    onClick={() => nav(`/checkout/${b.bookingId}`)}
                    style={{
                      width: "100%",
                      marginTop: 20,
                      padding: "14px",
                      borderRadius: 18,
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 800,
                      fontSize: 15,
                      background: `linear-gradient(135deg, ${SCB_PURPLE}, #6F1AB6)`,
                      color: "#FFF",
                      boxShadow: "0 8px 20px rgba(74,0,128,0.22)",
                      transition: "0.2s",
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
