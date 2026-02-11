// src/pages/ThankYou.tsx
import { useEffect, useState } from "react";
import { logoutLiff, ensureLiffReady } from "../lib/liff";
import NavBar from "../components/NavBar";

export default function ThankYou() {
  const [countdown, setCountdown] = useState(9);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timer = setTimeout(async () => {
      const ready = await ensureLiffReady();
      if (ready) await logoutLiff();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7FAFC",
        fontFamily: "Prompt, sans-serif",
      }}
      className="text-center"
    >
      <NavBar />

      {/* CARD */}
      <div
        style={{
          marginTop: "90px",
          background: "white",
          maxWidth: "520px",
          marginInline: "auto",
          borderRadius: "18px",
          padding: "32px 28px",
          boxShadow: "0 6px 26px rgba(0,0,0,0.06)",
          border: "1px solid #E5E7EB",
        }}
      >
        <h2
          style={{
            fontWeight: 700,
            color: "#0F3D91",
            marginBottom: "12px",
          }}
        >
          ชำระเงินสำเร็จแล้ว
        </h2>

        <p style={{ color: "#475569", marginBottom: "6px" }}>
          ระบบได้รับข้อมูลการชำระเงินของคุณเรียบร้อย
        </p>

        <p style={{ color: "#475569", fontSize: "14px", marginBottom: "20px" }}>
          หน้านี้จะปิดโดยอัตโนมัติภายใน{" "}
          <b style={{ color: "#0F3D91" }}>{countdown}</b> วินาที
        </p>

        {/* Spinner */}
        <div className="mt-3">
          <div
            className="spinner-border"
            style={{
              width: "2.8rem",
              height: "2.8rem",
              color: "#0F3D91",
            }}
          ></div>
          <p className="mt-2" style={{ color: "#64748B", fontSize: "14px" }}>
            กำลังนำคุณกลับสู่หน้าหลัก...
          </p>
        </div>
      </div>
    </div>
  );
}