// src/pages/PaymentChoice.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import Swal from "sweetalert2";
import { ensureLiffReady, refreshLiffToken } from "../lib/liff";
import axios from "axios";
import liff from "@line/liff";

export default function PaymentChoice() {
  const { state } = useLocation();
  const nav = useNavigate();
  const bill = state as any;

  const [method, setMethod] = useState<"qr" | "account">("qr");
  const [ready, setReady] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const ok = await ensureLiffReady();
        if (!ok) throw new Error("LIFF not ready");

        const token = await refreshLiffToken();
        const profile = await liff.getProfile();
        setUserName(profile.displayName);

        await axios.post(`${API_BASE}/user/me`, { accessToken: token });
        setReady(true);
      } catch {
        Swal.fire("❌ ตรวจสอบสิทธิ์ล้มเหลว", "กรุณาเข้าสู่ระบบใหม่", "error");
        nav("/");
      }
    })();
  }, [nav]);

  if (!bill)
    return (
      <div className="text-center p-5">
        <h5 className="text-danger mb-3">❌ ไม่พบบิล</h5>
        <button className="btn btn-primary" onClick={() => nav("/")}>
          กลับหน้าแรก
        </button>
      </div>
    );

  const total = bill.total;
  const qrUrl = `${API_BASE}/qr/${total}`;
  const isInLine = liff.isInClient();

  if (!ready)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );

  const handleCopy = () => {
    navigator.clipboard.writeText("5052997156");
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "คัดลอกเลขบัญชีแล้ว",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center py-4"
      style={{ background: "linear-gradient(135deg, #e0f7fa, #f1fff0)" }}
    >
      {/* 🔹 โลโก้ */}
      <div className="text-center mb-4">
        <img
          src="https://smartdorm-admin.biwbong.shop/assets/SmartDorm.png"
          alt="SmartDorm Logo"
          width={120}
          className="mb-2"
          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}
        />
        <h5 className="fw-bold text-success mb-0">SmartDorm Payment</h5>
        <p className="text-muted small mb-0">
          สวัสดีคุณ <b>{userName}</b>
        </p>
      </div>

      {/* 🔹 การ์ดเลือกชำระ */}
      <div
        className="card shadow-lg border-0 p-3"
        style={{
          width: "90%",
          maxWidth: "460px",
          borderRadius: "16px",
          background: "white",
        }}
      >
        <h4 className="fw-bold text-center mb-3 text-primary">
          💳 วิธีการชำระเงิน
        </h4>

        {/* 🔘 ปุ่มเลือกวิธีชำระ */}
        <div className="btn-group w-100 mb-4">
          <button
            className={`btn ${
              method === "account" ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => setMethod("account")}
          >
            🏦 โอนบัญชีธนาคาร
          </button>
          <button
            className={`btn ${
              method === "qr" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setMethod("qr")}
          >
            📲 สแกน QR PromptPay
          </button>
        </div>

        {/* 💰 ยอดรวม */}
        <div
          className="p-3 mb-3 rounded text-center shadow-sm"
          style={{ background: "linear-gradient(135deg, #b1f370, #b3efea)" }}
        >
          <h5 className="fw-bold text-dark">
            💰 ยอดรวม {total.toLocaleString("th-TH")} บาท
          </h5>
        </div>

        {/* 🔹 QR PromptPay หรือ บัญชี */}
        {method === "qr" ? (
          <div className="text-center mb-3">
            <img
              src={qrUrl}
              alt="QR PromptPay"
              width="220"
              className="border rounded shadow-sm my-2"
            />
            {isInLine ? (
              <p className="text-danger small fw-semibold">
                กดค้างที่ QR แล้วเลือก “บันทึกภาพ”
              </p>
            ) : (
              <button
                className="btn btn-outline-success w-100"
                onClick={async () => {
                  const res = await fetch(qrUrl);
                  const blob = await res.blob();
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = "SmartDorm_QR.png";
                  link.click();
                }}
              >
                📥 ดาวน์โหลด QR
              </button>
            )}
          </div>
        ) : (
          <div
            className="text-center text-white p-3 rounded"
            style={{
              background: "linear-gradient(135deg, #5d00ff, #9bc5ee)",
            }}
          >
            <h5 className="fw-bold">ธนาคารไทยพาณิชย์</h5>
            <p className="fw-semibold mb-0">505-2997156</p>
            <p className="mb-3">นายภูวณัฐ พาหะละ</p>
            <button
              className="btn btn-warning fw-semibold"
              onClick={handleCopy}
            >
              📋 คัดลอกเลขบัญชี
            </button>
          </div>
        )}

        {/* 🔹 ปุ่มดำเนินการต่อ */}
        <button
          className="btn w-100 fw-semibold text-white mt-3 py-2"
          style={{
            background: "linear-gradient(90deg, #43cea2, #185a9d)",
            borderRadius: "10px",
          }}
          onClick={() => nav("/upload-slip", { state: bill })}
        >
          ➡️ ดำเนินการต่อ
        </button>
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
