import { useState } from "react";
import { useUploadSlip } from "../../hooks/useUploadSlip";
import type { Room } from "../../types/Room";
import { UploadSlipPreview } from "./UploadSlipPreview";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE } from "../../config";

interface Props {
  room: Room;
  accessToken: string;
  onSuccess: () => void;
}

export default function UploadSlipForm({
  room,
  accessToken,
  onSuccess,
}: Props) {
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
    const phoneRegex = /^[0-9]{10}$/;
    const idRegex = /^[0-9]{13}$/;

    if (!nameRegex.test(cname) || !nameRegex.test(csurname)) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "ชื่อ-นามสกุลห้ามมีอักษรพิเศษ",
        showConfirmButton: false,
        timer: 2500,
      });
      return false;
    }
    if (!phoneRegex.test(cphone)) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "เบอร์โทรต้องเป็น 10 หลัก",
        showConfirmButton: false,
        timer: 2500,
      });
      return false;
    }
    if (!idRegex.test(cmumId)) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "เลขบัตรประชาชนต้อง 13 หลัก",
        showConfirmButton: false,
        timer: 2500,
      });
      return false;
    }

    const today = new Date();
    const selected = new Date(checkin);
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "ไม่สามารถเลือกวันย้อนหลังได้",
        showConfirmButton: false,
        timer: 2500,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!slip) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "กรุณาแนบสลิปก่อนกดยืนยัน",
        showConfirmButton: false,
        timer: 2500,
      });
      return;
    }

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
    } catch (err: any) {
      console.error("❌ Booking submit failed:", err);
      Swal.fire("❌ เกิดข้อผิดพลาด", "ไม่สามารถส่งคำขอจองได้", "error");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container-fluid liff-full px-3 px-sm-4 px-md-5 py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-11 col-md-9 col-lg-7 col-xl-6">
            <div
              className="card shadow-lg border-0 rounded-4 mx-auto"
              style={{ width: "100%", maxWidth: "650px" }}
            >
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  <h3 className="text-center mb-3">📤 อัปโหลดสลิป</h3>
                  <h5 className="text-center text-secondary mb-4">
                    ห้อง {room.number}
                  </h5>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">คำนำหน้า</label>
                    <select
                      className="form-select"
                      value={ctitle}
                      onChange={(e) => setCtitle(e.target.value)}
                      required
                    >
                      <option value="">-- เลือก --</option>
                      <option value="นาย">นาย</option>
                      <option value="นาง">นาง</option>
                      <option value="น.ส.">นางสาว</option>
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
                      maxLength={10}
                      value={cphone}
                      onChange={(e) => setCphone(e.target.value)}
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
                      maxLength={13}
                      value={cmumId}
                      onChange={(e) => setCmumId(e.target.value)}
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
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />{" "}
                          กำลังอัปโหลด...
                        </>
                      ) : (
                        "ยืนยัน"
                      )}
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
