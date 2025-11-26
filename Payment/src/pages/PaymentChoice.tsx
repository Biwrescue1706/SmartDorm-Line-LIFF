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

  const handleDownload = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("โหลด QR ล้มเหลว");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "SmartDorm_QR.png";
      link.click();
    } catch {
      Swal.fire("❌ ไม่สามารถบันทึก QR ได้", "", "error");
    }
  };

  return (
    <div className="smartdorm-page">
      <NavBar />
      <div className="mt-3"></div>

      <div className="smartdorm-card">
        <div className="text-center mb-3">
          <h2 className="fw-bold text-success mb-2">ชำระค่าเช่า</h2>
          <h3 className="text-black mt-1 mb-2">เลขที่บิล : {bill.billId}</h3>
          <h3 className="text-black mt-1 mb-2">ห้อง {bill.room.number}</h3>
        </div>

        {/* 💰 ยอดรวม */}
        <div
          className="p-3 mb-3 rounded shadow-sm text-center"
          style={{
            background: "linear-gradient(135deg, #b1f370, #b3efea)",
          }}
        >
          <h4 className="fw-bold text-dark mb-0">
            💰 ยอดรวมที่ต้องชำระ {bill.total.toLocaleString("th-TH")} บาท
          </h4>
        </div>

        {/* 🔹 QR PromptPay อย่างเดียว */}
        <div
          className="p-3 mb-3 rounded shadow-sm text-center"
          style={{
            background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
          }}
        >
          <h3 className="fw-semibold mb-2 text-black">
            📲 สแกนเพื่อชำระผ่าน PromptPay
          </h3>

          <img
            src={qrUrl}
            alt="QR PromptPay"
            width="230"
            className="border rounded shadow-sm my-2"
          />

          {isInLine ? (
            <p className="small text-danger fw-semibold mt-2">
              กดค้างที่ QR แล้วเลือก “บันทึก QR Code” เพื่อบันทึกลงเครื่อง
            </p>
          ) : (
            <button
              className="btn btn-outline-success w-100 fw-semibold"
              onClick={() => handleDownload(qrUrl)}
            >
             ดาวน์โหลด QR Code
            </button>
          )}
        </div>

        {/* ปุ่มต่อไป */}
        <button
          className="btn w-100 mt-2 fw-semibold text-white py-2"
          style={{
            background: "linear-gradient(90deg, #43cea2, #185a9d)",
            borderRadius: "10px",
          }}
          onClick={() => nav("/upload-slip", { state: bill })}
        >
         แนบสลิปการโอน
        </button>
      </div>
    </div>
  );
}