// Booking/src/pages/ThankYou.tsx
import { useEffect, useState } from "react";
import { ensureLiffReady, logoutLiff } from "../lib/liff";
import LiffNav from "../components/LiffNav";

export default function ThankYou() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timer = setTimeout(async () => {
      const ready = await ensureLiffReady();
      if (ready) await logoutLiff();
      else console.warn("⚠️ LIFF not ready, skipping logout");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <LiffNav />

      <div
        className="d-flex justify-content-center align-items-center text-center"
        style={{
          height: "100vh",
          background:
            "linear-gradient(135deg, #f6f9ff, #eaf8ff, #e5f9f1)",
          fontFamily: "Prompt, sans-serif",
        }}
      >
        <div
          className="p-4 rounded-4 shadow-lg bg-white border-0"
          style={{
            maxWidth: "420px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            animation: "fadeIn 0.7s ease-in-out",
          }}
        >
          {/* 🎉 ICON */}
          <div
            className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "90px",
              height: "90px",
              background:
                "linear-gradient(135deg, #6FF5C2, #38A3FF)",
              boxShadow: "0 4px 12px rgba(56,163,255,0.4)",
            }}
          >
            <h1 className="fw-bold text-white mb-0">✔</h1>
          </div>

          {/* ข้อความ */}
          <h2 className="fw-bold text-success mb-2">
            ขอบคุณที่ใช้บริการ!
          </h2>
          <p className="text-muted mb-1">
            ระบบได้รับข้อมูลของคุณเรียบร้อยแล้ว
          </p>
          <p className="text-secondary small mb-3">
            หน้าต่างนี้จะปิดโดยอัตโนมัติภายใน{" "}
            <span className="fw-bold text-success">{countdown}</span>{" "}
            วินาที
          </p>

          {/* เส้นคั่น */}
          <div
            className="mx-auto mb-3"
            style={{
              width: "60%",
              height: "2px",
              background: "linear-gradient(90deg,#6FF5C2,#38A3FF)",
              borderRadius: "5px",
            }}
          ></div>

          {/* ปุ่มกลับ */}
          <button
            className="btn fw-semibold w-100 text-white py-2"
            style={{
              borderRadius: "12px",
              background: "linear-gradient(135deg,#7B2CBF,#4B008A)",
              boxShadow: "0 4px 10px rgba(123,44,191,0.4)",
            }}
            onClick={async () => {
              const ready = await ensureLiffReady();
              if (ready) await logoutLiff();
            }}
          >
            ออกจากระบบทันที
          </button>
        </div>
      </div>
    </>
  );
}