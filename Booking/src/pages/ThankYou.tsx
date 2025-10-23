// src/pages/ThankYou.tsx
import liff from "@line/liff";
import { useEffect } from "react";

export default function ThankYou() {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (liff.isInClient()) liff.closeWindow();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light text-center">
      <div>
        <h2 className="fw-bold text-success mb-3">🎉 ขอบคุณที่ใช้บริการ!</h2>
        <p className="text-muted">ระบบจะปิดหน้าต่างนี้โดยอัตโนมัติ...</p>
      </div>
    </div>
  );
}
