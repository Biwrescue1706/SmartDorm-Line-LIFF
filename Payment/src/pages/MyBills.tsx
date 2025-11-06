import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { refreshLiffToken } from "../lib/liff";
import { API_BASE } from "../config";

interface Bill {
  billId: string;
  month: string;
  total: number;
  status: number;
  room: { number: string };
}

const formatThaiMonth = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString("th-TH", { year: "numeric", month: "long" });
};

export default function MyBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) throw new Error("token not found");

        const unpaid = await axios.post(`${API_BASE}/user/bills/unpaid`, {
          accessToken: token,
        });
        const paid = await axios.post(`${API_BASE}/user/payments`, {
          accessToken: token,
        });

        const allBills = [
          ...unpaid.data.bills.map((b: any) => ({ ...b, status: 0 })),
          ...paid.data.bills.map((b: any) => ({ ...b, status: 1 })),
        ];

        setBills(allBills);
      } catch (err) {
        console.error(err);
        Swal.fire("โหลดข้อมูลล้มเหลว", "กรุณาลองใหม่", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3">กำลังโหลดข้อมูลบิล...</p>
      </div>
    );

  if (bills.length === 0)
    return (
      <div className="text-center p-5">
        <h5 className="text-muted">ไม่มีบิลในระบบ</h5>
      </div>
    );

  return (
    <div className="container my-4">
      <h3 className="fw-bold text-center mb-4">🧾 รายการบิลของฉัน</h3>

      <div className="list-group shadow-sm">
        {bills.map((b, i) => (
          <div
            key={i}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            <div>
              <h6 className="fw-bold mb-1">
                ห้อง {b.room.number} — {formatThaiMonth(b.month)}
              </h6>
              <p className="mb-1 text-muted">
                ยอด {b.total.toLocaleString()} บาท
              </p>
              <span
                className={`badge ${
                  b.status === 1 ? "bg-success" : "bg-warning text-dark"
                }`}
              >
                {b.status === 1 ? "ชำระแล้ว" : "ยังไม่ชำระ"}
              </span>
            </div>
            {b.status === 0 && (
              <button
                className="btn btn-sm btn-outline-primary fw-semibold"
                onClick={() => nav("/bill-detail", { state: { billId: b.billId } })}
              >
                💸 ชำระบิล
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
