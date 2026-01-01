// Booking/src/pages/ThankYou.tsx
import { useEffect, useState } from "react";
import { ensureLiffReady, logoutLiff } from "../lib/liff";
import LiffNav from "../components/LiffNav";

export default function ThankYou() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timer = setTimeout(async () => {
      const ready = await ensureLiffReady();
      if (ready) await logoutLiff();
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <LiffNav />

      {/* ===== PAGE BG ===== */}
      <div
        className="d-flex justify-content-center align-items-center text-center"
        style={{
          height: "100vh",
          background: "linear-gradient(135deg,#F2FBFF,#EAF7FF,#E7FFF4)",
          fontFamily: "Prompt, sans-serif",
          padding: "16px",
        }}
      >
        {/* ===== CARD ===== */}
        <div
          className="p-4 rounded-4 bg-white"
          style={{
            width: "100%",
            maxWidth: "430px",
            boxShadow: "0 10px 28px rgba(0,0,0,0.18)",
            animation: "fadeUp .8s ease",
            border: "1px solid #f0f4ff",
          }}
        >
          {/* ICON */}
          <div
            className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "95px",
              height: "95px",
              background: "linear-gradient(135deg,#6FF5C2,#38A3FF)",
              boxShadow: "0 6px 18px rgba(56,163,255,.45)",
            }}
          >
            <span
              style={{
                fontSize: "50px",
                fontWeight: "700",
                color: "white",
              }}
            >
              ✔
            </span>
          </div>

          {/* TITLE */}
          <h2 className="fw-bold" style={{ color: "#1B9C85" }}>
            การทำรายการสำเร็จ
          </h2>

          <p className="text-muted mt-2 mb-1">
            ระบบได้รับข้อมูลของคุณเรียบร้อยแล้ว
          </p>

          {/* COUNTDOWN */}
          <p className="text-secondary small">
            หน้าต่างนี้จะปิดภายใน{" "}
            <span className="fw-bold text-success">{countdown}</span> วินาที
          </p>

          {/* SEPARATOR */}
          <div
            className="mx-auto my-4"
            style={{
              width: "65%",
              height: "3px",
              background: "linear-gradient(90deg,#6FF5C2,#38A3FF)",
              borderRadius: "6px",
            }}
          ></div>

          {/* LOGOUT BUTTON */}
          <button
            className="btn fw-semibold w-100 text-white py-3 mb-2"
            style={{
              borderRadius: "14px",
              letterSpacing: "0.3px",
              background: "linear-gradient(135deg,#7B2CBF,#4B008A)",
              boxShadow: "0 4px 12px rgba(123,44,191,.35)",
            }}
            onClick={async () => {
              const ready = await ensureLiffReady();
              if (ready) await logoutLiff();
            }}
          >
            ออกจากระบบทันที
          </button>

          {/* FOOT NOTE */}
          <p className="small text-muted mt-3">
            ขอบคุณที่ไว้วางใจ SmartDorm 💙
          </p>
        </div>
      </div>

      {/* ===== ANIMATION ===== */}
      <style>
        {`
        @keyframes fadeUp {
          from {opacity: 0; transform: translateY(25px);}
          to   {opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
    </>
  );
}