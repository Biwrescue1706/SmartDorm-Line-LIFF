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

// 📅 -> 5 มกราคม 2569
const formatThaiDate = (d: string) => {
  const t = new Date(d);
  const months = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
  ];
  return `${t.getDate()} ${months[t.getMonth()]} ${t.getFullYear() + 543}`;
};

// 🧮 -> 2,969 → "สองพันเก้าร้อยหกสิบเก้าบาทถ้วน"
const thaiNumberText = (num: number) => {
  const thNums = ["ศูนย์","หนึ่ง","สอง","สาม","สี่","ห้า","หก","เจ็ด","แปด","เก้า"];
  const thPlaces = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
  const n = num.toString();
  let txt = "";
  let len = n.length;

  for (let i = 0; i < len; i++) {
    const digit = Number(n[i]);
    if (digit !== 0) txt += thNums[digit] + thPlaces[len - i - 1];
  }

  return txt
    .replace("หนึ่งสิบ","สิบ")
    .replace("สองสิบ","ยี่สิบ")
    .replace("สิบหนึ่ง","สิบเอ็ด") + "บาทถ้วน";
};

export default function BillDetail() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { billId } = state || {};
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // LOAD DATA -------------------------------------------------
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
      <div className="text-center">
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

  // UI --------------------------------------------------------
  return (
    <div style={{ background: "#f6f9ff", minHeight: "100vh" }}>
      <NavBar />

      {/* HEADER */}
      <div className="container-fluid bg-info text-white text-center py-3 shadow-sm">
        <h3 className="fw-bold mb-1">รายละเอียดบิลค่าเช่า</h3>
        <small className="opacity-75">เลขที่บิล {bill.billId}</small>
      </div>

      {/* BODY */}
      <div className="container mt-4">

        {/* USER INFO */}
        <div className="p-3 bg-light border rounded mb-4">
          <div className="row mb-2">
            <div className="col-6 fw-semibold">👤 ชื่อลูกค้า</div>
            <div className="col-6 text-end">{bill.booking.fullName}</div>
          </div>

          <div className="row mb-2">
            <div className="col-6 fw-semibold">🏠 ห้อง</div>
            <div className="col-6 text-end">{bill.room.number}</div>
          </div>

          <div className="row mb-2">
            <div className="col-6 fw-semibold">📅 ประจำเดือน</div>
            <div className="col-6 text-end">{formatThaiDate(bill.month)}</div>
          </div>

          <div className="row">
            <div className="col-6 fw-semibold">📆 วันครบกำหนดชำระ</div>
            <div className="col-6 text-end text-danger">{formatThaiDate(bill.dueDate)}</div>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-responsive mb-3">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-secondary">
              <tr>
                <th className="text-center">รายการ</th>
                <th className="text-center">ครั้งก่อน</th>
                <th className="text-center">ครั้งหลัง</th>
                <th className="text-center">ใช้</th>
                <th className="text-center">ยอดเงิน</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>น้ำ</td>
                <td>{bill.wBefore}</td>
                <td>{bill.wAfter}</td>
                <td>{bill.wUnits}</td>
                <td>{bill.waterCost.toLocaleString()}</td>
              </tr>
              <tr>
                <td>ไฟฟ้า</td>
                <td>{bill.eBefore}</td>
                <td>{bill.eAfter}</td>
                <td>{bill.eUnits}</td>
                <td>{bill.electricCost.toLocaleString()}</td>
              </tr>
              <tr>
                <td>ค่าเช่าห้อง</td>
                <td>-</td><td>-</td><td>-</td>
                <td>{bill.rent.toLocaleString()}</td>
              </tr>
              <tr>
                <td>ค่าส่วนกลาง</td>
                <td>-</td><td>-</td><td>-</td>
                <td>{bill.service.toLocaleString()}</td>
              </tr>
              <tr>
                <td>ค่าปรับ</td>
                <td>-</td><td>-</td><td>-</td>
                <td>{bill.fine.toLocaleString()}</td>
              </tr>
              <tr className="table-light">
                <td className="fw-bold">ยอดรวมทั้งหมด</td>
                <td colSpan={3}></td>
                <td className="fw-bold text-success">{bill.total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* TOTAL TEXT */}
        <p className="text-center fw-semibold text-primary">
          ({thaiNumberText(bill.total)})
        </p>

        {/* BUTTONS */}
        {bill.status === 0 && (
          <div className="row g-3 mt-4 mb-5">
            <div className="col-6">
              <button
                className="btn btn-outline-secondary w-100 py-2 fw-semibold"
                onClick={() => nav("/mybills")}
              >
                ยกเลิก
              </button>
            </div>
            <div className="col-6">
              <button
                className="btn btn-primary w-100 py-2 fw-semibold"
                onClick={() => nav("/payment-choice", { state: bill })}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}