// src/pages/Payments.tsx

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/fetch";

interface Payment {
  id: string;
  billId: string;
  roomNumber: string;
  amount: number;
  method: string;
  status: number; // 0=รอตรวจ,1=ผ่าน,2=ไม่ผ่าน
  createdAt?: string;
}

export default function Payments() {
  const [items, setItems] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Payment[]>("/payment/list");
      setItems(data);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container py-4">
      <h3>Payments</h3>
      {loading ? (
        <div>กำลังโหลด...</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ใบแจ้งหนี้</th>
              <th>ห้อง</th>
              <th>จำนวนเงิน</th>
              <th>วิธีชำระ</th>
              <th>สถานะ</th>
              <th>วันที่</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.billId}</td>
                <td>{p.roomNumber}</td>
                <td>{p.amount.toLocaleString()}</td>
                <td>{p.method}</td>
                <td>
                  {p.status === 0
                    ? "รอตรวจ"
                    : p.status === 1
                    ? "ผ่าน"
                    : "ไม่ผ่าน"}
                </td>
                <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
