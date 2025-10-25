import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AccountCard from "../components/Payment/AccountCard";
import QRSection from "../components/Payment/QRSection";
import PaymentSummary from "../components/Payment/PaymentSummary";
import type { Room } from "../types/Room";
import { API_BASE } from "../config";

export default function PaymentChoice() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room;

  const [method, setMethod] = useState<"qr" | "account">("qr");
  const [ready] = useState(false);

  // ถ้าเข้ามาโดยไม่มีข้อมูลห้อง
  if (!room)
    return (
      <div className="text-center p-5">
        <h5 className="text-danger mb-3">❌ ไม่พบข้อมูลห้อง</h5>
        <button className="btn btn-primary" onClick={() => nav("/")}>
          กลับหน้าแรก
        </button>
      </div>
    );

  // ✅ คำนวณยอดรวม
  const total = room.rent + room.deposit + room.bookingFee;
  const qrUrl = `${API_BASE}/qr/${total}`;

  if (!ready)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3">กำลังตรวจสอบสิทธิ์ผู้ใช้งาน...</p>
      </div>
    );

  return (
    <div className="container my-4">
      <div className="card shadow-sm p-3 border-0">
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

        <PaymentSummary total={total} />

        {method === "qr" ? (
          <QRSection qrUrl={qrUrl} total={total} />
        ) : (
          <AccountCard />
        )}

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
          ➡️ ดำเนินการต่อ
        </button>
      </div>
    </div>
  );
}
