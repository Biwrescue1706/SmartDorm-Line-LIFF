// Payment/src/pages/BillDetail.tsx

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE } from "../config";
import { refreshLiffToken } from "../lib/liff";
import NavBar from "../components/NavBar";

interface BillDetailType {
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
  n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });

const formatThaiDate = (d: string) => {
  const t = new Date(d);

  const m = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  return `${t.getDate()} ${m[t.getMonth()]} ${t.getFullYear() + 543}`;
};

const numberToThaiBaht = (num: number) => {
  const th = [
    "ศูนย์",
    "หนึ่ง",
    "สอง",
    "สาม",
    "สี่",
    "ห้า",
    "หก",
    "เจ็ด",
    "แปด",
    "เก้า",
  ];

  const unit = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

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

  const [bill, setBill] = useState<BillDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!billId) {
          Swal.fire(
            "ไม่พบบิล",
            "กรุณาเลือกบิลใหม่อีกครั้ง",
            "warning"
          );

          nav("/mybills");
          return;
        }

        await refreshLiffToken();

        const res = await axios.get(`${API_BASE}/bill/${billId}`);

        setBill(res.data);
      } catch {
        Swal.fire(
          "❌ โหลดข้อมูลล้มเหลว",
          "ไม่พบบิลในระบบ",
          "error"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [billId, nav]);

  if (loading) {
    return (
      <>
        <NavBar />

        <div
          style={{
            minHeight: "100vh",
            background: "#F6F4FA",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="spinner-border text-primary"></div>

          <p
            style={{
              marginTop: 16,
              color: "#7B7490",
            }}
          >
            กำลังโหลดข้อมูล...
          </p>
        </div>
      </>
    );
  }

  if (!bill) {
    return (
      <>
        <NavBar />

        <div
          style={{
            minHeight: "100vh",
            background: "#F6F4FA",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h4 style={{ color: "#dc3545" }}>
            ❌ ไม่พบบิลนี้
          </h4>
        </div>
      </>
    );
  }

  const vat = bill.total * 0.07;
  const beforeVat = bill.total - vat;
  const thaiText = numberToThaiBaht(bill.total);

  const rows = [
    ["ค่าน้ำ", bill.wAfter, bill.wBefore, bill.wUnits, bill.waterCost],
    ["ค่าไฟ", bill.eAfter, bill.eBefore, bill.eUnits, bill.electricCost],
    ["ค่าเช่า", "-", "-", "-", bill.rent],
    ["ส่วนกลาง", "-", "-", "-", bill.service],
  ];

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
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
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

          {/* DETAIL */}
          <div
            style={{
              background: "#fff",
              borderRadius: 30,
              padding: 24,
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
              📋 รายละเอียดค่าใช้จ่าย
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {rows.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: "#FAF9FC",
                    borderRadius: 22,
                    padding: 18,
                    border: "1px solid #EFE9F7",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#7B7490",
                          marginBottom: 5,
                          fontWeight: 600,
                        }}
                      >
                        รายการ
                      </div>

                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: "#4A0080",
                        }}
                      >
                        {r[0]}
                      </div>
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
                      #{i + 1}
                    </div>
                  </div>

                  {typeof r[1] === "number" && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 10,
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          background: "#fff",
                          borderRadius: 14,
                          padding: 12,
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            color: "#7B7490",
                            marginBottom: 5,
                          }}
                        >
                          มิเตอร์ล่าสุด
                        </div>

                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 18,
                            color: "#2D1A47",
                          }}
                        >
                          {r[1]}
                        </div>
                      </div>

                      <div
                        style={{
                          background: "#fff",
                          borderRadius: 14,
                          padding: 12,
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            color: "#7B7490",
                            marginBottom: 5,
                          }}
                        >
                          มิเตอร์ก่อนหน้า
                        </div>

                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 18,
                            color: "#2D1A47",
                          }}
                        >
                          {r[2]}
                        </div>
                      </div>

                      <div
                        style={{
                          background: "#fff",
                          borderRadius: 14,
                          padding: 12,
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            color: "#7B7490",
                            marginBottom: 5,
                          }}
                        >
                          จำนวนหน่วย
                        </div>

                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 18,
                            color: "#2D1A47",
                          }}
                        >
                          {r[3]}
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      background:
                        "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                      borderRadius: 16,
                      padding: "14px 16px",
                      color: "#fff",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        opacity: 0.9,
                      }}
                    >
                      ราคา
                    </span>

                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                      }}
                    >
                      ฿{" "}
                      {typeof r[4] === "number"
                        ? r[4].toLocaleString()
                        : r[4]}
                    </span>
                  </div>
                </div>
              ))}

              {bill.overdueDays > 0 && (
                <div
                  style={{
                    background: "#FFF8E8",
                    borderRadius: 22,
                    padding: 18,
                    border: "1px solid #FFE2A8",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: "#8C6A00",
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    ค่าปรับ
                  </div>

                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#5B4300",
                      marginBottom: 10,
                    }}
                  >
                    ปรับ {bill.overdueDays} วัน
                  </div>

                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: "#B45309",
                    }}
                  >
                    ฿ {bill.fine.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <span>ราคาก่อน VAT</span>
                <strong>{money(beforeVat)}</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <span>VAT 7%</span>
                <strong>{money(vat)}</strong>
              </div>

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
                    fontSize: 30,
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
                  ย้อนกลับ
                </button>

                <button
                  onClick={() =>
                    nav("/payment-choice", {
                      state: bill,
                    })
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
}