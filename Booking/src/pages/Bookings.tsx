// src/pages/Booking.tsx

import { useMemo, useState } from "react";

const BG = "#F7F5FA";
const CARD = "#FFFFFF";

interface Room {
  roomId: string;
  number: string;
  width: number;
  length: number;
  price: number;
  deposit: number;
  bookingFee: number;
  floor: number;
}

export default function RoomList({
  rooms,
}: {
  rooms: Room[];
}) {
  const [selectedFloor, setSelectedFloor] =
    useState("ทั้งหมด");

  /* FLOOR OPTIONS */
  const floorOptions = useMemo(() => {
    const floors = rooms.map((r) =>
      String(r.floor)
    );

    return [
      "ทั้งหมด",
      ...Array.from(new Set(floors)),
    ];
  }, [rooms]);

  /* FILTER */
  const filteredRooms = useMemo(() => {
    if (selectedFloor === "ทั้งหมด")
      return rooms;

    return rooms.filter(
      (r) =>
        String(r.floor) ===
        selectedFloor
    );
  }, [rooms, selectedFloor]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        padding: "78px 12px 30px",
        fontFamily:
          "Prompt, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: CARD,
            borderRadius: 28,
            overflow: "hidden",
            marginBottom: 18,
            boxShadow:
              "0 8px 24px rgba(74,0,128,.08)",
          }}
        >
          <div
            style={{
              height: 6,
              background:
                "linear-gradient(90deg,#4A0080,#7B2BC7)",
            }}
          />

          <div
            style={{
              padding: 24,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 38,
                lineHeight: 1.1,
                color: "#2563EB",
                fontWeight: 800,
              }}
            >
              🏢 รายการห้องพัก
            </h1>

            <p
              style={{
                marginTop: 10,
                marginBottom: 0,
                color: "#6B6480",
                fontSize: 15,
              }}
            >
              เลือกชั้นเพื่อดูห้องว่าง
            </p>
          </div>
        </div>

        {/* FILTER */}
        <div
          style={{
            background: CARD,
            borderRadius: 24,
            padding: 18,
            marginBottom: 20,
            boxShadow:
              "0 8px 24px rgba(74,0,128,.08)",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#2563EB",
              marginBottom: 10,
            }}
          >
            เลือกชั้น :
          </div>

          <select
            value={selectedFloor}
            onChange={(e) =>
              setSelectedFloor(
                e.target.value
              )
            }
            style={{
              width: 180,
              border:
                "1px solid #E6DDF5",
              borderRadius: 14,
              padding:
                "12px 14px",
              background: "#FAF9FC",
              fontWeight: 700,
              fontSize: 15,
              outline: "none",
            }}
          >
            {floorOptions.map((f) => (
              <option
                key={f}
                value={f}
              >
                {f === "ทั้งหมด"
                  ? "ทุกชั้น"
                  : `ชั้น ${f}`}
              </option>
            ))}
          </select>
        </div>

        {/* ROOM LIST */}
        <div className="row g-3">
          {filteredRooms.map((room) => (
            <div
              key={room.roomId}
              className="
                col-6
                col-md-4
                col-xl-3
              "
            >
              {/* CARD */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 24,
                  padding: 16,
                  boxShadow:
                    "0 8px 24px rgba(74,0,128,0.08)",
                  border:
                    "1px solid rgba(74,0,128,0.06)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* TOP */}
                <div
                  className="d-flex justify-content-between align-items-start mb-3"
                >
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color:
                          "#7E7695",
                        fontWeight: 600,
                        marginBottom: 4,
                      }}
                    >
                      หมายเลขห้อง
                    </div>

                    <div
                      style={{
                        fontSize:
                          "2rem",
                        fontWeight: 800,
                        color:
                          "#2563EB",
                        lineHeight: 1,
                      }}
                    >
                      {room.number}
                    </div>
                  </div>

                  <div
                    style={{
                      background:
                        "#DDF5E8",
                      color:
                        "#1D7A46",
                      padding:
                        "6px 12px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    ว่าง
                  </div>
                </div>

                {/* INFO */}
                <div
                  className="d-flex flex-column gap-2"
                >
                  <InfoBox
                    label="ขนาดห้อง"
                    value={`${room.width} × ${room.length} ม.`}
                  />

                  <InfoBox
                    label="ค่าเช่า"
                    value={`${room.price.toLocaleString()} บาท`}
                  />

                  <InfoBox
                    label="ค่าประกัน"
                    value={`${room.deposit.toLocaleString()} บาท`}
                  />

                  <InfoBox
                    label="ค่าจอง"
                    value={`${room.bookingFee.toLocaleString()} บาท`}
                  />
                </div>

                {/* TOTAL */}
                <div
                  style={{
                    marginTop: "auto",
                    background:
                      "linear-gradient(135deg,#4A0080,#6F1AB6)",
                    borderRadius: 18,
                    padding:
                      "14px 16px",
                    color: "#fff",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      opacity: 0.9,
                      marginBottom: 4,
                    }}
                  >
                    รวมทั้งหมด
                  </div>

                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                    }}
                  >
                    ฿{" "}
                    {(
                      room.price +
                      room.deposit +
                      room.bookingFee
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= INFO BOX ================= */

function InfoBox({
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
        borderRadius: "14px",
        padding: "12px 12px",
        gap: "10px",
      }}
    >
      <div
        style={{
          color: "#7A7391",
          fontSize: "11px",
          fontWeight: 600,
        }}
      >
        {label}
      </div>

      <div
        className="fw-bold text-end"
        style={{
          color: "#2D1A47",
          fontSize: "13px",
        }}
      >
        {value}
      </div>
    </div>
  );
}