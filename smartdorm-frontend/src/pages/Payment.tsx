// src/pages/Payment.tsx
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

  // 🔹 รวมค่าใช้จ่าย
  const total = room.rent + room.deposit + room.bookingFee;

  // 🔹 ข้อมูลบัญชี (คุณแก้ตามจริงได้เลย)
  const account = "5052997156";
  const bank = "ธนาคารไทยพาณิชย์";
  const owner = "นายภูวณัฐ พาหะละ";

  // 🔹 PromptPay
  const promptpayId = "0611747731"; // เบอร์ PromptPay
  const qrUrl = `https://promptpay.io/${promptpayId}/${total}.png`;

  const [copied, setCopied] = useState(false);

  // 🔹 copy เลขบัญชี
  const handleCopy = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🔹 ดาวน์โหลดรูป QR รองรับ iOS/Android
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("❌ Error downloading image:", err);
      alert("ไม่สามารถบันทึกรูป QR ได้");
    }
  };

  return (
    <div className="payment-container py-4 text-center">
      <div className="payment-card text-center">
        <h4 className="mb-3">หน้าชำระเงิน</h4>

        {/* 🔹 ข้อมูลบัญชี */}
        <div
          className="p-3 text-white mb-2"
          style={{ backgroundColor: "#6819c9ff" }}
        >
          <h5>{bank}</h5>
          <p>{account}</p>
          <p>{owner}</p>
        </div>

        {/* 🔹 ยอดรวม */}
        <p>
          ยอดรวมที่ต้องชำระ: <b>{total.toLocaleString()} บาท</b>
        </p>

        {/* 🔹 ปุ่มคัดลอกบัญชี */}
        <button className="btn btn-outline-success mb-3" onClick={handleCopy}>
          {copied ? "คัดลอกแล้ว!" : "คัดลอกบัญชี"}
        </button>

        {/* 🔹 QR Code */}
        <div className="mb-3">
          <div className="mb-3">
            <h6>หรือสแกน QR พร้อมเพย์</h6>
          </div>

          <img
            src={qrUrl}
            alt="QR PromptPay"
            width="250"
            crossOrigin="anonymous"
          />
          <p className="small text-muted">กดปุ่มด้านล่างเพื่อบันทึกรูป</p>

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
