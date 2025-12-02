// Payment/src/pages/MyBills.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { refreshLiffToken } from "../lib/liff";
import { API_BASE } from "../config";
import NavBar from "../components/NavBar";

interface Bill {
  billId: string;
  month?: string;
  total: number;
  status: number;
  room?: { number?: string };
}

const formatThaiMonth = (d?: string) => {
  if (!d || isNaN(new Date(d).getTime())) return "-";
  const date = new Date(d);
  return date.toLocaleDateString("th-TH", { year: "numeric", month: "long" });
};

export default function MyBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  // ✅ โหลดข้อมูลบิลทั้งหมด
  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) throw new Error("ไม่พบ token (ต้องเปิดผ่าน LIFF)");

        // ดึงข้อมูลจาก backend
        const unpaidRes = await axios.post(`${API_BASE}/user/bills/unpaid`, {
          accessToken: token,
        });
        const paidRes = await axios.post(`${API_BASE}/user/payments`, {
          accessToken: token,
        });

        // สร้างข้อมูลบิล
        const unpaid = unpaidRes.data.bills.map((b: any) => ({
          ...b,
          status: 0,
          room: b.room ?? { number: b.roomNumber ?? "-" },
        }));

        const paid = paidRes.data.bills.map((b: any) => ({
          ...b,
          status: 1,
          room: b.room ?? { number: b.roomNumber ?? "-" },
        }));

        const allBills = [...unpaid, ...paid];
        setBills(allBills);

        // ✅ เอาเฉพาะห้องที่ยังมีบิลรอชำระ
        const unpaidRooms = Array.from(
          new Set(
            allBills
              .filter((b) => b.status === 0)
              .map((b) => b.room?.number ?? "-")
          )
        ).filter((r) => r !== "-");

        setRooms(unpaidRooms);
        if (unpaidRooms.length > 0) setSelectedRoom(unpaidRooms[0]);
      } catch (err: any) {
        console.error("❌ โหลดบิลผิดพลาด:", err);
        Swal.fire({
          icon: "error",
          title: "โหลดข้อมูลล้มเหลว",
          text:
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "ไม่พบบิล",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ กรองบิลตามห้องที่เลือก
  useEffect(() => {
    if (!selectedRoom) return;
    const filtered = bills
      .filter((b) => b.room?.number === selectedRoom && b.status === 0)
      .sort(
        (a, b) =>
          new Date(b.month ?? "").getTime() - new Date(a.month ?? "").getTime()
      );
    setFilteredBills(filtered);
  }, [selectedRoom, bills]);

  // ✅ แสดง Loading
  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3 text-muted">กำลังโหลดข้อมูลบิล...</p>
      </div>
    );

  // ✅ ไม่มีบิลเลย
  if (rooms.length === 0)
    return (
      <div className="smartdorm-page text-center justify-content-center">
        <NavBar />
        <div className="mt-5"></div>
        <h5 className="text-muted">ไม่มีบิลที่รอการชำระในระบบ</h5>
      </div>
    );

  return (
    <div className="smartdorm-page">
      <NavBar />
      <div className="mt-5"></div>

      {/* Header */}
      <div className="text-center mb-3">
        <h2 className="fw-bold text-success mb-0">🧾 รายการบิลที่รอชำระ</h2>
        <h3 className="text-muted mt-1">เลือกห้องเพื่อดูบิลของคุณ</h3>
      </div>

      {/* 🔽 Dropdown เลือกห้อง */}
      <div className="text-center mb-3">
        <select
          className="form-select mx-auto"
          style={{ maxWidth: "300px", borderRadius: "8px" }}
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
        >
          {rooms.map((room) => (
            <option key={room} value={room}>
              ห้อง {room}
            </option>
          ))}
        </select>
      </div>

      {/* 🧾 รายการบิล */}
      {filteredBills.length === 0 ? (
        <p className="text-center text-muted">ไม่มีบิลของห้องนี้ที่รอชำระ</p>
      ) : (
        <div
          className="w-100"
          style={{
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {filteredBills.map((b, i) => (
            <div
              key={i}
              className="smartdorm-card"
              style={{
                borderLeft: "6px solid #ffc107",
              }}
            >
              <div className="d-flex justify-content-between align-items-start flex-wrap">
                <div>
                  <h4 className="fw-bold mb-1 text-dark">
                    ห้อง {b.room?.number ?? "-"}
                  </h4>
                  <h4 className="mb-1 text-muted">
                    เดือน {formatThaiMonth(b.month)}
                  </h4>
                  <h4 className="mb-1 text-muted">
                    💰 ยอด {b.total.toLocaleString()} บาท
                  </h4>
                  <span className="badge rounded-pill px-3 py-2 bg-warning text-dark fw-semibold">
                    ⌛ ยังไม่ชำระ
                  </span>
                </div>

                {/* ✅ ปุ่มไปหน้ารายละเอียดบิล */}
                <button
                  className="btn-primary-smart fw-semibold text-white px-3 py-2 mt-2 mt-sm-0"
                  style={{
                    borderRadius: "8px",
                    minWidth: "110px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => nav("/bill-detail", { state: { billId: b.billId } })}
                >
                  💸 ชำระบิล
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}