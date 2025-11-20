import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useRooms } from "../hooks/useRooms";
import type { Room } from "../types/Room";
import LiffNav from "../components/Nav/LiffNav";
import { API_BASE } from "../config";

export default function Bookings() {
  const { rooms, loading } = useRooms(true);
  const nav = useNavigate();
  const [floor, setFloor] = useState(1);

  /* ===========================================================
     🔐 LOCK ROOM API
     =========================================================== */
  const lockRoom = async (roomId: string) => {
    try {
      const accessToken = localStorage.getItem("liffAccessToken") ?? "";

      const res = await fetch(`${API_BASE}/booking/lock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          userId: "liff-" + accessToken, // ใช้ accessToken เป็น identity
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "ไม่สามารถล็อคห้องได้");
        return null;
      }

      return data.lockedUntil;
    } catch (err) {
      console.error("Lock room error:", err);
      return null;
    }
  };

  /* ===========================================================
     🔽 กรองห้องตามชั้น
     =========================================================== */
  const roomsByFloor = useMemo(() => {
    const start = floor * 100 + 1;
    const end = floor * 100 + 100;
    return rooms.filter((r) => {
      const num = parseInt(r.number, 10);
      return num >= start && num <= end;
    });
  }, [rooms, floor]);

  /* ===========================================================
     📌 เรียงห้อง: ว่างก่อน + ตามเลขห้อง
     =========================================================== */
  const sortedRooms = useMemo(() => {
    return [...roomsByFloor].sort((a, b) => {
      if (a.status === 0 && b.status !== 0) return -1;
      if (a.status !== 0 && b.status === 0) return 1;
      return parseInt(a.number) - parseInt(b.number);
    });
  }, [roomsByFloor]);

  /* ===========================================================
     👉 เมื่อเลือกห้อง (ล็อคก่อน)
     =========================================================== */
  const handleSelect = async (room: Room) => {
    if (room.status !== 0) return;

    // 1) ล็อคห้องก่อน
    const lockedUntil = await lockRoom(room.roomId);

    if (!lockedUntil) {
      alert("❌ ห้องนี้กำลังถูกเลือกโดยผู้อื่นอยู่ กรุณาลองใหม่");
      return;
    }

    // 2) ไปหน้าจอง พร้อมส่งข้อมูลห้อง + เวลา lock
    nav(`/bookings/${room.roomId}`, {
      state: { ...room, lockedUntil },
    });
  };

  return (
    <>
      <LiffNav />
      <div style={{ paddingTop: "70px" }}>
        <div className="container my-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="text-center fw-bold mb-4">
                หน้ารายการห้องพัก / การจอง
              </h3>

              {/* เลือกชั้น */}
              <div className="d-flex justify-content-center mb-4">
                <div className="input-group" style={{ maxWidth: "300px" }}>
                  <label className="input-group-text fw-semibold">
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

              {/* Loading */}
              {loading ? (
                <div className="text-center text-muted py-4">
                  ⏳ กำลังโหลดข้อมูลห้อง...
                </div>
              ) : sortedRooms.length === 0 ? (
                <div className="text-center text-muted py-4">
                  ไม่มีห้องในชั้น {floor} ให้แสดง
                </div>
              ) : (
                <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-6 g-3">
                  {sortedRooms.map((room) => {
                    const isAvailable = room.status === 0;
                    return (
                      <div key={room.roomId} className="col">
                        <div
                          className={`card text-center h-100 ${
                            isAvailable ? "bg-light" : "bg-body-secondary"
                          } shadow-sm border-0`}
                        >
                          <div className="card-body">
                            <h2 className="card-title fw-bold">
                              ห้อง {room.number}
                            </h2>

                            <div className="mb-2">
                              <small className="text-muted">
                                ขนาด : {room.size}
                              </small>
                              <br />
                              <small className="text-muted">
                                ค่าเช่า :{" "}
                                {room.rent.toLocaleString("th-TH")} บาท
                              </small>
                            </div>

                            {/* สถานะห้อง */}
                            <div className="mb-3">
                              {room.status === 0 ? (
                                <span className="badge bg-success">ว่าง</span>
                              ) : room.status === 1 ? (
                                <span className="badge bg-danger">
                                  ห้องเต็ม
                                </span>
                              ) : (
                                <span className="badge bg-secondary">
                                  ไม่ทราบ
                                </span>
                              )}
                            </div>

                            {/* ปุ่มเฉพาะห้องว่าง */}
                            {isAvailable && (
                              <button
                                className="btn fw-semibold w-100 text-dark"
                                style={{
                                  background:
                                    "linear-gradient(90deg, #FFD43B, #00FF66)",
                                  border: "none",
                                }}
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
        </div>
      </div>
    </>
  );
}