// src/pages/Returns.tsx

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/fetch";

interface ReturnItem {
  id: string;
  roomNumber: string;
  userName: string;
  returnDate: string;
  status: number; // 0=รอตรวจ, 1=คืนแล้ว
}

export default function Returns() {
  const [items, setItems] = useState<ReturnItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<ReturnItem[]>("/return/list");
      setItems(data);
    } catch (error) {
      console.error("Error loading returns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container py-4">
      <h3>คืนห้อง (Returns)</h3>
      {loading ? (
        <div>กำลังโหลด...</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ห้อง</th>
              <th>ผู้เช่า</th>
              <th>วันที่คืน</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id}>
                <td>{r.roomNumber}</td>
                <td>{r.userName}</td>
                <td>{new Date(r.returnDate).toLocaleDateString()}</td>
                <td>{r.status === 0 ? "รอตรวจ" : "คืนแล้ว"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
