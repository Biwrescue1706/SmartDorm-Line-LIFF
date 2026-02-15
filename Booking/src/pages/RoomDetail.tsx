import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Room } from "../types/All";
import { API_BASE } from "../config";
import { GetRoomById } from "../apis/endpoint.api";
import Swal from "sweetalert2";

export function useRoomDetail() {
  const { state } = useLocation();
  const { roomId } = useParams();
  const [room, setRoom] = useState<Room | null>((state as Room) || null);
  const [loading, setLoading] = useState(!state && !!roomId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state) return;

    if (!roomId) {
      setError("ไม่พบรหัสห้อง");
      return;
    }

    setLoading(true);
    fetch(`${API_BASE}${GetRoomById(roomId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลห้องได้");
        const data: Room = await res.json();
        setRoom(data);
      })
      .catch(() => {
        setError("โหลดข้อมูลห้องไม่สำเร็จ");
        Swal.fire({
          icon: "error",
          title: "โหลดข้อมูลห้องไม่สำเร็จ",
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .finally(() => setLoading(false));
  }, [roomId, state]);

  return { room, roomId, loading, error };
}

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { refreshLiffToken, logoutLiff } from "../lib/liff";
import LiffNav from "../components/LiffNav";

export default function RoomDetail() {
  const { room, roomId, loading, error } = useRoomDetail();
  const nav = useNavigate();

  // ✅ dorm profile state
  const [profile, setProfile] = useState({
    service: 0,
    waterRate: 0,
    electricRate: 0,
    overdueFinePerDay: 0,
  });

  // ✅ ดึง dorm profile
  useEffect(() => {
    fetch(`${API_BASE}/dorm-profile`)
      .then((r) => r.json())
      .then((d) =>
        setProfile({
          service: d.service ?? 0,
          waterRate: d.waterRate ?? 0,
          electricRate: d.electricRate ?? 0,
          overdueFinePerDay: d.overdueFinePerDay ?? 0,
        })
      )
      .catch(() => console.warn("โหลด dorm profile ไม่สำเร็จ"));
  }, []);

  // auth check
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
                  <th>รายการ</th>
                  <th>ค่าใช้จ่าย</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <th className="bg-light">หมายเลขห้อง</th>
                  <td className="fw-semibold">{room.number}</td>
                </tr>
                <tr>
                  <th className="bg-light">ขนาดห้อง</th>
                  <td className="fw-semibold">{room.size}</td>
                </tr>
                <tr>
                  <th className="bg-light">ค่าเช่า</th>
                  <td className="fw-bold text-primary">
                    {room.rent.toLocaleString("th-TH")} บาท
                  </td>
                </tr>
                <tr>
                  <th className="bg-light">เงินประกัน</th>
                  <td>{room.deposit.toLocaleString("th-TH")} บาท</td>
                </tr>
                <tr>
                  <th className="bg-light">ค่าจอง</th>
                  <td>{room.bookingFee.toLocaleString("th-TH")} บาท</td>
                </tr>
                <tr>
                  <th className="bg-light">ค่าส่วนกลาง</th>
                  <td>{profile.service} บาท / เดือน</td>
                </tr>
                <tr>
                  <th className="bg-light">ค่าไฟฟ้า</th>
                  <td>{profile.electricRate} บาท / หน่วย</td>
                </tr>
                <tr>
                  <th className="bg-light">ค่าน้ำ</th>
                  <td>{profile.waterRate} บาท / หน่วย</td>
                </tr>
                <tr className="table-success fw-bold">
                  <th>รวมทั้งหมด</th>
                  <td className="text-success">
                    {total.toLocaleString("th-TH")} บาท
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="text-muted small fst-italic text-start">
                    ( ตัดรอบบิลวันที่ 25 ของเดือน <br />
                    กำหนดชำระบิล ถึงวันที่ 5 ของทุกเดือน <br />
                    หากชำระเกินกำหนด ปรับวันละ {profile.overdueFinePerDay} บาท )
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