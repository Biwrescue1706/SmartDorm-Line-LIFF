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

export default function UploadSlip() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room;

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [slip, setSlip] = useState<File | null>(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slip) {
      alert("กรุณาแนบสลิปการโอนเงิน");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("roomId", room.id);
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("phone", phone);
      formData.append("checkInDate", checkInDate);
      formData.append("slip", slip);

      const res = await fetch("https://smartdorm-backend.onrender.com/booking/create", {
        method: "POST",
        body: formData,
        credentials: "include", // ถ้ามี session/cookie
      });

      if (!res.ok) {
        throw new Error("การจองล้มเหลว");
      }

      const data = await res.json();
      console.log("📤 ส่งข้อมูล:", data);

      alert("✅ ยืนยันการจองสำเร็จ!");
      nav("/"); // กลับไปหน้าแรก หรือ Dashboard
    } catch (err) {
      console.error("❌ Error:", err);
      alert("เกิดข้อผิดพลาดในการจอง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h4 className="text-center mb-3">รายละเอียด</h4>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>ชื่อ</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>นามสกุล</label>
          <input
            type="text"
            className="form-control"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>เบอร์โทร</label>
          <input
            type="tel"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>แนบสลิป</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setSlip(e.target.files?.[0] || null)}
            required
          />
        </div>

        <div className="mb-3">
          <label>วันที่เข้าพัก</label>
          <input
            type="date"
            className="form-control"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            required
          />
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => nav(-1)}
            disabled={loading}
          >
            ยกเลิก
          </button>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "กำลังบันทึก..." : "ยืนยัน"}
          </button>
        </div>
      </form>
    </div>
  );
}
