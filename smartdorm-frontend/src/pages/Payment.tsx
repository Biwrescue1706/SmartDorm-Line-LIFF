import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import "../css/Payment.css";

// ✅ components
import AccountCard from "../components/Payment/AccountCard";
import PaymentSummary from "../components/Payment/PaymentSummary";
import QRSection from "../components/Payment/QRSection";

interface Room {
  roomId: string;
  number: string;
  size: string;
  rent: number;
  deposit: number;
  bookingFee: number;
}

export default function Payment() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room;

  // 🔹 รวมค่าใช้จ่าย
  const total = room.rent + room.deposit + room.bookingFee;

  // 🔹 ข้อมูลบัญชี (config ได้)
  const account = "5052997156";
  const bank = "ธนาคารไทยพาณิชย์";
  const owner = "นายภูวณัฐ พาหะละ";

  // 🔹 backend proxy สำหรับ QR
  const qrUrl = `${API_BASE}/qr/${total}`;

  return (
    <div className="payment-container py-4 text-center">
      <div className="payment-card text-center">
        <h4 className="mb-3">หน้าชำระเงิน</h4>

        {/* ✅ ข้อมูลบัญชี + ปุ่ม copy */}
        <AccountCard account={account} bank={bank} owner={owner} />

        {/* ✅ ยอดรวม */}
        <PaymentSummary total={total} />

        {/* ✅ QR PromptPay */}
        <QRSection qrUrl={qrUrl} total={total} />

        {/* 🔹 ปุ่มดำเนินการต่อ */}
        <div>
          <button
            className="btn btn-outline-success"
            onClick={() => nav("/upload-slip", { state: room })}
          >
            ดำเนินการต่อ
          </button>
        </div>
      </div>
    </div>
  );
}
