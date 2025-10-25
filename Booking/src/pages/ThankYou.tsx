import { useEffect } from "react";
import { logoutLiff } from "../lib/liff";

export default function ThankYou() {
  useEffect(() => {
    const timer = setTimeout(() => {
      // ✅ ออกจากระบบ LIFF (ล้าง token + ปิดหน้าต่าง หรือ redirect)
      logoutLiff();
    }, 2500);

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
        <p className="text-muted mb-1">
          ระบบได้รับข้อมูลของคุณเรียบร้อยแล้ว
        </p>
        <p className="text-secondary small">
          หน้าต่างนี้จะปิดโดยอัตโนมัติภายในไม่กี่วินาที...
        </p>
      </div>
    </div>
  );
}
