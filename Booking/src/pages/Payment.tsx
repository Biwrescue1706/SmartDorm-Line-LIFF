import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

// Components
import AccountCard from "../components/Payment/AccountCard";
import PaymentSummary from "../components/Payment/PaymentSummary";
import QRSection from "../components/Payment/QRSection";

import type { Room } from "../types/Room";

export default function Payment() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room;

  // 🔹 รวมค่าใช้จ่าย
  const total = room.rent + room.deposit + room.bookingFee;

  // 🔹 backend proxy สำหรับ QR
  const qrUrl = `${API_BASE}/qr/${total}`;

  return (
    <div className="container my-4">
      <div className="card shadow-sm"
           style={{ background: "linear-gradient(135deg, #f8f9fa, #e9ecef)" }}>
        <div className="card-body text-center">
          <h3 className="fw-bold mb-4">💳 หน้าชำระเงิน</h3>

          {/* ✅ ข้อมูลบัญชี */}
          <AccountCard />

          {/* ✅ ยอดรวม */}
          <PaymentSummary total={total} />

          {/* ✅ QR พร้อมเพย์ */}
          <QRSection qrUrl={qrUrl} total={total} />

          {/* ✅ ปุ่มไปอัปโหลดสลิป */}
          <button
            className="btn w-100 fw-semibold mt-3"
            style={{
              background: "linear-gradient(90deg, #ff9a9e, #fad0c4)",
              color: "black",
            }}
            onClick={() => nav("/upload-slip", { state: room })}
          >
            ➡️ ดำเนินการต่อ
          </button>
        </div>
      </div>
    </div>
  );
}
