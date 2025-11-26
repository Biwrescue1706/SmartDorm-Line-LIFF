// src/pages/PaymentChoice.tsx
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
        <div className="spinner-border text-success"></div>
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
    <div className="smartdorm-page">
      <NavBar />

      <div className="mt-3"></div>

      {/* การ์ดหน้าหลัก */}
      <div className="smartdorm-card" style={{ padding: "15px" }}>

        {/* 🔹 หัวข้อที่คุณต้องการเพิ่ม */}
        <div className="text-center mb-3">
          <h2 className="fw-bold text-success text-center mb-2">ชำระค่าเช่า</h2>
          <h3 className="text-center text-black mt-1 mb-2">
            เลขที่บิล : {bill.billId}
          </h3>
          <h3 className="text-center text-black mt-1 mb-2">
            ห้อง {bill.room.number}
          </h3>
        </div>

        {/* กล่องยอดรวม */}
        <div
          className="p-3 mb-4 text-center rounded"
          style={{
            background: "linear-gradient(135deg, #a8f0c6, #b1f3e0)",
            border: "1px solid #d7fbe8",
          }}
        >
          <h4 className="fw-bold">
            ยอดรวม {bill.total.toLocaleString("th-TH")} บาท
          </h4>
        </div>

        {/* กล่อง QR */}
        <div
          className="p-3 rounded text-center shadow-sm"
          style={{
            background: "linear-gradient(135deg, #f8f9fa, #eef1f4)",
            border: "1px solid #e2e6ea",
          }}
        >
          <h5 className="fw-semibold mb-3">📱 สแกนเพื่อชำระเงิน</h5>

          <img
            src={qrUrl}
            width="250"
            className="shadow rounded"
            alt="QR PromptPay"
          />

          {/* ข้อความแนะนำ */}
          <p className="mt-3 text-danger fw-semibold" style={{ fontSize: "14px" }}>
            กดค้างที่ QR แล้วเลือก “บันทึกภาพ”
          </p>

          {!isInLine && (
            <button
              className="btn btn-outline-success w-100 fw-semibold mt-2"
              onClick={handleDownload}
            >
              📥 ดาวน์โหลด QR
            </button>
          )}
        </div>

        {/* ปุ่มอัปโหลดสลิป */}
        <button
          className="btn fw-semibold w-100 mt-4 py-2 text-white"
          style={{
            background: "linear-gradient(90deg, #43cea2, #185a9d)",
            borderRadius: "10px",
            fontSize: "18px",
          }}
          onClick={() => nav("/upload-slip", { state: bill })}
        >
          อัปโหลดสลิป
        </button>
      </div>
    </div>
  );
}