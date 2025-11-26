// src/pages/PaymentChoice.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import Swal from "sweetalert2";
import { refreshLiffToken } from "../lib/liff";
import axios from "axios";
import Nav from "../components/NavBar";
import liff from "@line/liff";

export default function PaymentChoice() {
  const { state } = useLocation();
  const nav = useNavigate();

  const bill: any = state;   // ✅ รับค่าบิลจากหน้า BillDetail
  const total = bill?.total ?? 0;   // ✅ ปลอดภัย ไม่เป็น NaN

  const [ready, setReady] = useState(false);
  const [qrSrc, setQrSrc] = useState("");

  // สร้าง QR ตามยอดบิล
  const makeQR = () => {
    const qr = `${API_BASE}/qr/${total}}`;
    setQrSrc(qr);
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) return;
        await axios.post(`${API_BASE}/user/me`, { accessToken: token });
        setReady(true);
        makeQR();
      } catch {
        Swal.fire("ตรวจสอบสิทธิ์ล้มเหลว", "", "error");
        nav("/");
      }
    })();
  }, [nav]);

  if (!bill)
    return (
      <div className="text-center p-5">
        <h5 className="text-danger">ไม่พบข้อมูลบิล</h5>
        <button className="btn btn-primary" onClick={() => nav(-1)}>
          กลับก่อนหน้า
        </button>
      </div>
    );

  if (!ready)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" />
        <p>กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );

  const isInLine = liff.isInClient();

  return (
    <>
      <Nav />

      <div style={{ paddingTop: "70px" }}>
        <div className="container my-4">
          <div className="card shadow-sm p-3 border-0" style={{ borderRadius: "16px" }}>
            <h3 className="fw-bold mb-3" style={{ textAlign: "left" }}>
              การชำระเงินผ่าน PromptPay
            </h3>

            {/* กล่องยอดรวม */}
            <div
              className="p-3 mb-3 rounded text-center shadow-sm"
              style={{
                background: "linear-gradient(135deg, #d4f9c4, #c2f8d5)",
                border: "1px solid #b7f3c4",
              }}
            >
              <h4 className="fw-bold mb-0">
                ยอดรวม {total.toLocaleString("th-TH")} บาท
              </h4>
            </div>

            {/* QR */}
            <h6 className="fw-semibold mb-2" style={{ textAlign: "left" }}>
              📱 สแกนเพื่อชำระเงิน
            </h6>

            <div
              className="p-3 mb-3 rounded text-center shadow-sm"
              style={{
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                border: "1px solid #e5e8ec",
              }}
            >
              <img
                src={qrSrc}
                width="240"
                className="border rounded shadow-sm my-2"
                alt="QR PromptPay"
              />

              {isInLine ? (
                <p className="small fw-semibold" style={{ color: "red" }}>
                  กดค้างที่ QR แล้วเลือก “บันทึกภาพ”
                </p>
              ) : (
                <button
                  className="btn w-100 fw-semibold text-dark"
                  style={{
                    background: "linear-gradient(90deg, #42e695, #3bb2b8)",
                    border: "none",
                  }}
                  onClick={async () => {
                    const res = await fetch(qrSrc);
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `QR-${total}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  ดาวน์โหลด QR
                </button>
              )}
            </div>

            <button
              className="btn w-100 fw-semibold mt-3 text-white"
              style={{
                background: "linear-gradient(90deg, #6ee2c6, #5bb0f3)",
                borderRadius: "12px",
                fontSize: "18px",
              }}
              onClick={() => nav("/upload-slip", { state: bill })}
            >
              อัปโหลดสลิป
            </button>
          </div>
        </div>
      </div>
    </>
  );
}