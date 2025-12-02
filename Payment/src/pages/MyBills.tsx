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
  status: number; // 0 = unpaid, 1 = paid
  room?: { number?: string };
}

const formatThaiMonth = (d?: string) => {
  if (!d || isNaN(new Date(d).getTime())) return "-";
  const date = new Date(d);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
  });
};

export default function MyBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  // LOAD DATA
useEffect(() => {
  (async () => {
    try {
      const token = await refreshLiffToken();
      if (!token) throw new Error("ไม่พบ token (ต้องเปิดผ่าน LIFF)");

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

      // 🟢 FIX TYPE ERROR HERE
      const unpaidRooms: string[] = Array.from(
        new Set<string>(
          unpaid
            .filter((b: Bill) => b.status === 0)
            .map((b: Bill) => String(b.room?.number ?? "-"))
        )
      ).filter((r) => r !== "-");

      setRooms([...unpaidRooms]);

      if (unpaidRooms.length > 0) {
        setSelectedRoom(String(unpaidRooms[0]));
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "โหลดข้อมูลล้มเหลว",
        text:
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message,
      });
    } finally {
      setLoading(false);
    }
  })();
}, []);

  // ===========================
  // FILTER BILLS BY ROOM + STATUS = 0 (UNPAID)
  // ===========================
  useEffect(() => {
    if (!selectedRoom) return;

    const filtered = bills
      .filter((b) => b.room?.number === selectedRoom && b.status === 0)
      .sort(
        (a, b) =>
          new Date(b.month ?? "").getTime() -
          new Date(a.month ?? "").getTime()
      );

    setFilteredBills(filtered);
  }, [selectedRoom, bills]);

  // ===========================
  // LOADING
  // ===========================
  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3 text-muted">กำลังโหลดข้อมูลบิล...</p>
      </div>
    );

  // ===========================
  // EMPTY (NO UNPAID ROOMS)
  // ===========================
  if (rooms.length === 0)
    return (
      <div className="smartdorm-page text-center">
        <NavBar />
        <div style={{ height: "60px" }}></div>
        <h4 className="text-muted mt-4">ไม่มีบิลค้างชำระ 🎉</h4>
      </div>
    );

  // ===========================
  // MAIN UI
  // ===========================
  return (
    <div className="smartdorm-page pb-4">
      <NavBar />
      <div style={{ height: "60px" }}></div>

      {/* HEADER */}
      <div className="text-center mb-4">
        <h3 className="fw-bold text-success">🧾 รายการบิลที่รอชำระ</h3>
        <small className="text-muted">เลือกห้องเพื่อดูบิล</small>
      </div>

      {/* ROOM SELECT */}
      <div className="container mb-3">
        <select
          className="form-select text-center fw-semibold"
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

      {/* BILL LIST */}
      <div className="container px-3">
        {filteredBills.map((b, i) => (
          <div
            className="card shadow-sm mb-3 border-start border-4 border-success rounded-3"
            key={i}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1">ห้อง {b.room?.number}</h5>
                <p className="text-secondary mb-1">
                  เดือน {formatThaiMonth(b.month)}
                </p>
                <p className="fw-semibold fs-5 text-dark mb-0">
                  💰 {b.total.toLocaleString()} บาท
                </p>
              </div>

              <button
                className="btn btn-success px-3 py-2 fw-semibold"
                onClick={() =>
                  nav("/bill-detail", { state: { billId: b.billId } })
                }
              >
                ชำระบิล
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}