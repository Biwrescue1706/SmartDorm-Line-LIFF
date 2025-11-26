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
  const [qrSrc, setQrSrc] = useState("");

  const total = room ? room.rent + room.deposit + room.bookingFee : 0;

  // 🔹 สร้าง QR ครั้งเดียว
  const makeQR = () => {
    const qr = `${API_BASE}/qr/${total}?t=${Date.now()}`;
    setQrSrc(qr);
  };

  // 🔹 ตรวจสอบสิทธิ์
  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) return;

        await axios.post(`${API_BASE}/user/me`, { accessToken: token });

        setReady(true);
        makeQR();
      } catch {
        Swal.fire("ไม่สามารถตรวจสอบสิทธิ์ได้", "กรุณาเข้าสู่ระบบใหม่", "error");
        nav("/");
      }
    })();
  }, [nav]);

  if (!room)
    return (
      <div className="text-center p-5">
        <h5 className="text-danger mb-3">ไม่พบข้อมูลห้อง</h5>
        <button className="btn btn-primary" onClick={() => nav("/")}>
          กลับหน้าแรก
        </button>
      </div>
    );

  if (!ready)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" />
        <p className="mt-3">กำลังตรวจสอบสิทธิ์ผู้ใช้งาน...</p>
      </div>
    );

  const isInLine = liff.isInClient();

  return (
    <>
      <LiffNav />

      <div style={{ paddingTop: "70px" }}>
        <div className="container my-4">
          <div
            className="card shadow-sm p-3 border-0"
            style={{ borderRadius: "16px" }}
          >
            {/* 🎯 หัวข้อแบบในรูป */}
            <h3 className="fw-bold mb-3" style={{ textAlign: "left" }}>
              การชำระเงินผ่าน PromptPay
            </h3>

            {/* 🎯 กล่องยอดรวมแบบในรูป */}
            <div
              className="p-3 mb-3 rounded text-center shadow-sm"
              style={{
                background: "linear-gradient(135deg, #d4f9c4, #c2f8d5)",
                border: "1px solid #b7f3c4",
              }}
            >
              <h4 className="fw-bold mb-0">
                ยอดรวม {total.toLocaleString("th-TH")} บาท
              </h4>
            </div>

            {/* 🎯 หัวข้อ QR */}
            <h6
              className="fw-semibold mb-2"
              style={{
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              📱 สแกนเพื่อชำระเงิน
            </h6>

            {/* 🎯 กล่อง QR แบบในรูปจริง */}
            <div
              className="p-3 mb-3 rounded text-center shadow-sm"
              style={{
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                border: "1px solid #e5e8ec",
              }}
            >
              <img
                src={qrSrc}
                width="240"
                className="border rounded shadow-sm my-2"
                alt="QR PromptPay"
              />

              {/* 🎯 ข้อความเตือน */}
              {isInLine ? (
                <p
                  className="small fw-semibold"
                  style={{ color: "red", fontSize: "14px" }}
                >
                  กดค้างที่ QR แล้วเลือก “บันทึกภาพ”
                </p>
              ) : (
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
              )}
            </div>

            {/* 🎯 ปุ่มอัปโหลดสลิปแบบในรูป */}
            <button
              className="btn w-100 fw-semibold mt-3 text-white"
              style={{
                background: "linear-gradient(90deg, #6ee2c6, #5bb0f3)",
                borderRadius: "12px",
                fontSize: "18px",
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