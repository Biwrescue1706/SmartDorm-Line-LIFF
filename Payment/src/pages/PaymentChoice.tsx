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

      <div className="smartdorm-card" style={{ padding: "18px" }}>
        {/* หัวการชำระเงิน */}
        <h3 className="fw-bold mb-3" style={{ textAlign: "left" }}>
          การชำระเงินผ่าน PromptPay
        </h3>

        {/* กล่องยอดรวม */}
        <div
          className="p-3 text-center rounded mb-4 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #d4f9c4, #c2f8d5)",
            border: "1px solid #b7f3c4",
          }}
        >
          <h4 className="fw-bold mb-0">
            ยอดรวม {bill.total.toLocaleString("th-TH")} บาท
          </h4>
        </div>

        {/* หัวข้อ QR */}
        <h5
          className="fw-semibold mb-2"
          style={{
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          📱 สแกนเพื่อชำระเงิน
        </h5>

        {/* กล่อง QR */}
        <div
          className="p-3 rounded shadow-sm text-center mb-2"
          style={{
            background: "#f5f7fa",
            border: "1px solid #e5e8ec",
          }}
        >
          <img
            src={qrUrl}
            width="240"
            className="rounded shadow-sm"
            alt="QR PromptPay"
          />

          {isInLine ? (
            <p
              className="mt-3 fw-semibold"
              style={{ color: "red", fontSize: "14px" }}
            >
              กดค้างที่ QR แล้วเลือก “บันทึกภาพ”
            </p>
          ) : (
            <button
              className="btn btn-outline-success w-100 fw-semibold mt-3"
              onClick={handleDownload}
            >
              📥 ดาวน์โหลด QR
            </button>
          )}
        </div>

        {/* ปุ่มอัปโหลดสลิป */}
        <button
          className="btn fw-semibold w-100 py-2 mt-3"
          style={{
            color: "white",
            background: "linear-gradient(90deg, #6ee2c6, #5bb0f3)",
            borderRadius: "12px",
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