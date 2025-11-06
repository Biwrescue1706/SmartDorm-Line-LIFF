// src/pages/BillDetail.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE } from "../config";
import { refreshLiffToken } from "../lib/liff";

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

const formatThaiDate = (d: string) =>
  new Date(d).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function BillDetail() {
  const { state } = useLocation();
  const nav = useNavigate();
  const { billId } = state || {};
  const [bill, setBill] = useState<BillDetail | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) throw new Error("ไม่มี token");
        const res = await axios.get(`${API_BASE}/bill/${billId}`);
        setBill(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire("โหลดข้อมูลล้มเหลว", "ไม่พบบิล", "error");
      }
    })();
  }, [billId]);

  if (!bill)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3 text-muted">กำลังโหลดข้อมูล...</p>
      </div>
    );

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center bg-light py-4">
      {/* 🔹 โลโก้ SmartDorm */}
      <div className="text-center mb-4">
        <img
          src="https://smartdorm-admin.biwbong.shop/assets/SmartDorm.png"
          alt="SmartDorm Logo"
          width={120}
          className="mb-2 img-fluid"
          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}
        />
        <h5 className="fw-bold text-success">รายละเอียดบิล SmartDorm</h5>
      </div>

      {/* 🔹 กล่องข้อมูลบิล */}
      <div
        className="card shadow-lg border-0 p-3"
        style={{ maxWidth: "460px", width: "90%", borderRadius: "1rem" }}
      >
        <div className="card-body">
          <table className="table table-borderless align-middle">
            <tbody>
              <tr>
                <th className="text-muted w-50">🏠 ห้อง</th>
                <td className="fw-semibold">{bill.room.number}</td>
              </tr>
              <tr>
                <th className="text-muted">📅 เดือน</th>
                <td>{formatThaiDate(bill.month)}</td>
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

          {/* 🔹 ปุ่ม */}
          <div className="mt-3 text-center">
            {bill.status === 0 ? (
              <button
                className="btn w-100 fw-semibold text-white py-2"
                style={{
                  background: "linear-gradient(90deg, #43cea2, #185a9d)",
                  borderRadius: "8px",
                }}
                onClick={() => nav("/payment-choice", { state: bill })}
              >
                💳 ไปชำระเงิน
              </button>
            ) : (
              <button
                className="btn btn-secondary w-100 fw-semibold py-2"
                style={{ borderRadius: "8px" }}
                disabled
              >
                ✅ ชำระแล้ว
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
