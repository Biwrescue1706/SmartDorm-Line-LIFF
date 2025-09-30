// src/components/UploadSlip/UploadSlipForm.tsx
import { useState } from "react";
import Swal from "sweetalert2";
import UploadSlipPreview from "./UploadSlipPreview";

interface Props {
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  nav: any;
  roomId: string;
}

export default function UploadSlipForm({ onSubmit, loading, nav, roomId }: Props) {
  const [ctitle, setCtitle] = useState("");
  const [cname, setCname] = useState("");
  const [csurname, setCsurname] = useState("");
  const [cphone, setCphone] = useState("");
  const [cmumId, setCmumId] = useState("");
  const [checkin, setCheckin] = useState("");
  const [slip, setSlip] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
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
      Swal.fire("❌ ข้อผิดพลาด", "กรุณาแนบสลิป", "error");
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
      Swal.fire("❌ ข้อผิดพลาด", "กรุณาเข้าสู่ระบบก่อน", "error");
      return;
    }

    // ✅ เตรียม FormData
    const formData = new FormData();
    formData.append("roomId", roomId);
    formData.append("userId", userId);
    formData.append("userName", userName || "");
    formData.append("ctitle", ctitle);
    formData.append("cname", cname);
    formData.append("csurname", csurname);
    formData.append("cphone", cphone);
    formData.append("cmumId", cmumId);
    formData.append("checkin", checkin);
    formData.append("slip", slip);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* คำนำหน้า */}
      <select
        value={ctitle}
        onChange={(e) => setCtitle(e.target.value)}
        required
        className="w-full border rounded px-3 py-2 text-sm"
      >
        <option value="">-- เลือกคำนำหน้า --</option>
        <option value="นาย">นาย</option>
        <option value="นาง">นาง</option>
        <option value="นางสาว">นางสาว</option>
      </select>

      <input
        type="text"
        placeholder="ชื่อ"
        value={cname}
        onChange={(e) => setCname(e.target.value)}
        required
        className="w-full border rounded px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="นามสกุล"
        value={csurname}
        onChange={(e) => setCsurname(e.target.value)}
        required
        className="w-full border rounded px-3 py-2 text-sm"
      />
      <input
        type="tel"
        placeholder="เบอร์โทร"
        value={cphone}
        onChange={(e) => setCphone(e.target.value)}
        required
        className="w-full border rounded px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="เลขบัตรประชาชน"
        value={cmumId}
        onChange={(e) => setCmumId(e.target.value)}
        required
        className="w-full border rounded px-3 py-2 text-sm"
      />
      <input
        type="date"
        value={checkin}
        onChange={(e) => setCheckin(e.target.value)}
        required
        className="w-full border rounded px-3 py-2 text-sm"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSlip(e.target.files?.[0] || null)}
        required
        className="w-full border rounded px-3 py-2 text-sm"
      />

      <UploadSlipPreview slip={slip} />

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => nav(-1)}
          className="flex-1 bg-red-500 text-white py-2 rounded text-sm"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-600 text-white py-2 rounded text-sm"
        >
          {loading ? "กำลังบันทึก..." : "ยืนยัน"}
        </button>
      </div>
    </form>
  );
}
