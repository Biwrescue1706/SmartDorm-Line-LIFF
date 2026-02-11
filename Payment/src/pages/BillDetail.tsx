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

  return (
    <>
      <NavBar />
      <div className="pt-5"></div>

      <div className="pb-5 min-vh-100 bg-light">

        <div className="bg-primary text-white text-center py-4 shadow">
          <h4 className="fw-bold">ใบแจ้งหนี้</h4>
          <small>หอพัก 47/21 ม.1 ต.บ้านสวน อ.เมืองชลบุรี จ.ชลบุรี</small>
          <br />
          <small className="opacity-75">
            เลขที่ใบแจ้งหนี้ : {bill.billId}
          </small>
        </div>

        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-xl-8">

              <div className="bg-white p-4 rounded-4 shadow-sm">

                {/* ผู้เช่า */}
                <h5 className="fw-bold border-start border-4 border-primary ps-2 mb-3">
                  ข้อมูลผู้เช่า
                </h5>

                <p><strong>ชื่อลูกค้า :</strong> {bill.booking.fullName}</p>
                <p><strong>ห้อง :</strong> {bill.room.number}</p>
                <p><strong>ประจำเดือน :</strong> {formatThaiDate(bill.month)}</p>
                <p>
                  <strong>วันครบกำหนด :</strong> {formatThaiDate(bill.dueDate)}
                </p>

                {/* ตาราง */}
                <h5 className="fw-bold border-start border-4 border-primary ps-2 mt-4 mb-3">
                  รายละเอียดค่าใช้จ่าย
                </h5>

                <table
                  className="table table-bordered text-center w-100"
                  style={{ tableLayout: "fixed", fontSize: "13px" }}
                >
                  <thead className="table-light">
                    <tr>
                      <th style={{ wordBreak: "break-word" }}>#</th>
                      <th style={{ wordBreak: "break-word" }}>รายการ</th>
                      <th style={{ wordBreak: "break-word" }}>มิเตอร์ครั้งหลัง</th>
                      <th style={{ wordBreak: "break-word" }}>มิเตอร์ครั้งก่อน</th>
                      <th style={{ wordBreak: "break-word" }}>หน่วยที่ใช้</th>
                      <th style={{ wordBreak: "break-word" }}>ราคา</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        {r.map((c, idx) => (
                          <td key={idx} style={{ wordBreak: "break-word" }}>
                            {typeof c === "number"
                              ? c.toLocaleString()
                              : c}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {bill.overdueDays > 0 && (
                      <tr>
                        <td>{rows.length + 1}</td>
                        <td>ค่าปรับ</td>
                        <td colSpan={3} className="text-center">
                          ปรับ {bill.overdueDays} วัน
                        </td>
                        <td>{bill.fine.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>

                  <tfoot className="fw-semibold">
                    <tr>
                      <td colSpan={5} className="text-end">ก่อน VAT</td>
                      <td>{beforeVat.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="text-end">VAT 7%</td>
                      <td>{vat.toLocaleString()}</td>
                    </tr>
                    <tr className="table-success">
                      <td colSpan={5} className="text-end">รวม</td>
                      <td>{bill.total.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={6} className="text-start">
                        ({thaiText})
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* ปุ่ม */}
                {bill.billStatus === 0 && (
                  <div className="text-center mt-4">
                    <button
                      className="btn btn-outline-secondary me-3"
                      onClick={() => nav("/mybills")}
                    >
                      ยกเลิก
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={() => nav("/payment-choice", { state: bill })}
                    >
                      ยืนยัน
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}