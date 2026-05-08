// Payment/src/pages/BillDetail.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE } from "../config";
import { refreshLiffToken } from "../lib/liff";
import NavBar from "../components/NavBar";

interface BillDetail {
  billId: string;
  month: string;
  total: number;
  rent: number;
  service: number;
  waterCost: number;
  electricCost: number;
  wBefore: number;
  wAfter: number;
  wUnits: number;
  eBefore: number;
  eAfter: number;
  eUnits: number;
  fine: number;
  overdueDays: number;
  dueDate: string;
  billStatus: number;
  room: { number: string };
  booking: { fullName: string };
}

const money = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2 });

const formatThaiDate = (d: string) => {
  const t = new Date(d);
  const m = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
  ];
  return `${t.getDate()} ${m[t.getMonth()]} ${t.getFullYear() + 543}`;
};

const numberToThaiBaht = (num: number) => {
  const th = ["ศูนย์","หนึ่ง","สอง","สาม","สี่","ห้า","หก","เจ็ด","แปด","เก้า"];
  const unit = ["","สิบ","ร้อย","พัน","หมื่น","แสน","ล้าน"];

  const readInt = (n: number) => {
    let s = "";
    const str = n.toString();
    for (let i = 0; i < str.length; i++) {
      const d = parseInt(str[i]);
      const u = unit[str.length - i - 1];
      if (d === 0) continue;
      if (u === "สิบ" && d === 1) s += "สิบ";
      else if (u === "สิบ" && d === 2) s += "ยี่สิบ";
      else if (u === "" && d === 1 && str.length > 1) s += "เอ็ด";
      else s += th[d] + u;
    }
    return s;
  };

  const [i, f] = num.toFixed(2).split(".");
  let result = readInt(parseInt(i)) + "บาท";
  if (f === "00") result += "ถ้วน";
  else result += readInt(parseInt(f)) + "สตางค์";
  return result;
};

export default function BillDetail() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { billId } = state || {};
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!billId) {
          Swal.fire("ไม่พบบิล", "กรุณาเลือกบิลใหม่อีกครั้ง", "warning");
          nav("/mybills");
          return;
        }
        await refreshLiffToken();
        const res = await axios.get(`${API_BASE}/bill/${billId}`);
        setBill(res.data);
      } catch {
        Swal.fire("❌ โหลดข้อมูลล้มเหลว", "ไม่พบบิลในระบบ", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [billId, nav]);

  if (loading)
    return (
      <>
        <NavBar />
        <div className="text-center mt-5 pt-5">
          <div className="spinner-border text-primary"></div>
          <p className="text-muted mt-2">กำลังโหลดข้อมูล...</p>
        </div>
      </>
    );

  if (!bill)
    return (
      <>
        <NavBar />
        <h5 className="text-danger text-center mt-5 pt-5">❌ ไม่พบบิลนี้</h5>
      </>
    );

  const vat = bill.total * 0.07;
  const beforeVat = bill.total - vat;
  const thaiText = numberToThaiBaht(bill.total);

  const rows = [
    ["ค่าน้ำ", bill.wAfter, bill.wBefore, bill.wUnits, bill.waterCost],
    ["ค่าไฟ", bill.eAfter, bill.eBefore, bill.eUnits, bill.electricCost],
    ["ค่าเช่า", "-", "-", "-", bill.rent],
    ["ส่วนกลาง", "-", "-", "-", bill.service],
  ];

  // UI MODERN STYLE VERSION
// เปลี่ยนเฉพาะ return ได้เลย

return (
  <>
    <NavBar />

    <div
      style={{
        minHeight: "100vh",
        background: "#F6F4FA",
        padding: "88px 16px 40px",
      }}
    >
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: "#fff",
            borderRadius: 30,
            padding: 28,
            marginBottom: 20,
            boxShadow: "0 12px 28px rgba(74,0,128,0.08)",
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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#4A0080",
                }}
              >
                🧾 ใบแจ้งหนี้
              </h1>

              <p
                style={{
                  marginTop: 10,
                  marginBottom: 0,
                  color: "#7B7490",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                หอพัก 47/21 ม.1 ต.บ้านสวน
                <br />
                อ.เมืองชลบุรี จ.ชลบุรี
              </p>
            </div>

            <div
              style={{
                background: "#F5EEFC",
                padding: "14px 18px",
                borderRadius: 18,
                minWidth: 240,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#7B7490",
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                เลขที่ใบแจ้งหนี้
              </div>

              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#2D1A47",
                  wordBreak: "break-all",
                }}
              >
                {bill.billId}
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER */}
        <div
          style={{
            background: "#fff",
            borderRadius: 30,
            padding: 26,
            marginBottom: 20,
            boxShadow: "0 12px 28px rgba(74,0,128,0.08)",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: 22,
              color: "#4A0080",
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            👤 ข้อมูลผู้เช่า
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 16,
            }}
          >
            {[
              ["ชื่อผู้เช่า", bill.booking.fullName],
              ["ห้องพัก", bill.room.number],
              ["ประจำเดือน", formatThaiDate(bill.month)],
              ["กำหนดชำระ", formatThaiDate(bill.dueDate)],
            ].map(([label, value], i) => (
              <div
                key={i}
                style={{
                  background: "#FAF9FC",
                  borderRadius: 18,
                  padding: "16px 18px",
                  border: "1px solid #EFE9F7",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#7B7490",
                    marginBottom: 6,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </div>

                <div
                  style={{
                    color: "#2D1A47",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div
          style={{
            background: "#fff",
            borderRadius: 30,
            padding: 24,
            boxShadow: "0 12px 28px rgba(74,0,128,0.08)",
            overflowX: "auto",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: 20,
              color: "#4A0080",
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            📋 รายละเอียดค่าใช้จ่าย
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              overflow: "hidden",
              borderRadius: 18,
              minWidth: 700,
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                  color: "#fff",
                }}
              >
                {[
                  "#",
                  "รายการ",
                  "มิเตอร์ล่าสุด",
                  "มิเตอร์ก่อนหน้า",
                  "หน่วย",
                  "ราคา",
                ].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "16px 14px",
                      fontSize: 14,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={i}
                  style={{
                    background: i % 2 === 0 ? "#FAF9FC" : "#fff",
                  }}
                >
                  <td
                    style={{
                      padding: 14,
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </td>

                  {r.map((c, idx) => (
                    <td
                      key={idx}
                      style={{
                        padding: 14,
                        textAlign: "center",
                        color: "#2D1A47",
                        borderBottom: "1px solid #F1EDF7",
                      }}
                    >
                      {typeof c === "number"
                        ? c.toLocaleString()
                        : c}
                    </td>
                  ))}
                </tr>
              ))}

              {bill.overdueDays > 0 && (
                <tr style={{ background: "#FFF8E8" }}>
                  <td
                    style={{
                      padding: 14,
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    {rows.length + 1}
                  </td>

                  <td
                    style={{
                      padding: 14,
                      textAlign: "center",
                    }}
                  >
                    ค่าปรับ
                  </td>

                  <td
                    colSpan={3}
                    style={{
                      padding: 14,
                      textAlign: "center",
                    }}
                  >
                    ปรับ {bill.overdueDays} วัน
                  </td>

                  <td
                    style={{
                      padding: 14,
                      textAlign: "center",
                      fontWeight: 700,
                      color: "#B45309",
                    }}
                  >
                    {bill.fine.toLocaleString()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* SUMMARY */}
          <div
            style={{
              marginTop: 24,
              background: "#FAF9FC",
              borderRadius: 24,
              padding: 24,
              border: "1px solid #EFE9F7",
            }}
          >
            {[
              ["ราคาก่อน VAT", money(beforeVat)],
              ["VAT 7%", money(vat)],
            ].map(([label, value], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 14,
                  color: "#2D1A47",
                }}
              >
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 18,
                paddingTop: 18,
                borderTop: "1px dashed #D9CFF0",
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#4A0080",
                }}
              >
                รวมทั้งหมด
              </span>

              <span
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#4A0080",
                }}
              >
                ฿ {bill.total.toLocaleString()}
              </span>
            </div>

            <div
              style={{
                marginTop: 18,
                textAlign: "center",
                color: "#7B7490",
                fontSize: 14,
              }}
            >
              ({thaiText})
            </div>
          </div>

          {/* BUTTONS */}
          {bill.billStatus === 0 && (
            <div
              style={{
                display: "flex",
                gap: 14,
                marginTop: 26,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => nav("/mybills")}
                style={{
                  flex: 1,
                  minWidth: 150,
                  padding: "15px",
                  borderRadius: 18,
                  border: "1.5px solid #D9CFF0",
                  background: "#fff",
                  color: "#4A0080",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ยกเลิก
              </button>

              <button
                onClick={() =>
                  nav("/payment-choice", { state: bill })
                }
                style={{
                  flex: 1,
                  minWidth: 150,
                  padding: "15px",
                  borderRadius: 18,
                  border: "none",
                  background:
                    "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow:
                    "0 8px 20px rgba(74,0,128,0.18)",
                }}
              >
                ดำเนินการชำระ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
);