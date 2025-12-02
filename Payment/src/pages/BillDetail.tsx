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
  fine: number;
  dueDate: string;
  status: number;
  room: { number: string };
}

// แปลงเป็น "1 ธันวาคม 2568"
const formatThaiMonth = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
  });
};

// แปลงเป็น "6 มกราคม 2569"
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
  const nav = useNavigate();
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
      } catch (err: any) {
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

  return (
    <div className="smartdorm-page">
      <NavBar />

      {/* HEADER */}
      <div className="mt-4 text-center">
        <h4 className="fw-bold text-success">รายละเอียดบิล SmartDorm</h4>
        <p className="text-muted small mb-0">เลขที่บิล: {bill.billId}</p>
      </div>

      {/* CARD */}
      <div
        className="smartdorm-card shadow-sm mt-3"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <table className="table table-borderless align-middle mb-0">
          <tbody>
            <tr>
              <th className="text-muted w-50">🏠 ห้อง</th>
              <td className="fw-semibold">{bill.room.number}</td>
            </tr>

            <tr>
              <th className="text-muted">📅 เดือน</th>
              <td>1 {formatThaiMonth(bill.month)}</td>
            </tr>

            <tr>
              <th className="text-muted">💰 ค่าเช่าห้อง</th>
              <td>{bill.rent.toLocaleString()} บาท</td>
            </tr>

            <tr>
              <th className="text-muted">💧 ค่าน้ำ</th>
              <td>{bill.waterCost.toLocaleString()} บาท</td>
            </tr>

            <tr>
              <th className="text-muted">⚡ ค่าไฟ</th>
              <td>{bill.electricCost.toLocaleString()} บาท</td>
            </tr>

            <tr>
              <th className="text-muted">🏢 ค่าส่วนกลาง</th>
              <td>{bill.service.toLocaleString()} บาท</td>
            </tr>

            <tr>
              <th className="text-muted">⚠️ ค่าปรับ</th>
              <td>{bill.fine.toLocaleString()} บาท</td>
            </tr>

            <tr>
              <th className="text-muted">🗓️ ครบกำหนดชำระ</th>
              <td>{formatThaiDate(bill.dueDate)}</td>
            </tr>

            <tr className="border-top">
              <th className="fw-bold text-dark">💵 ยอดรวมทั้งหมด</th>
              <td className="fw-bold text-success">
                {bill.total.toLocaleString()} บาท
              </td>
            </tr>
          </tbody>
        </table>

        {/* BUTTON */}
        {bill.status === 0 && (
          <button
            className="btn w-100 fw-semibold py-2 mt-4"
            style={{
              background: "linear-gradient(135deg, #7B2CBF, #4B008A)",
              color: "white",
              borderRadius: "14px",
            }}
            onClick={() => nav("/payment-choice", { state: bill })}
          >
            💳 ไปชำระเงิน
          </button>
        )}
      </div>
    </div>
  );
}