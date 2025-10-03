import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AccountCard from "../components/Payment/AccountCard";
import QRSection from "../components/Payment/QRSection";
import PaymentSummary from "../components/Payment/PaymentSummary";
import type { Room } from "../types/Room";
import { API_BASE } from "../config";
import Swal from "sweetalert2";

export default function PaymentChoice() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room;

  // ถ้าเข้ามาหน้าโดยไม่มี room -> redirect กลับ
  if (!room) {
    Swal.fire("❌ ไม่พบข้อมูลห้อง", "", "error").then(() => nav("/"));
    return null;
  }

  const [method, setMethod] = useState<"qr" | "account">("qr");

  // ✅ คำนวณยอดรวม
  const total = room.rent + room.deposit + room.bookingFee;

  // ✅ สร้างลิงก์ QR จาก backend
  const qrUrl = `${API_BASE}/qr/${total}`;

  return (
    <div className="container my-4">
      <div className="card shadow-sm p-3">
        <h3 className="fw-bold text-center mb-3">💳 วิธีการชำระเงิน</h3>

        {/* ปุ่มสลับวิธีการ */}
        <div className="btn-group w-100 mb-4">
          <button
            className={`btn ${
              method === "account" ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => setMethod("account")}
          >
            🏦 โอนเข้าบัญชีธนาคาร
          </button>

          <button
            className={`btn ${
              method === "qr" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setMethod("qr")}
          >
            📲 สแกน QR PromptPay
          </button>
        </div>

        {/* สรุปยอด */}
        <PaymentSummary total={total} />

        {/* แสดงตามที่เลือก */}
        {method === "qr" ? (
          <QRSection qrUrl={qrUrl} total={total} />
        ) : (
          <AccountCard />
        )}

        {/* ปุ่มไปอัปโหลดสลิป */}
          <button
            className="btn w-100 fw-semibold mt-3"
            style={{
              background: "linear-gradient(90deg, #ff9a9e, #fad0c4)",
              color: "black",
              border: "none",
              transition: "0.3s", // ✅ ให้ hover ลื่นขึ้น
            }}
            onMouseEnter={
              (e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #ff6f91, #ffb6c1)") // hover สีเข้มขึ้น
            }
            onMouseLeave={
              (e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #ff9a9e, #fad0c4)") // กลับสีเดิม
            }
            onClick={() => nav("/upload-slip", { state: room })}
          >
            ➡️ ดำเนินการต่อ
          </button>
      </div>
    </div>
  );
}
