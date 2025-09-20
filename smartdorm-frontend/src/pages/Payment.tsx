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
  const [loading, setLoading] = useState(false);

  // ✅ ฟอร์มข้อมูลผู้ใช้
  const [studentId, setStudentId] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = async () => {
    try {
      setLoading(true);

      // ⚡ จาก LIFF จริง ๆ ต้องใช้ liff.getProfile()
      const profile = {
        userId: "Uxxxxxxxxx",
        displayName: "BiwBong",
      };

      const res = await fetch("https://smartdorm-backend.onrender.com/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.userId,
          mumId: studentId,
          name: profile.displayName,
          phone: phoneInput,
        }),
      });

      if (!res.ok) throw new Error("❌ สมัคร/อัปเดต User ไม่สำเร็จ");

      nav("/upload-slip", { state: room });
    } catch (err) {
      console.error("❌ Error register:", err);
      alert("เกิดข้อผิดพลาดในการสมัคร/อัปเดต User");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-center py-4">
      <h4 className="mb-3">หน้าชำระเงิน</h4>

      <div className="p-3 rounded text-white mb-3" style={{ backgroundColor: "#4a148c" }}>
        <h5>{bank}</h5>
        <p>{account}</p>
        <p>{owner}</p>
      </div>

      <p>ยอดรวมที่ต้องชำระ: <b>{total.toLocaleString()} บาท</b></p>

      <button className="btn btn-outline-success mb-3" onClick={handleCopy}>
        {copied ? "คัดลอกแล้ว!" : "คัดลอกบัญชี"}
      </button>

      {/* ✅ ฟอร์มกรอกข้อมูล */}
      <div className="mb-3 text-start">
        <label>รหัสนักศึกษา</label>
        <input
          type="text"
          className="form-control"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
      </div>

      <div className="mb-3 text-start">
        <label>เบอร์โทรศัพท์</label>
        <input
          type="tel"
          className="form-control"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          required
        />
      </div>

      <div>
        <button
          className="btn btn-success"
          onClick={handleContinue}
          disabled={loading}
        >
          {loading ? "กำลังบันทึก..." : "ดำเนินการต่อ"}
        </button>
      </div>
    </div>
  );
}
