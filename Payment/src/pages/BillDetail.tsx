// src/pages/BillDetail.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE } from "../config";
import { refreshLiffToken } from "../lib/liff";
import NavBar from "../components/NavBar"; // ✅ Navbar (auto back)

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 🧩 ถ้าไม่มี billId กลับหน้า MyBills
        if (!billId) {
          Swal.fire("ไม่พบบิล", "กรุณาเลือกบิลจากหน้าเดิมอีกครั้ง", "warning");
          nav("/mybills");
          return;
        }

        const token = await refreshLiffToken();
        if (!token) throw new Error("ไม่มี token (ต้องเปิดผ่าน LIFF)");

        console.log("🔍 กำลังโหลดข้อมูลบิล:", billId);
        const res = await axios.get(`${API_BASE}/bill/${billId}`);
        setBill(res.data);
      } catch (err: any) {
        console.error("❌ โหลดข้อมูลบิลล้มเหลว:", err);
        Swal.fire(
          "❌ โหลดข้อมูลล้มเหลว",
          err.response?.data?.message || "ไม่พบบิลในระบบ",
          "error"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [billId, nav]);

  if (loading)
    return (
      <div className="smartdorm-page text-center justify-content-center">
        <NavBar />
        <div className="mt-5"></div>
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3 text-muted">กำลังโหลดข้อมูล...</p>
      </div>
    );

  if (!bill)
    return (
      <div className="smartdorm-page text-center justify-content-center">
        <NavBar />
        <div className="mt-5"></div>
        <h5 className="text-danger fw-bold">❌ ไม่พบบิลนี้</h5>
      </div>
    );

  return (
    <div className="smartdorm-page">
      <NavBar />
      <div className="mt-4 text-center">
        <h4 className="fw-bold text-success">รายละเอียดบิล SmartDorm</h4>
        <p className="text-muted small mb-0">เลขที่บิล: {bill.billId}</p>
      </div>

      {/* 🔹 กล่องข้อมูลบิล */}
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

        {/* 🔹 ปุ่มชำระเงิน */}
        <div className="mt-4 text-center">
          {bill.status === 0 && (
            <button
              className="btn-primary-smart w-100 fw-semibold py-2"
              onClick={() => nav("/payment-choice", { state: bill })}
            >
              💳 ไปชำระเงิน
            </button>
          )}
        </div>
      </div>
    </div>
  );
}