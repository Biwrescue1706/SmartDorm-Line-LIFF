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

// แปลงวันที่ไทยแบบ "1 ธันวาคม 2568"
const formatThaiDate = (d: string) => {
  const t = new Date(d);
  const months = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
  ];
  return `${t.getDate()} ${months[t.getMonth()]} ${t.getFullYear() + 543}`;
};

// แปลงยอดรวมเป็นข้อความภาษาไทย เช่น 5569 → ห้าพันห้าร้อยหกสิบเก้าบาทถ้วน
const thaiNumberText = (num: number) => {
  const thNum = ["ศูนย์","หนึ่ง","สอง","สาม","สี่","ห้า","หก","เจ็ด","แปด","เก้า"];
  const thDigit = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
  const n = num.toString();
  let txt = "";
  let len = n.length;

  for (let i = 0; i < len; i++) {
    const digit = Number(n[i]);
    if (digit !== 0) {
      txt += thNum[digit] + thDigit[len - i - 1];
    }
  }

  txt = txt.replace("หนึ่งสิบ", "สิบ")
           .replace("สองสิบ", "ยี่สิบ")
           .replace("สิบหนึ่ง", "สิบเอ็ด");

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
        <p className="mt-2 text-muted">กำลังโหลดข้อมูล...</p>
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
          borderBottomLeftRadius: "18px",
          borderBottomRightRadius: "18px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        }}
      >
        <h3 className="fw-bold">รายละเอียดบิลค่าเช่า</h3>
        <p className="mb-0 small">เลขที่บิล {bill.billId}</p>
      </div>

      {/* CONTENT CARD */}
      <div className="container mt-3 mb-5">
        <div className="bg-white shadow p-4 rounded-4 mx-auto" style={{ maxWidth: 520 }}>

          {/* USER INFO BLOCK */}
          <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">
            ข้อมูลผู้เช่า
          </h5>

          <div className="row mb-2">
            <div className="col fw-semibold">👤 ชื่อลูกค้า</div>
            <div className="col text-end">{bill.booking.fullName}</div>
          </div>

          <div className="row mb-2">
            <div className="col fw-semibold">🏠 ห้อง</div>
            <div className="col text-end">{bill.room.number}</div>
          </div>

          <div className="row mb-2">
            <div className="col fw-semibold">📅 ประจำเดือน</div>
            <div className="col text-end">{formatThaiDate(bill.month)}</div>
          </div>

          <div className="row mb-3">
            <div className="col fw-semibold text-danger">⏰ วันครบกำหนดชำระ</div>
            <div className="col text-end text-danger fw-bold">{formatThaiDate(bill.dueDate)}</div>
          </div>

          {/* TABLE BLOCK */}
          <h5 className="fw-bold mt-4 text-primary border-bottom pb-2">
            รายละเอียดค่าใช้จ่าย
          </h5>

          <table className="table table-bordered align-middle text-center mt-2">
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
              <tr>
                <td>ค่าน้ำ</td>
                <td>{bill.wBefore}</td>
                <td>{bill.wAfter}</td>
                <td>{bill.wUnits}</td>
                <td>{bill.waterCost.toLocaleString()}</td>
              </tr>

              <tr>
                <td>ค่าไฟฟ้า</td>
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
            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn px-4 py-2 fw-semibold btn-outline-secondary"
                style={{ borderRadius: "14px" }}
                onClick={() => nav("/mybills")}
              >
                ยกเลิก
              </button>

              <button
                className="btn px-4 py-2 fw-semibold text-white"
                style={{
                  borderRadius: "14px",
                  background: "linear-gradient(135deg,#7B2CBF,#4B008A)",
                  boxShadow: "0 4px 10px rgba(123,44,191,0.4)",
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