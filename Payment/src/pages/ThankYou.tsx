// src/pages/ThankYou.tsx
import { useEffect } from "react";
import { logoutLiff, ensureLiffReady } from "../lib/liff";

export default function ThankYou() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const ready = await ensureLiffReady();
      if (ready) await logoutLiff();
    }, 10000); // ✅ ออกจากระบบอัตโนมัติหลัง 10 วินาที

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center px-3"
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
          style={{
            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))",
          }}
        />
      </div>

      {/* 🔹 การ์ดข้อความขอบคุณ */}
      <div
        className="p-4 rounded shadow-lg bg-white border text-center animate__animated animate__fadeIn"
        style={{
          width: "90%",
          maxWidth: "480px",
          borderRadius: "16px",
        }}
      >
        <h2 className="fw-bold text-success mb-3">
          🎉 ขอบคุณที่ชำระเงินเรียบร้อย!
        </h2>
        <p className="text-muted mb-2">
          ระบบได้บันทึกข้อมูลการชำระของคุณเรียบร้อยแล้ว
        </p>
        <p className="text-muted small mb-0">
          (จะกลับไปหน้า LINE อัตโนมัติภายใน <b>10 วินาที</b>)
        </p>

        <div className="mt-4">
          <div
            className="spinner-border text-success"
            style={{ width: "2.5rem", height: "2.5rem" }}
          ></div>
          <p className="mt-2 text-secondary small">กำลังกลับไปยังหน้าหลัก...</p>
        </div>
      </div>
    </div>
  );
}
