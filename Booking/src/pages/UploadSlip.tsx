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

  // ✅ ตรวจสอบ LIFF พร้อมใช้งาน
  useEffect(() => {
    (async () => {
      try {
        const ready = await ensureLiffReady();
        if (!ready) return;

        const token = getAccessToken();
        if (!token) {
          console.warn("⚠️ token หาย — login ใหม่");
          return;
        }

        const profile = await getUserProfile();
        if (!profile) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "warning",
            title: "ไม่สามารถดึงโปรไฟล์ LINE ได้",
            showConfirmButton: false,
            timer: 2500,
          });
          return;
        }

        await axios.post(`${API_BASE}/user/me`, { accessToken: token });
        setAccessToken(token);
        setReady(true);
      } catch (err: any) {
        console.warn(
          "❌ verify failed:",
          err.response?.data?.error || err.message
        );
        if (
          err.response?.data?.error?.includes("หมดอายุ") ||
          err.response?.data?.error?.includes("invalid")
        ) {
          await logoutLiff();
          return;
        }

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "ไม่สามารถตรวจสอบการเข้าสู่ระบบได้",
          text:
            err.response?.data?.error || err.message || "กรุณาลองใหม่อีกครั้ง",
          showConfirmButton: false,
          timer: 2500,
        }).then(() => nav("/"));
      }
    })();
  }, [nav]);

  // ❌ ถ้าไม่มีข้อมูลห้อง
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

  // ⏳ ยังไม่พร้อม
  if (!ready) {
    return (
      <>
        <LiffNav />
        <div className="text-center py-5" style={{ paddingTop: "80px" }}>
          <div className="spinner-border text-success"></div>
          <p className="mt-3">กำลังตรวจสอบการเข้าสู่ระบบกับเซิร์ฟเวอร์...</p>
        </div>
      </>
    );
  }

  // ✅ เมื่อพร้อม
  return (
    <>
      <LiffNav />
      <div className="container py-4" style={{ paddingTop: "70px" }}>
        <UploadSlipForm
          room={room}
          accessToken={accessToken!}
          onSuccess={() => {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "ส่งคำขอจองเรียบร้อยแล้วครับ",
              showConfirmButton: false,
              timer: 2500,
            }).then(() => nav("/thankyou"));
          }}
        />
      </div>
    </>
  );
}

// 🧾 ================= ฟอร์มอัปโหลดสลิป ================= //
function UploadSlipForm({
  room,
  accessToken,
  onSuccess,
}: {
  room: Room;
  accessToken: string;
  onSuccess: () => void;
}) {
  const [userName, setUserName] = useState("");
  const [ctitle, setCtitle] = useState("");
  const [cname, setCname] = useState("");
  const [csurname, setCsurname] = useState("");
  const [cphone, setCphone] = useState("");
  const [cmumId, setCmumId] = useState("");
  const [slip, setSlip] = useState<File | null>(null);
  const [checkin, setCheckin] = useState("");

  const { loading, submitSlip } = useUploadSlip();
  const nav = useNavigate();

  // 🟢 ดึงชื่อผู้ใช้จาก LINE API
  useEffect(() => {
    if (!accessToken) return;
    fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => data.displayName && setUserName(data.displayName))
      .catch((err) => console.error("❌ ดึงชื่อ LINE ไม่สำเร็จ:", err));
  }, [accessToken]);

  // ✅ helper function
  const showAlert = (text: string, icon: any) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title: text,
      showConfirmButton: false,
      timer: 2000,
    });
    return false;
  };

  // ✅ ตรวจสอบข้อมูลก่อนส่ง
  const validateForm = (): boolean => {
    const nameRegex = /^[ก-๙a-zA-Z]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const idRegex = /^[0-9]{13}$/;
    const today = new Date();
    const selected = new Date(checkin);
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    if (!nameRegex.test(cname) || !nameRegex.test(csurname))
      return showAlert("ชื่อ-นามสกุลไม่ถูกต้อง", "error");
    if (!phoneRegex.test(cphone))
      return showAlert("เบอร์โทรต้องมี 10 หลัก", "error");
    if (!idRegex.test(cmumId))
      return showAlert("เลขบัตรประชาชนต้อง 13 หลัก", "error");
    if (selected < today)
      return showAlert("ไม่สามารถเลือกวันย้อนหลังได้", "warning");
    return true;
  };

  // 📤 ส่งข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🟡 เช็กแนบสลิปก่อน validate
    if (!slip) {
      showAlert("กรุณาแนบสลิปก่อนยืนยัน", "warning");
      return;
    }

    if (!validateForm()) return;

    try {
      await axios.post(`${API_BASE}/user/register`, {
        accessToken,
        ctitle,
        cname,
        csurname,
        cphone,
        cmumId,
      });

      const formData = new FormData();
      formData.append("accessToken", accessToken);
      formData.append("roomId", room.roomId);
      formData.append("ctitle", ctitle);
      formData.append("cname", cname);
      formData.append("csurname", csurname);
      formData.append("cphone", cphone);
      formData.append("cmumId", cmumId);
      formData.append("checkin", checkin);
      formData.append("slip", slip);

      const success = await submitSlip(formData);
      if (success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "จองห้องสำเร็จ",
          showConfirmButton: false,
          timer: 2000,
        });
        onSuccess();
        setTimeout(() => nav("/thankyou"), 1500);
      }
    } catch {
      Swal.fire("❌ เกิดข้อผิดพลาด", "ไม่สามารถส่งคำขอจองได้", "error");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container-fluid px-3 px-sm-4 px-md-5 py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-11 col-md-9 col-lg-7 col-xl-6">
            <div
              className="card shadow-lg border-0 rounded-4 mx-auto"
              style={{ maxWidth: "650px" }}
            >
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  <h3 className="text-center mb-3">📤 อัปโหลดสลิป</h3>
                  <h5 className="text-center text-black mb-4">
                    ห้อง {room.number}
                  </h5>

                  {/* 🔹 LINE Username */}
                  <FormInput label="LINE ผู้ใช้" value={userName} readOnly />

                  {/* 🔹 คำนำหน้า */}
                  <FormSelect
                    label="คำนำหน้า"
                    value={ctitle}
                    onChange={setCtitle}
                    options={["นาย", "นาง", "นางสาว"]}
                  />

                  <FormInput label="ชื่อ" value={cname} onChange={setCname} />
                  <FormInput
                    label="นามสกุล"
                    value={csurname}
                    onChange={setCsurname}
                  />

                  {/* 🔹 เบอร์โทร */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">เบอร์โทร</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-control"
                      value={cphone}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        setCphone(v.slice(0, 10));
                      }}
                      required
                    />
                  </div>

                  {/* 🔹 เลขบัตรประชาชน */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      เลขบัตรประชาชน
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-control"
                      value={cmumId}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        setCmumId(v.slice(0, 13));
                      }}
                      required
                    />
                  </div>

                  <FormInput
                    label="วันที่เข้าพัก"
                    type="date"
                    value={checkin}
                    onChange={setCheckin}
                  />
                  <FormFile onChange={setSlip} />
                  <UploadSlipPreview slip={slip} />

                  {/* 🔹 ปุ่ม */}
                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn w-50 me-2 fw-semibold text-white"
                      style={{
                        background: "linear-gradient(90deg, #ff6a6a, #ff0000)",
                      }}
                      onClick={() => nav("/")}
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="btn w-50 fw-semibold text-white"
                      style={{
                        background: "linear-gradient(90deg, #42e695, #3bb2b8)",
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

// 📦 ========== Components ย่อยในไฟล์เดียว ========== //
function FormInput({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
}: any) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <input
        type={type}
        className="form-control"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange && onChange(e.target.value)}
        required={!readOnly}
      />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }: any) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <select
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">-- เลือก --</option>
        {options.map((o: string) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function FormFile({ onChange }: any) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">แนบสลิป</label>
      <input
        type="file"
        className="form-control"
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        required
      />
    </div>
  );
}

function UploadSlipPreview({ slip }: { slip: File | null }) {
  if (!slip) return null;
  const imageUrl = URL.createObjectURL(slip);
  return (
    <div className="mt-3 text-center">
      <p className="fw-semibold mb-2">📷 ตัวอย่างสลิป</p>
      <img
        src={imageUrl}
        alt="Slip Preview"
        style={{
          width: "100%",
          maxWidth: "300px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
}
