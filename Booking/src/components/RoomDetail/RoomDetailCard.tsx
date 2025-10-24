import type { Room } from "../../types/Room";
import RoomDetailTable from "./RoomDetailTable";
import { useNavigate } from "react-router-dom";

interface Props {
  room: Room;
}

export default function RoomDetailCard({ room }: Props) {
  const nav = useNavigate();

  /**
   * ✅ เมื่อกด “ยืนยันจอง”
   * - เก็บข้อมูลห้องไว้ใน localStorage (กันหายตอน reload / redirect)
   * - ส่ง room ไปหน้า PaymentChoice ผ่าน state ด้วย
   */
  const handleConfirm = () => {
    localStorage.setItem("selectedRoom", JSON.stringify(room));
    nav("/payment", { state: room });
  };

  /**
   * ❌ เมื่อกด “ยกเลิก”
   * - ลบข้อมูลห้องที่เก็บไว้
   * - กลับหน้าแรก
   */
  const handleCancel = () => {
    localStorage.removeItem("selectedRoom");
    nav("/");
  };

  return (
    <div
      className="card shadow-sm border-0"
      style={{
        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
      }}
    >
      <div className="card-body">
        <h3 className="text-center mb-4 fw-bold">รายละเอียดห้องพัก</h3>

        {/* ตารางรายละเอียดห้อง */}
        <RoomDetailTable room={room} />

        {/* ปุ่มควบคุม */}
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
            onClick={handleCancel}
          >
             ยกเลิก
          </button>

          {/* ปุ่มยืนยันจอง */}
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
             ยืนยันจอง
          </button>
        </div>
      </div>
    </div>
  );
}
