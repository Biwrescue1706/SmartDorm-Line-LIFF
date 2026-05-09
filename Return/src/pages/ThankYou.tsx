// src/pages/ThankYou.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LiffNav from "../components/LiffNav";

export default function ThankYou() {
  const navigate = useNavigate();

  const [countdown, setCountdown] =
    useState(10);

  /* ===== AUTO CLOSE ===== */
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [navigate]);

  return (
    <>
      <LiffNav />

      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(180deg,#F7F4FB 0%, #F4F7FF 100%)",
          paddingTop: "72px",
          paddingBottom: "20px",
          fontFamily:
            "Prompt, sans-serif",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-7 col-lg-5">

              {/* CARD */}
              <div
                className="card border-0 rounded-5 shadow-sm overflow-hidden"
                style={{
                  border:
                    "1px solid rgba(123,44,191,0.08)",
                }}
              >
                {/* TOP BAR */}
                <div
                  style={{
                    height: "6px",
                    background:
                      "linear-gradient(90deg,#4A0080,#7B2CBF)",
                  }}
                />

                <div className="card-body text-center px-4 py-4">

                  {/* ICON */}
                  <div
                    className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: "108px",
                      height: "108px",
                      borderRadius: "50%",
                      background:
                        "rgba(123,44,191,0.10)",
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "76px",
                        height: "76px",
                        borderRadius:
                          "50%",
                        background:
                          "linear-gradient(135deg,#6A11CB,#8E2DE2)",
                        color: "#fff",
                        fontSize: "42px",
                        fontWeight: 700,
                        boxShadow:
                          "0 10px 24px rgba(106,17,203,.22)",
                      }}
                    >
                      ✓
                    </div>
                  </div>

                  {/* TITLE */}
                  <h2
                    className="fw-bold mb-2"
                    style={{
                      color: "#4A0080",
                    }}
                  >
                    ทำรายการสำเร็จ
                  </h2>

                  {/* DESC */}
                  <p
                    className="mb-4"
                    style={{
                      color: "#7A7391",
                      lineHeight: 1.7,
                      fontSize: "15px",
                    }}
                  >
                    ระบบได้รับข้อมูลของคุณเรียบร้อยแล้ว
                    <br />
                    ขอบคุณที่ใช้บริการ
                    SmartDorm
                  </p>

                  {/* COUNTDOWN */}
                  <div
                    className="rounded-4 p-4 mb-4"
                    style={{
                      background:
                        "#F4ECFB",
                      border:
                        "1px solid rgba(123,44,191,.08)",
                    }}
                  >
                    <div
                      className="fw-semibold mb-2"
                      style={{
                        color: "#7A7391",
                        fontSize: "14px",
                      }}
                    >
                      ระบบจะปิดหน้าต่างอัตโนมัติภายใน
                    </div>

                    <div
                      className="fw-bold"
                      style={{
                        fontSize: "52px",
                        lineHeight: 1,
                        color: "#4A0080",
                      }}
                    >
                      {countdown}
                    </div>

                    <div
                      style={{
                        color: "#7A7391",
                        marginTop: "4px",
                      }}
                    >
                      วินาที
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}