// src/pages/MyBills.tsx
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
        Swal.fire("โหลดข้อมูลล้มเหลว", "กรุณาลองใหม่อีกครั้ง", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🌀 Loading
  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3 text-muted">กำลังโหลดข้อมูลบิล...</p>
      </div>
    );

  // 🕳️ ไม่มีบิล
  if (bills.length === 0)
    return (
      <div
        className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center"
        style={{
          background: "linear-gradient(135deg, #e0f7fa, #f1fff0)",
        }}
      >
        <img
          src="https://smartdorm-admin.biwbong.shop/assets/SmartDorm.png"
          alt="SmartDorm Logo"
          width={120}
          className="mb-3"
          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}
        />
        <h5 className="text-muted">ยังไม่มีบิลในระบบ</h5>
      </div>
    );

  // ✅ แสดงรายการบิล
  return (
    <div
      className="min-vh-100 py-4"
      style={{
        background: "linear-gradient(135deg, #e0f7fa, #f1fff0)",
      }}
    >
      {/* 🔹 โลโก้ */}
      <div className="text-center mb-4">
        <img
          src="https://smartdorm-admin.biwbong.shop/assets/SmartDorm.png"
          alt="SmartDorm Logo"
          width={120}
          className="mb-2"
          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}
        />
        <h4 className="fw-bold text-success">🧾 รายการบิลของฉัน</h4>
      </div>

      <div className="container">
        {bills.map((b, i) => (
          <div
            key={i}
            className="card mb-3 shadow-sm border-0"
            style={{
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-bold mb-1 text-dark">
                  ห้อง {b.room.number} — {formatThaiMonth(b.month)}
                </h6>
                <p className="mb-1 text-muted">
                  💰 ยอด {b.total.toLocaleString()} บาท
                </p>
                <span
                  className={`badge rounded-pill px-3 py-2 ${
                    b.status === 1
                      ? "bg-success"
                      : "bg-warning text-dark fw-semibold"
                  }`}
                >
                  {b.status === 1 ? "✅ ชำระแล้ว" : "⌛ ยังไม่ชำระ"}
                </span>
              </div>

              {b.status === 0 && (
                <button
                  className="btn fw-semibold text-white px-3 py-2"
                  style={{
                    background: "linear-gradient(90deg, #43cea2, #185a9d)",
                    borderRadius: "8px",
                    transition: "0.2s",
                  }}
                  onClick={() =>
                    nav("/bill-detail", { state: { billId: b.billId } })
                  }
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "linear-gradient(90deg, #74ebd5, #ACB6E5)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "linear-gradient(90deg, #43cea2, #185a9d)")
                  }
                >
                  💸 ชำระบิล
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
