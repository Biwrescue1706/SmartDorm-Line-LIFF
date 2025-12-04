// Booking/src/pages/UploadSlip.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { ensureLiffReady, getAccessToken, logoutLiff } from "../lib/liff";
import { API_BASE } from "../config";
import type { Room } from "../types/Room";
import LiffNav from "../components/LiffNav";

export default function UploadSlip() {
  const { state } = useLocation();
  const nav = useNavigate();
  const room = state as Room | null;

  const [ready, setReady] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ok = await ensureLiffReady();
        if (!ok) return;

        const token = getAccessToken();
        if (!token) return;

        await axios.post(`${API_BASE}/user/me`, { accessToken: token });

        setAccessToken(token);
        setReady(true);
      } catch {
        await logoutLiff();
        Swal.fire("หมดเวลาเข้าสู่ระบบ", "กรุณาเข้าสู่ระบบใหม่", "error");
        nav("/");
      }
    })();
  }, [nav]);

  if (!room)
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

  if (!ready)
    return (
      <>
        <LiffNav />
        <div className="text-center py-5" style={{ paddingTop: "80px" }}>
          <div className="spinner-border text-success" />
          <p className="mt-3">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
        </div>
      </>
    );

  return (
    <>
      <LiffNav />
      <div
        className="container"
        style={{
          paddingTop: "90px",
          paddingBottom: "40px",
          background: "#f6f9ff",
          minHeight: "100vh",
        }}
      >
        <UploadSlipForm room={room} accessToken={accessToken!} />
      </div>
    </>
  );
}

// ===============================================================
//                 FORM อัปโหลดข้อมูล + สลิป
// ===============================================================
function UploadSlipForm({
  room,
  accessToken,
}: {
  room: Room;
  accessToken: string;
}) {
  const nav = useNavigate();

  const [userName, setUserName] = useState("");
  const [ctitle, setCtitle] = useState("");
  const [cname, setCname] = useState("");
  const [csurname, setCsurname] = useState("");
  const [cphone, setCphone] = useState("");
  const [cmumId, setCmumId] = useState("");
  const [checkin, setCheckin] = useState("");
  const [slip, setSlip] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => data.displayName && setUserName(data.displayName))
      .catch(() => {});
  }, [accessToken]);

  const toast = (text: string, icon: any = "warning") =>
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title: text,
      timer: 2000,
      showConfirmButton: false,
    });

  const validate = () => {
    if (!slip) return toast("กรุณาแนบสลิป");
    if (!cname.trim()) return toast("กรุณากรอกชื่อ");
    if (!csurname.trim()) return toast("กรุณากรอกนามสกุล");
    if (cphone.length !== 10) return toast("เบอร์โทรต้อง 10 หลัก");
    if (cmumId.length !== 13) return toast("เลขบัตรต้อง 13 หลัก");
    if (!checkin) return toast("กรุณาเลือกวันที่เข้าพัก");
    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/booking/create`, {
        accessToken,
        roomId: room.roomId,
        ctitle,
        cname,
        csurname,
        cphone,
        cmumId,
        checkin,
      });

      const bookingId = res.data.booking.bookingId;

      const form = new FormData();
      form.append("slip", slip!);

      await axios.post(`${API_BASE}/booking/${bookingId}/uploadSlip`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast("จองสำเร็จ", "success");
      setTimeout(() => nav("/thankyou"), 900);
    } catch (err: any) {
      Swal.fire("เกิดข้อผิดพลาด", err.response?.data?.error || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const slipPreviewUrl = slip ? URL.createObjectURL(slip) : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 shadow-lg rounded-4 bg-white mx-auto"
      style={{ maxWidth: "560px" }}
    >
      <h3 className="fw-bold text-center mb-4 text-primary">
        กรอกข้อมูลเพื่อยืนยันการจอง
      </h3>

      <label className="form-label fw-semibold">🏠 ห้องที่เลือก</label>
      <input className="form-control mb-3" value={room.number} readOnly />

      <label className="form-label fw-semibold">LINE ผู้ใช้</label>
      <input className="form-control mb-3" value={userName} readOnly />

      <label className="form-label fw-semibold">คำนำหน้า</label>
      <select
        className="form-select mb-3"
        required
        value={ctitle}
        onChange={(e) => setCtitle(e.target.value)}
      >
        <option value="">-- เลือก --</option>
        <option>นาย</option>
        <option>นาง</option>
        <option>น.ส.</option>
      </select>

      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label fw-semibold">ชื่อ</label>
          <input
            className="form-control"
            value={cname}
            onChange={(e) => setCname(e.target.value)}
            required
          />
        </div>

        <div className="col-6 mb-3">
          <label className="form-label fw-semibold">นามสกุล</label>
          <input
            className="form-control"
            value={csurname}
            onChange={(e) => setCsurname(e.target.value)}
            required
          />
        </div>
      </div>

      <label className="form-label fw-semibold">📞 เบอร์โทร</label>
      <input
        className="form-control mb-3"
        value={cphone}
        onChange={(e) =>
          setCphone(e.target.value.replace(/\D/g, "").slice(0, 10))
        }
        required
      />

      <label className="form-label fw-semibold">🆔 เลขบัตรประชาชน</label>
      <input
        className="form-control mb-3"
        value={cmumId}
        onChange={(e) =>
          setCmumId(e.target.value.replace(/\D/g, "").slice(0, 13))
        }
        required
      />

      <label className="form-label fw-semibold">📅 วันที่เข้าพัก</label>
      <input
        type="date"
        className="form-control mb-3"
        value={checkin}
        onChange={(e) => setCheckin(e.target.value)}
        required
      />

      <label className="form-label fw-semibold">แนบสลิป PromptPay</label>
      <input
        type="file"
        accept="image/*"
        className="form-control mb-3"
        onChange={(e) => setSlip(e.target.files?.[0] || null)}
        required
      />

      {slipPreviewUrl && (
        <div className="text-center mb-3">
          <img
            src={slipPreviewUrl}
            style={{
              maxWidth: "300px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      )}

      {/* ===== ปุ่มยืนยัน + ปุ่มยกเลิก ===== */}
      <div className="d-flex gap-2 mt-4">
        {/* ปุ่มยกเลิก */}
        <button
          type="button"
          className="btn w-50 fw-semibold py-3 text-dark"
          style={{
            borderRadius: "14px",
            background: "#e9ecef",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
          onClick={() => {
            Swal.fire({
              title: "คุณต้องการยกเลิกการจองใช่หรือไม่?",
              text: "ข้อมูลที่กรอกจะไม่ถูกบันทึก",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "ใช่",
              cancelButtonText: "ไม่",
              reverseButtons: true,
              confirmButtonColor: "#d6336c",
              cancelButtonColor: "#6c757d",
            }).then((res) => {
              if (res.isConfirmed) {
                nav("/");
              }
            });
          }}
        >
          ยกเลิก
        </button>

        {/* ปุ่มยืนยัน */}
        <button
          disabled={loading}
          className="btn w-50 fw-bold py-3 text-white"
          style={{
            borderRadius: "14px",
            background: "linear-gradient(135deg,#7B2CBF,#4B008A)",
            boxShadow: "0 4px 10px rgba(123,44,191,0.4)",
          }}
        >
          {loading ? "กำลังบันทึก..." : "ยืนยันการจองและอัปโหลดสลิป"}
        </button>
      </div>
    </form>
  );
}