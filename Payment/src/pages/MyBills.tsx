// src/pages/MyBills.tsx
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

  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        if (!token) throw new Error("token not found");

        const unpaidRes = await axios.post(`${API_BASE}/user/bills/unpaid`, {
          accessToken: token,
        });
        const paidRes = await axios.post(`${API_BASE}/user/payments`, {
          accessToken: token,
        });

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

        // ✅ ดึงรายชื่อห้องทั้งหมดไม่ซ้ำกัน
        const uniqueRooms = Array.from(
          new Set(allBills.map((b) => b.room?.number ?? "-"))
        ).filter((r) => r !== "-");
        setRooms(uniqueRooms);

        // ✅ ตั้งค่า default เป็นห้องแรก (ถ้ามี)
        if (uniqueRooms.length > 0) {
          setSelectedRoom(uniqueRooms[0]);
        }

      } catch (err) {
        console.error(err);
        Swal.fire("โหลดข้อมูลล้มเหลว", "กรุณาลองใหม่อีกครั้ง", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ เมื่อเลือกห้องใหม่ ให้กรองบิลของห้องนั้น
  useEffect(() => {
    if (!selectedRoom) {
      setFilteredBills([]);
      return;
    }

    const filtered = bills
      .filter((b) => b.room?.number === selectedRoom)
      .sort(
        (a, b) =>
          new Date(b.month ?? "").getTime() - new Date(a.month ?? "").getTime()
      );

    setFilteredBills(filtered);
  }, [selectedRoom, bills]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3 text-muted">กำลังโหลดข้อมูลบิล...</p>
      </div>
    );

  if (rooms.length === 0)
    return (
      <div className="smartdorm-page text-center justify-content-center">
        <NavBar />
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
      <NavBar />
      <div className="mt-5"></div>

      <div className="text-center mb-3">
        <img
          src="https://smartdorm-admin.biwbong.shop/assets/SmartDorm.png"
          alt="SmartDorm Logo"
          className="smartdorm-logo"
        />
        <h4 className="fw-bold text-success mb-0">🧾 รายการบิลของฉัน</h4>
        <p className="text-muted small mt-1">เลือกห้องเพื่อดูบิลที่เกี่ยวข้อง</p>
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

      {/* 🧾 แสดงรายการบิลของห้องที่เลือก */}
      {filteredBills.length === 0 ? (
        <p className="text-center text-muted">ไม่มีบิลของห้องนี้</p>
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
                borderLeft: b.status === 1 ? "6px solid #28a745" : "6px solid #ffc107",
              }}
            >
              <div className="d-flex justify-content-between align-items-start flex-wrap">
                <div>
                  <h6 className="fw-bold mb-1 text-dark">
                    ห้อง {b.room?.number ?? "-"}
                  </h6>
                  <p className="mb-1 text-muted small">
                    เดือน {formatThaiMonth(b.month)}
                  </p>
                  <p className="mb-1 text-muted small">
                    💰 ยอด {b.total.toLocaleString()} บาท
                  </p>
                  <span
                    className={`badge rounded-pill px-3 py-2 fw-semibold ${
                      b.status === 1
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {b.status === 1 ? "✅ ชำระแล้ว" : "⌛ ยังไม่ชำระ"}
                  </span>
                </div>

                <button
                  className="btn-primary-smart fw-semibold text-white px-3 py-2 mt-2 mt-sm-0"
                  style={{
                    borderRadius: "8px",
                    minWidth: "110px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() =>
                    nav(`/bill/${b.billId}`)
                  }
                >
                  💸 ดูรายละเอียด
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}