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

  const [cname, setCname] = useState("");
  const [csurname, setCsurname] = useState("");
  const [cphone, setCphone] = useState("");
  const [cmumId, setCmumId] = useState(""); 
  const [slip, setSlip] = useState<File | null>(null);
  const [checkin, setCheckin] = useState("");
  const [loading, setLoading] = useState(false);
  const [slipUrl, setSlipUrl] = useState<string | null>(null);

  // ✅ เช็ค login ก่อนเข้า
  useEffect(() => {
    const userId = localStorage.getItem("liff_userId");
    if (!userId) {
      Swal.fire("⚠️ กรุณาเข้าสู่ระบบผ่าน LINE", "", "warning").then(() => {
        nav("/");
      });
    }
  }, [nav]);

  // ✅ upload slip แยก แล้วได้ URL
  const uploadSlip = async (): Promise<string | null> => {
    if (!slip) return null;
    const formData = new FormData();
    formData.append("file", slip);

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("อัปโหลดสลิปล้มเหลว");
    const data = await res.json();
    return data.url; // backend ต้องส่ง { url: "/uploads/xxxx.png" }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      // 🔹 upload slip ก่อน → ได้ URL
      const slipUrlUploaded = await uploadSlip();

      // 🔹 ส่งไปสร้าง booking
      const res = await fetch(`${API_BASE}/booking/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room.roomId,
          userId,
          userName,
          cname,
          csurname,
          cphone,
          cmumId,
          checkin,
          slipUrl: slipUrlUploaded,
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("การจองล้มเหลว");

      const data = await res.json();
      console.log("📤 ส่งข้อมูล:", data);

      setSlipUrl(slipUrlUploaded);

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
        <div className="mb-3">
          <label>ชื่อ</label>
          <input type="text" className="form-control" value={cname} onChange={(e) => setCname(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>นามสกุล</label>
          <input type="text" className="form-control" value={csurname} onChange={(e) => setCsurname(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>เบอร์โทร</label>
          <input type="tel" className="form-control" value={cphone} onChange={(e) => setCphone(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>เลขบัตรประชาชน</label>
          <input type="text" className="form-control" value={cmumId} onChange={(e) => setCmumId(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>แนบสลิป</label>
          <input type="file" className="form-control" accept="image/*" onChange={(e) => setSlip(e.target.files?.[0] || null)} required />
        </div>

        <div className="mb-3">
          <label>วันที่เข้าพัก</label>
          <input type="date" className="form-control" value={checkin} onChange={(e) => setCheckin(e.target.value)} required />
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn btn-danger" onClick={() => nav("/")} disabled={loading}>
            ยกเลิก
          </button>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "กำลังบันทึก..." : "ยืนยัน"}
          </button>
        </div>
      </form>

      {slipUrl && (
        <div className="mt-4 text-center">
          <h5>🧾 สลิปที่อัปโหลด</h5>
          <img src={`${API_BASE}${slipUrl}`} alt="slip preview" className="img-fluid border rounded" style={{ maxHeight: "400px" }} />
        </div>
      )}
    </div>
  );
}
