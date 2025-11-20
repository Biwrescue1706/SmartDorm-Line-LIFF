// src/pages/UploadSlip.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import {
  ensureLiffReady,
  getAccessToken,
  getUserProfile,
  logoutLiff,
} from "../lib/liff";
import { API_BASE } from "../config";
import { useUploadSlip } from "../hooks/useUploadSlip";
import type { Room } from "../types/Room";
import LiffNav from "../components/Nav/LiffNav";

export default function UploadSlip() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room | null;

  const [ready, setReady] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // ตรวจสอบ LIFF
  useEffect(() => {
    (async () => {
      try {
        const ok = await ensureLiffReady();
        if (!ok) return;

        const token = getAccessToken();
        if (!token) return;

        const profile = await getUserProfile();
        if (!profile) return;

        await axios.post(`${API_BASE}/user/me`, { accessToken: token });

        setAccessToken(token);
        setReady(true);
      } catch (err: any) {
        if (
          err.response?.data?.error?.includes("หมดอายุ") ||
          err.response?.data?.error?.includes("invalid")
        ) {
          await logoutLiff();
          return;
        }

        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: err.response?.data?.error || err.message,
        }).then(() => nav("/"));
      }
    })();
  }, [nav]);

  // ❌ ไม่มีข้อมูลห้อง
  if (!room) {
    return (
      <>
        <LiffNav />
        <div className="text-center py-5" style={{ paddingTop: "80px" }}>
          <h4 className="text-danger">ไม่พบข้อมูลห้อง</h4>
          <button className="btn btn-primary mt-3" onClick={() => nav("/")}>
            กลับหน้าแรก
          </button>
        </div>
      </>
    );
  }

  // ⏳ Loading ตรวจสอบสิทธิ์
  if (!ready) {
    return (
      <>
        <LiffNav />
        <div className="text-center py-5" style={{ paddingTop: "80px" }}>
          <div className="spinner-border text-success"></div>
          <p className="mt-3">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <LiffNav />
      <div className="container py-4" style={{ paddingTop: "70px" }}>
        <UploadSlipForm room={room} accessToken={accessToken!} />
      </div>
    </>
  );
}

// ================================================
//             ฟอร์มอัปโหลดแบบรวมทั้งหมด
// ================================================
function UploadSlipForm({
  room,
  accessToken,
}: {
  room: Room;
  accessToken: string;
}) {
  const nav = useNavigate();

  // ฟิลด์ทั้งหมดในหน้า
  const [userName, setUserName] = useState("");
  const [ctitle, setCtitle] = useState("");
  const [cname, setCname] = useState("");
  const [csurname, setCsurname] = useState("");
  const [cphone, setCphone] = useState("");
  const [cmumId, setCmumId] = useState("");
  const [checkin, setCheckin] = useState("");
  const [slip, setSlip] = useState<File | null>(null);

  const { loading, submitSlip } = useUploadSlip();

  // ดึงชื่อ LINE
  useEffect(() => {
    fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => data.displayName && setUserName(data.displayName))
      .catch(() => {});
  }, [accessToken]);

  // แจ้งเตือน
  const showToast = (text: string, icon: any) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title: text,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // ตรวจสอบฟอร์ม
  const validate = () => {
    const nameRegex = /^[ก-๙a-zA-Z]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const idRegex = /^[0-9]{13}$/;

    if (!slip) return showToast("กรุณาแนบสลิป", "warning");
    if (!nameRegex.test(cname)) return showToast("ชื่อไม่ถูกต้อง", "error");
    if (!nameRegex.test(csurname)) return showToast("นามสกุลไม่ถูกต้อง", "error");
    if (!phoneRegex.test(cphone)) return showToast("เบอร์โทรต้อง 10 หลัก", "error");
    if (!idRegex.test(cmumId))
      return showToast("เลขบัตรประชาชนต้อง 13 หลัก", "error");
    return true;
  };

  // ส่งข้อมูล
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post(`${API_BASE}/user/register`, {
        accessToken,
        ctitle,
        cname,
        csurname,
        cphone,
        cmumId,
      });

      const form = new FormData();
      form.append("accessToken", accessToken);
      form.append("roomId", room.roomId);
      form.append("ctitle", ctitle);
      form.append("cname", cname);
      form.append("csurname", csurname);
      form.append("cphone", cphone);
      form.append("cmumId", cmumId);
      form.append("checkin", checkin);
      form.append("slip", slip!);

      const ok = await submitSlip(form);

      if (ok) {
        showToast("จองสำเร็จ", "success");
        setTimeout(() => nav("/thankyou"), 800);
      }
    } catch {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
    }
  };

  // แสดงภาพตัวอย่างสลิป
  const slipPreviewUrl = slip ? URL.createObjectURL(slip) : null;

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container-fluid px-3 px-md-5 py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4">

                <form onSubmit={handleSubmit}>
                  <h3 className="text-center mb-3">📤 อัปโหลดสลิป</h3>
                  <h5 className="text-center text-black mb-4">
                    ห้อง {room.number}
                  </h5>

                  {/* LINE */}
                  <label className="form-label fw-semibold">LINE ผู้ใช้</label>
                  <input className="form-control mb-3" value={userName} readOnly />

                  {/* คำนำหน้า */}
                  <label className="form-label fw-semibold">คำนำหน้า</label>
                  <select
                    className="form-select mb-3"
                    value={ctitle}
                    onChange={(e) => setCtitle(e.target.value)}
                    required
                  >
                    <option value="">-- เลือก --</option>
                    <option>นาย</option>
                    <option>นาง</option>
                    <option>น.ส.</option>
                  </select>

                  {/* ชื่อ */}
                  <label className="form-label fw-semibold">ชื่อ</label>
                  <input
                    className="form-control mb-3"
                    value={cname}
                    onChange={(e) => setCname(e.target.value)}
                    required
                  />

                  {/* นามสกุล */}
                  <label className="form-label fw-semibold">นามสกุล</label>
                  <input
                    className="form-control mb-3"
                    value={csurname}
                    onChange={(e) => setCsurname(e.target.value)}
                    required
                  />

                  {/* เบอร์โทร */}
                  <label className="form-label fw-semibold">เบอร์โทร</label>
                  <input
                    inputMode="numeric"
                    className="form-control mb-3"
                    value={cphone}
                    onChange={(e) =>
                      setCphone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    required
                  />

                  {/* บัตรประชาชน */}
                  <label className="form-label fw-semibold">
                    เลขบัตรประชาชน
                  </label>
                  <input
                    inputMode="numeric"
                    className="form-control mb-3"
                    value={cmumId}
                    onChange={(e) =>
                      setCmumId(e.target.value.replace(/\D/g, "").slice(0, 13))
                    }
                    required
                  />

                  {/* วันที่เข้าพัก */}
                  <label className="form-label fw-semibold">
                    วันที่เข้าพัก
                  </label>
                  <input
                    type="date"
                    className="form-control mb-3"
                    value={checkin}
                    onChange={(e) => setCheckin(e.target.value)}
                    required
                  />

                  {/* แนบสลิป */}
                  <label className="form-label fw-semibold">แนบสลิป</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-3"
                    onChange={(e) => setSlip(e.target.files?.[0] || null)}
                    required
                  />

                  {/* ตัวอย่างสลิป */}
                  {slipPreviewUrl && (
                    <div className="text-center mb-4">
                      <p className="fw-semibold">📷 ตัวอย่างสลิป</p>
                      <img
                        src={slipPreviewUrl}
                        style={{
                          width: "100%",
                          maxWidth: "300px",
                          borderRadius: "10px",
                          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                        }}
                      />
                    </div>
                  )}

                  {/* ปุ่ม */}
                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="button"
                      className="btn w-50 text-white fw-semibold"
                      style={{
                        background: "linear-gradient(90deg,#ff6a6a,#ff0000)",
                      }}
                      onClick={() => nav("/")}
                    >
                      ยกเลิก
                    </button>

                    <button
                      type="submit"
                      className="btn w-50 text-white fw-semibold"
                      style={{
                        background: "linear-gradient(90deg,#42e695,#3bb2b8)",
                      }}
                      disabled={loading}
                    >
                      {loading ? "กำลังอัปโหลด..." : "ยืนยัน"}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}