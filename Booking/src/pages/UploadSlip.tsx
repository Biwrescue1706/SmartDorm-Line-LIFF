// src/pages/UploadSlip.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { ensureLiffReady, getAccessToken, logoutLiff } from "../lib/liff";
import { API_BASE } from "../config";
import type { Room } from "../types/Room";
import LiffNav from "../components/LiffNav";
import TitleSelect from "../components/TitleSelect";

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

/* ================= FORM ================= */

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
  const [slipPreviewUrl, setSlipPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // โหลด LINE Profile
  useEffect(() => {
    fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => data.displayName && setUserName(data.displayName))
      .catch(() => {});
  }, [accessToken]);

  // สร้าง Preview ของสลิป และป้องกัน memory leak
  useEffect(() => {
    if (!slip) {
      setSlipPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(slip);
    setSlipPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [slip]);

  const toast = (text: string, icon: any = "warning") =>
    Swal.fire({
      icon,
      title: text,
      timer: 2000,
      showConfirmButton: false,
    });

  // =================== Validation ครบทุกฟิลด์ ===================
  const validate = () => {
    if (!slip) {
      toast("กรุณาแนบสลิป");
      return false;
    }

    // จำกัดไฟล์ไม่เกิน 5MB
    if (slip.size > 5 * 1024 * 1024) {
      toast("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return false;
    }

    if (!ctitle) {
      toast("กรุณาเลือกคำนำหน้า");
      return false;
    }
    if (!cname.trim()) {
      toast("กรุณากรอกชื่ออย่างน้อย 1 ตัวอักษร");
      return false;
    }
    if (!csurname.trim()) {
      toast("กรุณากรอกนามสกุลอย่างน้อย 1 ตัวอักษร");
      return false;
    }

    const phoneDigits = cphone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      toast("เบอร์โทรต้องครบ 10 ตัวเลข");
      return false;
    }

    const idDigits = cmumId.replace(/\D/g, "");
    if (idDigits.length !== 13) {
      toast("เลขบัตรประชาชนต้องครบ 13 ตัวเลข");
      return false;
    }

    if (!checkin) {
      toast("กรุณาเลือกวันที่เข้าพัก");
      return false;
    }

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

      // reset form
      setCtitle("");
      setCname("");
      setCsurname("");
      setCphone("");
      setCmumId("");
      setCheckin("");
      setSlip(null);
      setSlipPreviewUrl(null);

      setTimeout(() => nav("/thankyou"), 900);
    } catch (err: any) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        err.response?.data?.error || err.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 shadow-lg rounded-4 bg-white mx-auto"
      style={{ maxWidth: "560px" }}
    >
      <h3 className="fw-bold text-center mb-4 text-primary">
        กรอกข้อมูลเพื่อยืนยันการจอง
      </h3>

      <label className="form-label fw-semibold">ห้องที่เลือก</label>
      <input className="form-control mb-3" value={room.number} readOnly />

      <label className="form-label fw-semibold">LINE ผู้ใช้</label>
      <input className="form-control mb-3" value={userName} readOnly />

      <TitleSelect value={ctitle} onChange={setCtitle} />

      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label fw-semibold">ชื่อ</label>
          <input
            className="form-control"
            value={cname}
            onChange={(e) => setCname(e.target.value)}
          />
        </div>

        <div className="col-6 mb-3">
          <label className="form-label fw-semibold">นามสกุล</label>
          <input
            className="form-control"
            value={csurname}
            onChange={(e) => setCsurname(e.target.value)}
          />
        </div>
      </div>

      <label className="form-label fw-semibold">เบอร์โทร</label>
      <input
        className="form-control mb-3"
        value={cphone}
        onChange={(e) =>
          setCphone(e.target.value.replace(/\D/g, "").slice(0, 10))
        }
      />

      <label className="form-label fw-semibold">เลขบัตรประชาชน</label>
      <input
        className="form-control mb-3"
        value={cmumId}
        onChange={(e) =>
          setCmumId(e.target.value.replace(/\D/g, "").slice(0, 13))
        }
      />

      <label className="form-label fw-semibold">วันที่เข้าพัก</label>
<input
  type="date"
  className="form-control mb-3"
  value={checkin}
  min={new Date().toISOString().split("T")[0]}
  onChange={(e) => setCheckin(e.target.value)}
/>

      <label className="form-label fw-semibold">แนบสลิป</label>
      <input
        type="file"
        accept="image/*"
        className="form-control mb-3"
        onChange={(e) => setSlip(e.target.files?.[0] || null)}
      />

      {slipPreviewUrl && (
        <div className="text-center mb-3">
          <img
            src={slipPreviewUrl}
            style={{ maxWidth: "300px", borderRadius: "12px" }}
          />
        </div>
      )}

      <button
        disabled={loading}
        className="btn btn-primary w-100 py-3"
        type="submit"
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
            />
            กำลังบันทึก...
          </>
        ) : (
          "ยืนยันการจอง"
        )}
      </button>
    </form>
  );
}