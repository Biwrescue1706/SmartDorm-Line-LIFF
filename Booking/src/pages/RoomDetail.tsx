// src/pages/RoomDetail.tsx
import { useNavigate } from "react-router-dom";
import { useRoomDetail } from "../hooks/useRoomDetail";
import RoomDetailTable from "../components/RoomDetail/RoomDetailTable";

export default function RoomDetail() {
  const nav = useNavigate();
  const { room, roomId, loading, error } = useRoomDetail();

  if (loading) {
    return (
      <div className="container p-4 text-muted">⏳ กำลังโหลดข้อมูลห้อง...</div>
    );
  }

  if (error) {
    return (
      <div className="container p-4 text-danger">
        ❌ {error} (ID: {roomId})
      </div>
    );
  }

  if (!room) {
    return <div className="container p-4">❌ ไม่พบข้อมูลห้อง {roomId}</div>;
  }

  const handleConfirm = () => {
    nav("/payment", { state: room });
  };

  return (
    <div className="container my-4">
      <div
        className="card shadow-sm"
        style={{
          background: "linear-gradient(135deg, #f8f9fa, #e9ecef)", // ✅ ไล่สีเทาอ่อน
        }}
      >
        <div className="card-body">
          <h3 className="text-center mb-4 fw-bold">รายละเอียดห้องพัก</h3>

          {/* ✅ ตารางรายละเอียด */}
          <RoomDetailTable room={room} />

          {/* ✅ ปุ่มอยู่บรรทัดเดียวกัน */}
          <div className="d-flex justify-content-between mt-4 gap-3">
            {/* ปุ่มยกเลิก */}
            <button
              className="btn fw-semibold flex-fill"
              style={{
                background: "linear-gradient(90deg, #ff6b6b, #d6336c)",
                color: "white",
                transition: "0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #d6336c, #a61e4d)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #ff6b6b, #d6336c)")
              }
              onClick={() => nav(-1)}
            >
              ❌ ยกเลิก
            </button>

            {/* ปุ่มยืนยัน */}
            <button
              className="btn fw-semibold flex-fill"
              style={{
                background: "linear-gradient(90deg, #20c997, #0d6efd)",
                color: "white",
                transition: "0.5s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #198754, #0a58ca)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #20c997, #0d6efd)")
              }
              onClick={handleConfirm}
            >
              ✅ ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
