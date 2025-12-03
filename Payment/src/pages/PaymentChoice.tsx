// Payment/src/pages/PaymentChoice.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import Swal from "sweetalert2";
import { refreshLiffToken } from "../lib/liff";
import axios from "axios";
import liff from "@line/liff";
import NavBar from "../components/NavBar";

interface Bill {
  billId: string;
  total: number;
  status: number;
  room: { number: string };
}

export default function PaymentChoice() {
  const { state } = useLocation();
  const nav = useNavigate();
  const bill = state as Bill;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) throw new Error("ไม่มี token");
        await axios.post(`${API_BASE}/user/me`, { accessToken: token });
        setReady(true);
      } catch {
        Swal.fire("❌ ตรวจสอบสิทธิ์ล้มเหลว", "กรุณาเข้าสู่ระบบใหม่", "error");
        nav("/");
      }
    })();
  }, [nav]);

  if (!bill)
    return (
      <div className="text-center p-5">
        <h5 className="text-danger mb-3">❌ ไม่พบข้อมูลบิล</h5>
        <button className="btn btn-primary" onClick={() => nav(-1)}>
          กลับหน้าก่อนหน้า
        </button>
      </div>
    );

  const qrUrl = `${API_BASE}/qr/${bill.total}`;
  const isInLine = liff.isInClient();

  if (!ready)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">กำลังตรวจสอบสิทธิ์ผู้ใช้งาน...</p>
      </div>
    );

  const handleDownload = async () => {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "SmartDorm_QR.png";
      link.click();
    } catch {
      Swal.fire("❌ บันทึก QR ไม่สำเร็จ", "", "error");
    }
  };

  return (
    <div style={{ background: "#F7FAFC", minHeight: "100vh", fontFamily: "Prompt" }}>
      <NavBar />

      <div
        style={{
          marginTop: "70px",
          maxWidth: "520px",
          marginInline: "auto",
          background: "white",
          borderRadius: "18px",
          padding: "26px 22px",
          boxShadow: "0 6px 26px rgba(0,0,0,0.06)",
          border: "1px solid #E5E7EB",
        }}
      >
        {/* หัวเรื่อง */}
        <h3
          style={{
            fontWeight: 600,
            fontSize: "1.2rem",
            color: "#0F3D91",
            marginBottom: "22px",
          }}
        >
          การชำระเงินผ่าน PromptPay
        </h3>

        {/* กล่องยอดรวม */}
        <div
          className="text-center fw-bold mb-4"
          style={{
            background: "#F1F5F9",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            padding: "14px 0",
            fontSize: "20px",
            color: "#0F3D91",
          }}
        >
          ยอดชำระ {bill.total.toLocaleString("th-TH")} บาท
        </div>

        {/* หัว QR */}
        <h5
          style={{
            fontWeight: 600,
            color: "#0F3D91",
            fontSize: "1rem",
            marginBottom: "8px",
          }}
        >
          📱 สแกนเพื่อชำระเงิน
        </h5>

        {/* กล่อง QR */}
        <div
          className="text-center mb-3"
          style={{
            background: "#FFFFFF",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            padding: "18px",
          }}
        >
          <img
            src={qrUrl}
            width="240"
            className="rounded shadow-sm"
            alt="QR PromptPay"
          />

          {isInLine ? (
            <p style={{ color: "#D92D20", marginTop: "14px" }}>
              กดค้างที่ QR แล้วเลือก “บันทึกภาพ”
            </p>
          ) : (
            <button
              className="btn fw-semibold w-100 mt-3"
              style={{
                borderRadius: "10px",
                border: "1px solid #CBD5E1",
                fontWeight: 500,
                color: "#0F3D91",
                background: "white",
              }}
              onClick={handleDownload}
            >
              ดาวน์โหลด QR
            </button>
          )}
        </div>

        {/* ปุ่มอัปโหลดสลิป */}
        <button
          className="btn fw-semibold w-100 py-2"
          style={{
            background: "#0F3D91",
            color: "white",
            borderRadius: "10px",
            fontSize: "18px",
            boxShadow: "0 4px 10px rgba(15,61,145,0.35)",
          }}
          onClick={() => nav("/upload-slip", { state: bill })}
        >
          อัปโหลดสลิป
        </button>
      </div>
    </div>
  );
}