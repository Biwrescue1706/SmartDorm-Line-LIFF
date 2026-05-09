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
        className="min-vh-100 py-4"
        style={{
          background: "#F6F4FA",
        }}
      >
        <div className="container">

          {/* HEADER */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 mt-5">

            <div
              style={{
                height: 6,
                background:
                  "linear-gradient(90deg,#4A0080 0%, #7B2BC7 100%)",
              }}
            />

            <div className="card-body p-4">
              <h1 className="fw-bold text-primary mb-2">
                🏢 รายการห้องพัก
              </h1>

              <p className="text-muted mb-0">
                เลือกชั้นเพื่อดูห้องว่าง
              </p>
            </div>
          </div>

          {/* FILTER */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body d-flex flex-wrap align-items-center gap-3">

              <div className="fw-bold text-primary">
                เลือกชั้น :
              </div>

              <select
                className="form-select w-auto rounded-3 fw-semibold"
                value={selectedFloor}
                onChange={(e) =>
                  setSelectedFloor(
                    e.target.value
                  )
                }
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
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body text-center py-5">

                <div className="spinner-border text-primary"></div>

                <p className="text-muted mt-3 mb-0">
                  กำลังโหลดข้อมูลห้อง...
                </p>

              </div>
            </div>
          ) : sortedRooms.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body text-center py-5 text-muted">
                ❌ ไม่มีห้องในชั้นที่เลือก
              </div>
            </div>
          ) : (
            <div className="row g-4">

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
                    className="col-12 col-sm-6 col-lg-4 col-xl-3"
                  >
                    <div
                      className={`card h-100 border-0 shadow-sm rounded-4 ${
                        !isAvailable
                          ? "opacity-75"
                          : ""
                      }`}
                      style={{
                        cursor:
                          isAvailable
                            ? "pointer"
                            : "default",
                        transition:
                          "0.2s",
                      }}
                      onClick={
                        isAvailable
                          ? () =>
                              handleSelect(
                                room
                              )
                          : undefined
                      }
                    >
                      <div className="card-body p-4 d-flex flex-column">

                        {/* TOP */}
                        <div className="d-flex justify-content-between align-items-start mb-4">

                          <div>
                            <small className="text-muted fw-semibold d-block mb-1">
                              หมายเลขห้อง
                            </small>

                            <h2 className="fw-bold text-primary mb-0">
                              {room.number}
                            </h2>
                          </div>

                          <span
                            className={`badge rounded-pill px-3 py-2 ${
                              isAvailable
                                ? "bg-success-subtle text-success"
                                : "bg-danger-subtle text-danger"
                            }`}
                          >
                            {isAvailable
                              ? "ว่าง"
                              : "ไม่ว่าง"}
                          </span>

                        </div>

                        {/* INFO */}
                        <div className="d-flex flex-column gap-2">

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
                                className="d-flex justify-content-between align-items-center rounded-3 p-3"
                                style={{
                                  background:
                                    "#FAF9FC",
                                  border:
                                    "1px solid #EFE9F7",
                                }}
                              >
                                <small className="text-muted fw-semibold">
                                  {label}
                                </small>

                                <span className="fw-bold text-dark">
                                  {value}
                                </span>
                              </div>
                            )
                          )}

                        </div>

                        {/* TOTAL */}
                        <div
                          className="rounded-4 text-white p-3 mt-4"
                          style={{
                            background:
                              "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                          }}
                        >
                          <small
                            style={{
                              opacity: 0.85,
                            }}
                          >
                            รวมทั้งหมด
                          </small>

                          <h4 className="fw-bold mb-0 mt-1">
                            ฿{" "}
                            {total.toLocaleString()}
                          </h4>
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