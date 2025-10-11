// src/components/RoomDetail/RoomDetailCard.tsx
import type { Room } from "../../types/Room";
import RoomDetailTable from "./RoomDetailTable";
import { useNavigate } from "react-router-dom";

interface Props {
  room: Room;
}

export default function RoomDetailCard({ room }: Props) {
  const nav = useNavigate();

  const handleConfirm = () => {
    nav("/payment", { state: room });
  };

  return (
    <div
      className="card shadow-sm"
      style={{
        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)", // พื้นหลังเทาไล่สี
      }}
    >
      <div className="card-body">
        <h3 className="text-center mb-4 fw-bold">รายละเอียดห้องพัก</h3>

        {/* ตารางรายละเอียด */}
        <RoomDetailTable room={room} />

        {/* ปุ่ม */}
        <div className="d-flex justify-content-between mt-4 gap-3">
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
            onClick={() => nav("/")}
          >
           ยกเลิก
          </button>

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
           ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}
