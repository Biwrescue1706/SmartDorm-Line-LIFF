import { useRoomDetail } from "../hooks/useRoomDetail";
import RoomDetailCard from "../components/RoomDetail/RoomDetailCard";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE, VITE_LIFF_ID } from "../config";
import liff from "@line/liff";

export default function RoomDetail() {
  const { room, roomId, loading, error } = useRoomDetail();
  const nav = useNavigate();

  // ✅ ตรวจสอบการเข้าสู่ระบบผ่าน LIFF ก่อนเข้า
  useEffect(() => {
    (async () => {
      try {
        await liff.init({ liffId: VITE_LIFF_ID });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const token = liff.getAccessToken();
        if (!token) {
          liff.login(); // หมดอายุ → login ใหม่
          return;
        }

        // ตรวจสอบ token กับ backend
        await axios.post(`${API_BASE}/user/me`, { accessToken: token });
      } catch (err) {
        Swal.fire(
          "❌ การยืนยันสิทธิ์ล้มเหลว",
          "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
          "error"
        ).then(() => {
          liff.logout();
          liff.login(); // รี login ใหม่
        });
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="container p-4 text-muted text-center">
        ⏳ กำลังโหลดข้อมูลห้อง...
      </div>
    );

  if (error)
    return (
      <div className="container p-4 text-danger text-center">
        ❌ {error} (ID: {roomId})
      </div>
    );

  if (!room)
    return (
      <div className="container p-4 text-center">
        ❌ ไม่พบข้อมูลห้อง {roomId}
        <div>
          <button className="btn btn-primary mt-3" onClick={() => nav("/")}>
            กลับหน้าแรก
          </button>
        </div>
      </div>
    );

  return (
    <div className="container my-4">
      <RoomDetailCard room={room} />
    </div>
  );
}
