// Booking/src/pages/Bookings.tsx
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useRooms } from "../hooks/useRooms";
import type { Room } from "../types/Room";
import LiffNav from "../components/LiffNav";

export default function Bookings() {
  const { rooms, loading } = useRooms(true);
  const nav = useNavigate();
  const [floor, setFloor] = useState(1);

  const roomsByFloor = useMemo(() => {
    const s = floor * 100 + 1;
    const e = floor * 100 + 100;
    return rooms.filter((r) => {
      const num = parseInt(r.number, 10);
      return num >= s && num <= e;
    });
  }, [rooms, floor]);

  const sortedRooms = useMemo(() => {
    return [...roomsByFloor].sort((a, b) => {
      if (a.status === 0 && b.status !== 0) return -1;
      if (a.status !== 0 && b.status === 0) return 1;
      return parseInt(a.number) - parseInt(b.number);
    });
  }, [roomsByFloor]);

  const handleSelect = (room: Room) => {
    if (room.status !== 0) return;
    nav(`/bookings/${room.roomId}`, { state: room });
  };

  return (
    <>
      {/* NAV */}
      <LiffNav />

      {/* CONTENT */}
      <div style={{ paddingTop: "78px", background: "#f6faff", minHeight: "100vh" }}>
        <div className="container">
          {/* HEADER CARD */}
          <div
            className="shadow-sm p-4 mb-4 rounded-4"
            style={{
              background: "linear-gradient(135deg,#38A3FF,#7B2CBF)",
              color: "white",
              boxShadow: "0 5px 18px rgba(0,0,0,0.22)",
            }}
          >
            <h3 className="fw-bold mb-1 text-center">รายการห้องพัก SmartDorm</h3>
            <p className="text-center mb-0 opacity-75">เลือกชั้นเพื่อดูห้องว่าง</p>
          </div>

          {/* SELECT FLOOR */}
          <div className="d-flex justify-content-center mb-4">
            <div className="input-group" style={{ maxWidth: "320px" }}>
              <label className="input-group-text fw-semibold bg-primary text-white">
                เลือกชั้น
              </label>
              <select
                className="form-select fw-semibold"
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    ชั้น {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="text-center text-muted py-4">
              ⏳ กำลังโหลดข้อมูลห้อง...
            </div>
          ) : sortedRooms.length === 0 ? (
            <div className="text-center text-muted py-4">
              ❌ ไม่มีห้องในชั้น {floor}
            </div>
          ) : (
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
              {sortedRooms.map((room) => {
                const isAvailable = room.status === 0;

                return (
                  <div key={room.roomId} className="col">
                    <div
                      className="card h-100 border-0 shadow-sm"
                      style={{
                        borderRadius: "18px",
                        background: isAvailable ? "white" : "#f1f1f1",
                      }}
                    >
                      <div className="card-body text-center d-flex flex-column">
                        <h4 className="fw-bold mb-2 text-primary">
                          ห้อง {room.number}
                        </h4>

                        <small className="text-muted">
                          ขนาด : {room.size}
                        </small>
                        <small className="text-muted">
                          ค่าเช่า : {room.rent.toLocaleString()} บาท
                        </small>

                        {/* STATUS */}
                        <div className="mt-2 mb-3">
                          {room.status === 0 ? (
                            <span className="badge bg-success px-3 py-2 rounded-pill">
                              ว่าง
                            </span>
                          ) : (
                            <span className="badge bg-danger px-3 py-2 rounded-pill">
                              ไม่ว่าง
                            </span>
                          )}
                        </div>

                        {/* BUTTON */}
                        {isAvailable && (
                          <button
                            className="btn fw-semibold w-100 text-dark mt-auto"
                            style={{
                              background:
                                "linear-gradient(90deg,#FFD43B,#00FF66)",
                              borderRadius: "12px",
                              transition: ".25s",
                              border: "none",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background =
                                "linear-gradient(90deg,#FFC107,#00FF66)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background =
                                "linear-gradient(90deg,#FFD43B,#00FF66)")
                            }
                            onClick={() => handleSelect(room)}
                          >
                            เลือกห้องนี้
                          </button>
                        )}
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