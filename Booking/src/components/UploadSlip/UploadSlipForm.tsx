import { useState } from "react";
import Swal from "sweetalert2";
import { useUploadSlip } from "../../hooks/useUploadSlip";
import type { Room } from "../../types/Room";
import UploadSlipPreview from "./UploadSlipPreview";
import { useNavigate } from "react-router-dom";

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

  const { loading, submitSlip } = useUploadSlip(room.roomId, room.number);
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ validate
    if (!/^\d{10}$/.test(cphone)) {
      Swal.fire("❌ ข้อผิดพลาด", "เบอร์โทรต้องเป็นตัวเลข 10 หลัก", "error");
      return;
    }
    if (!/^\d{13}$/.test(cmumId)) {
      Swal.fire(
        "❌ ข้อผิดพลาด",
        "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก",
        "error"
      );
      return;
    }
    if (!slip) {
      Swal.fire("❌ ข้อผิดพลาด", "กรุณาแนบสลิปการโอนเงิน", "error");
      return;
    }
    if (slip.size > 5 * 1024 * 1024) {
      Swal.fire("❌ ข้อผิดพลาด", "ไฟล์สลิปต้องไม่เกิน 5MB", "error");
      return;
    }
    if (new Date(checkin) < new Date(new Date().toDateString())) {
      Swal.fire("❌ ข้อผิดพลาด", "วันที่เข้าพักต้องไม่น้อยกว่าวันนี้", "error");
      return;
    }

    const userId = localStorage.getItem("liff_userId");
    const userName = localStorage.getItem("liff_displayName");
    if (!userId) {
      Swal.fire("❌ ข้อผิดพลาด", "กรุณาเข้าสู่ระบบก่อนจองห้อง", "error");
      return;
    }

    // ✅ prepare FormData
    const formData = new FormData();
    formData.append("roomId", room.roomId);
    formData.append("userId", userId);
    formData.append("userName", userName || "");
    formData.append("ctitle", ctitle);
    formData.append("cname", cname);
    formData.append("csurname", csurname);
    formData.append("cphone", cphone);
    formData.append("cmumId", cmumId);
    formData.append("checkin", checkin);
    formData.append("slip", slip);

    const success = await submitSlip(formData);
    if (success) onSuccess();
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "#f0f0f0" }}
    >
      <div
        className="card shadow-lg"
        style={{ maxWidth: "350px", width: "100%" }}
      >
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* ---------------- คำนำหน้า ---------------- */}
            <div className="mb-2">
              <h2 className="text-center mb-3">อัปโหลดสลิป</h2>
              <h5 className="mb-4 text-center">ห้อง {room.number}</h5>
              <h6 className="form-label fw-semibold">คำนำหน้า</h6>
              <select
                className="form-control form-control-sm"
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

            {/* ---------------- ชื่อ ---------------- */}
            <div className="mb-2">
              <h6 className="form-label fw-semibold">ชื่อ</h6>
              <input
                type="text"
                className="form-control form-control-sm"
                value={cname}
                onChange={(e) => setCname(e.target.value)}
                required
              />
            </div>

            {/* ---------------- นามสกุล ---------------- */}
            <div className="mb-2">
              <h6 className="form-label fw-semibold">นามสกุล</h6>
              <input
                type="text"
                className="form-control form-control-sm"
                value={csurname}
                onChange={(e) => setCsurname(e.target.value)}
                required
              />
            </div>

            {/* ---------------- เบอร์โทร ---------------- */}
            <div className="mb-2">
              <h6 className="form-label fw-semibold">เบอร์โทร</h6>
              <input
                type="tel"
                className="form-control form-control-sm"
                value={cphone}
                onChange={(e) => setCphone(e.target.value)}
                required
              />
            </div>

            {/* ---------------- เลขบัตร ---------------- */}
            <div className="mb-2">
              <h6 className="form-label fw-semibold">เลขบัตร</h6>
              <input
                type="text"
                className="form-control form-control-sm"
                value={cmumId}
                onChange={(e) => setCmumId(e.target.value)}
                required
              />
            </div>

            {/* ---------------- วันที่เข้าพัก ---------------- */}
            <div className="mb-2">
              <h6 className="form-label fw-semibold">วันที่เข้าพัก</h6>
              <input
                type="date"
                className="form-control form-control-sm"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                required
              />
            </div>

            {/* ---------------- แนบสลิป ---------------- */}
            <div className="mb-2">
              <h6 className="form-label fw-semibold">แนบสลิป</h6>
              <input
                type="file"
                className="form-control form-control-sm"
                accept="image/*"
                onChange={(e) => setSlip(e.target.files?.[0] || null)}
                required
              />
            </div>

            {/* ---------------- ปุ่ม ---------------- */}
            <div className="d-flex justify-content-between mt-3">
              <button
                type="button"
                className="btn w-50 me-1 fw-semibold"
                style={{
                  background: "linear-gradient(90deg, #ff6a6a, #ff0000)",
                  color: "white",
                  border: "none",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(90deg, #ff0000, #cc0000)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(90deg, #ff6a6a, #ff0000)")
                }
                onClick={() => nav("/")}
              >
                ❌ ยกเลิก
              </button>

              <button
                type="submit"
                className="btn w-50 ms-1 fw-semibold"
                style={{
                  background: "linear-gradient(90deg, #42e695, #3bb2b8)",
                  color: "white",
                  border: "none",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(90deg, #2ecc71, #1abc9c)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(90deg, #42e695, #3bb2b8)")
                }
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    กำลังบันทึก...
                  </>
                ) : (
                  "✅ ยืนยัน"
                )}
              </button>
              
            </div>
            <br />
            {/* ---------------- preview ---------------- */}
            <UploadSlipPreview slip={slip} />
          </form>
        </div>
      </div>
    </div>
  );
}
