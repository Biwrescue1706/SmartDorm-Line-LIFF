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
  overdueDays : number;
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

const thaiNumberText = (num: number) => {
  const thNum = ["ศูนย์","หนึ่ง","สอง","สาม","สี่","ห้า","หก","เจ็ด","แปด","เก้า"];
  const thDigit = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
  const s = num.toString();
  let txt = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== "0") txt += thNum[+s[i]] + thDigit[s.length - i - 1];
  }
  return txt.replace("หนึ่งสิบ","สิบ")
            .replace("สองสิบ","ยี่สิบ")
            .replace("สิบหนึ่ง","สิบเอ็ด") + "บาทถ้วน";
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7FAFC",
        fontFamily: "Prompt, sans-serif",
      }}
    >
      <NavBar />

      {/* HEADER */}
      <div
        style={{
          marginTop: "65px", // เพิ่มพื้นที่ใต้ NavBar จริง
          textAlign: "center",
          padding: "24px 10px",
          background: "#0F3D91",
          color: "white",
          borderBottomLeftRadius: "18px",
          borderBottomRightRadius: "18px",
          boxShadow: "0 3px 12px rgba(0,0,0,0.18)",
        }}
      >
        <h2 style={{ fontWeight: 600 }}>รายละเอียดบิลค่าเช่า</h2>
        <p style={{ opacity: 0.8, fontSize: "1rem" }}>เลขที่บิล {bill.billId}</p>
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
          <p style={{ color: "#D92D20" }}>
            <strong>วันครบกำหนดชำระ :</strong> {formatThaiDate(bill.dueDate)}
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
    <th style={{ textAlign: "center", verticalAlign: "middle" }}>รายการ</th>
    <th style={{ textAlign: "center", verticalAlign: "middle" }}>มิเตอร์เดือนหลัง</th>
    <th style={{ textAlign: "center", verticalAlign: "middle" }}>มิเตอร์เดือนหลังก่อน</th>
    <th style={{ textAlign: "center", verticalAlign: "middle" }}>จำนวนหน่วยที่ใช้</th>
    <th style={{ textAlign: "center", verticalAlign: "middle" }}>จำนวนเงิน</th>
  </tr>
</thead>
            <tbody>
              <tr>
<td className="text-center" >ค่าน้ำ</td>
<td className="text-center" >{bill.wAfter}</td>
<td className="text-center" >{bill.wBefore}</td>
<td className="text-center" >{bill.wUnits}</td>
<td className="text-center" >{bill.waterCost.toLocaleString()}</td>
</tr>
              <tr>
<td className="text-center" >ค่าไฟฟ้า</td>
<td className="text-center" >{bill.eAfter}</td>
<td className="text-center" >{bill.eBefore}</td>
<td className="text-center" >{bill.eUnits}</td>
<td className="text-center" >{bill.electricCost.toLocaleString()}</td></tr>
              <tr>
<td className="text-center" >ค่าเช่าห้อง</td>
<td className="text-center" >-</td>
<td className="text-center" >-</td>
<td className="text-center" >-</td>
<td className="text-center" >{bill.rent.toLocaleString()}</td>
</tr>
              <tr>
<td className="text-center" >ค่าส่วนกลาง</td>
<td className="text-center" >-</td>
<td className="text-center" >-</td>
<td className="text-center" >-</td>
<td className="text-center" >{bill.service.toLocaleString()}</td>
</tr>
              {/* ค่าปรับ – ผสาน 3 ช่อง */}
  <tr>
    <td className="text-center">ค่าปรับ</td>
                          {bill.overdueDays && bill.overdueDays !== 0 ? (
                        <td colSpan={3}>ปรับ {bill.overdueDays} วัน</td>
                      ) : (
                        <td colSpan={3}>-</td>
                      )}
                      <td className="text-center">
                        {(bill.fine ?? 0).toLocaleString()}
                      </td>
    <td className="text-center">{bill.fine.toLocaleString()}</td>
  </tr>
              {/* ยอดรวม – ผสานฝั่งซ้ายเพิ่ม */}
  <tr style={{ background: "#F8FAFC", fontWeight: 600 }}>
    <td className="text-center" colSpan={4}>
      ยอดรวมทั้งหมด
    </td>
    <td className="text-center" style={{ color: "#000000" }}>
      {bill.total.toLocaleString()}
    </td>
  </tr>
</tbody>
          </table>

          <p className="text-center mt-2" style={{ color: "#000000" }}>
            ({thaiNumberText(bill.total)})
          </p>

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
                  marginRight: "20px", // ระยะห่างปุ่มจริง
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
    color: "white", // บังคับสีตัวหนังสือ
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