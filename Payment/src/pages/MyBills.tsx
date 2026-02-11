import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { refreshLiffToken } from "../lib/liff";
import { API_BASE } from "../config";
import NavBar from "../components/NavBar";

interface Bill {
  billId: string;
  month: string;
  total: number;
  billStatus: number;
  dueDate: string;
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

// 🟣 ฟังก์ชันแปลงเป็น "5 มกราคม 2569"
const formatThaiDate = (d?: string) => {
  if (!d || isNaN(new Date(d).getTime())) return "-";
  const date = new Date(d);

  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;

  return `${day} ${month} ${year}`;
};

export default function MyBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = "#f7ecff"; // พื้นหลังโทน SCB
  }, []);

  // โหลดข้อมูล ------------------------------------------------
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
  billStatus: 0,
  room: b.room ?? { number: b.roomNumber ?? "-" },
}));

        const paid = paidRes.data.bills.map((b: any) => ({
  ...b,
  billStatus: 1,
  room: b.room ?? { number: b.roomNumber ?? "-" },
}));

        const allBills = [...unpaid, ...paid];
        setBills(allBills);

        // ห้องที่ยังมีบิลค้างชำระเท่านั้น
        const unpaidRooms: string[] = Array.from(
          new Set<string>(
            unpaid.map((b: Bill) => String(b.room?.number ?? "-"))
          )
        ).filter((r) => r !== "-");

        setRooms(unpaidRooms);

        if (unpaidRooms.length > 0) {
          setSelectedRoom(unpaidRooms[0]);
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

  // กรองบิลตามห้อง ------------------------------------------------
  useEffect(() => {
    if (!selectedRoom) return;

    const filtered = bills
      .filter((b) => b.room?.number === selectedRoom && b.billStatus === 0)
      .sort(
        (a, b) =>
          new Date(b.month ?? "").getTime() -
          new Date(a.month ?? "").getTime()
      );

    setFilteredBills(filtered);
  }, [selectedRoom, bills]);

  // LOADING ---------------------------------------------------
  if (loading)
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-success"></div>
        <p className="mt-3 text-muted">กำลังโหลดข้อมูลบิล...</p>
      </div>
    );

  // ไม่มีบิลค้าง ---------------------------------------------------
  if (rooms.length === 0)
    return (
      <div className="smartdorm-page text-center">
        <NavBar />
        <h4 className="text-muted mt-4">ไม่มีบิลค้างชำระ 🎉</h4>
      </div>
    );

  // MAIN UI ---------------------------------------------------
  return (
<>
      <NavBar />
    <div className="smartdorm-page pb-4">

      {/* HEADER */}
      <div className="text-center mb-4 mt-4">
        <h2 className="fw-bold text-dark">🧾 รายการบิลที่รอชำระ</h2>
      </div>

      {/* เลือกห้อง */}
      <div className="container mb-4">
        <select
          className="form-select text-center fw-semibold border-0 shadow-sm py-2"
          style={{
            background: "white",
            borderRadius: "14px",
            color: "#4B008A",
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

      {/* รายการบิล */}
      <div className="container">

        {filteredBills.map((b, i) => (
          <div
            key={i}
            className="card shadow-sm border-0 rounded-4 mb-4 text-center"
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "18px",
            }}
          >
            <div className="card-body">

              {/* ห้อง */}
              <span
                className="badge px-4 py-2 mb-3"
                style={{
                  background: "rgba(123,44,191,0.12)",
                  color: "#7B2CBF",
                  borderRadius: "12px",
                  fontSize: "1rem",
                }}
              >
                ห้อง {b.room?.number}
              </span>

              {/* เดือน */}
              <p className="text-muted mb-1" style={{ fontSize: "1.05rem" }}>
                เดือน {formatThaiMonth(b.month)}
              </p>

              {/* ราคา */}
              <h2 className="fw-bold my-3" style={{ color: "#371B58" }}>
                ฿ {b.total.toLocaleString()}
              </h2>

              {/* กำหนดชำระ */}
              {b.dueDate && (
                <h5 className="fw-bold text-secondary mb-4">
                  กำหนดชำระ : {formatThaiDate(b.dueDate)}
                </h5>
              )}

              {/* ปุ่ม */}
              <button
                className="btn w-100 fw-semibold py-2"
                style={{
                  background: "linear-gradient(135deg, #7B2CBF, #4B008A)",
                  color: "white",
                  borderRadius: "14px",
                }}
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
</>
  );
}