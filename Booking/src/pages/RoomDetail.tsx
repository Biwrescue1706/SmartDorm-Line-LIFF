import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import type { Room } from "../types/All";
import { API_BASE } from "../config";
import { GetRoomById } from "../apis/endpoint.api";
import { refreshLiffToken, logoutLiff } from "../lib/liff";
import LiffNav from "../components/LiffNav";

/* ---------------- HOOK ---------------- */

function useRoomDetail() {
  const { state } = useLocation();
  const { roomId } = useParams();

  const [room, setRoom] = useState<Room | null>(
    (state as Room) || null
  );

  const [loading, setLoading] = useState(
    !state && !!roomId
  );

  const [error, setError] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (state) return;

    if (!roomId) {
      setError("ไม่พบรหัสห้อง");
      return;
    }

    setLoading(true);

    fetch(`${API_BASE}${GetRoomById(roomId)}`)
      .then(async (res) => {
        if (!res.ok)
          throw new Error(
            "ไม่สามารถโหลดข้อมูลห้องได้"
          );

        const data: Room = await res.json();
        setRoom(data);
      })
      .catch(() => {
        setError("โหลดข้อมูลห้องไม่สำเร็จ");

        Swal.fire({
          icon: "error",
          title: "โหลดข้อมูลห้องไม่สำเร็จ",
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .finally(() => setLoading(false));
  }, [roomId, state]);

  return {
    room,
    roomId,
    loading,
    error,
  };
}

/* ---------------- PAGE ---------------- */

export default function RoomDetail() {
  const { room, roomId, loading, error } =
    useRoomDetail();

  const nav = useNavigate();

  const [profile, setProfile] = useState({
    service: 0,
    waterRate: 0,
    electricRate: 0,
    overdueFinePerDay: 0,
  });

  /* ---------------- DORM PROFILE ---------------- */

  useEffect(() => {
    fetch(`${API_BASE}/dorm-profile`)
      .then((r) => r.json())
      .then((d) =>
        setProfile({
          service: d.service ?? 0,
          waterRate: d.waterRate ?? 0,
          electricRate: d.electricRate ?? 0,
          overdueFinePerDay:
            d.overdueFinePerDay ?? 0,
        })
      )
      .catch(() =>
        console.warn(
          "โหลด dorm profile ไม่สำเร็จ"
        )
      );
  }, []);

  /* ---------------- AUTH ---------------- */

  useEffect(() => {
    (async () => {
      try {
        const token =
          await refreshLiffToken();

        if (!token) return;

        await axios.post(
          `${API_BASE}/user/me`,
          {
            accessToken: token,
          }
        );
      } catch {
        await logoutLiff();

        Swal.fire(
          "หมดเวลาการใช้งาน",
          "กรุณาล็อกอินใหม่อีกครั้ง",
          "warning"
        );

        nav("/");
      }
    })();
  }, [nav]);

  /* ---------------- LOADING ---------------- */

  if (loading)
    return (
      <>
        <LiffNav />

        <div className="container text-center text-muted pt-5 mt-4">
          ⏳ กำลังโหลดข้อมูลห้อง...
        </div>
      </>
    );

  /* ---------------- ERROR ---------------- */

  if (error)
    return (
      <>
        <LiffNav />

        <div className="container text-center text-danger pt-5 mt-4">
          {error} (ID: {roomId})
        </div>
      </>
    );

  /* ---------------- NOT FOUND ---------------- */

  if (!room)
    return (
      <>
        <LiffNav />

        <div className="container text-center pt-5 mt-4">
          ❌ ไม่พบข้อมูลห้อง {roomId}

          <button
            className="btn btn-primary mt-3"
            onClick={() => nav("/")}
          >
            กลับหน้าแรก
          </button>
        </div>
      </>
    );

  /* ---------------- DATA ---------------- */

  const total =
    room.rent +
    room.deposit +
    room.bookingFee;

  const handleConfirm = () => {
    localStorage.setItem(
      "selectedRoom",
      JSON.stringify(room)
    );

    nav("/payment", {
      state: room,
    });
  };

  const handleCancel = () => {
    localStorage.removeItem(
      "selectedRoom"
    );

    nav("/");
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <LiffNav />

      <div className="pt-5"></div>

      <div
        className="min-vh-100 py-4"
        style={{
          background: "#F6F4FA",
        }}
      >
        <div className="container">

          {/* HEADER */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">

            <div
              style={{
                height: 6,
                background:
                  "linear-gradient(90deg,#4A0080 0%, #7B2BC7 100%)",
              }}
            />

            <div className="card-body p-4">
              <h2 className="fw-bold text-primary mb-1">
                🏠 รายละเอียดห้องพัก
              </h2>

              <p className="text-muted mb-0">
                กรุณาตรวจสอบข้อมูลก่อนทำการจอง
              </p>
            </div>
          </div>

          {/* MAIN CARD */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">

              {/* ROOM NUMBER */}
              <div
                className="rounded-4 text-white p-4 mb-4"
                style={{
                  background:
                    "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                }}
              >
                <small className="opacity-75">
                  หมายเลขห้อง
                </small>

                <h1 className="fw-bold mb-0 mt-1">
                  {room.number}
                </h1>
              </div>

              {/* DETAIL GRID */}
              <div className="row g-3">

                {[
                  [
                    "ขนาดห้อง",
                    room.size,
                  ],
                  [
                    "ค่าเช่า",
                    `${room.rent.toLocaleString(
                      "th-TH"
                    )} บาท`,
                  ],
                  [
                    "เงินประกัน",
                    `${room.deposit.toLocaleString(
                      "th-TH"
                    )} บาท`,
                  ],
                  [
                    "ค่าจอง",
                    `${room.bookingFee.toLocaleString(
                      "th-TH"
                    )} บาท`,
                  ],
                  [
                    "ค่าส่วนกลาง",
                    `${profile.service} บาท / เดือน`,
                  ],
                  [
                    "ค่าไฟฟ้า",
                    `${profile.electricRate} บาท / หน่วย`,
                  ],
                  [
                    "ค่าน้ำ",
                    `${profile.waterRate} บาท / หน่วย`,
                  ],
                ].map(([label, value], i) => (
                  <div
                    className="col-12 col-md-6"
                    key={i}
                  >
                    <div
                      className="rounded-4 border h-100 p-3"
                      style={{
                        background: "#FAF9FC",
                        borderColor:
                          "#EFE9F7",
                      }}
                    >
                      <small className="text-muted d-block mb-1">
                        {label}
                      </small>

                      <div className="fw-bold fs-5 text-dark">
                        {value}
                      </div>
                    </div>
                  </div>
                ))}

              </div>

              {/* TOTAL */}
              <div
                className="rounded-4 text-white p-4 mt-4"
                style={{
                  background:
                    "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                }}
              >
                <small className="opacity-75">
                  รวมทั้งหมด
                </small>

                <h2 className="fw-bold mb-0 mt-1">
                  ฿{" "}
                  {total.toLocaleString(
                    "th-TH"
                  )}
                </h2>
              </div>

              {/* NOTE */}
              <div
                className="rounded-4 border p-3 mt-4 text-muted small"
                style={{
                  background: "#FAF9FC",
                  borderColor: "#EFE9F7",
                  lineHeight: 1.8,
                }}
              >
                • ตัดรอบบิลวันที่ 25
                ของทุกเดือน
                <br />
                • กำหนดชำระภายในวันที่ 5
                ของเดือนถัดไป
                <br />
                • หากชำระเกินกำหนด
                ปรับวันละ{" "}
                <span className="fw-bold">
                  {
                    profile.overdueFinePerDay
                  }{" "}
                  บาท
                </span>
              </div>

              {/* BUTTONS */}
              <div className="row g-3 mt-2">

                <div className="col-12 col-md-6">
                  <button
                    className="btn btn-light border w-100 fw-semibold py-3 rounded-4"
                    onClick={handleCancel}
                  >
                    ยกเลิก
                  </button>
                </div>

                <div className="col-12 col-md-6">
                  <button
                    className="btn w-100 fw-bold text-white py-3 rounded-4"
                    style={{
                      background:
                        "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                    }}
                    onClick={handleConfirm}
                  >
                    ยืนยันการจอง
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}