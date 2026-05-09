// src/pages/Bookings.tsx

import { useMemo, useState } from "react";
import LiffNav from "../components/LiffNav";
import { useRooms } from "../hooks/useRooms";

const CARD = "#FFFFFF";

export default function Bookings() {
  const { rooms, loading } = useRooms();

  const [selectedFloor, setSelectedFloor] =
    useState("ทั้งหมด");

  /* ---------- FLOOR OPTIONS ---------- */
  const floorOptions = useMemo(() => {
    const floors = rooms.map((r) =>
      String(r.floor)
    );

    return [
      "ทั้งหมด",
      ...Array.from(new Set(floors)),
    ];
  }, [rooms]);

  /* ---------- FILTER ---------- */
  const filteredRooms = useMemo(() => {
    if (selectedFloor === "ทั้งหมด")
      return rooms;

    return rooms.filter(
      (r) =>
        String(r.floor) === selectedFloor
    );
  }, [rooms, selectedFloor]);

  return (
    <>
      <LiffNav />

      <div
        className="min-vh-100"
        style={{
          background:
            "linear-gradient(180deg,#F7F4FB 0%, #F4F7FF 100%)",
          paddingTop: "72px",
          fontFamily: "Prompt, sans-serif",
        }}
      >
        <div className="container py-3">

          <div
            className="mx-auto"
            style={{
              maxWidth: "1200px",
            }}
          >
            {/* HEADER */}
            <div
              className="bg-white rounded-5 shadow-sm p-4 mb-4"
              style={{
                border:
                  "1px solid rgba(123,44,191,0.08)",
              }}
            >
              <h1
                className="fw-bold mb-2"
                style={{
                  color: "#2563EB",
                  fontSize: "clamp(2rem,5vw,3.5rem)",
                  lineHeight: 1,
                }}
              >
                🏢 รายการห้องพัก
              </h1>

              <p
                className="mb-0"
                style={{
                  color: "#6B7280",
                }}
              >
                เลือกชั้นเพื่อดูห้องว่าง
              </p>
            </div>

            {/* FILTER */}
            <div
              className="bg-white rounded-5 shadow-sm p-4 mb-4"
              style={{
                border:
                  "1px solid rgba(123,44,191,0.08)",
              }}
            >
              <div className="d-flex align-items-center gap-3 flex-wrap">

                <div
                  className="fw-bold"
                  style={{
                    color: "#2563EB",
                    fontSize: "1.1rem",
                  }}
                >
                  เลือกชั้น :
                </div>

                <select
                  className="form-select"
                  value={selectedFloor}
                  onChange={(e) =>
                    setSelectedFloor(
                      e.target.value
                    )
                  }
                  style={{
                    maxWidth: "150px",
                    borderRadius: "14px",
                    padding: "10px 14px",
                    fontWeight: 600,
                  }}
                >
                  {floorOptions.map((floor) => (
                    <option
                      key={floor}
                      value={floor}
                    >
                      {floor === "ทั้งหมด"
                        ? "ทุกชั้น"
                        : `ชั้น ${floor}`}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" />

                <div className="fw-semibold text-primary">
                  กำลังโหลดข้อมูลห้อง...
                </div>
              </div>
            ) : (
              <div className="row g-4">

                {filteredRooms.map((room) => {
                  const total =
                    room.price +
                    room.deposit +
                    room.bookingFee;

                  return (
                    <div
                      key={room.roomId}
                      className="col-12 col-md-6"
                    >
                      <div
                        className="card border-0 shadow-sm rounded-5 h-100 overflow-hidden"
                        style={{
                          background: CARD,
                        }}
                      >
                        {/* TOP BAR */}
                        <div
                          style={{
                            height: "6px",
                            background:
                              "linear-gradient(90deg,#4A0080,#7B2CBF)",
                          }}
                        />

                        <div className="card-body p-4">

                          {/* TOP */}
                          <div className="d-flex justify-content-between align-items-start mb-4">

                            <div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#6B7280",
                                  fontWeight: 600,
                                  marginBottom: "6px",
                                }}
                              >
                                หมายเลขห้อง
                              </div>

                              <h2
                                className="fw-bold mb-0"
                                style={{
                                  color: "#2563EB",
                                  fontSize: "3rem",
                                  lineHeight: 1,
                                }}
                              >
                                {room.number}
                              </h2>
                            </div>

                            <div
                              className="px-3 py-2 rounded-pill fw-semibold"
                              style={{
                                background:
                                  "#DCFCE7",
                                color:
                                  "#166534",
                                fontSize:
                                  "13px",
                              }}
                            >
                              ว่าง
                            </div>

                          </div>

                          {/* DETAIL */}
                          <div className="d-flex flex-column gap-2">

                            <InfoRow
                              label="ขนาดห้อง"
                              value={`${room.width * room.length} ตร.ม. (${room.width} × ${room.length} ม.)`}
                            />

                            <InfoRow
                              label="ค่าเช่า"
                              value={`${room.price.toLocaleString()} บาท`}
                            />

                            <InfoRow
                              label="ค่าประกัน"
                              value={`${room.deposit.toLocaleString()} บาท`}
                            />

                            <InfoRow
                              label="ค่าจอง"
                              value={`${room.bookingFee.toLocaleString()} บาท`}
                            />

                          </div>

                          {/* TOTAL */}
                          <div
                            className="mt-4 rounded-5 p-4 text-white"
                            style={{
                              background:
                                "linear-gradient(135deg,#5B0DB5,#7E22CE)",
                            }}
                          >
                            <div
                              style={{
                                opacity: 0.9,
                                fontSize: "14px",
                              }}
                            >
                              รวมทั้งหมด
                            </div>

                            <div
                              className="fw-bold"
                              style={{
                                fontSize: "2rem",
                                lineHeight: 1.1,
                              }}
                            >
                              ฿{" "}
                              {total.toLocaleString()}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

/* ---------- INFO ROW ---------- */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="d-flex justify-content-between align-items-center"
      style={{
        background: "#FAF9FC",
        border:
          "1px solid rgba(123,44,191,0.08)",
        borderRadius: "16px",
        padding: "14px 16px",
        gap: "12px",
      }}
    >
      <div
        style={{
          color: "#4B5563",
          fontSize: "14px",
        }}
      >
        {label}
      </div>

      <div
        className="fw-bold text-end"
        style={{
          color: "#111827",
          fontSize: "15px",
        }}
      >
        {value}
      </div>
    </div>
  );
}