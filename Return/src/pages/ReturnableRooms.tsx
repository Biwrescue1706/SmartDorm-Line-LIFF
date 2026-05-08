// src/pages/ReturnableRooms.tsx

import { useMemo, useState } from "react";
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

        <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3"></div>

            <div className="fw-semibold text-primary">
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
        className="min-vh-100 py-5"
        style={{
          background:
            "linear-gradient(135deg,#F6F4FA 0%,#FCFBFF 100%)",
          paddingTop: "88px",
        }}
      >
        <div className="container">

          {/* HEADER */}
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">

              <div className="card border-0 shadow-sm rounded-5 overflow-hidden mb-4">

                <div
                  style={{
                    height: 6,
                    background:
                      "linear-gradient(90deg,#4A0080 0%, #7B2BC7 100%)",
                  }}
                />

                <div className="card-body p-4">
                  <h2
                    className="fw-bold mb-2"
                    style={{
                      color: "#4A0080",
                    }}
                  >
                    🏠 คืนห้องพัก
                  </h2>

                  <p className="text-muted mb-0">
                    เลือกห้องที่ต้องการดำเนินการคืนห้องพัก
                  </p>
                </div>

              </div>

              {/* FILTER */}
              {!loading &&
                bookings.length > 0 && (
                  <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body">

                      <label className="form-label fw-bold text-primary">
                        เลือกห้องที่จะคืน
                      </label>

                      <select
                        className="form-select form-select-lg rounded-4"
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
                <div className="card border-0 shadow-sm rounded-5">
                  <div className="card-body text-center py-5">

                    <div className="spinner-border text-primary mb-3"></div>

                    <div className="fw-semibold text-primary">
                      กำลังโหลดข้อมูล...
                    </div>

                  </div>
                </div>
              ) : filteredBookings.length ===
                0 ? (
                <div className="card border-0 shadow-sm rounded-5">
                  <div className="card-body text-center py-5">

                    <div
                      style={{
                        fontSize: 54,
                      }}
                    >
                      🏡
                    </div>

                    <h4 className="fw-bold mt-3">
                      ไม่มีห้องที่สามารถคืนได้
                    </h4>

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
                        className="card border-0 shadow-sm rounded-5 overflow-hidden"
                      >
                        {/* TOP BAR */}
                        <div
                          style={{
                            height: 6,
                            background:
                              "linear-gradient(90deg,#4A0080 0%, #7B2BC7 100%)",
                          }}
                        />

                        <div className="card-body p-4">

                          {/* TOP */}
                          <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>
                              <div className="text-muted small fw-semibold mb-1">
                                ห้องพัก
                              </div>

                              <h1
                                className="fw-bold mb-0"
                                style={{
                                  color:
                                    "#4A0080",
                                  fontSize:
                                    "42px",
                                }}
                              >
                                {b.room
                                  ?.number ??
                                  "-"}
                              </h1>
                            </div>

                            <span className="badge rounded-pill text-bg-success px-3 py-2 fs-6">
                              พร้อมคืน
                            </span>

                          </div>

                          {/* INFO */}
                          <div className="row g-3">

                            <div className="col-12 col-md-6">
                              <div className="bg-light rounded-4 p-3 h-100 border">

                                <div className="small text-muted fw-semibold mb-1">
                                  วันที่จอง
                                </div>

                                <div className="fw-bold">
                                  {formatDate(
                                    b.bookingDate
                                  )}
                                </div>

                              </div>
                            </div>

                            <div className="col-12 col-md-6">
                              <div className="bg-light rounded-4 p-3 h-100 border">

                                <div className="small text-muted fw-semibold mb-1">
                                  วันเข้าพักจริง
                                </div>

                                <div className="fw-bold">
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
                            className="btn w-100 text-white fw-bold py-3 rounded-4 mt-4"
                            style={{
                              background:
                                "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                              border:
                                "none",
                              boxShadow:
                                "0 8px 20px rgba(74,0,128,0.18)",
                              fontSize:
                                "16px",
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