import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE } from "../config";
import { refreshLiffToken } from "../lib/liff";
import NavBar from "../components/NavBar"; // ✅ ใช้ NavBar อัตโนมัติ

export default function UploadSlip() {
  const { state } = useLocation();
  const nav = useNavigate();
  const bill = state as any;
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      Swal.fire("กรุณาเลือกสลิปก่อนส่ง", "", "warning");
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

  // ⚠️ ถ้าไม่มี bill (เช่นเข้าหน้านี้ตรงๆ)
  if (!bill)
    return (
      <div className="smartdorm-page text-center justify-content-center">
        <NavBar /> {/* ✅ Navbar คงที่ด้านบน */}
        <div className="mt-5"></div>
        <h5 className="text-danger mb-3">❌ ไม่พบบิล</h5>
        <button
          className="btn-primary-smart fw-semibold"
          onClick={() => nav("/")}
        >
          กลับหน้าแรก
        </button>
      </div>
    );

  return (
    <div className="smartdorm-page">
      <NavBar /> {/* ✅ Navbar ด้านบน */}
      <div className="mt-5"></div> {/* เผื่อพื้นที่ Navbar */}

      {/* 🔹 โลโก้ SmartDorm */}
      <div className="text-center mb-3">
        <h4 className="fw-bold text-success mb-0">📸 อัปโหลดสลิป SmartDorm</h4>
        <p className="text-muted small mt-1">
          แนบหลักฐานการโอนเงินเพื่อยืนยันการชำระ
        </p>
      </div>

      {/* 🔹 กล่องอัปโหลด */}
      <div className="smartdorm-card shadow-sm">
        <h5 className="fw-bold text-center mb-3 text-primary">
          อัปโหลดสลิปการชำระเงิน
        </h5>

        <div className="text-center mb-3">
          <p className="mb-0">
            ห้อง <b>{bill.room?.number ?? "-"}</b>
          </p>
          <p className="mb-3">
            💰 ยอด <b>{bill.total?.toLocaleString() ?? 0} บาท</b>
          </p>
        </div>

        {/* 🔹 เลือกไฟล์ */}
        <div className="mb-3">
          <label className="fw-semibold mb-2">เลือกรูปสลิป</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* 🔹 แสดง Preview */}
        {file && (
          <div className="text-center mb-3">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="rounded shadow-sm"
              style={{
                width: "100%",
                maxWidth: "300px",
                objectFit: "contain",
                borderRadius: "10px",
              }}
            />
          </div>
        )}

        {/* 🔹 ปุ่มส่ง */}
        <button
          className="btn-primary-smart w-100 fw-semibold py-2"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "⏳ กำลังส่ง..." : "📤 ส่งสลิปการชำระเงิน"}
        </button>
      </div>
    </div>
  );
}
