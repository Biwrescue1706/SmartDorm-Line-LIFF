// Payment/src/pages/UploadSlip.tsx

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE } from "../config";
import { refreshLiffToken } from "../lib/liff";
import NavBar from "../components/NavBar";

/**
 * ย่อขนาดรูป
 */
const compressImage = (file: File, quality = 0.6): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      const maxW = 1080;
      let w = img.width;
      let h = img.height;

      if (w > maxW) {
        h = (maxW / w) * h;
        w = maxW;
      }

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          resolve(
            new File([blob!], file.name.replace(/\.\w+$/, ".jpg"), {
              type: "image/jpeg",
            })
          );
        },
        "image/jpeg",
        quality
      );
    };
  });
};

export default function UploadSlip() {
  const { state } = useLocation();
  const nav = useNavigate();
  const bill = state as any;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // cleanup preview memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSelectFile = async (file: File | null) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        title: "กำลังลดขนาดรูป...",
        html: "กำลังประมวลผลภาพสลิป โปรดรอ",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const compressed = await compressImage(file, 0.55);
      Swal.close();

      setFile(compressed);
      setPreview(URL.createObjectURL(compressed));
    } else {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!bill?.billId)
      return Swal.fire("ไม่พบบิล", "กรุณากลับไปเลือกบิลใหม่", "error");

    if (!file)
      return Swal.fire("กรุณาเลือกสลิปก่อนส่ง", "", "warning");

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

      Swal.fire({
        icon: "success",
        title: "ส่งสลิปสำเร็จ",
        text: "ขอบคุณที่ชำระเงิน",
        showConfirmButton: false,
        timer: 1800,
      }).then(() => {
        nav("/thankyou");
      });

    } catch (err: any) {
      console.log("SERVER ERROR:", err.response?.data);

      Swal.fire(
        "❌ ไม่สามารถส่งสลิปได้",
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          err.message,
        "error"
      );
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
        }}
      >
        อัปโหลดสลิปการชำระเงิน
      </div>

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
        }}
      >
        <h5 style={{ color: "#0F3D91", fontWeight: 600 }}>
          รายละเอียดการชำระเงิน
        </h5>

        <p>ห้อง <b>{bill.room?.number ?? "-"}</b></p>
        <p>
          ยอดที่ต้องชำระ{" "}
          <b style={{ color: "#0F3D91" }}>
            {bill.total?.toLocaleString("th-TH")} บาท
          </b>
        </p>

        <div
          style={{
            border: "2px dashed #CBD5E1",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => document.getElementById("slipInput")?.click()}
        >
          {!file ? "เลือกไฟล์สลิป" : `✔ ${file.name}`}

          <input
            id="slipInput"
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => onSelectFile(e.target.files?.[0] || null)}
          />
        </div>

        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{
              width: "100%",
              maxWidth: "300px",
              marginTop: "15px",
              borderRadius: "10px",
            }}
          />
        )}

        <button
          className="btn w-100 mt-3"
          disabled={loading}
          style={{
            background: "#0F3D91",
            color: "white",
            borderRadius: "10px",
            fontSize: "18px",
          }}
          onClick={handleSubmit}
        >
          {loading ? "กำลังส่ง..." : "ส่งสลิป"}
        </button>
      </div>
    </div>
  );
}