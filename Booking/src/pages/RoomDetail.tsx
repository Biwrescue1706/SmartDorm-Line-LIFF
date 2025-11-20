// src/pages/RoomDetail.tsx
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRoomDetail } from "../hooks/useRoomDetail";
import { refreshLiffToken, logoutLiff } from "../lib/liff";
import { API_BASE } from "../config";
import LiffNav from "../components/Nav/LiffNav";

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
        if (
          err.response?.data?.error?.includes("หมดอายุ") ||
          err.response?.data?.error?.includes("invalid")
        ) {
          await logoutLiff();
          return;
        }

        Swal.fire(
          "การยืนยันสิทธิ์ล้มเหลว",
          "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
          "error"
        ).then(() => nav("/"));
      }
    })();
  }, [nav]);

  // Loading
  if (loading)
    return (
      <>
        <LiffNav />
        <div className="container text-center text-muted" style={{ paddingTop: "80px" }}>
          ⏳ กำลังโหลดข้อมูลห้อง...
        </div>
      </>
    );

  // Error
  if (error)
    return (
      <>
        <LiffNav />
        <div className="container text-center text-danger" style={{ paddingTop: "80px" }}>
          {error} (ID: {roomId})
        </div>
      </>
    );

  // ไม่พบข้อมูลห้อง
  if (!room)
    return (
      <>
        <LiffNav />
        <div className="container text-center" style={{ paddingTop: "80px" }}>
          ไม่พบข้อมูลห้อง {roomId}
          <div>
            <button className="btn btn-primary mt-3" onClick={() => nav("/")}>
              กลับหน้าแรก
            </button>
          </div>
        </div>
      </>
    );

  // === ฟังก์ชันจัดการปุ่ม ===
  const total = room.rent + room.deposit + room.bookingFee;

  const handleConfirm = () => {
    localStorage.setItem("selectedRoom", JSON.stringify(room));
    nav("/payment", { state: room });
  };

  const handleCancel = () => {
    localStorage.removeItem("selectedRoom");
    nav("/");
  };

  // === Render หลัก ===
  return (
    <>
      <LiffNav />
      <div className="container my-4" style={{ paddingTop: "70px" }}>
        <div
          className="card shadow-sm border-0"
          style={{ background: "linear-gradient(135deg, #f8f9fa, #e9ecef)" }}
        >
          <div className="card-body">
            <h3 className="text-center mb-4 fw-bold">รายละเอียดห้องพัก</h3>

            {/* ตารางแสดงรายละเอียดห้องในหน้าเดียว */}
            <table className="table table-bordered align-middle text-center shadow-sm">
              <tbody>
                <tr>
                  <th className="text-start w-30">หมายเลขห้อง</th>
                  <td colSpan={2}>{room.number}</td>
                </tr>

                <tr>
                  <th className="text-start w-30">ขนาดห้อง</th>
                  <td colSpan={2}>{room.size}</td>
                </tr>

                <tr>
                  <th className="text-start w-30">ค่าส่วนกลาง</th>
                  <td>50</td>
                  <td>บาท</td>
                </tr>

                <tr>
                  <th className="text-start w-30">ค่าไฟฟ้า</th>
                  <td>7</td>
                  <td>บาท / หน่วย</td>
                </tr>

                <tr>
                  <th className="text-start w-30">ค่าน้ำ</th>
                  <td>19</td>
                  <td>บาท / หน่วย</td>
                </tr>

                <tr>
                  <th className="text-start w-30">ค่าเช่า</th>
                  <td>{room.rent.toLocaleString("th-TH")}</td>
                  <td>บาท</td>
                </tr>

                <tr>
                  <th className="text-start w-30">เงินประกัน</th>
                  <td>{room.deposit.toLocaleString("th-TH")}</td>
                  <td>บาท</td>
                </tr>

                <tr>
                  <th className="text-start w-30">ค่าจอง</th>
                  <td>{room.bookingFee.toLocaleString("th-TH")}</td>
                  <td>บาท</td>
                </tr>

                <tr className="table-success fw-bold">
                  <th className="text-start w-30">รวมทั้งหมด</th>
                  <td className="text-success">{total.toLocaleString("th-TH")}</td>
                  <td>บาท</td>
                </tr>

                <tr>
                  <td colSpan={3} className="fst-italic text-muted small text-start">
                    ( ตัดรอบบิลทุกวันที่ 25 ของเดือน <br />
                    ราคานี้ยังไม่รวมค่าส่วนกลาง, ค่าน้ำ, ค่าไฟ <br />
                    หากชำระเกินวันที่ 5 ของเดือน จะมีค่าปรับ 50 บาท/วัน )
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ปุ่ม */}
            <div className="d-flex justify-content-between mt-4 gap-3">
              <button
                className="btn fw-semibold flex-fill"
                style={{
                  background: "linear-gradient(90deg, #ff6b6b, #d6336c)",
                  color: "white",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "linear-gradient(90deg, #d6336c, #a61e4d)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "linear-gradient(90deg, #ff6b6b, #d6336c)")
                }
                onClick={handleCancel}
              >
                ยกเลิก
              </button>

              <button
                className="btn fw-semibold flex-fill"
                style={{
                  background: "linear-gradient(90deg, #20c997, #0d6efd)",
                  color: "white",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "linear-gradient(90deg, #198754, #0a58ca)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "linear-gradient(90deg, #20c997, #0d6efd)")
                }
                onClick={handleConfirm}
              >
                ยืนยันจอง
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}