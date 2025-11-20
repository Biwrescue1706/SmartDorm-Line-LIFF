// src/pages/PaymentChoice.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Room } from "../types/Room";
import { API_BASE } from "../config";
import Swal from "sweetalert2";
import { refreshLiffToken } from "../lib/liff";
import axios from "axios";
import LiffNav from "../components/Nav/LiffNav";
import liff from "@line/liff";

export default function PaymentChoice() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room | null;

  const [ready, setReady] = useState(false);
  const [seconds, setSeconds] = useState(300); // ⏳ 5 นาที
  const [qrSrc, setQrSrc] = useState(""); // 🆕 QR สดที่ regenerate ได้

  const total = room ? room.rent + room.deposit + room.bookingFee : 0;

  // 🆕 ฟังก์ชันสร้าง QR ใหม่
  const generateQR = () => {
    const newQR = `${API_BASE}/qr/${total}?t=${Date.now()}`; 
    setQrSrc(newQR);
    setSeconds(300);       // รีเซ็ตเวลา
  };

  // ตรวจสอบสิทธิ์ก่อน
  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) return;
        await axios.post(`${API_BASE}/user/me`, { accessToken: token });
        setReady(true);

        // 🆕 สร้าง QR ทันทีเมื่อเข้าหน้า
        generateQR();
      } catch {
        Swal.fire("ไม่สามารถตรวจสอบสิทธิ์ได้", "กรุณาเข้าสู่ระบบใหม่", "error");
        nav("/");
      }
    })();
  }, [nav]);

  // 🕒 ตัวนับถอยหลัง
  useEffect(() => {
    if (!ready) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          // 🆕 หมดเวลา → regenerate QR อัตโนมัติ
          generateQR();
          return 300; // รีเซ็ตเวลาใหม่
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ready]);

  // format รายงานเวลา
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  if (!room)
    return (
      <div className="text-center p-5">
        <h5 className="text-danger mb-3">ไม่พบข้อมูลห้อง</h5>
        <button className="btn btn-primary" onClick={() => nav("/")}>
          กลับหน้าแรก
        </button>
      </div>
    );

  const isInLine = liff.isInClient();

  if (!ready)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3">กำลังตรวจสอบสิทธิ์ผู้ใช้งาน...</p>
      </div>
    );

  return (
    <>
      <LiffNav />
      <div style={{ paddingTop: "70px" }}>
        <div className="container my-4">
          <div className="card shadow-sm p-3 border-0">

            <h3 className="fw-bold text-center mb-4">การชำระเงินผ่าน PromptPay</h3>

            {/* สรุปยอด */}
            <div
              className="p-3 mb-3 rounded shadow-sm text-center"
              style={{ background: "linear-gradient(135deg, #b1f370, #b3efea)" }}
            >
              <h5 className="fw-bold mb-1">
                ยอดรวม {total.toLocaleString("th-TH")} บาท
              </h5>
            </div>

            {/* QR PromptPay */}
            <div
              className="p-3 mb-3 rounded shadow-sm text-center"
              style={{ background: "linear-gradient(135deg, #f8f9fa, #e9ecef)" }}
            >
              <h6 className="fw-semibold mb-2">📲 สแกนเพื่อชำระเงิน</h6>

              {/* ตัวนับถอยหลัง */}
              <p className="fw-bold text-danger mb-2">
                QR หมดอายุใน {formatTime(seconds)}
              </p>

              <img
                src={qrSrc}
                width="240"
                alt="QR PromptPay"
                className="border rounded shadow-sm my-2"
              />

              {!isInLine ? (
                <button
                  className="btn w-100 fw-semibold text-dark"
                  style={{
                    background: "linear-gradient(90deg, #42e695, #3bb2b8)",
                    border: "none",
                  }}
                  onClick={async () => {
                    const res = await fetch(qrSrc);
                    const blob = await res.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = blobUrl;
                    link.download = `QR-${total}.png`;
                    link.click();
                    URL.revokeObjectURL(blobUrl);
                  }}
                >
                  ดาวน์โหลด QR
                </button>
              ) : (
                <p className="small text-danger fw-semibold">
                  กดค้างที่ QR แล้วเลือก “บันทึกภาพ”
                </p>
              )}
            </div>

            {/* ปุ่มไปหน้าอัปโหลดสลิป */}
            <button
              className="btn w-100 fw-semibold mt-3 text-white"
              style={{
                background: "linear-gradient(90deg, #42e695, #3bb2b8)",
              }}
              onClick={() => nav("/upload-slip", { state: room })}
            >
              อัปโหลดสลิป
            </button>
          </div>
        </div>
      </div>
    </>
  );
}