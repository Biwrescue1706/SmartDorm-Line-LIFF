// src/pages/ThankYou.tsx
import { useEffect, useState } from "react";
import { ensureLiffReady, logoutLiff } from "../lib/liff";
import LiffNav from "../components/Nav/LiffNav"; //  Navbar

export default function ThankYou() {
  const [countdown, setCountdown] = useState(10); //  เริ่มที่ 10 วินาที

  useEffect(() => {
    // 🕐 ตั้ง interval นับถอยหลังทุก 1 วินาที
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // ⏳ ตั้ง timeout สำหรับ logout หลังครบ 10 วินาที
    const timer = setTimeout(async () => {
      const ready = await ensureLiffReady();
      if (ready) {
        await logoutLiff();
      } else {
        console.warn("⚠️ LIFF not ready, skipping logout");
      }
    }, 10000);

    //  ล้าง interval และ timeout เมื่อ component ถูก unmount
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/*  แถบ SmartDorm ด้านบน */}
      <LiffNav />

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
            หน้าต่างนี้จะปิดโดยอัตโนมัติภายใน{" "}
            <span className="fw-bold text-success">{countdown}</span>{" "}
            วินาที...
          </p>
        </div>
      </div>
    </>
  );
}
