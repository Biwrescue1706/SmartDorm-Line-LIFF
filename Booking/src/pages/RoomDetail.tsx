// src/pages/RoomDetail.tsx
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRoomDetail } from "../hooks/useRoomDetail";
import RoomDetailCard from "../components/RoomDetail/RoomDetailCard";
import { refreshLiffToken, logoutLiff } from "../lib/liff";
import { API_BASE } from "../config";
import LiffNav from "../components/Nav/LiffNav"; // ✅ เพิ่ม navbar

export default function RoomDetail() {
  const { room, roomId, loading, error } = useRoomDetail();
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) return;

        await axios.post(`${API_BASE}/user/me`, { accessToken: token });
        console.log("✅ ตรวจสอบสิทธิ์ผ่าน");
      } catch (err: any) {
        if (
          err.response?.data?.error?.includes("หมดอายุ") ||
          err.response?.data?.error?.includes("invalid")
        ) {
          await logoutLiff();
          return;
        }

        Swal.fire(
          "❌ การยืนยันสิทธิ์ล้มเหลว",
          "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
          "error"
        ).then(() => nav("/"));
      }
    })();
  }, [nav]);

  if (loading)
    return (
      <>
        <LiffNav />
        <div className="container p-4 text-muted text-center">
          ⏳ กำลังโหลดข้อมูลห้อง...
        </div>
      </>
    );

  if (error)
    return (
      <>
        <LiffNav />
        <div className="container p-4 text-danger text-center">
          ❌ {error} (ID: {roomId})
        </div>
      </>
    );

  if (!room)
    return (
      <>
        <LiffNav />
        <div className="container p-4 text-center">
          ❌ ไม่พบข้อมูลห้อง {roomId}
          <div>
            <button className="btn btn-primary mt-3" onClick={() => nav("/")}>
              กลับหน้าแรก
            </button>
          </div>
        </div>
      </>
    );

  return (
    <>
      {/* ✅ Navbar ด้านบน */}
      <LiffNav />

      <div className="container my-4">
        <RoomDetailCard room={room} />
      </div>
    </>
  );
}
