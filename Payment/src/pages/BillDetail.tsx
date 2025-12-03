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

// 📅 แปลงวันที่
const formatThaiDate = (d: string) => {
  const t = new Date(d);
  const months = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
  ];
  return `${t.getDate()} ${months[t.getMonth()]} ${t.getFullYear() + 543}`;
};

// 🔢 แปลงเป็นข้อความเงินไทย
const thaiNumberText = (num: number): string => {
  const thNums = ["ศูนย์","หนึ่ง","สอง","สาม","สี่","ห้า","หก","เจ็ด","แปด","เก้า"];
  const thPlaces = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
  const n = num.toString();
  let txt = "";
  let len = n.length;

  for (let i = 0; i < len; i++) {
    const digit = Number(n[i]);
    if (digit !== 0) txt += thNums[digit] + thPlaces[len - i - 1];
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
        await refreshLiffToken();
        const res = await axios.get(`${API_BASE}/bill/${billId}`);
        setBill(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [billId, nav]);

  if (!bill)
    return <div className="text-center mt-5">❌ ไม่พบบิลนี้</div>;

  return (
    <div className="smartdorm-page" style={{ background: "#F4F7FF", minHeight: "100vh" }}>
      <NavBar />

      {/* HEADER */}
      <div
        className="text-center py-4 mb-4"
        style={{
          background: "linear-gradient(135deg,#6FF5C2,#38A3FF)",
          borderBottomLeftRadius: "18px",
          borderBottomRightRadius: "18px",
          color: "white",
        }}
      >
        <h3 className="fw-bold mb-1" style={{ fontSize: "1.4rem" }}>
          รายละเอียดบิลค่าเช่า
        </h3>
        <div className="small opacity-75">เลขที่บิล {bill.billId}</div>
      </div>

      {/* CARD */}
      <div
        className="bg-white shadow-sm p-4 rounded-4"
        style={{ maxWidth: "580px", margin: "0 auto 80px auto" }}
      >
        {/* SECTION: USER */}
        <div
          className="p-3 rounded-4 mb-4"
          style={{ background: "#F1F5FF", borderLeft: "6px solid #3A7AFE" }}
        >
          <div className="d-flex justify-content-between fw-semibold">
            <span>👤 ชื่อลูกค้า</span>
            <span>{bill.booking.fullName}</span>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <span>🏠 ห้อง</span>
            <span className="fw-semibold">{bill.room.number}</span>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <span>📅 ประจำเดือน</span>
            <span>{formatThaiDate(bill.month)}</span>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <span>📆 วันครบกำหนดชำระ</span>
            <span className="text-danger fw-bold">
              {formatThaiDate(bill.dueDate)}
            </span>
          </div>
        </div>

        {/* TABLE */}
        <div style={{ marginBottom: "25px" }}>
          <table className="table table-bordered text-center align-middle mb-0">
            <thead style={{ background: "#EEF2FF", fontWeight: 600 }}>
              <tr>
                <th>รายการ</th>
                <th>ครั้งก่อน</th>
                <th>ครั้งหลัง</th>
                <th>ใช้</th>
                <th>ยอดเงิน</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>💧 น้ำ</td>
                <td>{bill.wBefore}</td>
                <td>{bill.wAfter}</td>
                <td>{bill.wUnits}</td>
                <td>{bill.waterCost.toLocaleString()}</td>
              </tr>
              <tr>
                <td>⚡ ไฟฟ้า</td>
                <td>{bill.eBefore}</td>
                <td>{bill.eAfter}</td>
                <td>{bill.eUnits}</td>
                <td>{bill.electricCost.toLocaleString()}</td>
              </tr>
              <tr>
                <td>💰 ค่าเช่าห้อง</td><td>-</td><td>-</td><td>-</td>
                <td>{bill.rent.toLocaleString()}</td>
              </tr>
              <tr>
                <td>🏢 ค่าส่วนกลาง</td><td>-</td><td>-</td><td>-</td>
                <td>{bill.service.toLocaleString()}</td>
              </tr>
              <tr>
                <td>⚠️ ค่าปรับ</td><td>-</td><td>-</td><td>-</td>
                <td>{bill.fine.toLocaleString()}</td>
              </tr>

              <tr style={{ background: "#FAFDFF" }}>
                <td className="fw-bold">💵 ยอดรวมทั้งหมด</td>
                <td colSpan={3}></td>
                <td className="fw-bold text-success">{bill.total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* TOTAL TEXT */}
        <p className="text-center text-primary fw-semibold mb-4">
          ({thaiNumberText(bill.total)})
        </p>

        {/* BUTTONS */}
        {bill.status === 0 && (
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn py-2 w-45 fw-semibold"
              style={{ borderRadius: "14px", background: "#E6E6E6" }}
              onClick={() => nav("/mybills")}
            >
              ยกเลิก
            </button>

            <button
              className="btn py-2 w-45 fw-semibold text-white"
              style={{
                borderRadius: "14px",
                background: "linear-gradient(135deg,#7B2CBF,#4B008A)",
                boxShadow: "0 5px 14px rgba(123,44,191,0.35)",
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