// src/pages/Booking.tsx

import { useState, useEffect, useMemo } from "react";
import { useRooms } from "../hooks/useRooms";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import LiffNav from "../components/Nav/LiffNav";
import { API_BASE } from "../config";
import { getAccessToken } from "../lib/liff";
import type { Room } from "../types/Room";

export default function Booking() {
  const { rooms, loading, fetchRooms } = useRooms(true);
  const nav = useNavigate();

  const [floor, setFloor] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);

  /* ===========================================================
     ✔ ดึง userId จาก LINE (เพื่อใช้ล๊อคห้อง)
  =========================================================== */
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setUserId(d.userId || null))
      .catch(() => {});
  }, []);

  /* ===========================================================
     ✔ คำนวณ "ชั้นสูงสุด" จากเลขห้องจริง
        เช่น มีห้องถึง 820 → maxFloor = 8
  =========================================================== */
  const maxFloor = useMemo(() => {
    if (rooms.length === 0) return 1;

    const maxRoomNum = Math.max(...rooms.map((r) => Number(r.number)));
    return Math.floor(maxRoomNum / 100) || 1;
  }, [rooms]);

  /* ===========================================================
     ✔ คัดห้องตามชั้น
  =========================================================== */
  const roomsByFloor = useMemo(() => {
    const start = floor * 100 + 1;
    const end = floor * 100 + 100;

    return rooms.filter((r) => {
      const num = Number(r.number);
      return num >= start && num <= end;
    });
  }, [rooms, floor]);

  /* ===========================================================
     ✔ เรียงห้อง: ว่างก่อน → เลขน้อยก่อน
  =========================================================== */
  const sortedRooms = useMemo(() => {
    return [...roomsByFloor].sort((a, b) => {
      if (a.status === 0 && b.status !== 0) return -1;
      if (a.status !== 0 && b.status === 0) return 1;
      return Number(a.number) - Number(b.number);
    });
  }, [roomsByFloor]);

  /* ===========================================================
     ⭐ เลือกห้อง = ล็อคห้องใน backend (15 นาที)
  =========================================================== */
  const handleSelectRoom = async (room: Room) => {
    if (!userId) {
      Swal.fire("ไม่พบข้อมูลผู้ใช้งาน", "กรุณาล็อกอินใหม่", "error");
      return;
    }

    if (room.status !== 0) {
      Swal.fire("ห้องไม่ว่าง", "ห้องนี้กำลังถูกเลือกโดยคนอื่น", "warning");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/booking/lock`, {
        roomId: room.roomId,
        userId,
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "ล็อคห้องสำเร็จ (15 นาที)",
        timer: 2000,
        showConfirmButton: false,
      });

      nav("/upload-slip", { state: room });

    } catch (err: any) {
      Swal.fire("มีคนกำลังเลือกห้องนี้อยู่", "", "warning");
      fetchRooms(); // refresh ข้อมูล
    }
  };

  return (
    <>
      <LiffNav />

      <div style={{ paddingTop: "70px" }}>
        <div className="container my-4">

          <div className="card shadow border-0">
            <div className="card-body">

              <h3 className="text-center fw-bold mb-4">เลือกห้องพัก</h3>

              {/* ================= ชั้น ================= */}
              <div className="d-flex justify-content-center mb-4">
                <div className="input-group" style={{ maxWidth: 280 }}>
                  <span className="input-group-text fw-semibold">ชั้น</span>

                  <select
                    className="form-select fw-semibold"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                  >
                    {Array.from({ length: maxFloor }, (_, i) => i + 1).map(
                      (f) => (
                        <option key={f} value={f}>
                          ชั้น {f}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* ================= ห้อง ================= */}
              {loading ? (
                <div className="text-center py-5 text-muted">
                  ⏳ กำลังโหลด...
                </div>
              ) : (
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">

                  {sortedRooms.map((room) => {
                    const available = room.status === 0;
                    const isLocked =
                      room.lockedUntil &&
                      new Date(room.lockedUntil) > new Date();
                    const lockedByOther =
                      isLocked && room.lockedBy !== userId;

                    return (
                      <div key={room.roomId} className="col">
                        <div
                          className={`card h-100 text-center border-0 shadow-sm ${
                            available ? "bg-light" : "bg-secondary-subtle"
                          }`}
                        >
                          <div className="card-body py-3">

                            <h4 className="fw-bold">ห้อง {room.number}</h4>

                            <small className="text-muted d-block">
                              ขนาด: {room.size}
                            </small>
                            <small className="text-muted">
                              ค่าเช่า:{" "}
                              {room.rent.toLocaleString("th-TH")} บาท
                            </small>

                            <div className="my-2">
                              {available ? (
                                <span className="badge bg-success">ว่าง</span>
                              ) : (
                                <span className="badge bg-danger">
                                  ไม่ว่าง / มีคนเลือกอยู่
                                </span>
                              )}
                            </div>

                            {/* ปุ่มเลือกห้อง */}
                            {available && !lockedByOther ? (
                              <button
                                onClick={() => handleSelectRoom(room)}
                                className="btn w-100 fw-semibold"
                                style={{
                                  border: "none",
                                  background:
                                    "linear-gradient(90deg,#FFD43B,#2EE689)",
                                }}
                              >
                                เลือกห้องนี้
                              </button>
                            ) : (
                              <button
                                disabled
                                className="btn w-100 fw-semibold btn-secondary"
                              >
                                ไม่สามารถเลือกได้
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