//src/pages/UploadSlip.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { initLiff, getAccessToken } from "../lib/liff";
import axios from "axios";
import { API_BASE } from "../config";
import UploadSlipForm from "../components/UploadSlip/UploadSlipForm";
import type { Room } from "../types/Room";

export default function UploadSlip() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room;
  const [ready, setReady] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await initLiff();
        const token = getAccessToken();

        if (!token) {
          Swal.fire("⚠️ กรุณาเข้าสู่ระบบผ่าน LINE", "", "warning").then(() =>
            nav("/")
          );
          return;
        }

        // ✅ ตรวจสอบ token กับ backend โดยตรง
        await axios.post(`${API_BASE}/user/me`, { accessToken: token });

        setAccessToken(token);
        setReady(true);
      } catch (err: any) {
        Swal.fire(
          "❌ ไม่สามารถตรวจสอบการเข้าสู่ระบบได้",
          err.response?.data?.error || "กรุณาลองใหม่อีกครั้ง",
          "error"
        ).then(() => nav("/"));
      }
    })();
  }, [nav]);

  if (!room) {
    return (
      <div className="text-center py-5">
        <h4 className="text-danger">❌ ไม่พบข้อมูลห้อง</h4>
        <button className="btn btn-primary mt-3" onClick={() => nav("/")}>
          กลับหน้าแรก
        </button>
      </div>
    );
  }

  if (!ready)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3">กำลังตรวจสอบการเข้าสู่ระบบกับเซิร์ฟเวอร์...</p>
      </div>
    );

  return (
    <div className="container py-4">
      <UploadSlipForm
        room={room}
        accessToken={accessToken!}
        onSuccess={() => {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "✅ ส่งคำขอจองเรียบร้อยแล้วครับ",
            showConfirmButton: false,
            timer: 2500,
          }).then(() => nav("/"));
        }}
      />
    </div>
  );
}
