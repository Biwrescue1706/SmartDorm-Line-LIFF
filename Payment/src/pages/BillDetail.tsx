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

// 📅 แปลงเป็นไทย เช่น 5 มกราคม 2569
const formatThaiDate = (d: string) => {
  const t = new Date(d);
  const months = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
  ];
  return `${t.getDate()} ${months[t.getMonth()]} ${t.getFullYear() + 543}`;
};

// 🔢 แปลงเป็นข้อความไทย เช่น 2,969 → สองพันเก้าร้อยหกสิบเก้าบาทถ้วน
const thaiNumberText = (num: number) => {
  const thNums = ["ศูนย์","หนึ่ง","สอง","สาม","สี่","ห้า","หก","เจ็ด","แปด","เก้า"];
  const thUnits = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
  const n = num.toString().split("").reverse();
  let txt = "";

  for (let i = 0; i < n.length; i++) {
    const digit = Number(n[i]);
    if (digit !== 0) {
      txt = thNums[digit] + thUnits[i] + txt;
    }
  }

  return txt.replace("หนึ่งสิบ", "สิบ").replace("สองสิบ", "ยี่สิบ") + "บาทถ้วน";
};

export default function BillDetail() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { billId } = state || {};
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลบิล
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

  // LOADING UI
  if (loading)
    return (
      <div className="smartdorm-page text-center" style={{ background: "#f6f9ff" }}>
        <NavBar />
        <div style={{ marginTop: "120px" }}>
          <div className="spinner-border text-success" style={{ width: "3rem", height: "3rem" }}></div>
          <p className="mt-3 text-muted fw-semibold">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );

  if (!bill)
    return (
      <div className="text-center">
        <NavBar />
        <h5 className="mt-5 text-danger">❌ ไม่พบบิลนี้</h5>
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
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          color: "white",
          boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
        }}
      >
        <h3 className="fw-bold mb-0">รายละเอียดบิลค่าเช่า</h3>
        <div className="small opacity-75 mt-1">เลขที่บิล {bill.billId}</div>
      </div>

      {/* CARD */}
      <div
        className="bg-white shadow-sm p-4 rounded-4 mt-4"
        style={{ maxWidth: "580px", margin: "0 auto" }}
      >
        {/* USER SECTION */}
        <div
          className="p-3 rounded-3 mb-4"
          style={{ background: "#f3f7ff", borderLeft: "6px solid #3a7afe" }}
        >
          <div className="d-flex justify-content-between">
            <span>👤 ชื่อลูกค้า</span>
            <span className="fw-semibold text-dark">{bill.booking.fullName}</span>
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
            <span className="text-danger fw-semibold">
              {formatThaiDate(bill.dueDate)}
            </span>
          </div>
        </div>

        {/* TABLE */}
        <table className="table align-middle text-center">
          <thead style={{ background: "#eef2ff", fontWeight: 600 }}>
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
              <td className="text-start">น้ำ</td>
              <td>{bill.wBefore}</td>
              <td>{bill.wAfter}</td>
              <td>{bill.wUnits}</td>
              <td>{bill.waterCost.toLocaleString()}</td>
            </tr>

            <tr>
              <td className="text-start">ไฟฟ้า</td>
              <td>{bill.eBefore}</td>
              <td>{bill.eAfter}</td>
              <td>{bill.eUnits}</td>
              <td>{bill.electricCost.toLocaleString()}</td>
            </tr>

            <tr>
              <td className="text-start">ค่าเช่าห้อง</td>
              <td>-</td><td>-</td><td>-</td>
              <td>{bill.rent.toLocaleString()}</td>
            </tr>

            <tr>
              <td className="text-start">ค่าส่วนกลาง</td>
              <td>-</td><td>-</td><td>-</td>
              <td>{bill.service.toLocaleString()}</td>
            </tr>

            <tr>
              <td className="text-start">ค่าปรับ</td>
              <td>-</td><td>-</td><td>-</td>
              <td>{bill.fine.toLocaleString()}</td>
            </tr>

            <tr style={{ background: "#fafcff" }}>
              <td className="fw-bold text-start">ยอดรวมทั้งหมด</td>
              <td colSpan={3}></td>
              <td className="fw-bold text-success">
                {bill.total.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        {/* TOTAL AS TEXT */}
        <p className="text-center mt-1 mb-2 fw-semibold text-primary">
          ({thaiNumberText(bill.total)})
        </p>

        {/* BUTTONS */}
        {bill.status === 0 && (
          <div className="d-flex justify-content-between gap-3 mt-4">
            <button
              className="btn btn-light w-50 py-2 fw-semibold"
              style={{ borderRadius: "14px" }}
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