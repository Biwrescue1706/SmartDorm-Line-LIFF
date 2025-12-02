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
        if (!token) throw new Error("ไม่พบ token");

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

        const allRooms = Array.from(
          new Set(allBills.map((b) => b.room?.number ?? "-"))
        ).filter((r) => r !== "-");

        setRooms(allRooms);
        if (allRooms.length > 0) setSelectedRoom(allRooms[0]);
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "โหลดข้อมูลล้มเหลว",
          text: err.message,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ===========================
  // FILTER
  // ===========================
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
  // EMPTY
  // ===========================
  if (rooms.length === 0)
    return (
      <div className="smartdorm-page text-center justify-content-center">
        <NavBar />
        <div style={{ height: "60px" }}></div>
        <h4 className="text-muted">ยังไม่มีรายการบิลในระบบ</h4>
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
        <h2
          className="fw-bold"
          style={{
            color: "#16a34a",
            letterSpacing: "0.5px",
          }}
        >
          🧾 รายการบิลที่รอชำระ
        </h2>
        <p className="text-secondary" style={{ fontSize: "15px" }}>
          โปรดเลือกห้องที่ต้องการดูบิล
        </p>
      </div>

      {/* ROOM SELECT */}
      <div className="text-center mb-4">
        <select
          className="form-select mx-auto shadow-sm"
          style={{
            maxWidth: "330px",
            borderRadius: "12px",
            padding: "10px 14px",
            fontSize: "15px",
            border: "1px solid #d1d5db",
          }}
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
        </p>
      ) : (
        <div
          className="w-100 mx-auto"
          style={{
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {filteredBills.map((b, i) => (
            <div
              key={i}
              className="shadow-sm"
              style={{
                padding: "18px",
                borderRadius: "16px",
                background: "white",
                borderLeft: "6px solid #facc15",
                boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              }}
            >
              <div className="d-flex justify-content-between flex-wrap">
                <div>
                  <h4
                    className="fw-bold mb-1"
                    style={{ fontSize: "20px", color: "#111827" }}
                  >
                    ห้อง {b.room?.number ?? "-"}
                  </h4>

                  <div className="text-secondary mb-1">
                    เดือน {formatThaiMonth(b.month)}
                  </div>

                  <div
                    className="fw-semibold"
                    style={{ fontSize: "17px", color: "#16a34a" }}
                  >
                    💰 {b.total.toLocaleString()} บาท
                  </div>

                  <span
                    className="badge mt-2"
                    style={{
                      background: "#facc15",
                      color: "#78350f",
                      padding: "6px 12px",
                      fontSize: "13px",
                      borderRadius: "20px",
                    }}
                  >
                    ⌛ ยังไม่ชำระ
                  </span>
                </div>

                {/* BUTTON */}
                <button
                  className="fw-semibold text-white mt-3 mt-sm-0"
                  style={{
                    background:
                      "linear-gradient(90deg, #16a34a 0%, #22c55e 100%)",
                    border: "none",
                    borderRadius: "12px",
                    padding: "10px 18px",
                    fontSize: "15px",
                    minWidth: "120px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                  }}
                  onClick={() =>
                    nav("/bill-detail", { state: { billId: b.billId } })
                  }
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