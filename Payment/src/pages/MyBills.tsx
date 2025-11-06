import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { refreshLiffToken } from "../lib/liff";
import { API_BASE } from "../config";
import NavBar from "../components/NavBar"; // ✅ เพิ่มบรรทัดนี้

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
          ...unpaid.data.bills.map((b: any) => ({
            ...b,
            status: 0,
            room: b.room || { number: b.number || "-" }, // ✅ ป้องกัน b.room undefined
          })),
          ...paid.data.bills.map((b: any) => ({
            ...b,
            status: 1,
            room: b.room || { number: b.number || "-" }, // ✅ เช่นเดียวกัน
          })),
        ];

        const sorted = allBills.sort(
          (a, b) => new Date(b.month).getTime() - new Date(a.month).getTime()
        );

        setBills(sorted);
      } catch (err) {
        console.error(err);
        Swal.fire("โหลดข้อมูลล้มเหลว", "กรุณาลองใหม่อีกครั้ง", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3 text-muted">กำลังโหลดข้อมูลบิล...</p>
      </div>
    );

  if (bills.length === 0)
    return (
      <div className="smartdorm-page text-center justify-content-center">
        <NavBar /> {/* ✅ เพิ่ม Navbar */}
        <div className="mt-5"></div>
        <img
          src="https://smartdorm-admin.biwbong.shop/assets/SmartDorm.png"
          alt="SmartDorm Logo"
          className="smartdorm-logo mb-3"
        />
        <h5 className="text-muted">ยังไม่มีบิลในระบบ</h5>
      </div>
    );

  return (
    <div className="smartdorm-page">
      <NavBar /> {/* ✅ แถบ SmartDorm ด้านบน */}
      <div className="mt-5"></div>
      <div className="text-center mb-3">
        <img
          src="https://smartdorm-admin.biwbong.shop/assets/SmartDorm.png"
          alt="SmartDorm Logo"
          className="smartdorm-logo"
        />
        <h4 className="fw-bold text-success mb-0">🧾 รายการบิลของฉัน</h4>
        <p className="text-muted small mt-1">
          ดูบิลทั้งหมดของห้องที่คุณพักอาศัย
        </p>
      </div>
      <div
        className="w-100"
        style={{
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {bills.map((b, i) => (
          <div
            key={i}
            className="smartdorm-card"
            style={{
              borderLeft:
                b.status === 1 ? "6px solid #28a745" : "6px solid #ffc107",
            }}
          >
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <div>
                <h6 className="fw-bold mb-1 text-dark">
                  ห้อง {b.room?.number ?? "-"} — {formatThaiMonth(b.month)}
                </h6>
                <p className="mb-1 text-muted small">
                  💰 ยอดชำระ {b.total.toLocaleString()} บาท
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
                  className="btn-primary-smart fw-semibold text-white px-3 py-2 mt-2 mt-sm-0"
                  style={{
                    borderRadius: "8px",
                    minWidth: "110px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() =>
                    nav("/bill-detail", { state: { billId: b.billId } })
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
