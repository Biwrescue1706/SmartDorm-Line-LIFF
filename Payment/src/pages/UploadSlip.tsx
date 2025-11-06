// src/pages/UploadSlip.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE } from "../config";
import { refreshLiffToken } from "../lib/liff";

export default function UploadSlip() {
  const { state } = useLocation();
  const nav = useNavigate();
  const bill = state as any;
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      Swal.fire("กรุณาเลือกสลิป", "", "warning");
      return;
    }

    try {
      setLoading(true);
      const token = await refreshLiffToken();
      if (!token) throw new Error("ไม่มี access token");

      const form = new FormData();
      form.append("billId", bill.billId);
      form.append("accessToken", token);
      form.append("slip", file);

      const res = await axios.post(`${API_BASE}/payment/create`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ ส่งสลิปสำเร็จ:", res.data);
      Swal.fire("ส่งสลิปสำเร็จ", "ขอบคุณที่ชำระเงิน", "success");
      nav("/thankyou");
    } catch (err: any) {
      console.error(err);
      Swal.fire("❌ ไม่สามารถส่งสลิปได้", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!bill)
    return (
      <div className="text-center p-5">
        <h5 className="text-danger mb-3">❌ ไม่พบบิล</h5>
        <button className="btn btn-primary" onClick={() => nav("/")}>
          กลับหน้าแรก
        </button>
      </div>
    );

  return (
    <div className="container my-4">
      <div className="card shadow-sm p-3">
        <h4 className="fw-bold text-center mb-3">📸 อัปโหลดสลิปการชำระเงิน</h4>

        <p className="text-center mb-2">
          ห้อง <b>{bill.room?.number}</b> — ยอด{" "}
          <b>{bill.total.toLocaleString()} บาท</b>
        </p>

        <input
          type="file"
          accept="image/*"
          className="form-control mb-3"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {file && (
          <div className="text-center mb-3">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              width="200"
              className="rounded border shadow-sm"
            />
          </div>
        )}

        <button
          className="btn btn-success w-100 fw-semibold"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "กำลังส่ง..." : "📤 ส่งสลิป"}
        </button>
      </div>
    </div>
  );
}
