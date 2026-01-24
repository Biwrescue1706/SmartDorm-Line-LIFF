// Booking/src/pages/RoomDetail.tsx
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRoomDetail } from "../hooks/useRoomDetail";
import { refreshLiffToken, logoutLiff } from "../lib/liff";
import { API_BASE } from "../config";
import LiffNav from "../components/LiffNav";

export default function RoomDetail() {
  const { room, roomId, loading, error } = useRoomDetail();
  const nav = useNavigate();

  // ตรวจสอบสิทธิ์ LIFF
  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) return;
        await axios.post(`${API_BASE}/user/me`, { accessToken: token });
      } catch (err: any) {
        await logoutLiff();
        Swal.fire("หมดเวลาการใช้งาน", "กรุณาล็อกอินใหม่อีกครั้ง", "warning");
        nav("/");
      }
    })();
  }, [nav]);

  if (loading)
    return (
      <>
        <LiffNav />
        <div className="container text-center text-muted" style={{ paddingTop: "90px" }}>
          ⏳ กำลังโหลดข้อมูลห้อง...
        </div>
      </>
    );

  if (error)
    return (
      <>
        <LiffNav />
        <div className="container text-center text-danger" style={{ paddingTop: "90px" }}>
          {error} (ID: {roomId})
        </div>
      </>
    );

  if (!room)
    return (
      <>
        <LiffNav />
        <div className="container text-center" style={{ paddingTop: "90px" }}>
          ❌ ไม่พบข้อมูลห้อง {roomId}
          <button className="btn btn-primary mt-3" onClick={() => nav("/")}>
            กลับหน้าแรก
          </button>
        </div>
      </>
    );

  // ค่าใช้จ่ายรวม
  const total = room.rent + room.deposit + room.bookingFee;

  const handleConfirm = () => {
    localStorage.setItem("selectedRoom", JSON.stringify(room));
    nav("/payment", { state: room });
  };

  const handleCancel = () => {
    localStorage.removeItem("selectedRoom");
    nav("/");
  };

  return (
    <>
      <LiffNav />
      <div style={{ paddingTop: "90px", background: "#f6f9ff", minHeight: "100vh" }}>
        <div className="container">
          {/* HEADER */}
          <div
            className="shadow p-4 mb-4 text-white rounded-4"
            style={{
              background: "linear-gradient(135deg,#38A3FF,#7B2CBF)",
              boxShadow: "0 6px 16px rgba(0,0,0,.25)"
            }}
          >
            <h3 className="text-center fw-bold mb-0">รายละเอียดห้องพัก</h3>
            <p className="text-center mb-0 opacity-75">ตรวจสอบข้อมูลก่อนทำการจอง</p>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-4 shadow-sm p-4">
            <table className="table align-middle text-center table-bordered">
              <tbody>
                <tr>
                  <th className="bg-light text-start">หมายเลขห้อง</th>
                  <td className="fw-semibold">{room.number}</td>
                </tr>
                <tr>
                  <th className="bg-light text-start">ขนาดห้อง</th>
                  <td className="fw-semibold">{room.size}</td>
                </tr>
                <tr>
                  <th className="bg-light text-start">ค่าเช่า</th>
                  <td className="fw-bold text-primary">
                    {room.rent.toLocaleString("th-TH")} บาท
                  </td>
                </tr>
                <tr>
                  <th className="bg-light text-start">เงินประกัน</th>
                  <td>{room.deposit.toLocaleString("th-TH")} บาท</td>
                </tr>
                <tr>
                  <th className="bg-light text-start">ค่าจอง</th>
                  <td>{room.bookingFee.toLocaleString("th-TH")} บาท</td>
                </tr>

<tr>
                  <th className="bg-light text-start">ค่าส่วนกลาง</th>
                  <td>50 บาท / เดือน</td>
                </tr>
                <tr>
                  <th className="bg-light text-start">ค่าไฟฟ้า</th>
                  <td>7 บาท / หน่วย</td>
                </tr>
                <tr>
                  <th className="bg-light text-start">ค่าน้ำ</th>
                  <td>19 บาท / หน่วย</td>
                </tr>

                <tr className="table-success fw-bold">
                  <th className="text-start">รวมทั้งหมด</th>
                  <td className="text-success">
                    {total.toLocaleString("th-TH")} บาท
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className="text-muted small fst-italic text-start">
                    ( ตัดรอบบิลวันที่ 25 ของเดือน <br /> กำหนดชำระบิล ตั้งแต่วันแจ้งบิล ถึง วันที่ 5 ของทุกเดือน <br /> หากชำระค่าเช่าเกินวันที่ 5 อัตราการปรับ วันละ 50 บาท )
                  </td>
                </tr>
              </tbody>
            </table>

            {/* BUTTONS */}
            <div className="d-flex gap-3 justify-content-between mt-4">
              <button
                className="btn flex-fill fw-semibold text-white"
                style={{
                  borderRadius: "14px",
                  background: "linear-gradient(135deg,#FF6B6B,#C92A2A)"
                }}
                onMouseEnter={(e) =>
                  e.currentTarget.style.background =
                    "linear-gradient(135deg,#C92A2A,#7A1E1E)"
                }
                onMouseLeave={(e) =>
                  e.currentTarget.style.background =
                    "linear-gradient(135deg,#FF6B6B,#C92A2A)"
                }
                onClick={handleCancel}
              >
                ยกเลิก
              </button>

              <button
                className="btn flex-fill fw-semibold text-white"
                style={{
                  borderRadius: "14px",
                  background: "linear-gradient(135deg,#20C997,#0D6EFD)"
                }}
                onMouseEnter={(e) =>
                  e.currentTarget.style.background =
                    "linear-gradient(135deg,#198754,#0A58CA)"
                }
                onMouseLeave={(e) =>
                  e.currentTarget.style.background =
                    "linear-gradient(135deg,#20C997,#0D6EFD)"
                }
                onClick={handleConfirm}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}