// src/components/UploadSlip/UploadSlipForm.tsx
import { useState } from "react";
import { useUploadSlip } from "../../hooks/useUploadSlip";
import type { Room } from "../../types/Room";
import { UploadSlipPreview } from "../UploadSlip/UploadSlipPreview";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import liff from "@line/liff";

interface Props {
  room: Room;
  onSuccess: () => void;
}

export default function UploadSlipForm({ room, onSuccess }: Props) {
  const [ctitle, setCtitle] = useState("");
  const [cname, setCname] = useState("");
  const [csurname, setCsurname] = useState("");
  const [cphone, setCphone] = useState("");
  const [cmumId, setCmumId] = useState("");
  const [slip, setSlip] = useState<File | null>(null);
  const [checkin, setCheckin] = useState("");

  const { loading, submitSlip } = useUploadSlip();
  const nav = useNavigate();

  const validateForm = (): boolean => {
    const nameRegex = /^[ก-๙a-zA-Z]+$/;
    if (!nameRegex.test(cname)) {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ถูกต้อง",
        text: "ชื่อห้ามมีอักษรพิเศษหรือเว้นวรรค",
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    }

    if (!nameRegex.test(csurname)) {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ถูกต้อง",
        text: "นามสกุลห้ามมีอักษรพิเศษหรือเว้นวรรค",
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(cphone)) {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ถูกต้อง",
        text: "เบอร์โทรต้องเป็นตัวเลข 10 หลัก และห้ามมีอักษรพิเศษหรือเว้นวรรค",
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    }

    const idRegex = /^[0-9]{13}$/;
    if (!idRegex.test(cmumId)) {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ถูกต้อง",
        text: "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก และห้ามมีอักษรพิเศษหรือเว้นวรรค",
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(checkin);
    if (selectedDate.getTime() < today.getTime()) {
      Swal.fire({
        icon: "warning",
        title: "แจ้งเตือน",
        text: "ไม่สามารถเลือกวันย้อนหลังได้",
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slip) {
      Swal.fire({
        icon: "warning",
        title: "แจ้งเตือน",
        text: "กรุณาแนบสลิปก่อนกดยืนยัน",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (!validateForm()) return;

    const formData = new FormData();
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
        icon: "success",
        title: "✅ สำเร็จ",
        text: "ส่งคำขอจองเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 2000,
      });

      // ✅ แจ้ง parent ว่าสำเร็จ
      onSuccess();

      // ✅ ไปหน้า thankyou แล้วปิด LIFF
      setTimeout(() => {
        nav("/thankyou");
        setTimeout(() => {
          if (liff.isInClient()) liff.closeWindow();
        }, 1500);
      }, 2000);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 px-3 col-sm-10 col-md-8 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <h2 className="text-center mb-3">อัปโหลดสลิป</h2>
                  <h5 className="mb-4 text-center">ห้อง {room.number}</h5>

                  {/* ฟอร์ม input เหมือนเดิม */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">คำนำหน้า</label>
                    <select
                      className="form-control"
                      value={ctitle}
                      onChange={(e) => setCtitle(e.target.value)}
                      required
                    >
                      <option value="">-- เลือก --</option>
                      <option value="นาย">นาย</option>
                      <option value="นาง">นาง</option>
                      <option value="นางสาว">นางสาว</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">ชื่อ</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cname}
                      onChange={(e) => setCname(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">นามสกุล</label>
                    <input
                      type="text"
                      className="form-control"
                      value={csurname}
                      onChange={(e) => setCsurname(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">เบอร์โทร</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={cphone}
                      onChange={(e) => setCphone(e.target.value)}
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      เลขบัตรประชาชน
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmumId}
                      onChange={(e) => setCmumId(e.target.value)}
                      maxLength={13}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      วันที่เข้าพัก
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={checkin}
                      onChange={(e) => setCheckin(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">แนบสลิป</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setSlip(e.target.files?.[0] || null)}
                      required
                    />
                  </div>

                  <UploadSlipPreview slip={slip} />

                  {/* ปุ่ม */}
                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn w-50 me-2 fw-semibold text-white"
                      style={{
                        background: "linear-gradient(90deg, #ff6a6a, #ff0000)",
                      }}
                      onClick={() => nav("/")}
                    >
                      ❌ ยกเลิก
                    </button>

                    <button
                      type="submit"
                      className="btn w-50 fw-semibold text-white"
                      style={{
                        background: "linear-gradient(90deg, #42e695, #3bb2b8)",
                      }}
                      disabled={loading}
                    >
                      {loading ? "กำลังอัปโหลด..." : "✅ ยืนยัน"}
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
