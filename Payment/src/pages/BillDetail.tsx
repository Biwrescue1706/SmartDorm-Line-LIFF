// Payment/src/pages/BillDetail.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE } from "../config";
import { refreshLiffToken } from "../lib/liff";
import NavBar from "../components/NavBar";

interface BillDetail {
  billId: string;
  month: string;
  total: number;
  rent: number;
  service: number;
  waterCost: number;
  electricCost: number;
  wBefore: number;
  wAfter: number;
  wUnits: number;
  eBefore: number;
  eAfter: number;
  eUnits: number;
  fine: number;
  dueDate: string;
  status: number;
  room: { number: string };
  booking: { fullName: string };
}

// 📅 แปลงเป็น "6 มกราคม 2569"
const formatThaiDate = (d: string) => {
  const t = new Date(d);
  const months = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
  ];
  return `${t.getDate()} ${months[t.getMonth()]} ${t.getFullYear() + 543}`;
};

export default function BillDetail() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { billId } = state || {};
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!billId) {
          Swal.fire("ไม่พบบิล", "กรุณาเลือกบิลใหม่อีกครั้ง", "warning");
          nav("/mybills");
          return;
        }

        const token = await refreshLiffToken();
        if (!token) throw new Error("ไม่มี token");

        const res = await axios.get(`${API_BASE}/bill/${billId}`);
        setBill(res.data);
      } catch {
        Swal.fire("❌ โหลดข้อมูลล้มเหลว", "ไม่พบบิลในระบบ", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [billId, nav]);

  if (loading)
    return (
      <div className="text-center smartdorm-loading">
        <NavBar />
        <div className="spinner-border text-success mt-5"></div>
        <p className="mt-2">กำลังโหลดข้อมูล...</p>
      </div>
    );

  if (!bill)
    return (
      <div className="text-center">
        <NavBar />
        <h5 className="text-danger mt-5">❌ ไม่พบบิลนี้</h5>
      </div>
    );

  return (
    <div className="smartdorm-page" style={{ background: "#f6f9ff" }}>
      <NavBar />

      {/* HEADER TITLE */}
      <div
        className="text-center py-3"
        style={{
          background: "linear-gradient(135deg,#6FF5C2,#38A3FF)",
          borderBottomLeftRadius: "30px",
          borderBottomRightRadius: "30px",
          color: "white",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        }}
      >
        <h3 className="fw-bold mb-1">รายละเอียดบิลค่าเช่า</h3>
        <div className="small opacity-75">เลขที่บิล {bill.billId}</div>
      </div>

      {/* CARD AREA */}
      <div
        className="bg-white shadow-sm p-4 rounded-4 mt-3"
        style={{ maxWidth: "520px", margin: "0 auto" }}
      >
        {/* SECTION: USER & ROOM */}
        <div
          className="p-3 rounded-3 mb-3"
          style={{ background: "#f3f7ff", borderLeft: "6px solid #3a7afe" }}
        >
          <div className="d-flex justify-content-between">
            <span>👤 ชื่อลูกค้า</span>
            <span className="fw-semibold">{bill.booking.fullName}</span>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <span>🏠 ห้องพัก</span>
            <span className="fw-semibold">{bill.room.number}</span>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <span>📅 ประจำเดือน</span>
            <span>{formatThaiDate(bill.month)}</span>
          </div>
        </div>

        {/* SECTION: TABLE */}
        <table className="table align-middle text-center rounded-3 overflow-hidden">
          <thead
            style={{
              background: "#eef2ff",
              fontWeight: 600,
              fontSize: "0.92rem",
            }}
          >
            <tr>
              <th className="text-start ps-3">รายการ</th>
              <th>ครั้งก่อน</th>
              <th>ครั้งหลัง</th>
              <th>ใช้</th>
              <th>ยอดเงิน</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="text-start">💧 ค่าน้ำ</td>
              <td>{bill.wBefore}</td>
              <td>{bill.wAfter}</td>
              <td>{bill.wUnits}</td>
              <td>{bill.waterCost.toLocaleString()} บาท</td>
            </tr>
            <tr>
              <td className="text-start">⚡ ค่าไฟ</td>
              <td>{bill.eBefore}</td>
              <td>{bill.eAfter}</td>
              <td>{bill.eUnits}</td>
              <td>{bill.electricCost.toLocaleString()} บาท</td>
            </tr>

            <tr>
              <td className="text-start">💰 ค่าเช่าห้อง</td>
              <td>-</td><td>-</td><td>-</td>
              <td>{bill.rent.toLocaleString()} บาท</td>
            </tr>

            <tr>
              <td className="text-start">🏢 ค่าส่วนกลาง</td>
              <td>-</td><td>-</td><td>-</td>
              <td>{bill.service.toLocaleString()} บาท</td>
            </tr>

            <tr>
              <td className="text-start">⚠️ ค่าปรับ</td>
              <td>-</td><td>-</td><td>-</td>
              <td>{bill.fine.toLocaleString()} บาท</td>
            </tr>

            <tr style={{ background: "#fafcff" }}>
              <td className="fw-bold text-start">💵 ยอดรวมทั้งหมด</td>
              <td colSpan={3}></td>
              <td className="fw-bold text-success">
                {bill.total.toLocaleString()} บาท
              </td>
            </tr>
          </tbody>
        </table>

        {/* DUE DATE */}
        <div className="text-center fw-bold mt-3" style={{ color: "#ff7b00" }}>
          ครบกำหนดชำระวันที่ {formatThaiDate(bill.dueDate)}
        </div>

        {/* BUTTONS */}
        {bill.status === 0 && (
          <div className="d-flex gap-2 mt-4">
            <button
              className="btn w-50 py-2"
              style={{
                borderRadius: "14px",
                background: "#e8e8e8",
                fontWeight: 600,
              }}
              onClick={() => nav("/mybills")}
            >
              ยกเลิก
            </button>

            <button
              className="btn w-50 py-2 text-white"
              style={{
                borderRadius: "14px",
                background: "linear-gradient(135deg,#7B2CBF,#4B008A)",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(123,44,191,0.4)",
              }}
              onClick={() => nav("/payment-choice", { state: bill })}
            >
              ยืนยันการชำระเงิน
            </button>
          </div>
        )}
      </div>
    </div>
  );
}