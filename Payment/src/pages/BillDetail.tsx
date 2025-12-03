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

// แปลงวันที่เป็นไทย
const formatThaiDate = (d: string) => {
  const t = new Date(d);
  const months = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
  ];
  return `${t.getDate()} ${months[t.getMonth()]} ${t.getFullYear() + 543}`;
};

// แปลงยอดรวมเป็นข้อความภาษาไทย
const thaiNumberText = (num: number) => {
  const thNum = ["ศูนย์","หนึ่ง","สอง","สาม","สี่","ห้า","หก","เจ็ด","แปด","เก้า"];
  const thDigit = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
  const n = num.toString();
  let txt = "";
  let len = n.length;

  for (let i = 0; i < len; i++) {
    const digit = Number(n[i]);
    if (digit !== 0) txt += thNum[digit] + thDigit[len - i - 1];
  }

  txt = txt.replace("หนึ่งสิบ", "สิบ").replace("สองสิบ", "ยี่สิบ").replace("สิบหนึ่ง", "สิบเอ็ด");
  return txt + "บาทถ้วน";
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
      <div className="text-center">
        <NavBar />
        <div className="spinner-border text-success mt-5"></div>
        <p className="text-muted mt-2">กำลังโหลดข้อมูล...</p>
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
    <div className="smartdorm-page" style={{ background: "#f8fbff", minHeight: "100vh" }}>
      <NavBar />

      {/* HEADER */}
      <div
        className="text-center py-3"
        style={{
          background: "linear-gradient(135deg,#6FF5C2,#38A3FF)",
          color: "white",
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h3 className="fw-bold mb-1">รายละเอียดบิลค่าเช่า</h3>
        <p className="small mb-0">เลขที่บิล {bill.billId}</p>
      </div>

      <div className="container mt-4 mb-5">
        <div className="bg-white shadow p-4 rounded-4 mx-auto" style={{ maxWidth: 520 }}>

          {/* USER INFO */}
          <h5
            className="fw-bold mb-3"
            style={{
              color: "#1b5cb8",
              borderLeft: "6px solid #38A3FF",
              paddingLeft: "10px",
              fontSize: "1.1rem",
            }}
          >
            📌 ข้อมูลผู้เช่า
          </h5>

          <p className="fw-semibold mb-1">👤 ชื่อลูกค้า : {bill.booking.fullName}</p>
          <p className="fw-semibold mb-1">🏠 ห้อง : {bill.room.number}</p>
          <p className="fw-semibold mb-1">📅 ประจำเดือน : {formatThaiDate(bill.month)}</p>
          <p className="fw-semibold text-danger mb-3">⏰ วันครบกำหนดชำระ : {formatThaiDate(bill.dueDate)}</p>

          {/* TABLE */}
          <h5
            className="fw-bold mt-4 mb-2"
            style={{
              color: "#1b5cb8",
              borderLeft: "6px solid #38A3FF",
              paddingLeft: "10px",
              fontSize: "1.1rem",
            }}
          >
            💰 รายละเอียดค่าใช้จ่าย
          </h5>

          <table className="table table-bordered text-center align-middle">
            <thead className="table-light fw-semibold">
              <tr>
                <th>รายการ</th>
                <th>ครั้งก่อน</th>
                <th>ครั้งหลัง</th>
                <th>ใช้</th>
                <th>ยอดเงิน</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>ค่าน้ำ</td><td>{bill.wBefore}</td><td>{bill.wAfter}</td><td>{bill.wUnits}</td><td>{bill.waterCost.toLocaleString()}</td></tr>
              <tr><td>ค่าไฟฟ้า</td><td>{bill.eBefore}</td><td>{bill.eAfter}</td><td>{bill.eUnits}</td><td>{bill.electricCost.toLocaleString()}</td></tr>
              <tr><td>ค่าเช่าห้อง</td><td>-</td><td>-</td><td>-</td><td>{bill.rent.toLocaleString()}</td></tr>
              <tr><td>ค่าส่วนกลาง</td><td>-</td><td>-</td><td>-</td><td>{bill.service.toLocaleString()}</td></tr>
              <tr><td>ค่าปรับ</td><td>-</td><td>-</td><td>-</td><td>{bill.fine.toLocaleString()}</td></tr>

              <tr className="fw-bold table-secondary">
                <td>ยอดรวมทั้งหมด</td>
                <td colSpan={3}></td>
                <td className="text-success">{bill.total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* TOTAL TEXT */}
          <p className="text-center fw-semibold text-primary mt-2">
            ({thaiNumberText(bill.total)})
          </p>

          {/* BUTTONS */}
          {bill.status === 0 && (
            <div className="d-flex justify-content-center gap-4 mt-5">

              {/* CANCEL */}
              <button
                className="btn px-4 py-2 fw-semibold"
                style={{
                  borderRadius: "16px",
                  minWidth: "140px",
                  background: "#fff",
                  border: "2px solid #d1d5db",
                  color: "#374151",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
                }}
                onClick={() => nav("/mybills")}
              >
                ยกเลิก
              </button>

              {/* CONFIRM */}
              <button
                className="btn px-4 py-2 fw-semibold text-white"
                style={{
                  borderRadius: "16px",
                  minWidth: "180px",
                  background: "linear-gradient(135deg,#38A3FF,#7B2CBF)",
                  boxShadow: "0 4px 12px rgba(56,163,255,0.35)",
                }}
                onClick={() => nav("/payment-choice", { state: bill })}
              >
                ยืนยันการชำระเงิน
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}