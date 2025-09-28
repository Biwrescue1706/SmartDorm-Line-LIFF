// src/pages/UploadSlip.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE } from "../config";
import "sweetalert2/dist/sweetalert2.min.css";
import "../css/UploadSlip.css";

interface Room {
  roomId: string;
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

  const [ctitle, setCtitle] = useState("");
  const [cname, setCname] = useState("");
  const [csurname, setCsurname] = useState("");
  const [cphone, setCphone] = useState("");
  const [cmumId, setCmumId] = useState("");
  const [slip, setSlip] = useState<File | null>(null);
  const [checkin, setCheckin] = useState("");
  const [loading, setLoading] = useState(false);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);

  // ✅ เช็ค login ก่อนเข้า
  useEffect(() => {
    const userId = localStorage.getItem("liff_userId");
    if (!userId) {
      Swal.fire("⚠️ กรุณาเข้าสู่ระบบผ่าน LINE", "", "warning").then(() => {
        nav("/");
      });
    }
  }, [nav]);

  // ✅ submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- validate เบอร์โทร ---
    if (!/^\d{10}$/.test(cphone)) {
      Swal.fire("❌ ข้อผิดพลาด", "เบอร์โทรต้องเป็นตัวเลข 10 หลัก", "error");
      return;
    }

    // --- validate บัตรประชาชน ---
    if (!/^\d{13}$/.test(cmumId)) {
      Swal.fire(
        "❌ ข้อผิดพลาด",
        "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก",
        "error"
      );
      return;
    }

    if (!checkin) {
      Swal.fire("❌ ข้อผิดพลาด", "กรุณาเลือกวันที่เข้าพัก", "error");
      return;
    }

    if (!slip) {
      Swal.fire("❌ ข้อผิดพลาด", "กรุณาแนบสลิปการโอนเงิน", "error");
      return;
    }

    try {
      setLoading(true);

      const userId = localStorage.getItem("liff_userId");
      const userName = localStorage.getItem("liff_displayName");

      if (!userId) {
        Swal.fire("❌ ข้อผิดพลาด", "กรุณาเข้าสู่ระบบก่อนจองห้อง", "error");
        return;
      }

      // 👇 เตรียม FormData
      const formData = new FormData();
      formData.append("roomId", room.roomId);
      formData.append("userId", userId);
      formData.append("userName", userName || "");
      formData.append("ctitle", ctitle);
      formData.append("cname", cname);
      formData.append("csurname", csurname);
      formData.append("cphone", cphone);
      formData.append("cmumId", cmumId);
      formData.append("checkin", checkin);
      formData.append("slip", slip);

      // 🐞 debug ดูว่าค่าอะไรส่งออกไปบ้าง
      console.log("📦 FormData preview:");
      formData.forEach((v, k) => console.log(k, v));

      // 👇 ส่งไป API backend
      const res = await fetch(`${API_BASE}/booking/create`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("การจองล้มเหลว");

      const data = await res.json();
      console.log("📤 ส่งข้อมูล:", data);

      await Swal.fire({
        icon: "success",
        title: "✅ ยืนยันการจองสำเร็จ",
        text: `ห้อง ${room.number} ถูกจองเรียบร้อยแล้ว`,
        confirmButtonText: "ตกลง",
      });

      nav("/");
    } catch (err) {
      console.error("❌ Error:", err);
      Swal.fire("❌ ข้อผิดพลาด", "เกิดข้อผิดพลาดในการจอง", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uploadslip-container py-4">
      <form onSubmit={handleSubmit}>
        <h2 className="text-center mb-3">อัปโหลดสลิปชำระเงิน</h2>

        <div className="mb-3">
          <h3>ห้อง {room.number}</h3>
        </div>

        {/* ---------------- คำนำหน้า ---------------- */}
        <div className="mb-3">
          <h4>คำนำหน้า</h4>
          <select
            className="form-control"
            value={ctitle}
            onChange={(e) => setCtitle(e.target.value)}
            required
          >
            <option value="">-- เลือกคำนำหน้า --</option>
            <option value="นาย">นาย</option>
            <option value="นาง">นาง</option>
            <option value="นางสาว">นางสาว</option>
          </select>
        </div>

        {/* ---------------- ชื่อ ---------------- */}
        <div className="mb-3">
          <h4>ชื่อ</h4>
          <input
            type="text"
            className="form-control"
            value={cname}
            onChange={(e) => setCname(e.target.value)}
            required
          />
        </div>

        {/* ---------------- นามสกุล ---------------- */}
        <div className="mb-3">
          <h4>นามสกุล</h4>
          <input
            type="text"
            className="form-control"
            value={csurname}
            onChange={(e) => setCsurname(e.target.value)}
            required
          />
        </div>

        {/* ---------------- เบอร์โทร ---------------- */}
        <div className="mb-3">
          <h4>เบอร์โทร</h4>
          <input
            type="tel"
            className="form-control"
            value={cphone}
            onChange={(e) => setCphone(e.target.value)}
            required
          />
        </div>

        {/* ---------------- เลขบัตร ---------------- */}
        <div className="mb-3">
          <h4>เลขบัตรประชาชน</h4>
          <input
            type="text"
            className="form-control"
            value={cmumId}
            onChange={(e) => setCmumId(e.target.value)}
            required
          />
        </div>

        {/* ---------------- แนบสลิป ---------------- */}
        <div className="mb-3">
          <h4>แนบสลิป</h4>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setSlip(file);
              if (file) setSlipPreview(URL.createObjectURL(file));
            }}
            required
          />
        </div>

        {/* ---------------- วันที่เข้าพัก ---------------- */}
        <div className="mb-3">
          <h4>วันที่เข้าพัก</h4>
          <input
            type="date"
            className="form-control"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            required
          />
        </div>

        {/* ---------------- ปุ่ม ---------------- */}
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

      {/* ---------------- Preview Slip ---------------- */}
      {slipPreview && (
        <div className="mt-4 text-center">
          <h5>🧾 สลิปที่เลือก</h5>
          <img
            src={slipPreview}
            alt="slip preview"
            className="img-fluid border rounded"
            style={{ maxHeight: "400px" }}
          />
        </div>
      )}
    </div>
  );
}
