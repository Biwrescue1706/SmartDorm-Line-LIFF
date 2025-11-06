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
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">กำลังโหลดข้อมูล...</p>
      </div>
    );

  return (
    <div className="container my-4">
      <div className="card p-3 shadow-sm">
        <h4 className="fw-bold text-center mb-3">รายละเอียดบิล</h4>
        <table className="table table-sm">
          <tbody>
            <tr>
              <th>ห้อง</th>
              <td>{bill.room.number}</td>
            </tr>
            <tr>
              <th>เดือน</th>
              <td>{formatThaiDate(bill.month)}</td>
            </tr>
            <tr>
              <th>ค่าเช่าห้อง</th>
              <td>{bill.rent.toLocaleString()} บาท</td>
            </tr>
            <tr>
              <th>ค่าน้ำ</th>
              <td>{bill.waterCost.toLocaleString()} บาท</td>
            </tr>
            <tr>
              <th>ค่าไฟ</th>
              <td>{bill.electricCost.toLocaleString()} บาท</td>
            </tr>
            <tr>
              <th>ค่าส่วนกลาง</th>
              <td>{bill.service.toLocaleString()} บาท</td>
            </tr>
            <tr>
              <th>ค่าปรับ</th>
              <td>{bill.fine.toLocaleString()} บาท</td>
            </tr>
            <tr>
              <th>ครบกำหนดชำระ</th>
              <td>{formatThaiDate(bill.dueDate)}</td>
            </tr>
            <tr>
              <th>ยอดรวม</th>
              <td className="fw-bold text-success">
                {bill.total.toLocaleString()} บาท
              </td>
            </tr>
          </tbody>
        </table>

        <div className="text-center mt-3">
          {bill.status === 0 ? (
            <button
              className="btn btn-success w-100 fw-semibold"
              onClick={() => nav("/payment-choice", { state: bill })}
            >
              💳 ไปชำระเงิน
            </button>
          ) : (
            <button className="btn btn-secondary w-100 fw-semibold" disabled>
              ✅ ชำระแล้ว
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
