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

// แปลงเป็นวันที่แบบ 6 มกราคม 2569
const formatThaiDate = (d: string) => {
  const t = new Date(d);
  const months = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
  ];
  return `${t.getDate()} ${months[t.getMonth()]} ${t.getFullYear() + 543}`;
};

// แปลงเป็นข้อความภาษาไทย เช่น 5,559 → "ห้าพันห้าร้อยห้าสิบเก้าบาทถ้วน"
const thaiNumberText = (num: number): string => {
  const thNums = ["ศูนย์","หนึ่ง","สอง","สาม","สี่","ห้า","หก","เจ็ด","แปด","เก้า"];
  const thPlaces = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
  const n = num.toString();
  let txt = "";
  let len = n.length;

  for (let i = 0; i < len; i++) {
    const digit = Number(n[i]);
    if (digit !== 0) {
      txt += thNums[digit] + thPlaces[len - i - 1];
    }
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

      {/* HEADER */}
      <div
        className="text-center py-3"
        style={{
          background: "linear-gradient(135deg,#6FF5C2,#38A3FF)",
          borderBottomLeftRadius: "5px",
          borderBottomRightRadius: "5px",
          color: "white",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        }}
      >
        <h3 className="fw-bold mb-1">รายละเอียดบิลค่าเช่า</h3>
        <div className="small opacity-75">เลขที่บิล {bill.billId}</div>
      </div>

      {/* CARD */}
      <div
        className="bg-white shadow-sm p-4 rounded-4 mt-3"
        style={{ maxWidth: "520px", margin: "0 auto" }}
      >
        {/* SECTION: USER */}
        <div
          className="p-3 rounded-3 mb-5 mt-3"
          style={{ background: "#f3f7ff", borderLeft: "6px solid #3a7afe" }}
        >
          <div className="d-flex justify-content-between">
            <span>👤 ชื่อลูกค้า :</span>
            <span className="fw-semibold">{bill.booking.fullName}</span>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <span>🏠 ห้อง :</span>
            <span className="fw-semibold">{bill.room.number}</span>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <span>📅 ประจำเดือน :</span>
            <span>{formatThaiDate(bill.month)}</span>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <span>📆 วันครบกำหนดชำระ :</span>
            <span className="fw-semibold text-danger">{formatThaiDate(bill.dueDate)}</span>
          </div>
        </div>

        {/* TABLE */}
        <table className="table align-middle text-center">
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
              <td className="text-center">น้ำ</td>
              <td className="text-center" >{bill.wBefore}</td>
              <td className="text-center" >{bill.wAfter}</td>
              <td className="text-center" >{bill.wUnits}</td>
              <td>{bill.waterCost.toLocaleString()}</td>
            </tr>

            <tr>
              <td className="text-center">ไฟฟ้า</td>
              <td className="text-center" >{bill.eBefore}</td>
              <td className="text-center" >{bill.eAfter}</td>
              <td className="text-center" >{bill.eUnits}</td>
              <td className="text-center"  >{bill.electricCost.toLocaleString()} </td>
            </tr>

            <tr>
              <td className="text-center">ค่าเช่าห้อง</td>
              <td>-</td><td>-</td><td>-</td>
              <td className="text-center">{bill.rent.toLocaleString()}</td>
            </tr>

            <tr>
              <td className="text-center">ค่าส่วนกลาง</td>
              <td>-</td><td>-</td><td>-</td>
              <td className="text-center">{bill.service.toLocaleString()}</td>
            </tr>

            <tr>
              <td className="text-center">ค่าปรับ</td>
              <td>-</td><td>-</td><td>-</td>
              <td className="text-center">{bill.fine.toLocaleString()}</td>
            </tr>

            <tr style={{ background: "#fafcff" }}>
              <td className="fw-bold text-center">ยอดรวมทั้งหมด</td>
              <td colSpan={3}></td>
              <td className="fw-bold text-success text-center">
                {bill.total.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        {/* TOTAL IN TEXT */}
        <p className="text-center mt-2 fw-semibold text-primary">
          ({thaiNumberText(bill.total)})
        </p>

        {/* BUTTONS */}
        {bill.status === 0 && (
          <div className="d-flex gap-2 mt-4">
            <button
              className="btn w-50 py-2 fw-semibold"
              style={{ borderRadius: "14px", background: "#e8e8e8" }}
              onClick={() => nav("/mybills")}
            >
              ยกเลิก
            </button>

            <button
              className="btn w-50 py-2 fw-semibold text-white"
              style={{
                borderRadius: "14px",
                background: "linear-gradient(135deg,#7B2CBF,#4B008A)",
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