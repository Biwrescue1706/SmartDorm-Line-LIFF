// Payment/src/pages/PaymentChoice.tsx

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import Swal from "sweetalert2";
import { refreshLiffToken } from "../lib/liff";
import axios from "axios";
import liff from "@line/liff";
import NavBar from "../components/NavBar";

interface Bill {
  billId: string;
  billNumber?: string;
  total: number;
  status: number;
  room: { number: string };
}

export default function PaymentChoice() {
  const { state } = useLocation();
  const nav = useNavigate();

  const bill = state as Bill;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();

        if (!token) {
          throw new Error("ไม่มี token");
        }

        await axios.post(`${API_BASE}/user/me`, {
          accessToken: token,
        });

        setReady(true);
      } catch {
        Swal.fire(
          "❌ ตรวจสอบสิทธิ์ล้มเหลว",
          "กรุณาเข้าสู่ระบบใหม่",
          "error"
        );

        nav("/");
      }
    })();
  }, [nav]);

  if (!bill) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F6F4FA",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 20,
        }}
      >
        <h4
          style={{
            color: "#dc3545",
            marginBottom: 16,
          }}
        >
          ❌ ไม่พบข้อมูลบิล
        </h4>

        <button
          onClick={() => nav(-1)}
          style={{
            border: "none",
            background:
              "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
            color: "#fff",
            padding: "12px 22px",
            borderRadius: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          กลับหน้าก่อนหน้า
        </button>
      </div>
    );
  }

  const qrUrl = `${API_BASE}/qr/${bill.total}`;
  const isInLine = liff.isInClient();

  if (!ready) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F6F4FA",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="spinner-border text-primary"></div>

        <p
          style={{
            marginTop: 18,
            color: "#7B7490",
          }}
        >
          กำลังตรวจสอบสิทธิ์ผู้ใช้งาน...
        </p>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const res = await fetch(qrUrl);

      const blob = await res.blob();

      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = "SmartDorm_QR.png";

      link.click();
    } catch {
      Swal.fire(
        "❌ บันทึก QR ไม่สำเร็จ",
        "",
        "error"
      );
    }
  };

  return (
    <>
      <NavBar />

      <div
        style={{
          minHeight: "100vh",
          background: "#F6F4FA",
          padding: "88px 16px 40px",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            margin: "0 auto",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: "#fff",
              borderRadius: 30,
              padding: 28,
              marginBottom: 20,
              boxShadow: "0 12px 28px rgba(74,0,128,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
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

            <h1
              style={{
                margin: 0,
                fontSize: 30,
                fontWeight: 800,
                color: "#4A0080",
              }}
            >
              💳 ชำระเงิน
            </h1>

            <p
              style={{
                marginTop: 10,
                marginBottom: 0,
                color: "#7B7490",
                lineHeight: 1.7,
              }}
            >
              กรุณาชำระผ่าน PromptPay
              <br />
              และอัปโหลดสลิปหลังโอนเงิน
            </p>
          </div>

          {/* BILL CARD */}
          <div
            style={{
              background: "#fff",
              borderRadius: 30,
              padding: 24,
              marginBottom: 20,
              boxShadow: "0 12px 28px rgba(74,0,128,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  color: "#7B7490",
                }}
              >
                เลขที่บิล
              </span>

              <strong
                style={{
                  color: "#2D1A47",
                }}
              >
                {bill.billNumber || "-"}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: "#7B7490",
                }}
              >
                ห้องพัก
              </span>

              <strong
                style={{
                  color: "#2D1A47",
                }}
              >
                ห้อง {bill.room?.number}
              </strong>
            </div>

            {/* TOTAL */}
            <div
              style={{
                marginTop: 24,
                background:
                  "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                borderRadius: 24,
                padding: "24px 20px",
                textAlign: "center",
                color: "#fff",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  opacity: 0.9,
                  marginBottom: 8,
                }}
              >
                ยอดชำระทั้งหมด
              </div>

              <div
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                ฿ {bill.total.toLocaleString("th-TH")}
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  opacity: 0.9,
                }}
              >
                บาท
              </div>
            </div>
          </div>

          {/* QR CARD */}
          <div
            style={{
              background: "#fff",
              borderRadius: 30,
              padding: 24,
              boxShadow: "0 12px 28px rgba(74,0,128,0.08)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#4A0080",
                  fontWeight: 800,
                }}
              >
                📱 สแกน QR เพื่อชำระ
              </h3>

              <p
                style={{
                  marginTop: 8,
                  color: "#7B7490",
                  fontSize: 14,
                }}
              >
                รองรับ Mobile Banking ทุกธนาคาร
              </p>
            </div>

            {/* QR */}
            <div
              style={{
                background: "#FAF9FC",
                borderRadius: 24,
                padding: 24,
                textAlign: "center",
                border: "1px solid #EFE9F7",
              }}
            >
              <img
                src={qrUrl}
                alt="QR PromptPay"
                style={{
                  width: "100%",
                  maxWidth: 260,
                  borderRadius: 20,
                  background: "#fff",
                  padding: 12,
                  boxShadow:
                    "0 8px 20px rgba(74,0,128,0.08)",
                }}
              />

              {isInLine ? (
                <div
                  style={{
                    marginTop: 18,
                    background: "#FFF4E5",
                    color: "#B45309",
                    padding: "12px 16px",
                    borderRadius: 16,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  กดค้างที่ QR แล้วเลือก “บันทึกภาพ”
                </div>
              ) : (
                <button
                  onClick={handleDownload}
                  style={{
                    width: "100%",
                    marginTop: 18,
                    padding: "14px",
                    borderRadius: 18,
                    border: "1.5px solid #D9CFF0",
                    background: "#fff",
                    color: "#4A0080",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ดาวน์โหลด QR Code
                </button>
              )}
            </div>

            {/* UPLOAD BUTTON */}
            <button
              onClick={() =>
                nav("/upload-slip", {
                  state: bill,
                })
              }
              style={{
                width: "100%",
                marginTop: 24,
                padding: "16px",
                borderRadius: 20,
                border: "none",
                background:
                  "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                color: "#fff",
                fontSize: 18,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow:
                  "0 10px 24px rgba(74,0,128,0.18)",
              }}
            >
              อัปโหลดสลิปการโอน
            </button>
          </div>
        </div>
      </div>
    </>
  );
}