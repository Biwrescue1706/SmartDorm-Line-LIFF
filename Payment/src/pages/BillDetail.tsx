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

const formatThaiDate = (d: string) => {
  const t = new Date(d);
  const m = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
  ];
  return `${t.getDate()} ${m[t.getMonth()]} ${t.getFullYear() + 543}`;
};

/* ===================== NUMBER TO THAI BAHT ===================== */
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
      <div className="text-center">
        <NavBar />
        <div className="spinner-border text-primary mt-5"></div>
        <p className="text-muted mt-2">กำลังโหลดข้อมูล...</p>
      </div>
    );

  if (!bill)
    return (
      <div className="text-center">
        <NavBar />
        <h5 className="text-danger mt-5">❌ ไม่พบบิลนี้</h5>
      </div>
    );

  const vat = bill.total * 0.07;
  const beforeVat = bill.total - vat;
  const thaiText = numberToThaiBaht(bill.total);

  // ===== CHECK OVERDUE (แสดงผลเท่านั้น) =====
  const today = new Date();
  const due = new Date(bill.dueDate);
  let isOverdue = false;
  let overdueDays = 0;

  if (bill.billStatus === 0 && today > due) {
    isOverdue = true;
    const diff = today.getTime() - due.getTime();
    overdueDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7FAFC",
        fontFamily: "Prompt, sans-serif",
      }}
    >
      <NavBar />

      {/* HEADER (INVOICE) */}
      <div
        style={{
          marginTop: "65px",
          textAlign: "center",
          padding: "24px 10px",
          background: "#0F3D91",
          color: "white",
          borderBottomLeftRadius: "18px",
          borderBottomRightRadius: "18px",
          boxShadow: "0 3px 12px rgba(0,0,0,0.18)",
        }}
      >
        <h2 style={{ fontWeight: 600 }}>ใบแจ้งหนี้</h2>
        <p style={{ opacity: 0.85, fontSize: "0.95rem" }}>
          หอพัก 47/21 ม.1 ต.บ้านสวน อ.เมืองชลบุรี จ.ชลบุรี
        </p>
        <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>
          เลขที่ใบแจ้งหนี้ : {bill.billId}
        </p>
      </div>

      {/* CARD */}
      <div className="container" style={{ marginTop: "20px", marginBottom: "60px" }}>
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "26px 22px",
            maxWidth: "520px",
            margin: "auto",
            boxShadow: "0 6px 26px rgba(0,0,0,0.06)",
            border: "1px solid #E5E7EB",
          }}
        >
          {/* USER INFO */}
          <h5
            style={{
              fontWeight: 600,
              fontSize: "1.05rem",
              color: "#000000",
              borderLeft: "5px solid #0F3D91",
              paddingLeft: "10px",
              marginBottom: "18px",
            }}
          >
            ข้อมูลผู้เช่า
          </h5>

          <p><strong>ชื่อลูกค้า :</strong> {bill.booking.fullName}</p>
          <p><strong>ห้อง :</strong> {bill.room.number}</p>
          <p><strong>ประจำเดือน :</strong> {formatThaiDate(bill.month)}</p>
          <p style={{ color: isOverdue ? "#D92D20" : "#000000" }}>
            <strong>
              {isOverdue ? `เกินกำหนด ${overdueDays} วัน` : "วันครบกำหนดชำระ"} :
            </strong>{" "}
            {formatThaiDate(bill.dueDate)}
          </p>

          {/* TABLE TITLE */}
          <h5
            style={{
              fontWeight: 600,
              fontSize: "1.05rem",
              color: "#000000",
              borderLeft: "5px solid #0F3D91",
              paddingLeft: "10px",
              margin: "26px 0 14px",
            }}
          >
            รายละเอียดค่าใช้จ่าย
          </h5>

          <table
            className="table"
            style={{
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            <thead style={{ background: "#F1F5F9" }}>
              <tr>
                <th>รายการ</th>
                <th>มิเตอร์เดือนหลัง</th>
                <th>มิเตอร์เดือนก่อน</th>
                <th>จำนวนหน่วยที่ใช้</th>
                <th>จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ค่าน้ำ</td>
                <td>{bill.wAfter}</td>
                <td>{bill.wBefore}</td>
                <td>{bill.wUnits}</td>
                <td>{bill.waterCost.toLocaleString()}</td>
              </tr>
              <tr>
                <td>ค่าไฟฟ้า</td>
                <td>{bill.eAfter}</td>
                <td>{bill.eBefore}</td>
                <td>{bill.eUnits}</td>
                <td>{bill.electricCost.toLocaleString()}</td>
              </tr>
              <tr>
                <td>ค่าเช่า</td>
                <td colSpan={3}>-</td>
                <td className="text-end">{bill.rent.toLocaleString()}</td>
              </tr>
              <tr>
                <td>ค่าส่วนกลาง</td>
                <td colSpan={3}>-</td>
                <td className="text-end">{bill.service.toLocaleString()}</td>
              </tr>
              <tr>
                <td>ค่าปรับ</td>
                {bill.overdueDays > 0 ? (
                  <td colSpan={3}>ปรับ {bill.overdueDays} วัน</td>
                ) : (
                  <td colSpan={3}>-</td>
                )}
                <td className="text-end">{bill.fine.toLocaleString()}</td>
              </tr>
            </tbody>
            <tfoot className="fw-semibold bg-light">
              <tr>
                <td colSpan={4} className="text-end">ราคาก่อนรวมภาษี</td>
                <td className="text-end">{beforeVat.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4} className="text-end">ภาษี 7%</td>
                <td className="text-end">{vat.toFixed(2)}</td>
              </tr>
              <tr className="table-success">
                <td colSpan={4} className="text-end">รวมทั้งหมด</td>
                <td className="text-end">{bill.total.toLocaleString()}</td>
              </tr>
              <tr>
                <td colSpan={5} className="text-start ps-2">({thaiText})</td>
              </tr>
            </tfoot>
          </table>

          {/* BUTTONS */}
          {bill.billStatus === 0 && (
            <div className="d-flex justify-content-center mt-5">
              <button
                className="btn px-4 py-2"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  background: "white",
                  color: "#475569",
                  fontWeight: 500,
                  marginRight: "20px",
                }}
                onClick={() => nav("/mybills")}
              >
                ยกเลิก
              </button>

              <button
                className="btn px-4 py-2"
                style={{
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#1E3A8A,#0F3D91)",
                  fontWeight: 600,
                  boxShadow: "0 4px 10px rgba(15,61,145,0.35)",
                  color: "white",
                }}
                onClick={() => nav("/payment-choice", { state: bill })}
              >
                ยืนยัน
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}