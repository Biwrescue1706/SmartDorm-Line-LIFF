หลวง// src/pages/ThankYou.tsx
import { useEffect } from "react";
import { ensureLiffReady, logoutLiff } from "../lib/liff";

export default function ThankYou() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      // ✅ ตรวจสอบ LIFF พร้อมก่อนออกจากระบบ
      const ready = await ensureLiffReady();
      if (ready) {
axios.post        await logoutLiff();
      } else {
        console.warn("⚠️ LIFF not ready, skipping logout");
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center bg-light text-center"
      style={{
        background:
          "linear-gradient(135deg, rgba(240,255,240,1), rgba(220,248,255,1))",
      }}
    >
      <div className="p-4 rounded shadow-sm bg-white border">
        <h2 className="fw-bold text-success mb-3">🎉 ขอบคุณที่ใช้บริการ!</h2>
        <p className="text-muted mb-1">ระบบได้รับข้อมูลของคุณเรียบร้อยแล้ว</p>
        <p className="text-secondary small">
          หน้าต่างนี้จะปิดโดยอัตโนมัติภายในไม่กี่วินาที...
        </p>
      </div>
    </div>
  );
}
