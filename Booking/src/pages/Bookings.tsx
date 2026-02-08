// Booking/src/pages/Bookings.tsx
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useRooms } from "../hooks/useRooms";
import type { Room } from "../types/Room";
import LiffNav from "../components/LiffNav";

/* ------------------ HELPERS ------------------ */
const getFloor = (roomNumber: string | number): number | null => {
  const num = Number(roomNumber);
  if (isNaN(num)) return null;
  return Math.floor(num / 100);
};

export default function Bookings() {
  const { rooms, loading } = useRooms(true);
  const nav = useNavigate();

  // ใช้ string เพื่อรองรับ "ทั้งหมด"
  const [selectedFloor, setSelectedFloor] = useState<string>("ทั้งหมด");

  /* ------------------ FLOORS ------------------ */
  const allFloors = useMemo(() => {
    const floors = rooms
      .map((r) => getFloor(r.number))
      .filter((f): f is number => f !== null);

    return Array.from(new Set(floors)).sort((a, b) => a - b);
  }, [rooms]);

  /* ------------------ FILTER ------------------ */
  const filteredRooms = useMemo(() => {
    if (selectedFloor === "ทั้งหมด") return rooms;

    const floorNum = Number(selectedFloor);
    return rooms.filter((r) => getFloor(r.number) === floorNum);
  }, [rooms, selectedFloor]);

  /* ------------------ SORT ------------------ */
  const sortedRooms = useMemo(() => {
    return [...filteredRooms].sort((a, b) => {
      if (a.status === 0 && b.status !== 0) return -1;
      if (a.status !== 0 && b.status === 0) return 1;
      return parseInt(a.number) - parseInt(b.number);
    });
  }, [filteredRooms]);

  /* ------------------ ACTION ------------------ */
  const handleSelect = (room: Room) => {
    if (room.status !== 0) return;
    nav(`/bookings/${room.roomId}`, { state: room });
  };

  return (
    <>
      <LiffNav />

      <div
        style={{
          paddingTop: "78px",
          paddingBottom: "60px",
          background: "#f6faff",
          minHeight: "100vh",
        }}
      >
        <div className="container">
          {/* HEADER */}
          <div
            className="shadow-sm p-4 mb-4 rounded-4"
            style={{
              background: "linear-gradient(135deg,#38A3FF,#7B2CBF)",
              color: "white",
            }}
          >
            <h3 className="fw-bold mb-1 text-center">
              รายการห้องพัก SmartDorm
            </h3>
            <p className="text-center mb-0 opacity-75">
              เลือกชั้นเพื่อดูห้องว่าง
            </p>
          </div>

          {/* FLOOR SELECTOR */}
          <div className="text-center mb-4">
            <label className="fw-semibold me-2 fs-5 text-primary">
              เลือกชั้น :
            </label>
            <select
              className="form-select d-inline-block text-center fw-semibold shadow-sm"
              style={{
                width: "170px",
                borderRadius: "12px",
              }}
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              <option value="ทั้งหมด">ทุกชั้น</option>
              {allFloors.map((f) => (
                <option key={f} value={f.toString()}>
                  ชั้น {f}
                </option>
              ))}
            </select>
          </div>

          {/* CONTENT */}
          {loading ? (
            <div className="text-center text-muted py-4">
              ⏳ กำลังโหลดข้อมูลห้อง...
            </div>
          ) : sortedRooms.length === 0 ? (
            <div className="text-center text-muted py-4">
              ❌ ไม่มีห้องในชั้นที่เลือก
            </div>
          ) : (
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
              {sortedRooms.map((room) => {
                const isAvailable = room.status === 0;
                const total = room.rent + room.deposit + room.bookingFee;

                return (
                  <div key={room.roomId} className="col">
                    <div
                      className="card h-100 border-0 shadow-sm"
                      style={{
                        borderRadius: "12px",
                        background: isAvailable ? "white" : "#f1f1f1",
                        cursor: isAvailable ? "pointer" : "default",
                        pointerEvents: isAvailable ? "auto" : "none",
                        opacity: isAvailable ? 1 : 0.6,
                        transition: "transform .1s ease, box-shadow .1s ease",
                      }}
                      onClick={isAvailable ? () => handleSelect(room) : undefined}
                      onMouseDown={(e) => {
                        if (isAvailable)
                          e.currentTarget.style.transform = "scale(0.97)";
                      }}
                      onMouseUp={(e) => {
                        if (isAvailable)
                          e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <div className="card-body text-center d-flex flex-column">
                        <h4 className="fw-bold mb-2 text-primary">
                          ห้อง {room.number}
                        </h4>

                        <small>ขนาด : {room.size}</small>
                        <small>ค่าเช่า : {room.rent.toLocaleString()}</small>
                        <small>
                          ค่าประกัน : {room.deposit.toLocaleString()}
                        </small>
                        <small>
                          ค่าจอง : {room.bookingFee.toLocaleString()}
                        </small>

                        <small className="fw-semibold text-success mt-1">
                          รวมทั้งหมด : {total.toLocaleString()}
                        </small>

                        <div className="mt-2">
                          {isAvailable ? (
                            <span className="badge bg-success rounded-pill">
                              ว่าง
                            </span>
                          ) : (
                            <span className="badge bg-danger rounded-pill">
                              ไม่ว่าง
                            </span>
                          )}
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