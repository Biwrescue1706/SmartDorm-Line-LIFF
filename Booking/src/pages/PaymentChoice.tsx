import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Room } from "../types/All";
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

  const total = room
    ? room.rent +
      room.deposit +
      room.bookingFee
    : 0;

  const makeQR = () => {
    const qr = `${API_BASE}/qr/${total}?t=${Date.now()}`;
    setQrSrc(qr);
  };

  useEffect(() => {
    (async () => {
      try {
        const token =
          await refreshLiffToken();

        if (!token) throw new Error();

        await axios.post(
          `${API_BASE}/user/me`,
          {
            accessToken: token,
          }
        );

        setReady(true);
        makeQR();
      } catch {
        Swal.fire(
          "❌ หมดเวลาการเข้าใช้งาน",
          "กรุณาเข้าสู่ระบบใหม่",
          "warning"
        );

        nav("/");
      }
    })();
  }, [nav]);

  if (!room)
    return (
      <>
        <LiffNav />

        <div className="container text-center pt-5 mt-5">
          <div className="card border-0 shadow-sm rounded-4 p-5">

            <h5 className="text-danger fw-bold">
              ❌ ไม่พบข้อมูลห้อง
            </h5>

            <button
              className="btn btn-primary rounded-4 px-4 mt-3"
              onClick={() => nav("/")}
            >
              กลับหน้าแรก
            </button>

          </div>
        </div>
      </>
    );

  if (!ready)
    return (
      <>
        <LiffNav />

        <div className="container text-center pt-5 mt-5">

          <div className="spinner-border text-primary"></div>

          <p className="mt-3 text-muted">
            กำลังตรวจสอบสิทธิ์การใช้งาน...
          </p>

        </div>
      </>
    );

  const isInLine = liff.isInClient();

  return (
    <>
      <LiffNav />

      <div
        className="min-vh-100 py-4"
        style={{
          background: "#F6F4FA",
        }}
      >
        <div className="container">

          {/* HEADER */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 mt-5">

            <div
              style={{
                height: 6,
                background:
                  "linear-gradient(90deg,#4A0080 0%, #7B2BC7 100%)",
              }}
            />

            <div className="card-body p-4 text-center">

              <h2 className="fw-bold text-primary mb-2">
                💳 ชำระเงินค่าจองห้องพัก
              </h2>

              <p className="text-muted mb-0">
                ชำระผ่าน PromptPay
                เพื่อดำเนินการต่อ
              </p>

            </div>
          </div>

          {/* CONTENT */}
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">

              <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body p-4">

                  {/* ROOM */}
                  <div
                    className="rounded-4 p-4 mb-4 text-white"
                    style={{
                      background:
                        "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                    }}
                  >
                    <small
                      style={{
                        opacity: 0.85,
                      }}
                    >
                      ห้องพัก
                    </small>

                    <h2 className="fw-bold mb-0 mt-1">
                      ห้อง {room.number}
                    </h2>
                  </div>

                  {/* TOTAL */}
                  <div
                    className="rounded-4 p-4 mb-4 text-center"
                    style={{
                      background: "#FAF9FC",
                      border:
                        "1px solid #EFE9F7",
                    }}
                  >
                    <small className="text-muted fw-semibold d-block mb-2">
                      ยอดรวมที่ต้องชำระ
                    </small>

                    <h1
                      className="fw-bold mb-0"
                      style={{
                        color: "#4A0080",
                      }}
                    >
                      ฿{" "}
                      {total.toLocaleString(
                        "th-TH"
                      )}
                    </h1>
                  </div>

                  {/* QR */}
                  <div
                    className="rounded-4 p-4 text-center mb-4"
                    style={{
                      background: "#fff",
                      border:
                        "1px solid #EFE9F7",
                    }}
                  >
                    <h5 className="fw-bold text-primary mb-3">
                      📱 สแกนเพื่อชำระเงิน
                    </h5>

                    <img
                      src={qrSrc}
                      alt="QR PromptPay"
                      className="img-fluid rounded-4 shadow-sm border"
                      style={{
                        maxWidth: 260,
                      }}
                    />

                    {!isInLine ? (
                      <button
                        className="btn btn-light border rounded-4 fw-semibold w-100 mt-4 py-3"
                        onClick={async () => {
                          const res =
                            await fetch(
                              qrSrc
                            );

                          const blob =
                            await res.blob();

                          const url =
                            URL.createObjectURL(
                              blob
                            );

                          const link =
                            document.createElement(
                              "a"
                            );

                          link.href = url;
                          link.download = `QR-${total}.png`;

                          link.click();

                          URL.revokeObjectURL(
                            url
                          );
                        }}
                      >
                        ดาวน์โหลด QR
                      </button>
                    ) : (
                      <p className="small text-danger fw-semibold mt-3 mb-0">
                        กดค้างที่ QR
                        แล้วเลือก “บันทึกภาพ”
                      </p>
                    )}
                  </div>

                  {/* BUTTON */}
                  <button
                    className="btn w-100 text-white fw-bold py-3 rounded-4"
                    style={{
                      background:
                        "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                      border: "none",
                    }}
                    onClick={() =>
                      nav(
                        "/upload-slip",
                        {
                          state: room,
                        }
                      )
                    }
                  >
                    ดำเนินการต่อ
                  </button>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}