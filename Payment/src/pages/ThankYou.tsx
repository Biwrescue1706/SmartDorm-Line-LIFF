// src/pages/ThankYou.tsx
import { useEffect } from "react";
import { logoutLiff, ensureLiffReady } from "../lib/liff";

export default function ThankYou() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const ready = await ensureLiffReady();
      if (ready) await logoutLiff();
    }, 10000); // ออกจากระบบอัตโนมัติหลัง 10 วินาที

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="vh-100 d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        background: "linear-gradient(135deg, #f4fff4, #e0f7fa)",
      }}
    >
      <div className="p-4 rounded shadow-sm bg-white border">
        <h2 className="fw-bold text-success mb-3">🎉 ขอบคุณที่ชำระเงิน!</h2>
        <p className="text-muted mb-2">ระบบได้บันทึกข้อมูลการชำระเรียบร้อย</p>
        <p className="text-muted small">(จะกลับไปหน้า LINE อัตโนมัติ)</p>
      </div>
    </div>
  );
}
