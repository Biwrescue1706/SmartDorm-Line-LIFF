import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useRooms } from "../hooks/useRooms";
import type { Room } from "../types/Room";
import LiffNav from "../components/LiffNav";

/* ------------------ HELPERS ------------------ */
const getFloor = (
  roomNumber: string | number
): number | null => {
  const num = Number(roomNumber);

  if (isNaN(num)) return null;

  return Math.floor(num / 100);
};

export default function Bookings() {
  const { rooms, loading } = useRooms(true);

  const nav = useNavigate();

  const [selectedFloor, setSelectedFloor] =
    useState<string>("1");

  const allFloors = useMemo(() => {
    const floors = rooms
      .map((r) => getFloor(r.number))
      .filter(
        (f): f is number => f !== null
      );

    return Array.from(new Set(floors)).sort(
      (a, b) => a - b
    );
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    if (selectedFloor === "ทั้งหมด")
      return rooms;

    const floorNum = Number(selectedFloor);

    return rooms.filter(
      (r) =>
        getFloor(r.number) === floorNum
    );
  }, [rooms, selectedFloor]);

  const sortedRooms = useMemo(() => {
    return [...filteredRooms].sort(
      (a, b) => {
        if (
          a.status === 0 &&
          b.status !== 0
        )
          return -1;

        if (
          a.status !== 0 &&
          b.status === 0
        )
          return 1;

        return (
          parseInt(a.number) -
          parseInt(b.number)
        );
      }
    );
  }, [filteredRooms]);

  const handleSelect = (room: Room) => {
    if (room.status !== 0) return;

    nav(`/bookings/${room.roomId}`, {
      state: room,
    });
  };

  return (
    <>
      <LiffNav />

      <div
        style={{
          minHeight: "100vh",
          background: "#F6F4FA",
          padding:
            "88px 16px 40px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: "#fff",
              borderRadius: 32,
              padding: 28,
              marginBottom: 24,
              boxShadow:
                "0 12px 28px rgba(74,0,128,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 6,
                background:
                  "linear-gradient(90deg,#4A0080 0%, #7B2BC7 100%)",
              }}
            />

            <h1
              style={{
                margin: 0,
                fontSize: 34,
                fontWeight: 800,
                color: "#4A0080",
                marginBottom: 10,
              }}
            >
              🏢 รายการห้องพัก
            </h1>

            <p
              style={{
                margin: 0,
                color: "#7B7490",
                fontSize: 15,
              }}
            >
              เลือกชั้นเพื่อดูห้องว่าง
            </p>
          </div>

          {/* FILTER */}
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: 20,
              marginBottom: 24,
              boxShadow:
                "0 12px 28px rgba(74,0,128,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                color: "#4A0080",
                fontWeight: 700,
                fontSize: 16,
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
                border:
                  "1.5px solid #D9CFF0",
                borderRadius: 14,
                padding:
                  "12px 16px",
                background: "#FAF9FC",
                color: "#2D1A47",
                fontWeight: 700,
                outline: "none",
                minWidth: 140,
              }}
            >
              <option value="ทั้งหมด">
                ทุกชั้น
              </option>

              {allFloors.map((f) => (
                <option
                  key={f}
                  value={f.toString()}
                >
                  ชั้น {f}
                </option>
              ))}
            </select>
          </div>

          {/* CONTENT */}
          {loading ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 28,
                padding: 50,
                textAlign: "center",
                boxShadow:
                  "0 12px 28px rgba(74,0,128,0.08)",
              }}
            >
              <div className="spinner-border text-primary"></div>

              <p
                style={{
                  marginTop: 18,
                  color: "#7B7490",
                }}
              >
                กำลังโหลดข้อมูลห้อง...
              </p>
            </div>
          ) : sortedRooms.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 28,
                padding: 50,
                textAlign: "center",
                boxShadow:
                  "0 12px 28px rgba(74,0,128,0.08)",
                color: "#7B7490",
              }}
            >
              ❌ ไม่มีห้องในชั้นที่เลือก
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill,minmax(260px,1fr))",
                gap: 20,
              }}
            >
              {sortedRooms.map((room) => {
                const isAvailable =
                  room.status === 0;

                const total =
                  room.rent +
                  room.deposit +
                  room.bookingFee;

                return (
                  <div
                    key={room.roomId}
                    onClick={
                      isAvailable
                        ? () =>
                            handleSelect(
                              room
                            )
                        : undefined
                    }
                    style={{
                      background:
                        "#fff",
                      borderRadius: 28,
                      padding: 22,
                      boxShadow:
                        "0 12px 28px rgba(74,0,128,0.08)",
                      cursor:
                        isAvailable
                          ? "pointer"
                          : "default",
                      transition:
                        "0.2s",
                      opacity:
                        isAvailable
                          ? 1
                          : 0.65,
                      border:
                        isAvailable
                          ? "1px solid #EFE9F7"
                          : "1px solid #E5E7EB",
                    }}
                  >
                    {/* ROOM NUMBER */}
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
                              "#7B7490",
                            marginBottom: 6,
                            fontWeight: 600,
                          }}
                        >
                          หมายเลขห้อง
                        </div>

                        <div
                          style={{
                            fontSize: 30,
                            fontWeight: 800,
                            color:
                              "#4A0080",
                          }}
                        >
                          {room.number}
                        </div>
                      </div>

                      <div
                        style={{
                          background:
                            isAvailable
                              ? "#DCFCE7"
                              : "#FEE2E2",
                          color:
                            isAvailable
                              ? "#166534"
                              : "#B91C1C",
                          padding:
                            "8px 14px",
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {isAvailable
                          ? "ว่าง"
                          : "ไม่ว่าง"}
                      </div>
                    </div>

                    {/* INFO */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection:
                          "column",
                        gap: 10,
                      }}
                    >
                      {[
                        [
                          "ขนาดห้อง",
                          room.size,
                        ],
                        [
                          "ค่าเช่า",
                          `${room.rent.toLocaleString()} บาท`,
                        ],
                        [
                          "ค่าประกัน",
                          `${room.deposit.toLocaleString()} บาท`,
                        ],
                        [
                          "ค่าจอง",
                          `${room.bookingFee.toLocaleString()} บาท`,
                        ],
                      ].map(
                        (
                          [label, value],
                          i
                        ) => (
                          <div
                            key={i}
                            style={{
                              background:
                                "#FAF9FC",
                              borderRadius: 16,
                              padding:
                                "12px 14px",
                              border:
                                "1px solid #EFE9F7",
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                color:
                                  "#7B7490",
                                fontWeight: 600,
                              }}
                            >
                              {label}
                            </span>

                            <span
                              style={{
                                fontWeight: 700,
                                color:
                                  "#2D1A47",
                              }}
                            >
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    {/* TOTAL */}
                    <div
                      style={{
                        marginTop: 18,
                        background:
                          "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                        borderRadius: 18,
                        padding:
                          "16px 18px",
                        color: "#fff",
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            opacity: 0.9,
                            marginBottom: 4,
                          }}
                        >
                          รวมทั้งหมด
                        </div>

                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 800,
                          }}
                        >
                          ฿{" "}
                          {total.toLocaleString()}
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
    </>
  );
}