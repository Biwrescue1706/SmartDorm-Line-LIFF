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
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-start py-4 px-2"
      style={{
        background: "linear-gradient(135deg, #e0f7fa, #f1fff0)",
      }}
    >
      {/* 🔹 โลโก้ SmartDorm */}
      <div className="text-center mb-3">
        <img
          src="https://smartdorm-admin.biwbong.shop/assets/SmartDorm.png"
          alt="SmartDorm Logo"
          width={50}
          height={50}
          className="mb-2"
          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}
        />
        <h5 className="fw-bold text-success mb-0">📸 อัปโหลดสลิป SmartDorm</h5>
      </div>

      {/* 🔹 กล่องอัปโหลดสลิป */}
      <div
        className="card shadow-lg border-0 w-100"
        style={{
          maxWidth: "480px",
          borderRadius: "16px",
          background: "white",
        }}
      >
        <div className="card-body p-4">
          <h5 className="fw-bold text-center mb-3 text-primary">
            อัปโหลดสลิปการชำระเงิน
          </h5>

          <p className="text-center mb-3">
            ห้อง <b>{bill.room?.number}</b> — ยอด{" "}
            <b>{bill.total.toLocaleString()} บาท</b>
          </p>

          {/* 🔹 เลือกไฟล์ */}
          <input
            type="file"
            accept="image/*"
            className="form-control mb-3"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {/* 🔹 แสดงภาพ Preview */}
          {file && (
            <div className="text-center mb-3">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                width="220"
                className="rounded border shadow-sm"
                style={{
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}

          {/* 🔹 ปุ่มส่ง */}
          <button
            className="btn w-100 fw-semibold text-white py-2"
            style={{
              background: "linear-gradient(90deg, #43cea2, #185a9d)",
              borderRadius: "10px",
              transition: "0.3s",
            }}
            disabled={loading}
            onClick={handleSubmit}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #74ebd5, #ACB6E5)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #43cea2, #185a9d)")
            }
          >
            {loading ? "⏳ กำลังส่ง..." : "📤 ส่งสลิปการชำระเงิน"}
          </button>
        </div>
      </div>

      {/* 🔹 ปุ่มกลับ */}
      <button
        className="btn btn-link text-muted mt-3 fw-semibold"
        onClick={() => nav(-1)}
      >
        ⬅️ กลับหน้าก่อนหน้า
      </button>
    </div>
  );
}
