// src/pages/RoomDetail.tsx
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRoomDetail } from "../hooks/useRoomDetail";
import RoomDetailCard from "../components/RoomDetail/RoomDetailCard";
import { refreshLiffToken, logoutLiff } from "../lib/liff";
import { API_BASE } from "../config";
import LiffNav from "../components/Nav/LiffNav"; //  Navbar

export default function RoomDetail() {
  const { room, roomId, loading, error } = useRoomDetail();
  const nav = useNavigate();

  //  ตรวจสอบสิทธิ์ LIFF
  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) return;

        await axios.post(`${API_BASE}/user/me`, { accessToken: token });
        console.log(" ตรวจสอบสิทธิ์ผ่าน");
      } catch (err: any) {
        if (
          err.response?.data?.error?.includes("หมดอายุ") ||
          err.response?.data?.error?.includes("invalid")
        ) {
          await logoutLiff();
          return;
        }

        Swal.fire(
          " การยืนยันสิทธิ์ล้มเหลว",
          "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
          "error"
        ).then(() => nav("/"));
      }
    })();
  }, [nav]);

  // 🌀 Loading state
  if (loading)
    return (
      <>
        <LiffNav />
        <div
          className="container text-center text-muted"
          style={{ paddingTop: "80px" }}
        >
          ⏳ กำลังโหลดข้อมูลห้อง...
        </div>
      </>
    );

  //  Error state
  if (error)
    return (
      <>
        <LiffNav />
        <div
          className="container text-center text-danger"
          style={{ paddingTop: "80px" }}
        >
           {error} (ID: {roomId})
        </div>
      </>
    );

  // ⚠️ ไม่พบข้อมูลห้อง
  if (!room)
    return (
      <>
        <LiffNav />
        <div
          className="container text-center"
          style={{ paddingTop: "80px" }}
        >
           ไม่พบข้อมูลห้อง {roomId}
          <div>
            <button className="btn btn-primary mt-3" onClick={() => nav("/")}>
              กลับหน้าแรก
            </button>
          </div>
        </div>
      </>
    );

  //  แสดงข้อมูลห้อง
  return (
    <>
      <LiffNav />
      <div className="container my-4" style={{ paddingTop: "70px" }}>
        <RoomDetailCard room={room} />
      </div>
    </>
  );
}
