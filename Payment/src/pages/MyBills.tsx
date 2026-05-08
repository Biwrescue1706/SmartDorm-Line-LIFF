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
  // UI สวยขึ้น + ดู modern + mobile friendly
// เปลี่ยนเฉพาะส่วน return ได้เลย

return (
  <>
    <NavBar />

    <div
      style={{
        minHeight: "100vh",
        background: "#F6F4FA",
        padding: "90px 16px 32px",
      }}
    >
      <div
        style={{
          maxWidth: 430,
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: 22 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 800,
              color: "#4A0080",
            }}
          >
            🧾 บิลค้างชำระ
          </h1>

          <p
            style={{
              marginTop: 8,
              color: "#7B7490",
              fontSize: 14,
            }}
          >
            ตรวจสอบและชำระค่าห้องพักของคุณ
          </p>
        </div>

        {/* ROOM SELECT */}
        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            padding: 18,
            marginBottom: 20,
            boxShadow: "0 10px 24px rgba(74,0,128,0.06)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#7B7490",
              marginBottom: 10,
            }}
          >
            เลือกห้อง
          </div>

          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 16,
              border: "1.5px solid rgba(74,0,128,0.12)",
              outline: "none",
              fontSize: 15,
              fontWeight: 700,
              color: "#2D1A47",
              background: "#FAF9FC",
            }}
          >
            {rooms.map((room) => (
              <option key={room} value={room}>
                ห้อง {room}
              </option>
            ))}
          </select>
        </div>

        {/* BILL LIST */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {filteredBills.map((b, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 28,
                padding: 22,
                boxShadow: "0 10px 28px rgba(74,0,128,0.08)",
                border: "1px solid rgba(74,0,128,0.05)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* TOP BAR */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: 6,
                  background:
                    "linear-gradient(90deg,#4A0080 0%, #7B2BC7 100%)",
                }}
              />

              {/* ROOM */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 18,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#7B7490",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    ห้องพัก
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      color: "#4A0080",
                      fontSize: 30,
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {b.room?.number}
                  </h2>
                </div>

                <div
                  style={{
                    background: "#F5EEFC",
                    color: "#4A0080",
                    padding: "10px 14px",
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  ค้างชำระ
                </div>
              </div>

              {/* MONTH */}
              <div
                style={{
                  background: "#FAF9FC",
                  borderRadius: 18,
                  padding: "14px 16px",
                  border: "1px solid #EFE9F7",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#7B7490",
                    marginBottom: 5,
                    fontWeight: 600,
                  }}
                >
                  เดือน
                </div>

                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#2D1A47",
                  }}
                >
                  {formatThaiMonth(b.month)}
                </div>
              </div>

              {/* PRICE */}
              <div
                style={{
                  background: "#FAF9FC",
                  borderRadius: 18,
                  padding: "18px 16px",
                  border: "1px solid #EFE9F7",
                  marginBottom: 14,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#7B7490",
                    marginBottom: 8,
                    fontWeight: 600,
                  }}
                >
                  ยอดที่ต้องชำระ
                </div>

                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    color: "#4A0080",
                    lineHeight: 1,
                  }}
                >
                  ฿ {b.total.toLocaleString()}
                </div>
              </div>

              {/* DUE DATE */}
              {b.dueDate && (
                <div
                  style={{
                    background: "#FFF8E8",
                    borderRadius: 16,
                    padding: "14px 16px",
                    border: "1px solid #FFE2A8",
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "#8C6A00",
                      marginBottom: 5,
                      fontWeight: 600,
                    }}
                  >
                    กำหนดชำระ
                  </div>

                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#5B4300",
                    }}
                  >
                    {formatThaiDate(b.dueDate)}
                  </div>
                </div>
              )}

              {/* BUTTON */}
              <button
                onClick={() =>
                  nav("/bill-detail", {
                    state: { billId: b.billId },
                  })
                }
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: 18,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: 15,
                  background:
                    "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                  color: "#fff",
                  boxShadow: "0 8px 20px rgba(74,0,128,0.20)",
                }}
              >
                ชำระบิล
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);
}