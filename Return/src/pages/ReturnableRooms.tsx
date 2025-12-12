import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { API_BASE } from "../config";
import { refreshLiffToken, logoutLiff } from "../lib/liff";

export default function ReturnableRooms() {
  const nav = useNavigate();

  // ✅ ตรวจสอบสิทธิ์จาก backend
  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) throw new Error("no token");

        const res = await axios.post(`${API_BASE}/user/me`, {
          accessToken: token,
        });

        if (!res.data?.success) {
          throw new Error("unauthorized");
        }

        // ✅ ผ่านแล้ว → ค่อยทำ logic คืนห้องต่อ
      } catch {
        await logoutLiff(false);
        Swal.fire(
          "หมดเวลาการใช้งาน",
          "กรุณาล็อกอินใหม่อีกครั้ง",
          "warning"
        );
        nav("/");
      }
    })();
  }, [nav]);

  return (
    <div style={{ padding: 20 }}>
      <h3>ห้องที่สามารถขอคืนได้</h3>
      {/* TODO: เรียก /user/bookings/returnable ต่อจากนี้ */}
    </div>
  );
}