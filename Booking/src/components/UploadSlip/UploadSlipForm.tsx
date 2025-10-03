import { useState } from "react";
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
    // ✅ prepare FormData ...
    const formData = new FormData();
    formData.append("roomId", room.roomId);
    formData.append("userId", localStorage.getItem("liff_userId") || "");
    formData.append("userName", localStorage.getItem("liff_displayName") || "");
    formData.append("ctitle", ctitle);
    formData.append("cname", cname);
    formData.append("csurname", csurname);
    formData.append("cphone", cphone);
    formData.append("cmumId", cmumId);
    formData.append("checkin", checkin);
    if (slip) formData.append("slip", slip);

    const success = await submitSlip(formData);
    if (success) onSuccess();
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center bg-light">
      <div className="row w-100 justify-content-center px-3">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <h2 className="text-center mb-3">อัปโหลดสลิป</h2>
                <h5 className="mb-4 text-center">ห้อง {room.number}</h5>

                {/* คำนำหน้า */}
                <div className="mb-3">
                  <h6 className="form-label fw-semibold text-center">
                    คำนำหน้า
                  </h6>
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

                {/* ชื่อ */}
                <div className="mb-3">
                  <h6 className="form-label fw-semibold text-center">ชื่อ :</h6>
                  <input
                    type="text"
                    className="form-control"
                    value={cname}
                    onChange={(e) => setCname(e.target.value)}
                    required
                  />
                </div>

                {/* นามสกุล */}
                <div className="mb-3">
                  <h6 className="form-label fw-semibold text-center">
                    นามสกุล :
                  </h6>
                  <input
                    type="text"
                    className="form-control"
                    value={csurname}
                    onChange={(e) => setCsurname(e.target.value)}
                    required
                  />
                </div>

                {/* เบอร์โทร */}
                <div className="mb-3">
                  <h6 className="form-label fw-semibold text-center">
                    เบอร์โทร :
                  </h6>
                  <input
                    type="tel"
                    className="form-control"
                    value={cphone}
                    onChange={(e) => setCphone(e.target.value)}
                    required
                  />
                </div>

                {/* เลขบัตร */}
                <div className="mb-3">
                  <h6 className="form-label fw-semibold text-center">
                    เลขบัตรประชาชน :
                  </h6>
                  <input
                    type="text"
                    className="form-control"
                    value={cmumId}
                    onChange={(e) => setCmumId(e.target.value)}
                    required
                  />
                </div>

                {/* วันที่เข้าพัก */}
                <div className="mb-3">
                  <h6 className="form-label fw-semibold text-center">
                    วันที่เข้าพัก
                  </h6>
                  <input
                    type="date"
                    className="form-control"
                    value={checkin}
                    onChange={(e) => setCheckin(e.target.value)}
                    required
                  />
                </div>

                {/* แนบสลิป */}
                <div className="mb-3">
                  <h6 className="form-label fw-semibold text-center">
                    แนบสลิป
                  </h6>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setSlip(e.target.files?.[0] || null)}
                    required
                  />
                </div>

                {/* Preview */}
                <UploadSlipPreview slip={slip} />

                {/* ปุ่ม */}
                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn w-50 me-2 fw-semibold text-white"
                    style={{
                      background: "linear-gradient(90deg, #ff6a6a, #ff0000)",
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
                    className="btn w-50 fw-semibold text-white"
                    style={{
                      background: "linear-gradient(90deg, #42e695, #3bb2b8)",
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
                    {loading ? "กำลังบันทึก..." : "✅ ยืนยัน"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
