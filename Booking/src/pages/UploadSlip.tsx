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
      <div className="container py-4" style={{ paddingTop: "70px" }}>
        <UploadSlipForm room={room} accessToken={accessToken!} />
      </div>
    </>
  );
}

// ===============================================================
//                 FORM ส่งข้อมูล + อัปโหลดสลิป
// ===============================================================
function UploadSlipForm({ room, accessToken }: { room: Room; accessToken: string }) {
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
    if (cmumId.length !== 13) return toast("เลขบัตรประชาชนต้อง 13 หลัก");
    if (!checkin) return toast("กรุณาเลือกวันที่เข้าพัก");
    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // STEP 1: create booking first
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

      // STEP 2: upload slip
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
    <form onSubmit={handleSubmit} className="card shadow-lg p-4 border-0 rounded-4">
      <h3 className="text-center mb-3">📤 อัปโหลดสลิป</h3>
      <h5 className="text-center mb-4">ห้อง {room.number}</h5>

      <label className="form-label fw-semibold">LINE ผู้ใช้</label>
      <input className="form-control mb-3" value={userName} readOnly />

      <label className="form-label fw-semibold">คำนำหน้า</label>
      <select className="form-select mb-3" value={ctitle} onChange={(e) => setCtitle(e.target.value)} required>
        <option value="">-- เลือก --</option>
        <option>นาย</option>
        <option>นาง</option>
        <option>น.ส.</option>
      </select>

      <label className="form-label fw-semibold">ชื่อ</label>
      <input className="form-control mb-3" value={cname} onChange={(e) => setCname(e.target.value)} required />

      <label className="form-label fw-semibold">นามสกุล</label>
      <input className="form-control mb-3" value={csurname} onChange={(e) => setCsurname(e.target.value)} required />

      <label className="form-label fw-semibold">เบอร์โทร</label>
      <input
        className="form-control mb-3"
        value={cphone}
        onChange={(e) => setCphone(e.target.value.replace(/\D/g, "").slice(0, 10))}
        required
      />

      <label className="form-label fw-semibold">เลขบัตรประชาชน</label>
      <input
        className="form-control mb-3"
        value={cmumId}
        onChange={(e) => setCmumId(e.target.value.replace(/\D/g, "").slice(0, 13))}
        required
      />

      <label className="form-label fw-semibold">วันที่เข้าพัก</label>
      <input type="date" className="form-control mb-3" value={checkin} onChange={(e) => setCheckin(e.target.value)} required />

      <label className="form-label fw-semibold">แนบสลิป</label>
      <input type="file" accept="image/*" className="form-control mb-3" onChange={(e) => setSlip(e.target.files?.[0] || null)} required />

      {slipPreviewUrl && (
        <div className="text-center mb-3">
          <img src={slipPreviewUrl} style={{ maxWidth: "280px", borderRadius: "10px" }} />
        </div>
      )}

      <button disabled={loading} className="btn btn-success w-100 fw-semibold">
        {loading ? "กำลังบันทึก..." : "ยืนยันการจอง"}
      </button>
    </form>
  );
}
