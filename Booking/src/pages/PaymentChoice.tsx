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

  // ตรวจสอบ token
  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) return;

        await axios.post(`${API_BASE}/user/me`, { accessToken: token });
        setReady(true);
      } catch (err) {
        await Swal.fire(
          "ไม่สามารถตรวจสอบสิทธิ์ได้",
          "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
          "error"
        );
        nav("/");
      }
    })();
  }, [nav]);

  // ถ้าไม่มีข้อมูลห้อง
  if (!room)
    return (
      <div className="text-center p-5">
        <h5 className="text-danger mb-3">ไม่พบข้อมูลห้อง</h5>
        <button className="btn btn-primary" onClick={() => nav("/")}>
          กลับหน้าแรก
        </button>
      </div>
    );

  // คำนวณยอดรวมทั้งหมด
  const total = room.rent + room.deposit + room.bookingFee;
  const qrUrl = `${API_BASE}/qr/${total}`;

  // Loading
  if (!ready)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3">กำลังตรวจสอบสิทธิ์ผู้ใช้งาน...</p>
      </div>
    );

  // ฟังก์ชันดาวน์โหลด QR
  const handleDownloadQR = async () => {
    try {
      const res = await fetch(qrUrl);
      if (!res.ok) throw new Error("โหลด QR ล้มเหลว");

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `QR-${total}.png`;
      link.click();

      window.URL.revokeObjectURL(blobUrl);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "บันทึก QR สำเร็จ",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึก QR ได้",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const isInLine = liff.isInClient();

  return (
    <>
      <LiffNav />

      <div style={{ paddingTop: "70px" }}>
        <div className="container my-4">
          <div className="card shadow-sm p-3 border-0">

            <h3 className="fw-bold text-center mb-4">
              📲 การชำระเงินผ่าน QR PromptPay
            </h3>

            {/* 💰 สรุปยอดรวม */}
            <div
              className="p-3 mb-3 rounded shadow-sm text-center"
              style={{
                background: "linear-gradient(135deg, #b1f370, #b3efea)",
              }}
            >
              <h5 className="fw-bold mb-1">
                💰 ยอดรวมที่ต้องชำระ {total.toLocaleString("th-TH")} บาท
              </h5>

              <p className="m-0 text-muted small">
                (ค่าห้อง {room.rent.toLocaleString("th-TH")} + มัดจำ{" "}
                {room.deposit.toLocaleString("th-TH")} + ค่าจอง{" "}
                {room.bookingFee.toLocaleString("th-TH")})
              </p>
            </div>

            {/* 🔳 QR PromptPay */}
            <div
              className="p-3 mb-3 rounded shadow-sm text-center"
              style={{
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
              }}
            >
              <h6 className="fw-semibold mb-2">
                📲 สแกนเพื่อชำระผ่าน PromptPay
              </h6>

              <img
                src={qrUrl}
                width="240"
                alt="QR PromptPay"
                className="border rounded shadow-sm my-2"
              />

              {isInLine ? (
                <p className="small text-danger fw-semibold mt-2">
                  กดค้างที่ QR แล้วเลือก “บันทึกภาพ” เพื่อดาวน์โหลด
                </p>
              ) : (
                <>
                  <p className="small text-muted">กดปุ่มด้านล่างเพื่อบันทึก QR</p>
                  <button
                    className="btn w-100 fw-semibold text-dark"
                    style={{
                      background: "linear-gradient(90deg, #42e695, #3bb2b8)",
                      border: "none",
                    }}
                    onClick={handleDownloadQR}
                  >
                    บันทึก QR PromptPay
                  </button>
                </>
              )}
            </div>

            {/* ปุ่มดำเนินการต่อ */}
            <button
              className="btn w-100 fw-semibold mt-3 text-white"
              style={{
                background: "linear-gradient(90deg, #42e695, #3bb2b8)",
                transition: "0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #a8edea, #fed6e3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #42e695, #3bb2b8)")
              }
              onClick={() => nav("/upload-slip", { state: room })}
            >
              ➡️ อัปโหลดสลิปเพื่อยืนยันการชำระเงิน
            </button>
          </div>
        </div>
      </div>
    </>
  );
}