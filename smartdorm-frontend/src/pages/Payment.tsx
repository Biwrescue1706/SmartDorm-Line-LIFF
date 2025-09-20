import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

interface Room {
  id: string;
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
    <div className="container text-center py-4">
      <h4 className="mb-3">หน้าชำระเงิน</h4>

      <div
        className="p-3 rounded text-white mb-3"
        style={{ backgroundColor: "#4a148c" }}
      >
        <h5>{bank}</h5>
        <p>{account}</p>
        <p>{owner}</p>
      </div>

      <p>ยอดรวมที่ต้องชำระ: <b>{total.toLocaleString()} บาท</b></p>

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
  );
}
