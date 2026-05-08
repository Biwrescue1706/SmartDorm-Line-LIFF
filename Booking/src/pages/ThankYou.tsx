// Booking/src/pages/ThankYou.tsx

import { useEffect, useState } from "react";
import {
  ensureLiffReady,
  logoutLiff,
} from "../lib/liff";

import LiffNav from "../components/LiffNav";

export default function ThankYou() {
  const [countdown, setCountdown] =
    useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    const timer = setTimeout(
      async () => {
        const ready =
          await ensureLiffReady();

        if (ready)
          await logoutLiff();
      },
      10000
    );

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <LiffNav />

      <div
        className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3"
        style={{
          background:
            "linear-gradient(135deg,#F6F4FA 0%,#FDFBFF 100%)",
        }}
      >
        <div
          className="card border-0 shadow-lg rounded-5 overflow-hidden"
          style={{
            maxWidth: 460,
            width: "100%",
          }}
        >
          {/* TOP BAR */}
          <div
            style={{
              height: 6,
              background:
                "linear-gradient(90deg,#4A0080 0%, #7B2BC7 100%)",
            }}
          />

          <div className="card-body p-4 p-md-5 text-center">

            {/* ICON */}
            <div
              className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 110,
                height: 110,
                background:
                  "linear-gradient(135deg,#4A0080 0%, #7B2BC7 100%)",
                boxShadow:
                  "0 12px 28px rgba(74,0,128,0.25)",
              }}
            >
              <span
                style={{
                  fontSize: 56,
                  color: "#fff",
                  fontWeight: 800,
                }}
              >
                ✓
              </span>
            </div>

            {/* TITLE */}
            <h2
              className="fw-bold mb-3"
              style={{
                color: "#4A0080",
              }}
            >
              จองห้องสำเร็จ
            </h2>

            <p
              className="mb-2"
              style={{
                color: "#6B7280",
                fontSize: 15,
                lineHeight: 1.7,
              }}
            >
              ระบบได้รับข้อมูลการจองของคุณเรียบร้อยแล้ว
              <br />
              กรุณารอเจ้าหน้าที่ตรวจสอบข้อมูล
            </p>

            {/* COUNTDOWN */}
            <div
              className="rounded-4 py-3 px-4 mt-4 mb-4"
              style={{
                background: "#F6F0FD",
                border:
                  "1px solid #E9D8FD",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: "#7B7490",
                  marginBottom: 6,
                }}
              >
                ระบบจะปิดอัตโนมัติภายใน
              </div>

              <div
                className="fw-bold"
                style={{
                  fontSize: 38,
                  color: "#4A0080",
                  lineHeight: 1,
                }}
              >
                {countdown}
              </div>

              <div
                style={{
                  fontSize: 14,
                  color: "#7B7490",
                  marginTop: 6,
                }}
              >
                วินาที
              </div>
            </div>

            {/* BUTTON */}
            <button
              className="btn w-100 text-white fw-bold py-3 rounded-4"
              style={{
                background:
                  "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                border: "none",
                boxShadow:
                  "0 8px 20px rgba(74,0,128,0.18)",
              }}
              onClick={async () => {
                const ready =
                  await ensureLiffReady();

                if (ready)
                  await logoutLiff();
              }}
            >
              ออกจากระบบทันที
            </button>

            {/* FOOTER */}
            <div
              className="mt-4"
              style={{
                fontSize: 13,
                color: "#9CA3AF",
              }}
            >
              ขอบคุณที่ใช้บริการ SmartDorm
            </div>

          </div>
        </div>
      </div>
    </>
  );
}