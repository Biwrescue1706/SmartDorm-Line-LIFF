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

  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) return;
        await axios.post(`${API_BASE}/user/me`, { accessToken: token });
      } catch {
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
        <div className="container text-center text-muted pt-5 mt-4">
          ⏳ กำลังโหลดข้อมูลห้อง...
        </div>
      </>
    );

  if (error)
    return (
      <>
        <LiffNav />
        <div className="container text-center text-danger pt-5 mt-4">
          {error} (ID: {roomId})
        </div>
      </>
    );

  if (!room)
    return (
      <>
        <LiffNav />
        <div className="container text-center pt-5 mt-4">
          ❌ ไม่พบข้อมูลห้อง {roomId}
          <button className="btn btn-primary mt-3" onClick={() => nav("/")}>
            กลับหน้าแรก
          </button>
        </div>
      </>
    );

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

      <div className="pt-5"></div>

      <div className="pb-5 min-vh-100 bg-light">
        <div className="container">

          <div className="shadow p-4 mb-4 rounded-4 text-white bg-primary bg-gradient text-center mt-3">
            <h3 className="fw-bold mb-0">รายละเอียดห้องพัก</h3>
            <p className="mb-0 opacity-75">ตรวจสอบข้อมูลก่อนทำการจอง</p>
          </div>

          <div className="bg-white rounded-4 shadow-sm p-4">
            <table className="table align-middle text-center table-bordered">
              <thead className="table-light">
                <tr>
                  <th className="text-start">รายการ</th>
                  <th>ค่าใช้จ่าย</th>
                </tr>
              </thead>

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
                    ( ตัดรอบบิลวันที่ 25 ของเดือน <br />
                    กำหนดชำระบิล ตั้งแต่วันแจ้งบิล ถึง วันที่ 5 ของทุกเดือน <br />
                    หากชำระค่าเช่าเกินวันที่ 5 อัตราการปรับ วันละ 50 บาท )
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="d-flex gap-3 justify-content-between mt-4">
              <button
                className="btn btn-danger flex-fill fw-semibold"
                onClick={handleCancel}
              >
                ยกเลิก
              </button>

              <button
                className="btn btn-success flex-fill fw-semibold"
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