import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Room } from "../types/All";
import { API_BASE } from "../config";
import { GetRoomById } from "../apis/endpoint.api";
import Swal from "sweetalert2";
import axios from "axios";
import {
  refreshLiffToken,
  logoutLiff,
} from "../lib/liff";
import LiffNav from "../components/LiffNav";

/* ---------------- HOOK ---------------- */

export function useRoomDetail() {
  const { state } = useLocation();
  const { roomId } = useParams();

  const [room, setRoom] =
    useState<Room | null>(
      (state as Room) || null
    );

  const [loading, setLoading] =
    useState(!state && !!roomId);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (state) return;

    if (!roomId) {
      setError("ไม่พบรหัสห้อง");
      return;
    }

    setLoading(true);

    fetch(
      `${API_BASE}${GetRoomById(
        roomId
      )}`
    )
      .then(async (res) => {
        if (!res.ok)
          throw new Error(
            "ไม่สามารถโหลดข้อมูลห้องได้"
          );

        const data: Room =
          await res.json();

        setRoom(data);
      })
      .catch(() => {
        setError(
          "โหลดข้อมูลห้องไม่สำเร็จ"
        );

        Swal.fire({
          icon: "error",
          title:
            "โหลดข้อมูลห้องไม่สำเร็จ",
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .finally(() =>
        setLoading(false)
      );
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
  const {
    room,
    roomId,
    loading,
    error,
  } = useRoomDetail();

  const nav = useNavigate();

  const [profile, setProfile] =
    useState({
      service: 0,
      waterRate: 0,
      electricRate: 0,
      overdueFinePerDay: 0,
    });

  /* LOAD PROFILE */
  useEffect(() => {
    fetch(`${API_BASE}/dorm-profile`)
      .then((r) => r.json())
      .then((d) =>
        setProfile({
          service:
            d.service ?? 0,
          waterRate:
            d.waterRate ?? 0,
          electricRate:
            d.electricRate ?? 0,
          overdueFinePerDay:
            d.overdueFinePerDay ??
            0,
        })
      )
      .catch(() =>
        console.warn(
          "โหลด dorm profile ไม่สำเร็จ"
        )
      );
  }, []);

  /* AUTH */
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

  /* LOADING */
  if (loading)
    return (
      <>
        <LiffNav />

        <div
          style={{
            minHeight: "100vh",
            background:
              "#F6F4FA",
            padding:
              "100px 16px 40px",
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 30,
              padding:
                "50px 40px",
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
        </div>
      </>
    );

  /* ERROR */
  if (error)
    return (
      <>
        <LiffNav />

        <div
          style={{
            minHeight: "100vh",
            background:
              "#F6F4FA",
            padding:
              "100px 16px 40px",
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 30,
              padding:
                "50px 40px",
              textAlign: "center",
              boxShadow:
                "0 12px 28px rgba(74,0,128,0.08)",
            }}
          >
            <h4
              style={{
                color: "#dc3545",
              }}
            >
              {error}
            </h4>

            <p
              style={{
                marginTop: 10,
                color: "#7B7490",
              }}
            >
              ID : {roomId}
            </p>
          </div>
        </div>
      </>
    );

  /* NOT FOUND */
  if (!room)
    return (
      <>
        <LiffNav />

        <div
          style={{
            minHeight: "100vh",
            background:
              "#F6F4FA",
            padding:
              "100px 16px 40px",
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 30,
              padding:
                "50px 40px",
              textAlign: "center",
              boxShadow:
                "0 12px 28px rgba(74,0,128,0.08)",
            }}
          >
            <h4>
              ❌ ไม่พบข้อมูลห้อง{" "}
              {roomId}
            </h4>

            <button
              onClick={() =>
                nav("/")
              }
              style={{
                marginTop: 18,
                border: "none",
                background:
                  "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                color: "#fff",
                padding:
                  "12px 18px",
                borderRadius: 14,
                fontWeight: 700,
              }}
            >
              กลับหน้าแรก
            </button>
          </div>
        </div>
      </>
    );

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
            maxWidth: 820,
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
              🏠 รายละเอียดห้องพัก
            </h1>

            <p
              style={{
                margin: 0,
                color: "#7B7490",
              }}
            >
              กรุณาตรวจสอบข้อมูลก่อนทำการจอง
            </p>
          </div>

          {/* ROOM CARD */}
          <div
            style={{
              background: "#fff",
              borderRadius: 32,
              padding: 24,
              boxShadow:
                "0 12px 28px rgba(74,0,128,0.08)",
            }}
          >
            {/* ROOM NUMBER */}
            <div
              style={{
                background:
                  "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                borderRadius: 24,
                padding:
                  "26px 24px",
                color: "#fff",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  opacity: 0.9,
                  marginBottom: 8,
                }}
              >
                หมายเลขห้อง
              </div>

              <div
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                }}
              >
                {room.number}
              </div>
            </div>

            {/* DETAIL GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(240px,1fr))",
                gap: 16,
              }}
            >
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
                      borderRadius: 20,
                      padding:
                        "18px 18px",
                      border:
                        "1px solid #EFE9F7",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        color:
                          "#7B7490",
                        marginBottom: 8,
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </div>

                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color:
                          "#2D1A47",
                      }}
                    >
                      {value}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* TOTAL */}
            <div
              style={{
                marginTop: 24,
                background:
                  "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                borderRadius: 24,
                padding:
                  "22px 24px",
                color: "#fff",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 14,
                    opacity: 0.9,
                    marginBottom: 6,
                  }}
                >
                  รวมทั้งหมด
                </div>

                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                  }}
                >
                  ฿{" "}
                  {total.toLocaleString(
                    "th-TH"
                  )}
                </div>
              </div>
            </div>

            {/* NOTE */}
            <div
              style={{
                marginTop: 24,
                background: "#FAF9FC",
                borderRadius: 22,
                padding: 20,
                border:
                  "1px solid #EFE9F7",
                color: "#6B6580",
                lineHeight: 1.8,
                fontSize: 14,
              }}
            >
              • ตัดรอบบิลวันที่ 25 ของทุกเดือน
              <br />
              • กำหนดชำระบิลภายในวันที่ 5
              ของเดือนถัดไป
              <br />
              • หากชำระเกินกำหนด
              ปรับวันละ{" "}
              <strong>
                {
                  profile.overdueFinePerDay
                }{" "}
                บาท
              </strong>
            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: 14,
                marginTop: 28,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={
                  handleCancel
                }
                style={{
                  flex: 1,
                  minWidth: 150,
                  padding:
                    "15px",
                  borderRadius: 18,
                  border:
                    "1.5px solid #D9CFF0",
                  background:
                    "#fff",
                  color:
                    "#4A0080",
                  fontWeight: 700,
                  cursor:
                    "pointer",
                }}
              >
                ยกเลิก
              </button>

              <button
                onClick={
                  handleConfirm
                }
                style={{
                  flex: 1,
                  minWidth: 150,
                  padding:
                    "15px",
                  borderRadius: 18,
                  border: "none",
                  background:
                    "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                  color: "#fff",
                  fontWeight: 800,
                  cursor:
                    "pointer",
                  boxShadow:
                    "0 8px 20px rgba(74,0,128,0.18)",
                }}
              >
                ยืนยันการจอง
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}