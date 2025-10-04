import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

interface Room {
  number: string;
  size: string;
}

interface Booking {
  bookingId: string;
  createdAt: string;
  room: Room;
  status: number; // 1 = active
}

export default function CheckoutRequest() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [liffReady, setLiffReady] = useState(false);

  const nav = useNavigate();

  // ✅ โหลด Booking ของผู้ใช้
  const loadBookings = async () => {
    try {
      if (!userId) return;
      const res = await fetch(`${API_BASE}/checkout/myBookings/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("โหลดข้อมูลการจองล้มเหลว");
      const data: Booking[] = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
      Swal.fire("❌", "ไม่สามารถโหลดข้อมูลการจองได้", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ โหลด userId จาก LIFF ที่เก็บใน localStorage
  useEffect(() => {
    const uid = localStorage.getItem("liff_userId");
    if (uid) {
      setUserId(uid);
      setLiffReady(true);
    } else {
      // รอ LIFF init เสร็จ (กรณีหน้าโหลดเร็วกว่า LIFF)
      const checkInterval = setInterval(() => {
        const id = localStorage.getItem("liff_userId");
        if (id) {
          setUserId(id);
          setLiffReady(true);
          clearInterval(checkInterval);
        }
      }, 500);
      return () => clearInterval(checkInterval);
    }
  }, []);

  // ✅ เมื่อได้ userId แล้ว โหลด booking
  useEffect(() => {
    if (liffReady && userId) loadBookings();
  }, [liffReady, userId]);

  // 🚪 ผู้ใช้ส่งคำขอคืนห้อง
  const requestCheckout = async (bookingId: string) => {
    const { value: date } = await Swal.fire({
      title: "📅 เลือกวันที่จะคืนห้อง",
      input: "date",
      inputAttributes: { min: new Date().toISOString().split("T")[0] },
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true,
    });

    if (!date) return;

    try {
      const res = await fetch(`${API_BASE}/checkout/${bookingId}/checkout`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ checkout: date }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      Swal.fire("✅", data.message, "success");
      loadBookings();
    } catch (err: any) {
      Swal.fire("❌", err.message || "เกิดข้อผิดพลาด", "error");
    }
  };

  // ✅ แสดงผลหน้า UI
  return (
    <div className="container py-4">
      <h3 className="mb-3 text-center">🚪 ขอคืนห้องพัก</h3>

      {!liffReady ? (
        <div className="text-center text-muted mt-5">
          ⏳ กำลังเชื่อมต่อกับ LINE...
        </div>
      ) : loading ? (
        <div className="text-center text-muted mt-5">
          ⏳ กำลังโหลดข้อมูล...
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-muted text-center">
          คุณยังไม่มีห้องที่สามารถขอคืนได้
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center align-middle">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>ห้อง</th>
                <th>วันที่จอง</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.bookingId}>
                  <td>{i + 1}</td>
                  <td>{b.room.number}</td>
                  <td>
                    {new Date(b.createdAt).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm fw-semibold"
                      onClick={() => requestCheckout(b.bookingId)}
                    >
                      🚪 ขอคืนห้อง
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={() => nav(-1)}>
          ⬅ กลับ
        </button>
      </div>
    </div>
  );
}
