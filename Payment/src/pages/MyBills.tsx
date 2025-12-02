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

  // ===========================
  // LOAD DATA
  // ===========================
  useEffect(() => {
    (async () => {
      try {
        const token = await refreshLiffToken();
        console.log("🔥 TOKEN =", token);

        if (!token) throw new Error("ไม่พบ token (ต้องเปิดผ่าน LIFF)");

        const unpaidRes = await axios.post(`${API_BASE}/user/bills/unpaid`, {
          accessToken: token,
        });

        const paidRes = await axios.post(`${API_BASE}/user/payments`, {
          accessToken: token,
        });

        console.log("🔥 UNPAID API →", unpaidRes.data);
        console.log("🔥 PAID API →", paidRes.data);

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
        console.log("🔥 ALL BILLS (unpaid+paid) →", allBills);

        setBills(allBills);

        const allRooms = Array.from(
          new Set(allBills.map((b) => b.room?.number ?? "-"))
        ).filter((r) => r !== "-");

        console.log("🔥 ALL ROOMS →", allRooms);

        setRooms(allRooms);

        if (allRooms.length > 0) setSelectedRoom(allRooms[0]);
        console.log("🔥 SELECTED ROOM =", allRooms[0]);
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

  // ===========================
  // FILTER BILLS
  // ===========================
  useEffect(() => {
    if (!selectedRoom) return;

    console.log("🔥 กำลัง Filter สำหรับห้อง =", selectedRoom);

    const filtered = bills
      .filter((b) => b.room?.number === selectedRoom && b.status === 0)
      .sort(
        (a, b) =>
          new Date(b.month ?? "").getTime() -
          new Date(a.month ?? "").getTime()
      );

    console.log("🔥 FILTERED BILLS →", filtered);

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
  // EMPTY (NO ROOMS)
  // ===========================
  if (rooms.length === 0)
    return (
      <div className="smartdorm-page text-center justify-content-center">
        <NavBar />
        <div style={{ height: "60px" }}></div>
        <h4 className="text-muted">ยังไม่มีรายการบิลในระบบ (rooms empty)</h4>
      </div>
    );

  // ===========================
  // MAIN UI
  // ===========================
  return (
    <div className="smartdorm-page" style={{ paddingBottom: "40px" }}>
      <NavBar />
      <div style={{ height: "60px" }}></div>

      {/* HEADER */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-success">🧾 รายการบิลที่รอชำระ</h2>
        <p className="text-secondary">เลือกห้องเพื่อดูบิล</p>
      </div>

      {/* ROOM SELECT */}
      <div className="text-center mb-4">
        <select
          className="form-select mx-auto"
          style={{ maxWidth: "330px", borderRadius: "12px" }}
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
      {filteredBills.length === 0 ? (
        <p className="text-center text-muted">
          ไม่มีบิลของห้องนี้ที่รอชำระ  
          (filteredBills empty)
        </p>
      ) : (
        <div className="w-100 mx-auto" style={{ maxWidth: "500px" }}>
          {filteredBills.map((b, i) => (
            <div
              key={i}
              className="p-3 mb-3 shadow-sm rounded"
              style={{ borderLeft: "6px solid #facc15" }}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <h4>ห้อง {b.room?.number}</h4>
                  <p>เดือน {formatThaiMonth(b.month)}</p>
                  <p>💰 {b.total} บาท</p>
                </div>

                <button
                  className="btn btn-success"
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
      )}
    </div>
  );
}