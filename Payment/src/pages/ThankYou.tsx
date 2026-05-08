// src/pages/ThankYou.tsx

import { useEffect, useState } from "react";
import {
  logoutLiff,
  ensureLiffReady,
} from "../lib/liff";
import NavBar from "../components/NavBar";

export default function ThankYou() {
  const [countdown, setCountdown] =
    useState(5);

  useEffect(() => {
    let interval: ReturnType<
      typeof setInterval
    >;

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

      if (ready) {
        await logoutLiff();
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <NavBar />

      <div
        style={{
          minHeight: "100vh",
          background: "#F6F4FA",
          padding: "88px 16px 40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            background: "#fff",
            borderRadius: 32,
            padding: "42px 28px",
            boxShadow:
              "0 12px 28px rgba(74,0,128,0.08)",
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
              background:
                "linear-gradient(90deg,#4A0080 0%, #7B2BC7 100%)",
            }}
          />

          {/* SUCCESS ICON */}
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              margin: "0 auto 24px",
              background:
                "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 52,
              color: "#fff",
              boxShadow:
                "0 14px 30px rgba(74,0,128,0.20)",
            }}
          >
            ✓
          </div>

          {/* TITLE */}
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 800,
              color: "#4A0080",
              marginBottom: 14,
            }}
          >
            ชำระเงินสำเร็จ
          </h1>

          {/* DESC */}
          <p
            style={{
              margin: 0,
              color: "#6B6580",
              fontSize: 16,
              lineHeight: 1.8,
            }}
          >
            ระบบได้รับข้อมูลการชำระเงิน
            <br />
            ของคุณเรียบร้อยแล้ว
          </p>

          {/* COUNTDOWN CARD */}
          <div
            style={{
              marginTop: 28,
              background: "#FAF9FC",
              borderRadius: 24,
              padding: "22px 20px",
              border:
                "1px solid #EFE9F7",
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#7B7490",
                marginBottom: 12,
                fontWeight: 600,
              }}
            >
              ระบบจะปิดอัตโนมัติภายใน
            </div>

            <div
              style={{
                fontSize: 54,
                fontWeight: 800,
                color: "#4A0080",
                lineHeight: 1,
              }}
            >
              {countdown}
            </div>

            <div
              style={{
                marginTop: 10,
                color: "#7B7490",
                fontSize: 14,
              }}
            >
              วินาที
            </div>
          </div>

          {/* LOADING */}
          <div
            style={{
              marginTop: 30,
            }}
          >
            <div
              className="spinner-border"
              style={{
                width: "2.8rem",
                height: "2.8rem",
                color: "#4A0080",
              }}
            />

            <p
              style={{
                marginTop: 16,
                marginBottom: 0,
                color: "#7B7490",
                fontSize: 14,
              }}
            >
              กำลังนำคุณกลับสู่หน้าหลัก...
            </p>
          </div>
        </div>
      </div>
    </>
  );
}