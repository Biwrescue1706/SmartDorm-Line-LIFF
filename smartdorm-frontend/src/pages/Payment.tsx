import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Payment.css"

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

  const total = room.rent + room.deposit + room.bookingFee;
  const account = "5052997156";
  const bank = "ธนาคารไทยพาณิชย์";
  const owner = "นายภูวณัฐ พาหะละ";

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="payment-container py-4 text-center ">
      <div className="payment-card text-center">
        <h4 className="mb-3">หน้าชำระเงิน</h4>

        <div
          className="p-3 text-white mb-2"
          style={{ backgroundColor: "#6819c9ff" }}
        >
          <h5>{bank}</h5>
          <p>{account}</p>
          <p>{owner}</p>
        </div>

        <p>
          ยอดรวมที่ต้องชำระ: <b>{total.toLocaleString()} บาท</b>
        </p>

        <button className="btn btn-outline-success mb-3" onClick={handleCopy}>
          {copied ? "คัดลอกแล้ว!" : "คัดลอกบัญชี"}
        </button>

        <div>
          <button
            className="btn btn-success"
            onClick={() => nav("/upload-slip", { state: room })}
          >
            ดำเนินการต่อ
          </button>
        </div>
      </div>
    </div>
  );
}
