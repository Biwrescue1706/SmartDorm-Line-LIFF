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
import { useUploadSlip } from "../hooks/useUploadSlip";

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

  const u = useUploadSlip({ room, accessToken });

  return (
    <form
      onSubmit={u.handleSubmit}
      className="p-4 shadow-lg rounded-4 bg-white mx-auto"
      style={{ maxWidth: "560px" }}
    >
      <h3 className="fw-bold text-center mb-4 text-primary">
        กรอกข้อมูลเพื่อยืนยันการจอง
      </h3>

      <label className="form-label fw-semibold">ห้องที่เลือก</label>
      <input className="form-control mb-3" value={room.number} readOnly />

      <label className="form-label fw-semibold">LINE ผู้ใช้</label>
      <input className="form-control mb-3" value={u.userName} readOnly />

      <TitleSelect value={u.ctitle} onChange={u.setCtitle} />

      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label fw-semibold">ชื่อ</label>
          <input
            className="form-control"
            value={u.cname}
            onChange={(e) => u.setCname(e.target.value)}
          />
        </div>

        <div className="col-6 mb-3">
          <label className="form-label fw-semibold">นามสกุล</label>
          <input
            className="form-control"
            value={u.csurname}
            onChange={(e) => u.setCsurname(e.target.value)}
          />
        </div>
      </div>

      <label className="form-label fw-semibold">เบอร์โทร</label>
      <input
        className="form-control mb-3"
        value={u.cphone}
        onChange={(e) =>
          u.setCphone(e.target.value.replace(/\D/g, "").slice(0, 10))
        }
      />

      <label className="form-label fw-semibold">เลขบัตรประชาชน</label>
      <input
        className="form-control mb-3"
        value={u.cmumId}
        onChange={(e) =>
          u.setCmumId(e.target.value.replace(/\D/g, "").slice(0, 13))
        }
      />

      <label className="form-label fw-semibold">วันที่เข้าพัก</label>
      <input
        type="date"
        className="form-control mb-3"
        value={u.checkin}
        min={u.todayLocal()}
        onChange={(e) => u.setCheckin(e.target.value)}
      />

      <label className="form-label fw-semibold">แนบสลิป</label>
      <input
        type="file"
        accept="image/*"
        className="form-control mb-3"
        onChange={(e) => u.setSlip(e.target.files?.[0] || null)}
      />

      {u.slipPreviewUrl && (
        <div className="text-center mb-3">
          <img
            src={u.slipPreviewUrl}
            style={{ maxWidth: "300px", borderRadius: "12px" }}
          />
        </div>
      )}

      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary w-50 py-3"
          onClick={() => nav("/")}
          disabled={u.loading}
        >
          ยกเลิก
        </button>

        <button
          disabled={u.loading}
          className="btn btn-primary w-50 py-3"
          type="submit"
        >
          {u.loading ? (
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
      </div>
    </form>
  );
}