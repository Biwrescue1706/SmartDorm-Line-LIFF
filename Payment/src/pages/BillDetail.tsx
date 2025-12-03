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

export default function BillDetail() {
  const { state } = useLocation();
  const { billId } = state || {};
  const nav = useNavigate();
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // LOAD BILL DATA -------------------------------------------
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

  // LOADING ---------------------------------------------------
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
        <h5 className="mt-5 text-danger">❌ ไม่พบบิลนี้</h5>
      </div>
    );

  // FINAL UI --------------------------------------------------
  return (
    <div className="smartdorm-page">
      <NavBar />

      {/* HEADER */}
      <h4 className="fw-bold text-center text-success mt-3">
        รายละเอียดบิล SmartDorm
      </h4>
      <p className="text-center text-muted small">เลขที่บิล: {bill.billId}</p>

      {/* CARD */}
      <div
        className="bg-white shadow-sm p-3 mt-3 rounded-4"
        style={{ maxWidth: "520px", margin: "0 auto" }}
      >
        {/* ห้อง / เดือน */}
        <div className="d-flex justify-content-between mb-2">
          <span>🏠 ห้อง</span>
          <span className="fw-semibold">{bill.room.number}</span>
        </div>

        <div className="d-flex justify-content-between mb-3">
          <span>📅 เดือน</span>
          <span>{formatThaiDate(bill.month)}</span>
        </div>

        {/* TABLE */}
        <table className="table text-center align-middle mt-3">
          <thead
            style={{
              background: "#e6e6e6",
              borderRadius: "12px",
              fontSize: "0.95rem",
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
            {/* 💧 น้ำ */}
            <tr>
              <td className="text-start">💧 น้ำ</td>
              <td>{bill.wBefore}</td>
              <td>{bill.wAfter}</td>
              <td>{bill.wUnits}</td>
              <td>{bill.waterCost.toLocaleString()} บาท</td>
            </tr>

            {/* ⚡ ไฟ */}
            <tr>
              <td className="text-start">⚡ ไฟ</td>
              <td>{bill.eBefore}</td>
              <td>{bill.eAfter}</td>
              <td>{bill.eUnits}</td>
              <td>{bill.electricCost.toLocaleString()} บาท</td>
            </tr>

            {/* ค่าเช่า */}
            <tr>
              <td className="text-start">💰 ค่าเช่าห้อง</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>{bill.rent.toLocaleString()} บาท</td>
            </tr>

            {/* ส่วนกลาง */}
            <tr>
              <td className="text-start">🏢 ค่าส่วนกลาง</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>{bill.service.toLocaleString()} บาท</td>
            </tr>

            {/* ค่าปรับ */}
            <tr>
              <td className="text-start">⚠️ ค่าปรับ</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>{bill.fine.toLocaleString()} บาท</td>
            </tr>

            {/* TOTAL */}
            <tr style={{ background: "#fafafa" }}>
              <td className="fw-bold text-start">💵 ยอดรวมทั้งหมด</td>
              <td colSpan={3}></td>
              <td className="fw-bold text-success">
                {bill.total.toLocaleString()} บาท
              </td>
            </tr>
          </tbody>
        </table>

        <div className="fw-semibold text-center mt-2">
          ครบกำหนดชำระ: {formatThaiDate(bill.dueDate)}
        </div>

        {/* BUTTON ZONE */}
        {bill.status === 0 && (
          <div className="d-flex gap-2 mt-4">
            {/* CANCEL */}
            <button
              className="btn btn-outline-danger w-50 fw-semibold py-2"
              style={{ borderRadius: "14px" }}
              onClick={() => nav("/mybills")}
            >
              ยกเลิก
            </button>

            {/* CONFIRM */}
            <button
              className="btn w-50 fw-semibold py-2"
              style={{
                borderRadius: "14px",
                background: "linear-gradient(135deg,#7B2CBF,#4B008A)",
                color: "white",
              }}
              onClick={() => nav("/payment-choice", { state: bill })}
            >
              ยืนยัน
            </button>
          </div>
        )}
      </div>
    </div>
  );
}