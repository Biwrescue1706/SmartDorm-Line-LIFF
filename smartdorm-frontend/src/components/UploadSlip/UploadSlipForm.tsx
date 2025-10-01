// src/components/UploadSlip/UploadSlipForm.tsx
import { useState } from "react";
import Swal from "sweetalert2";
import { useUploadSlip } from "../../hooks/useUploadSlip";
import type { Room } from "../../types/Room";
import UploadSlipPreview from "./UploadSlipPreview";

interface Props {
  room: Room;
  onSuccess: () => void;
}

export default function UploadSlipForm({ room, onSuccess }: Props) {
  const [ctitle, setCtitle] = useState("");
  const [cname, setCname] = useState("");
  const [csurname, setCsurname] = useState("");
  const [cphone, setCphone] = useState("");
  const [cmumId, setCmumId] = useState("");
  const [slip, setSlip] = useState<File | null>(null);
  const [checkin, setCheckin] = useState("");

  const { loading, submitSlip } = useUploadSlip(room.roomId, room.number);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ validate
    if (!/^\d{10}$/.test(cphone)) {
      Swal.fire("❌ ข้อผิดพลาด", "เบอร์โทรต้องเป็นตัวเลข 10 หลัก", "error");
      return;
    }
    if (!/^\d{13}$/.test(cmumId)) {
      Swal.fire("❌ ข้อผิดพลาด", "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก", "error");
      return;
    }
    if (!slip) {
      Swal.fire("❌ ข้อผิดพลาด", "กรุณาแนบสลิปการโอนเงิน", "error");
      return;
    }
    if (slip.size > 5 * 1024 * 1024) {
      Swal.fire("❌ ข้อผิดพลาด", "ไฟล์สลิปต้องไม่เกิน 5MB", "error");
      return;
    }
    if (new Date(checkin) < new Date(new Date().toDateString())) {
      Swal.fire("❌ ข้อผิดพลาด", "วันที่เข้าพักต้องไม่น้อยกว่าวันนี้", "error");
      return;
    }

    const userId = localStorage.getItem("liff_userId");
    const userName = localStorage.getItem("liff_displayName");
    if (!userId) {
      Swal.fire("❌ ข้อผิดพลาด", "กรุณาเข้าสู่ระบบก่อนจองห้อง", "error");
      return;
    }

    // ✅ prepare FormData
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

    const success = await submitSlip(formData);
    if (success) onSuccess();
  };

  return (
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
          onChange={(e) => setSlip(e.target.files?.[0] || null)}
          required
        />
      </div>

      {/* ✅ Preview ด้วย UploadSlipPreview */}
      <UploadSlipPreview slip={slip} />

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

      <div className="d-flex justify-content-between mt-4">
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "กำลังบันทึก..." : "ยืนยัน"}
        </button>
      </div>
    </form>
  );
}
