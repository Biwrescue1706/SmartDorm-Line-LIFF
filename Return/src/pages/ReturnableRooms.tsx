// src/pages/ReturnableRooms.tsx

import {
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import LiffNav from "../components/LiffNav";
import { useReturnableRooms } from "../hooks/useReturnableRooms";

export default function ReturnableRooms() {
  const nav = useNavigate();

  const {
    checkingAuth,
    loading,
    bookings,
    formatDate,
  } = useReturnableRooms();

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

  // filter
  const filteredBookings = useMemo(() => {
    if (selectedRoom === "ทั้งหมด")
      return bookings;

    return bookings.filter(
      (b) =>
        b.room?.number === selectedRoom
    );
  }, [bookings, selectedRoom]);

  if (checkingAuth) {
    return (
      <>
        <LiffNav />

        <div
          className="min-vh-100 d-flex justify-content-center align-items-center"
          style={{
            background:
              "linear-gradient(135deg,#F6F4FA,#FCFBFF)",
          }}
        >
          <div className="text-center">

            <div
              className="spinner-border mb-3"
              style={{
                color: "#6E1AB5",
                width: "3rem",
                height: "3rem",
              }}
            />

            <div
              className="fw-bold"
              style={{
                color: "#4A0080",
                fontSize: "17px",
              }}
            >
              กำลังตรวจสอบสิทธิ์...
            </div>

          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LiffNav />

      <div
        className="min-vh-100 py-4"
        style={{
          background:
            "linear-gradient(180deg,#F7F3FC 0%,#FCFBFF 100%)",
        }}
      >
        <div className="container">

          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">

              {/* HEADER */}
              <div
                className="card border-0 rounded-5 overflow-hidden mb-4"
                style={{
                  boxShadow:
                    "0 12px 30px rgba(74,0,128,.10)",
                }}
              >
                <div
                  style={{
                    height: "8px",
                    background:
                      "linear-gradient(90deg,#4A0080,#7B2BC7)",
                  }}
                />

                <div className="card-body p-4 p-md-5">

                  <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">

                    {/* ICON */}
                    <div
                      className="d-flex justify-content-center align-items-center rounded-4"
                      style={{
                        width: "78px",
                        height: "78px",
                        background:
                          "linear-gradient(135deg,#EEE5FF,#F8F4FF)",
                        fontSize: "42px",
                        flexShrink: 0,
                      }}
                    >
                      🏠
                    </div>

                    {/* TITLE */}
                    <div>
                      <h1
                        className="fw-bold mb-2"
                        style={{
                          color: "#4A0080",
                          fontSize:
                            "clamp(2rem,7vw,2.8rem)",
                          lineHeight: 1,
                        }}
                      >
                        คืนห้องพัก
                      </h1>

                      <div
                        className="text-muted"
                        style={{
                          fontSize: "15px",
                        }}
                      >
                        เลือกห้องที่ต้องการคืน
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* FILTER */}
              {!loading &&
                bookings.length > 0 && (
                  <div
                    className="card border-0 rounded-5 mb-4 overflow-hidden"
                    style={{
                      boxShadow:
                        "0 10px 24px rgba(74,0,128,.08)",
                    }}
                  >
                    <div className="card-body p-4">

                      <label
                        className="fw-bold mb-3 d-block"
                        style={{
                          color: "#4A0080",
                          fontSize: "16px",
                        }}
                      >
                        🔎 เลือกห้องที่จะคืน
                      </label>

                      <select
                        className="form-select rounded-4 border-0"
                        style={{
                          background:
                            "#F7F4FC",
                          padding:
                            "14px 16px",
                          fontWeight: 700,
                          color:
                            "#2D1A47",
                          boxShadow:
                            "inset 0 0 0 1px #E9DDF8",
                          fontSize:
                            "1rem",
                        }}
                        value={selectedRoom}
                        onChange={(e) =>
                          setSelectedRoom(
                            e.target.value
                          )
                        }
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
                  </div>
                )}

              {/* LOADING */}
              {loading ? (
                <div
                  className="card border-0 rounded-5 overflow-hidden"
                  style={{
                    boxShadow:
                      "0 10px 24px rgba(74,0,128,.08)",
                  }}
                >
                  <div className="card-body text-center py-5">

                    <div
                      className="spinner-border mb-3"
                      style={{
                        color: "#6E1AB5",
                      }}
                    />

                    <div
                      className="fw-bold"
                      style={{
                        color: "#4A0080",
                      }}
                    >
                      กำลังโหลดข้อมูล...
                    </div>

                  </div>
                </div>
              ) : filteredBookings.length ===
                0 ? (
                <div
                  className="card border-0 rounded-5 overflow-hidden"
                  style={{
                    boxShadow:
                      "0 10px 24px rgba(74,0,128,.08)",
                  }}
                >
                  <div className="card-body text-center py-5">

                    <div
                      style={{
                        fontSize: 70,
                      }}
                    >
                      🏡
                    </div>

                    <h3
                      className="fw-bold mt-3"
                      style={{
                        color: "#2D1A47",
                      }}
                    >
                      ไม่มีห้องที่สามารถคืนได้
                    </h3>

                    <p className="text-muted mb-0">
                      ยังไม่มีรายการห้องในระบบ
                    </p>

                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">

                  {filteredBookings.map(
                    (b) => (
                      <div
                        key={b.bookingId}
                        className="card border-0 rounded-5 overflow-hidden"
                        style={{
                          boxShadow:
                            "0 12px 28px rgba(74,0,128,.10)",
                        }}
                      >
                        {/* TOP LINE */}
                        <div
                          style={{
                            height: "7px",
                            background:
                              "linear-gradient(90deg,#4A0080,#7B2BC7)",
                          }}
                        />

                        <div className="card-body p-4">

                          {/* ROOM HEADER */}
                          <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">

                            <div>

                              <div
                                className="fw-semibold mb-1"
                                style={{
                                  color:
                                    "#8A7FA6",
                                  fontSize:
                                    "13px",
                                }}
                              >
                                หมายเลขห้อง
                              </div>

                              <div
                                className="fw-bold"
                                style={{
                                  color:
                                    "#2563EB",
                                  fontSize:
                                    "clamp(3rem,14vw,4.5rem)",
                                  lineHeight:
                                    1,
                                }}
                              >
                                {b.room
                                  ?.number ??
                                  "-"}
                              </div>

                            </div>

                            <span
                              className="badge rounded-pill align-self-start"
                              style={{
                                background:
                                  "#DCFCE7",
                                color:
                                  "#166534",
                                padding:
                                  "10px 16px",
                                fontSize:
                                  "13px",
                                fontWeight:
                                  700,
                              }}
                            >
                              พร้อมคืน
                            </span>

                          </div>

                          {/* INFO */}
                          <div className="row g-3">

                            <div className="col-12 col-md-6">
                              <div
                                className="rounded-4 h-100 p-3"
                                style={{
                                  background:
                                    "#FAF8FE",
                                  border:
                                    "1px solid #EFE7FA",
                                }}
                              >
                                <div
                                  className="fw-semibold mb-2"
                                  style={{
                                    color:
                                      "#8B84A3",
                                    fontSize:
                                      "13px",
                                  }}
                                >
                                  📅 วันที่จอง
                                </div>

                                <div
                                  className="fw-bold"
                                  style={{
                                    color:
                                      "#2D1A47",
                                    fontSize:
                                      "16px",
                                  }}
                                >
                                  {formatDate(
                                    b.bookingDate
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="col-12 col-md-6">
                              <div
                                className="rounded-4 h-100 p-3"
                                style={{
                                  background:
                                    "#FAF8FE",
                                  border:
                                    "1px solid #EFE7FA",
                                }}
                              >
                                <div
                                  className="fw-semibold mb-2"
                                  style={{
                                    color:
                                      "#8B84A3",
                                    fontSize:
                                      "13px",
                                  }}
                                >
                                  🛏️ วันเข้าพักจริง
                                </div>

                                <div
                                  className="fw-bold"
                                  style={{
                                    color:
                                      "#2D1A47",
                                    fontSize:
                                      "16px",
                                  }}
                                >
                                  {formatDate(
                                    b.checkinAt
                                  )}
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* BUTTON */}
                          <button
                            disabled={
                              loading
                            }
                            onClick={() =>
                              nav(
                                `/checkout/${b.bookingId}`
                              )
                            }
                            className="btn w-100 fw-bold py-3 rounded-4 mt-4 text-white"
                            style={{
                              border:
                                "none",
                              fontSize:
                                "17px",
                              background:
                                "linear-gradient(135deg,#4A0080,#6E1AB5)",
                              boxShadow:
                                "0 10px 24px rgba(74,0,128,.20)",
                            }}
                          >
                            คืนห้อง
                          </button>

                        </div>
                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </>
  );
}