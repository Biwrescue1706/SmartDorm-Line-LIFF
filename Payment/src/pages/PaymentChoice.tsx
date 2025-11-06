// src/pages/PaymentChoice.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import Swal from "sweetalert2";
import { refreshLiffToken } from "../lib/liff";
import axios from "axios";
import liff from "@line/liff";
import NavBar from "../components/NavBar"; // ✅ เพิ่ม NavBar

interface Room {
  rent: number;
  deposit: number;
  bookingFee: number;
}

export default function PaymentChoice() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room;

  const [method, setMethod] = useState<"qr" | "account">("qr");
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

  if (!room)
    return (
      <div className="text-center p-5">
        <h5 className="text-danger mb-3">❌ ไม่พบข้อมูลห้อง</h5>
        <button className="btn btn-primary" onClick={() => nav("/")}>
          กลับหน้าแรก
        </button>
      </div>
    );

  const total = room.rent + room.deposit + room.bookingFee;
  const qrUrl = `${API_BASE}/qr/${total}`;
  const isInLine = liff.isInClient();

  if (!ready)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3">กำลังตรวจสอบสิทธิ์ผู้ใช้งาน...</p>
      </div>
    );

  const handleCopy = () => {
    navigator.clipboard.writeText("5052997156");
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "คัดลอกเลขบัญชีแล้ว",
      timer: 2000,
      showConfirmButton: false,
    });
  };

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
      <NavBar /> {/* ✅ Navbar แสดง SmartDorm และปุ่มย้อนกลับ */}
      <div className="mt-5"></div> {/* เผื่อพื้นที่ Navbar */}
      {/* 🔹 โลโก้ */}
      <div className="text-center mb-3">
        <img
          src="https://smartdorm-admin.biwbong.shop/assets/SmartDorm.png"
          alt="SmartDorm Logo"
          className="smartdorm-logo"
        />
        <h5 className="fw-bold text-success mb-0">SmartDorm Payment</h5>
      </div>
      {/* 🔹 การ์ดหลัก */}
      <div className="smartdorm-card">
        <h4 className="fw-bold text-center mb-3 text-primary">
          💳 วิธีการชำระเงิน
        </h4>

        {/* 🔘 ปุ่มเลือกวิธี */}
        <div className="btn-group w-100 mb-4">
          <button
            className={`btn fw-semibold ${
              method === "account" ? "btn-success" : "btn-outline-success"
            }`}
            style={{ borderRadius: "8px 0 0 8px" }}
            onClick={() => setMethod("account")}
          >
            🏦 โอนบัญชีธนาคาร
          </button>
          <button
            className={`btn fw-semibold ${
              method === "qr" ? "btn-primary" : "btn-outline-primary"
            }`}
            style={{ borderRadius: "0 8px 8px 0" }}
            onClick={() => setMethod("qr")}
          >
            📲 QR พร้อมเพย์
          </button>
        </div>

        {/* 💰 สรุปยอด */}
        <div
          className="p-3 mb-3 rounded shadow-sm text-center"
          style={{
            background: "linear-gradient(135deg, #b1f370, #b3efea)",
          }}
        >
          <h5 className="fw-bold text-dark mb-0">
            💰 ยอดรวมที่ต้องชำระ {total.toLocaleString("th-TH")} บาท
          </h5>
        </div>

        {/* 🔹 ส่วน QR หรือ บัญชี */}
        {method === "qr" ? (
          <div
            className="p-3 mb-3 rounded shadow-sm text-center"
            style={{
              background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
            }}
          >
            <h6 className="fw-semibold mb-2">📲 สแกนเพื่อชำระผ่าน PromptPay</h6>
            <img
              src={qrUrl}
              alt="QR PromptPay"
              width="220"
              className="border rounded shadow-sm my-2"
            />
            {isInLine ? (
              <p className="small text-danger fw-semibold mt-2">
                กดค้างที่ QR แล้วเลือก “บันทึกภาพ” เพื่อบันทึกลงเครื่อง
              </p>
            ) : (
              <button
                className="btn btn-outline-success w-100 fw-semibold"
                onClick={() => handleDownload(qrUrl)}
              >
                📥 ดาวน์โหลด QR PromptPay
              </button>
            )}
          </div>
        ) : (
          <div
            className="p-3 mb-3 rounded shadow-sm text-center text-white"
            style={{
              background: "linear-gradient(135deg, #5d00ff, #9bc5ee)",
            }}
          >
            <h5 className="fw-bold mb-1">ธนาคารไทยพาณิชย์</h5>
            <p className="mb-1 fw-semibold">เลขบัญชี: 505-2997156</p>
            <p className="mb-2">นายภูวณัฐ พาหะละ</p>

            <button
              className="btn fw-semibold w-100"
              style={{
                background: "linear-gradient(90deg, #ffcc70, #ff8177)",
                border: "none",
                color: "black",
              }}
              onClick={handleCopy}
            >
              📋 คัดลอกเลขบัญชี
            </button>
          </div>
        )}

        {/* 🔹 ปุ่มดำเนินการต่อ */}
        <button
          className="btn w-100 fw-semibold text-white py-2"
          style={{
            background: "linear-gradient(90deg, #43cea2, #185a9d)",
            borderRadius: "10px",
            transition: "0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(90deg, #74ebd5, #ACB6E5)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(90deg, #43cea2, #185a9d)")
          }
          onClick={() => nav("/upload-slip", { state: room })}
        >
          ➡️ ดำเนินการต่อ
        </button>
      </div>
    </div>
  );
}
