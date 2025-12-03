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

// เดือน → 1 ธันวาคม 2568
const formatThaiMonth = (d: string) => {
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
      } catch (err) {
        Swal.fire("โหลดข้อมูลล้มเหลว", "ไม่พบบิลในระบบ", "error");
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
        <p>กำลังโหลดข้อมูล...</p>
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

      <div className="text-center mt-4">
        <h4 className="fw-bold text-success">รายละเอียดบิล SmartDorm</h4>
        <p className="text-muted small">เลขที่บิล: {bill.billId}</p>
      </div>

      {/* CARD WITHOUT TABLE */}
      <div
        className="shadow-sm p-4 mt-3"
        style={{
          background: "white",
          borderRadius: "18px",
          maxWidth: "500px",
          margin: "0 auto"
        }}
      >
        {/* ROW */}
        <div className="d-flex justify-content-between mb-2">
          <span>🏠 ห้อง</span>
          <span className="fw-semibold">{bill.room.number}</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>📅 เดือน</span>
          <span>{formatThaiMonth(bill.month)}</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>💰 ค่าเช่าห้อง</span>
          <span>{bill.rent.toLocaleString()} บาท</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>💧 ค่าน้ำ</span>
          <span>{bill.waterCost.toLocaleString()} บาท</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>⚡ ค่าไฟ</span>
          <span>{bill.electricCost.toLocaleString()} บาท</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>🏢 ค่าส่วนกลาง</span>
          <span>{bill.service.toLocaleString()} บาท</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>⚠️ ค่าปรับ</span>
          <span>{bill.fine.toLocaleString()} บาท</span>
        </div>

        {/* TOTAL */}
        <hr />
        <div className="d-flex justify-content-between fw-bold fs-5">
          <span>💵 ยอดรวมทั้งหมด</span>
          <span className="text-success">
            {bill.total.toLocaleString()} บาท
          </span>
        </div>

        {/* DUE DATE */}
        <div className="text-center text-dark mt-3">
          ครบกำหนดชำระ: {formatThaiMonth(bill.dueDate)}
        </div>

        {/* BUTTON */}
        {bill.status === 0 && (
          <button
            className="btn w-100 fw-semibold py-2 mt-4"
            style={{
              background: "linear-gradient(135deg, #7B2CBF, #4B008A)",
              color: "white",
              borderRadius: "14px"
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