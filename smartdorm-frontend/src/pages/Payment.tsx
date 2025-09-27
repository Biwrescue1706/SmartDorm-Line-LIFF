import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Payment.css";

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

  // 🔹 ข้อมูลบัญชี
  const account = "5052997156"; // เลขบัญชีจริง
  const bank = "ธนาคารไทยพาณิชย์";
  const owner = "นายภูวณัฐ พาหะละ";

  // 🔹 ถ้าใช้ PromptPay (เบอร์มือถือ/บัตรประชาชน)
  const promptpayId = "0611747731"; // เบอร์ที่ผูก PromptPay
  const qrUrl = `https://promptpay.io/${promptpayId}/${total}.png`;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🔹 ฟังก์ชันบันทึกรูป
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="payment-container py-4 text-center">
      <div className="payment-card text-center">
        <h4 className="mb-3">หน้าชำระเงิน</h4>

        {/* 🔹 แสดงข้อมูลบัญชี */}
        <div
          className="p-3 text-white mb-2"
          style={{ backgroundColor: "#6819c9ff" }}
        >
          <h5>{bank}</h5>
          <p>{account}</p>
          <p>{owner}</p>
        </div>

        {/* 🔹 แสดงยอดรวม */}
        <p>
          ยอดรวมที่ต้องชำระ: <b>{total.toLocaleString()} บาท</b>
        </p>

        {/* 🔹 ปุ่มคัดลอกเลขบัญชี */}
        <button className="btn btn-outline-success mb-3" onClick={handleCopy}>
          {copied ? "คัดลอกแล้ว!" : "คัดลอกบัญชี"}
        </button>

        {/* 🔹 QR Code แบบ PromptPay */}
        <div className="mb-3">
          <div className="mb-3">
            <h6>หรือสแกนจาก QR ธนาคาร</h6>
          </div>

          {/* วิธีที่ 1: กดที่รูปเพื่อบันทึก */}
          <a href={qrUrl} download={`PromptPay-${total}.png`}>
            <img src={qrUrl} alt="QR PromptPay" width="250" />
          </a>
          <p className="small text-muted">กดที่ QR เพื่อบันทึกรูป</p>

          {/* วิธีที่ 2: ปุ่มบันทึกรูป */}
          <button
            className="btn btn-outline-primary mt-2"
            onClick={() => handleDownload(qrUrl, `PromptPay-${total}.png`)}
          >
            บันทึกรูป QR
          </button>
        </div>

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
