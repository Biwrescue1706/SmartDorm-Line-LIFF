// src/pages/ThankYou.tsx
import { useEffect, useState } from "react";
import { ensureLiffReady, logoutLiff } from "../lib/liff";
import LiffNav from "../components/LiffNav";

const SCB_PURPLE = "#4A0080";
const SCB_LIGHT = "#F5EEFC";
const BG_SOFT = "#F6F4FA";
const TEXT_SUB = "#7B7490";

export default function ThankYou() {
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timer = setTimeout(async () => {
      const ready = await ensureLiffReady();
      if (ready) await logoutLiff();
    }, 7000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <LiffNav />

      <div
        style={{
          minHeight: "100vh",
          background: BG_SOFT,
          padding: "8px 10px 16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Prompt, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 430,
            background: "#fff",
            borderRadius: 30,
            padding: "24px 12px",
            boxShadow: "0 14px 34px rgba(74,0,128,0.10)",
            border: "1px solid rgba(74,0,128,0.06)",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          {/* TOP BAR */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 6,
              background: "linear-gradient(90deg, #4A0080 0%, #7B2BC7 100%)",
            }}
          />

          {/* SUCCESS ICON */}
          <div
            style={{
              width: 110,
              height: 110,
              margin: "0 auto 24px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6E1AB5,#8E3BDE)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 10px 24px rgba(74,0,128,0.20)",
              position: "relative",
            }}
          >
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                width: 135,
                height: 135,
                borderRadius: "50%",
                background: "rgba(142,59,222,0.10)",
              }}
            />

            <span
              style={{
                fontSize: 52,
                color: "#fff",
                fontWeight: 800,
                zIndex: 2,
              }}
            >
              ✓
            </span>
          </div>

          {/* TITLE */}
          <h1
            style={{
              margin: 0,
              color: SCB_PURPLE,
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.3,
            }}
          >
            ทำรายการสำเร็จ
          </h1>

          {/* DESCRIPTION */}
          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              color: TEXT_SUB,
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            ระบบได้รับข้อมูลของคุณเรียบร้อยแล้ว
            <br />
            ขอบคุณที่ใช้บริการ SmartDorm
          </p>

          {/* COUNTDOWN CARD */}
          <div
            style={{
              marginTop: 24,
              background: SCB_LIGHT,
              borderRadius: 18,
              padding: "16px 18px",
              border: "1px solid rgba(74,0,128,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: TEXT_SUB,
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              ระบบจะปิดหน้าต่างอัตโนมัติภายใน
            </div>

            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: SCB_PURPLE,
                lineHeight: 1,
              }}
            >
              {countdown}
            </div>

            <div
              style={{
                marginTop: 4,
                color: TEXT_SUB,
                fontSize: 13,
              }}
            >
              วินาที
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={async () => {
              const ready = await ensureLiffReady();
              if (ready) await logoutLiff();
            }}
            style={{
              width: "100%",
              marginTop: 24,
              padding: "15px",
              borderRadius: 18,
              border: "none",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: 15,
              background: "linear-gradient(135deg, #4A0080 0%, #6E1AB5 100%)",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(74,0,128,0.20)",
              transition: "0.2s",
            }}
          >
            ปิดหน้าต่างทันที
          </button>

          {/* FOOTER */}
          <div
            style={{
              marginTop: 22,
              fontSize: 13,
              color: TEXT_SUB,
            }}
          >
            SmartDorm Apartment Management
          </div>
        </div>
      </div>
    </>
  );
}
