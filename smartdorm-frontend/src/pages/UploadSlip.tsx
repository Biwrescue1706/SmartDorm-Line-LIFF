import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

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
  const [checkin, setCheckin] = useState("");
  const [loading, setLoading] = useState(false);

  const [bookingId, setBookingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slip) {
      Swal.fire("❌ ข้อผิดพลาด", "กรุณาแนบสลิปการโอนเงิน", "error");
      return;
    }

    try {
      setLoading(true);
        const userId = localStorage.getItem("userId"); 
        
      const formData = new FormData();
      formData.append("userId", userId || "");   // ✅ เพิ่มตรงนี้
      formData.append("roomId", room.id);
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("phone", phone);
      formData.append("checkin", checkin);
      formData.append("slip", slip);

      const res = await fetch(
        "https://smartdorm-backend.onrender.com/booking/create",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("การจองล้มเหลว");

      const data = await res.json();
      console.log("📤 ส่งข้อมูล:", data);

      setBookingId(data.booking.id);

      await Swal.fire({
        icon: "success",
        title: "✅ ยืนยันการจองสำเร็จ",
        text: `ห้อง ${room.number} ถูกจองเรียบร้อยแล้ว`,
        showConfirmButton: false, // ❌ ไม่ต้องให้กดปุ่ม OK
        timer: 1000, // ⏱ ปิดอัตโนมัติใน 2 วินาที
        timerProgressBar: true, // แสดง progress bar
      });

      nav("/"); // 👉 กลับหน้าแรก
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "❌ ข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการจอง",
        showConfirmButton: false, // ❌ ไม่แสดงปุ่ม OK
        timer: 1000, // ⏱ ปิดอัตโนมัติใน 2 วินาที
        timerProgressBar: true, // ✅ แสดง progress bar
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h4 className="text-center mb-3">รายละเอียดการจองห้อง {room.number}</h4>

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
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            required
          />
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => nav("/")}
            disabled={loading}
          >
            ยกเลิก
          </button>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "กำลังบันทึก..." : "ยืนยัน"}
          </button>
        </div>
      </form>

      {bookingId && (
        <div className="mt-4 text-center">
          <h5>🧾 สลิปที่อัปโหลด</h5>
          <img
            src={`https://smartdorm-backend.onrender.com/booking/${bookingId}/slip`}
            alt="slip preview"
            className="img-fluid border rounded"
            style={{ maxHeight: "400px" }}
          />
        </div>
      )}
    </div>
  );
}
