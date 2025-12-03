// Payment/src/pages/UploadSlip.tsx

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE } from "../config";
import { refreshLiffToken } from "../lib/liff";
import NavBar from "../components/NavBar";

export default function UploadSlip() {
  const { state } = useLocation();
  const nav = useNavigate();
  const bill = state as any;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) return Swal.fire("กรุณาเลือกสลิปก่อนส่ง", "", "warning");

    try {
      setLoading(true);
      const token = await refreshLiffToken();
      if (!token) throw new Error("ไม่มี token");

      const form = new FormData();
      form.append("billId", bill.billId);
      form.append("accessToken", token);
      form.append("slip", file);

      await axios.post(`${API_BASE}/payment/create`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("ส่งสลิปสำเร็จ", "ขอบคุณที่ชำระเงิน", "success");
      nav("/thankyou");
    } catch (err: any) {
      Swal.fire("❌ ไม่สามารถส่งสลิปได้", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!bill)
    return (
      <div className="text-center" style={{ marginTop: "80px" }}>
        <NavBar />
        <h5 className="text-danger mt-5">❌ ไม่พบบิล</h5>
        <button
          className="btn"
          style={{
            background: "#0F3D91",
            color: "white",
            borderRadius: "10px",
            marginTop: "15px",
          }}
          onClick={() => nav("/")}
        >
          กลับหน้าแรก
        </button>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7FAFC",
        fontFamily: "Prompt, sans-serif",
      }}
    >
      <NavBar />

      {/* HEADER */}
      <div
        style={{
          marginTop: "70px",
          textAlign: "center",
          padding: "20px 0",
          background: "#0F3D91",
          color: "white",
          fontWeight: 600,
          fontSize: "20px",
          borderBottomLeftRadius: "18px",
          borderBottomRightRadius: "18px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.18)",
        }}
      >
        อัปโหลดสลิปการชำระเงิน
      </div>

      {/* CARD */}
      <div
        style={{
          marginTop: "40px",
          marginBottom: "60px",
          background: "white",
          maxWidth: "520px",
          marginInline: "auto",
          borderRadius: "18px",
          padding: "26px 22px",
          boxShadow: "0 6px 26px rgba(0,0,0,0.06)",
          border: "1px solid #E5E7EB",
        }}
      >
        <h5
          style={{
            color: "#0F3D91",
            fontWeight: 600,
            marginBottom: "16px",
            borderLeft: "5px solid #0F3D91",
            paddingLeft: "10px",
          }}
        >
          รายละเอียดการชำระเงิน
        </h5>

        <p className="mb-1">
          ห้อง <b>{bill.room?.number ?? "-"}</b>
        </p>

        <p className="mb-3">
          ยอดที่ต้องชำระ{" "}
          <b style={{ color: "#0F3D91" }}>
            {bill.total?.toLocaleString("th-TH")} บาท
          </b>
        </p>

        {/* INPUT FILE */}
        <label className="fw-semibold mb-2">เลือกรูปสลิป</label>
        <input
          type="file"
          accept="image/*"
          className="form-control mb-3"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {/* PREVIEW SLIP */}
        {file && (
          <div className="text-center mb-3">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{
                width: "100%",
                maxWidth: "300px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          className="btn w-100 fw-semibold py-2"
          disabled={loading}
          style={{
            background: "#0F3D91",
            color: "white",
            borderRadius: "10px",
            fontSize: "18px",
            boxShadow: "0 4px 10px rgba(15,61,145,0.35)",
          }}
          onClick={handleSubmit}
        >
          {loading ? "⏳ กำลังส่ง..." : "📤 ส่งสลิปการชำระเงิน"}
        </button>
      </div>
    </div>
  );
}