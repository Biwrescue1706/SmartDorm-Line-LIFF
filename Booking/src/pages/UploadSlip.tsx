// src/pages/UploadSlip.tsx

import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import Swal from "sweetalert2";
import axios from "axios";

import {
  ensureLiffReady,
  getAccessToken,
  logoutLiff,
} from "../lib/liff";

import { API_BASE } from "../config";

import type { Room } from "../types/Room";

import LiffNav from "../components/LiffNav";
import TitleSelect from "../components/TitleSelect";

import { useUploadSlip } from "../hooks/useUploadSlip";

export default function UploadSlip() {
  const { state } = useLocation();

  const nav = useNavigate();

  const room = state as Room | null;

  const [ready, setReady] =
    useState(false);

  const [
    accessToken,
    setAccessToken,
  ] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ok =
          await ensureLiffReady();

        if (!ok) return;

        const token =
          getAccessToken();

        if (!token) return;

        await axios.post(
          `${API_BASE}/user/me`,
          {
            accessToken: token,
          }
        );

        setAccessToken(token);
        setReady(true);
      } catch {
        await logoutLiff();

        Swal.fire(
          "หมดเวลาเข้าสู่ระบบ",
          "กรุณาเข้าสู่ระบบใหม่",
          "error"
        );

        nav("/");
      }
    })();
  }, [nav]);

  /* ---------------- NO ROOM ---------------- */

  if (!room)
    return (
      <>
        <LiffNav />

        <div
          className="container pt-5 mt-5"
        >
          <div className="card border-0 shadow-sm rounded-4 text-center p-5">

            <h4 className="text-danger fw-bold">
              ❌ ไม่พบข้อมูลห้อง
            </h4>

            <button
              className="btn btn-primary rounded-4 px-4 mt-3"
              onClick={() =>
                nav("/")
              }
            >
              กลับหน้าแรก
            </button>

          </div>
        </div>
      </>
    );

  /* ---------------- LOADING ---------------- */

  if (!ready)
    return (
      <>
        <LiffNav />

        <div className="container text-center pt-5 mt-5">

          <div className="spinner-border text-primary"></div>

          <p className="mt-3 text-muted">
            กำลังตรวจสอบการเข้าสู่ระบบ...
          </p>

        </div>
      </>
    );

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

          <div className="row justify-content-center">

            <div className="col-12 col-md-9 col-lg-7 col-xl-6">

              <UploadSlipForm
                room={room}
                accessToken={
                  accessToken!
                }
              />

            </div>

          </div>

        </div>
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

  const u = useUploadSlip({
    room,
    accessToken,
  });

  return (
    <>
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
            📄 ยืนยันการจองห้องพัก
          </h2>

          <p className="text-muted mb-0">
            กรุณากรอกข้อมูลและแนบสลิปการชำระเงิน
          </p>

        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={u.handleSubmit}
        className="card border-0 shadow-sm rounded-4"
      >
        <div className="card-body p-4">

          {/* ROOM */}
          <div
            className="rounded-4 text-white p-4 mb-4"
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
              ห้องที่เลือก
            </small>

            <h2 className="fw-bold mb-0 mt-1">
              ห้อง {room.number}
            </h2>
          </div>

          {/* USER */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              LINE ผู้ใช้งาน
            </label>

            <input
              className="form-control rounded-4 py-3"
              value={u.userName}
              readOnly
            />

          </div>

          {/* TITLE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              คำนำหน้า
            </label>

            <TitleSelect
              value={u.ctitle}
              onChange={
                u.setCtitle
              }
            />
          </div>

          {/* NAME */}
          <div className="row">

            <div className="col-12 col-md-6 mb-3">

              <label className="form-label fw-semibold">
                ชื่อ
              </label>

              <input
                className="form-control rounded-4 py-3"
                value={u.cname}
                onChange={(e) =>
                  u.setCname(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="col-12 col-md-6 mb-3">

              <label className="form-label fw-semibold">
                นามสกุล
              </label>

              <input
                className="form-control rounded-4 py-3"
                value={
                  u.csurname
                }
                onChange={(e) =>
                  u.setCsurname(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          {/* PHONE */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              เบอร์โทรศัพท์
            </label>

            <input
              className="form-control rounded-4 py-3"
              value={u.cphone}
              onChange={(e) =>
                u.setCphone(
                  e.target.value
                    .replace(
                      /\D/g,
                      ""
                    )
                    .slice(
                      0,
                      10
                    )
                )
              }
            />

          </div>

          {/* ID CARD */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              เลขบัตรประชาชน
            </label>

            <input
              className="form-control rounded-4 py-3"
              value={u.cmumId}
              onChange={(e) =>
                u.setCmumId(
                  e.target.value
                    .replace(
                      /\D/g,
                      ""
                    )
                    .slice(
                      0,
                      13
                    )
                )
              }
            />

          </div>

          {/* CHECKIN */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              วันที่เข้าพัก
            </label>

            <input
              type="date"
              className="form-control rounded-4 py-3"
              value={
                u.checkin
              }
              min={u.todayLocal()}
              onChange={(e) =>
                u.setCheckin(
                  e.target.value
                )
              }
            />

          </div>

          {/* SLIP */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              แนบสลิปการชำระเงิน
            </label>

            <input
              type="file"
              accept="image/*"
              className="form-control rounded-4 py-3"
              onChange={(e) =>
                u.setSlip(
                  e.target
                    .files?.[0] ||
                    null
                )
              }
            />

          </div>

          {/* PREVIEW */}
          {u.slipPreviewUrl && (
            <div className="text-center mb-4">

              <img
                src={
                  u.slipPreviewUrl
                }
                alt="preview"
                className="img-fluid rounded-4 shadow-sm border"
                style={{
                  maxWidth: 320,
                }}
              />

            </div>
          )}

          {/* BUTTONS */}
          <div className="row g-3 mt-2">

            <div className="col-12 col-md-6">

              <button
                type="button"
                className="btn btn-light border w-100 fw-semibold py-3 rounded-4"
                onClick={() =>
                  nav("/")
                }
                disabled={
                  u.loading
                }
              >
                ยกเลิก
              </button>

            </div>

            <div className="col-12 col-md-6">

              <button
                type="submit"
                disabled={
                  u.loading
                }
                className="btn w-100 text-white fw-bold py-3 rounded-4"
                style={{
                  background:
                    "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                  border: "none",
                }}
              >
                {u.loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    กำลังบันทึก...
                  </>
                ) : (
                  "ยืนยันการจอง"
                )}
              </button>

            </div>

          </div>

        </div>
      </form>
    </>
  );
}