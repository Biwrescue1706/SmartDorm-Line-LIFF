// src/pages/ReturnableRooms.tsx
import { useMemo, useState } from "react";
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

  const {
    checkingAuth,
    loading,
    bookings,
    formatDate,
  } = useReturnableRooms();

  // เลือกห้อง
  const [selectedRoom, setSelectedRoom] =
    useState("ทั้งหมด");

  // ห้องทั้งหมด
  const roomOptions = useMemo(() => {
    const rooms = bookings.map(
      (b) => b.room?.number ?? "-"
    );

    return [
      "ทั้งหมด",
      ...Array.from(new Set(rooms)),
    ];
  }, [bookings]);

  // filter ห้อง
  const filteredBookings = useMemo(() => {
    if (selectedRoom === "ทั้งหมด")
      return bookings;

    return bookings.filter(
      (b) =>
        b.room?.number === selectedRoom
    );
  }, [bookings, selectedRoom]);

  // AUTH CHECK
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
          <div style={{ textAlign: "center" }}>
            <div
              className="spinner-border"
              style={{
                color: SCB_PURPLE,
                marginBottom: 14,
              }}
            />

            <div>กำลังตรวจสอบสิทธิ์...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LiffNav />

      {/* PAGE */}
      <div
        style={{
          minHeight: "100vh",
          background: BG_SOFT,
          padding: "8px 10px 16px",
        }}
      >
        <div
          style={{
            maxWidth: 430,
            margin: "0 auto",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: CARD_BG,
              borderRadius: 30,
              overflow: "hidden",
              boxShadow:
                "0 12px 30px rgba(74,0,128,0.08)",
              marginBottom: 16,
            }}
          >
            {/* TOP BAR */}
            <div
              style={{
                height: 6,
                background:
                  "linear-gradient(90deg,#4A0080,#7B2BC7)",
              }}
            />

            {/* CONTENT */}
            <div
              style={{
                padding: 22,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 32,
                  fontWeight: 800,
                  color: SCB_PURPLE,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  lineHeight: 1.2,
                }}
              >
                🏠 คืนห้องพัก
              </h1>

              <p
                style={{
                  marginTop: 12,
                  marginBottom: 0,
                  color: "#6B6480",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                เลือกห้องที่ต้องการดำเนินการคืนห้องพัก
              </p>
            </div>
          </div>

          {/* FILTER */}
          {!loading &&
            bookings.length > 0 && (
              <div
                style={{
                  background: CARD_BG,
                  borderRadius: 26,
                  padding: 18,
                  marginBottom: 18,
                  boxShadow:
                    "0 10px 28px rgba(74,0,128,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: SCB_PURPLE,
                    marginBottom: 12,
                  }}
                >
                  🔎 เลือกห้องที่จะคืน
                </div>

                <select
                  value={selectedRoom}
                  onChange={(e) =>
                    setSelectedRoom(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    border:
                      "1.5px solid #E8DDF7",
                    borderRadius: 18,
                    padding:
                      "14px 16px",
                    background:
                      "#FAF9FC",
                    fontWeight: 700,
                    color: TEXT_DARK,
                    outline: "none",
                    fontSize: 15,
                  }}
                >
                  {roomOptions.map(
                    (room) => (
                      <option
                        key={room}
                        value={room}
                      >
                        {room ===
                        "ทั้งหมด"
                          ? "ทุกห้อง"
                          : `ห้อง ${room}`}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

          {/* LOADING */}
          {loading ? (
            <div
              style={{
                background: CARD_BG,
                borderRadius: 24,
                padding: 32,
                textAlign: "center",
                color: SCB_PURPLE,
                fontWeight: 700,
                boxShadow:
                  "0 10px 30px rgba(74,0,128,0.08)",
              }}
            >
              <div
                className="spinner-border"
                style={{
                  color: SCB_PURPLE,
                  marginBottom: 14,
                }}
              />

              <div>กำลังโหลดข้อมูล...</div>
            </div>
          ) : filteredBookings.length ===
            0 ? (
            <div
              style={{
                background: CARD_BG,
                borderRadius: 28,
                padding: 40,
                textAlign: "center",
                boxShadow:
                  "0 10px 30px rgba(74,0,128,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: 48,
                }}
              >
                🏡
              </div>

              <h3
                style={{
                  marginTop: 16,
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
              {filteredBookings.map((b) => (
                <div
                  key={b.bookingId}
                  style={{
                    background: CARD_BG,
                    borderRadius: 28,
                    padding: 22,
                    boxShadow:
                      "0 10px 28px rgba(74,0,128,0.08)",
                    border:
                      "1px solid rgba(74,0,128,0.06)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* TOP BAR */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: 6,
                      background:
                        "linear-gradient(90deg,#4A0080,#7B2BC7)",
                    }}
                  />

                  {/* ROOM */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      marginBottom: 18,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color:
                            "#7E7695",
                          marginBottom: 6,
                          fontWeight: 600,
                        }}
                      >
                        ห้องพัก
                      </div>

                      <h2
                        style={{
                          margin: 0,
                          color:
                            SCB_PURPLE,
                          fontSize: 38,
                          fontWeight: 800,
                          lineHeight: 1,
                        }}
                      >
                        {b.room?.number ??
                          "-"}
                      </h2>
                    </div>

                    <div
                      style={{
                        background:
                          SCB_PURPLE_LIGHT,
                        color:
                          SCB_PURPLE,
                        padding:
                          "10px 16px",
                        borderRadius: 16,
                        fontSize: 13,
                        fontWeight: 800,
                      }}
                    >
                      พร้อมคืน
                    </div>
                  </div>

                  {/* INFO */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection:
                        "column",
                      gap: 12,
                    }}
                  >
                    {/* BOOK DATE */}
                    <div
                      style={{
                        background:
                          "#FAF9FC",
                        borderRadius: 18,
                        padding:
                          "15px 16px",
                        border:
                          "1px solid #F0EAF7",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color:
                            "#8B84A3",
                          marginBottom: 6,
                          fontWeight: 700,
                        }}
                      >
                        📅 วันที่จอง
                      </div>

                      <div
                        style={{
                          color:
                            TEXT_DARK,
                          fontWeight: 800,
                          fontSize: 16,
                        }}
                      >
                        {formatDate(
                          b.bookingDate
                        )}
                      </div>
                    </div>

                    {/* CHECKIN */}
                    <div
                      style={{
                        background:
                          "#FAF9FC",
                        borderRadius: 18,
                        padding:
                          "15px 16px",
                        border:
                          "1px solid #F0EAF7",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color:
                            "#8B84A3",
                          marginBottom: 6,
                          fontWeight: 700,
                        }}
                      >
                        🛏️ วันเข้าพักจริง
                      </div>

                      <div
                        style={{
                          color:
                            TEXT_DARK,
                          fontWeight: 800,
                          fontSize: 16,
                        }}
                      >
                        {formatDate(
                          b.checkinAt
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button
                    disabled={loading}
                    onClick={() =>
                      nav(
                        `/checkout/${b.bookingId}`
                      )
                    }
                    style={{
                      width: "100%",
                      marginTop: 20,
                      padding: "16px",
                      borderRadius: 20,
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 800,
                      fontSize: 16,
                      background:
                        "linear-gradient(135deg,#4A0080,#6F1AB6)",
                      color: "#FFF",
                      boxShadow:
                        "0 10px 24px rgba(74,0,128,0.22)",
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