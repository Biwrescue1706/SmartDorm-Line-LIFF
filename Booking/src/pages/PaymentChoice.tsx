import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Room } from "../types/Room";
import { API_BASE } from "../config";
import Swal from "sweetalert2";
import { refreshLiffToken } from "../lib/liff";
import axios from "axios";
import LiffNav from "../components/LiffNav";
import liff from "@line/liff";

export default function PaymentChoice() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room | null;

  const [ready, setReady] = useState(false);
  const [qrSrc, setQrSrc] = useState("");

  const total = room ? room.rent + room.deposit + room.bookingFee : 0;

  const makeQR = () => {
    const qr = `${API_BASE}/qr/${total}?t=${Date.now()}`;
    setQrSrc(qr);
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) throw new Error();

        await axios.post(`${API_BASE}/user/me`, { accessToken: token });
        setReady(true);
        makeQR();
      } catch {
        Swal.fire("❌ หมดเวลาการเข้าใช้งาน", "กรุณาเข้าสู่ระบบใหม่", "warning");
        nav("/");
      }
    })();
  }, [nav]);

  if (!room)
    return (
      <>
        <LiffNav />
        <div className="container text-center pt-5 mt-4">
          <h5 className="text-danger">ไม่พบข้อมูลห้อง</h5>
          <button className="btn btn-primary mt-3" onClick={() => nav("/")}>
            กลับหน้าแรก
          </button>
        </div>
      </>
    );

  if (!ready)
    return (
      <>
        <LiffNav />
        <div className="text-center py-5 mt-5">
          <div className="spinner-border text-success"></div>
          <p className="mt-3">กำลังตรวจสอบสิทธิ์การใช้งาน...</p>
        </div>
      </>
    );

  const isInLine = liff.isInClient();

  return (
    <>
      <LiffNav />
<div className="pt-5"></div>
      <div className="pb-5 mb-4 min-vh-100 bg-light">
        <div className="container">

          <div className="shadow p-4 mb-4 text-white text-center rounded-4 bg-primary bg-gradient">
            <h3 className="fw-bold mb-0">ชำระเงินค่าจองห้องพัก</h3>
            <small className="opacity-75">
              ชำระผ่าน PromptPay เพื่อดำเนินการต่อ
            </small>
          </div>

          <div className="bg-white p-4 shadow-sm rounded-4 mx-auto col-12 col-md-8 col-xl-6">

            <div className="text-center p-3 rounded-3 mb-4 bg-info bg-opacity-25">
              <h5 className="fw-bold mb-1">ยอดรวมที่ต้องชำระ</h5>
              <h2 className="fw-bold text-dark">
                {total.toLocaleString("th-TH")} บาท
              </h2>
            </div>

            <div className="p-4 text-center rounded-3 mb-4 border bg-light">
              <h6 className="fw-semibold mb-2">สแกนเพื่อชำระเงิน</h6>

              <img
                src={qrSrc}
                width="250"
                alt="QR PromptPay"
                className="my-3 border rounded shadow-sm"
              />

              {!isInLine ? (
                <button
                  className="btn btn-success w-100 fw-semibold"
                  onClick={async () => {
                    const res = await fetch(qrSrc);
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `QR-${total}.png`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  ดาวน์โหลด QR
                </button>
              ) : (
                <p className="small text-danger fw-semibold">
                  (กดค้างที่ QR แล้วเลือก “บันทึกภาพ”)
                </p>
              )}
            </div>

            <button
              className="btn btn-primary w-100 fw-bold py-3"
              onClick={() => nav("/upload-slip", { state: room })}
            >
              ดำเนินการต่อ
            </button>

          </div>
        </div>
      </div>
    </>
  );
}