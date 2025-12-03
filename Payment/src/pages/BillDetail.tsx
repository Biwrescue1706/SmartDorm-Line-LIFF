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
  waterBefore: number;
  waterAfter: number;
  electricBefore: number;
  electricAfter: number;
  fine: number;
  dueDate: string;
  status: number;
  room: { number: string };
}

// แปลงวันที่แบบ 6 มกราคม 2569
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
        <h5 className="mt-5 text-danger">❌ ไม่พบบิลนี้</h5>
      </div>
    );

  // คำนวณจำนวนหน่วย
  const waterUsed = bill.waterAfter - bill.waterBefore;
  const electricUsed = bill.electricAfter - bill.electricBefore;

  return (
    <div className="smartdorm-page">
      <NavBar />

      {/* HEADER */}
      <h4 className="fw-bold text-center text-success mt-3">
        รายละเอียดบิล SmartDorm
      </h4>
      <p className="text-center text-muted small mb-0">
        เลขที่บิล: {bill.billId}
      </p>

      {/* BODY CARD */}
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

        {/* หัวตารางเหมือนรูปที่ 1 */}
        <div
          className="mt-3 mb-2 p-2 fw-semibold text-center"
          style={{
            background: "#e6e6e6",
            borderRadius: "10px",
            fontSize: "0.95rem",
          }}
        >
          <div className="row">
            <div className="col-4 text-start">รายการ</div>
            <div className="col-3">หลัง</div>
            <div className="col-3">ก่อน</div>
            <div className="col-2">ใช้</div>
          </div>
        </div>

        {/* ค่าน้ำ */}
        <div className="row py-1 border-bottom">
          <div className="col-4">💧 น้ำ</div>
          <div className="col-3 text-center">{bill.waterAfter}</div>
          <div className="col-3 text-center">{bill.waterBefore}</div>
          <div className="col-2 text-center">{waterUsed}</div>
        </div>

        {/* ค่าไฟ */}
        <div className="row py-1 border-bottom">
          <div className="col-4">⚡ ไฟ</div>
          <div className="col-3 text-center">{bill.electricAfter}</div>
          <div className="col-3 text-center">{bill.electricBefore}</div>
          <div className="col-2 text-center">{electricUsed}</div>
        </div>

        <hr />

        {/* ค่าบริการ */}
        <div className="d-flex justify-content-between mb-2">
          <span>💰 ค่าเช่าห้อง</span>
          <span>{bill.rent.toLocaleString()} บาท</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>🏢 ค่าส่วนกลาง</span>
          <span>{bill.service.toLocaleString()} บาท</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>⚠️ ค่าปรับ</span>
          <span>{bill.fine.toLocaleString()} บาท</span>
        </div>

        <hr />

        {/* ยอดรวม */}
        <div className="d-flex justify-content-between fw-bold fs-5">
          <span>💵 ยอดรวมทั้งหมด</span>
          <span className="text-success">
            {bill.total.toLocaleString()} บาท
          </span>
        </div>

        <div className="fw-semibold text-center mt-2">
          ครบกำหนดชำระ: {formatThaiDate(bill.dueDate)}
        </div>

        {/* BUTTON */}
        {bill.status === 0 && (
          <button
            className="btn w-100 fw-semibold py-2 mt-4"
            style={{
              borderRadius: "14px",
              background: "linear-gradient(135deg,#7B2CBF,#4B008A)",
              color: "white",
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