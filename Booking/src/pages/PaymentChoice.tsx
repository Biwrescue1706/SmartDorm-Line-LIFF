import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Room } from "../types/Room";
import { API_BASE } from "../config";
import Swal from "sweetalert2";
import { refreshLiffToken } from "../lib/liff";
import axios from "axios";
import LiffNav from "../components/LiffNav";
import liff from "@line/liff";

export default function PaymentChoice() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room | null;

  const [ready, setReady] = useState(false);
  const [qrSrc, setQrSrc] = useState("");

  const total = room ? room.rent + room.deposit + room.bookingFee : 0;

  const makeQR = () => {
    const qr = `${API_BASE}/qr/${total}?t=${Date.now()}`;
    setQrSrc(qr);
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) throw new Error();

        await axios.post(`${API_BASE}/user/me`, { accessToken: token });
        setReady(true);
        makeQR();
      } catch {
        Swal.fire("❌ หมดเวลาการเข้าใช้งาน", "กรุณาเข้าสู่ระบบใหม่", "warning");
        nav("/");
      }
    })();
  }, [nav]);

  if (!room) return <div className="text-center p-5">ไม่พบข้อมูลห้อง</div>;
  if (!ready) return <div className="text-center py-5">กำลังโหลด...</div>;

  const isInLine = liff.isInClient();

  return (
    <>
      <LiffNav />
      <div style={{ paddingTop: 80 }}>
        <div className="container">
          <h3 className="text-center mb-3">ยอด {total.toLocaleString()} บาท</h3>

          <div className="text-center">
            <img src={qrSrc} width={250} alt="QR" className="border rounded" />

            {!isInLine ? (
              <button
                className="btn btn-success w-100 mt-3"
                onClick={async () => {
                  const res = await fetch(qrSrc);
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `QR-${total}.png`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >
                ดาวน์โหลด QR
              </button>
            ) : (
              <p className="small text-danger">(กดค้างเพื่อบันทึกภาพ)</p>
            )}

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={() => nav("/upload-slip", { state: room })}
            >
              ดำเนินการต่อ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}