// src/components/Bookings/RoomCard.tsx
import type { Room } from "../../types/Room";

interface Props {
  room: Room;
  onSelect: (room: Room) => void;
}

export default function RoomCard({ room, onSelect }: Props) {
  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return <span className="badge bg-success">ว่าง</span>;
      case 1:
        return <span className="badge bg-danger">ห้องเต็ม</span>;
      default:
        return <span className="badge bg-dark">-</span>;
    }
  };

  // ✅ ถ้าเต็ม -> ให้ใช้สีเทาอ่อน, ถ้าว่าง -> พื้นหลังขาวปกติ
  const cardClass =
    room.status === 1
      ? "card bg-secondary-subtle shadow-sm text-center h-100"
      : "card bg-light shadow-sm text-center h-100";

  return (
    <div className="col mb-3">
      <div className={cardClass}>
        <div className="card-body">
          <h2 className="card-title ">
            <strong>ห้อง</strong> {room.number}
          </h2>
          <p className="card-text mb-2">
            <h6>
              <strong>ขนาด : </strong> {room.size}{" "}
            </h6>
            <h6>
              <strong>ค่าเช่า : </strong> {room.rent.toLocaleString("th-TH")}{" "}
              บาท{" "}
            </h6>
          </p>
          <div className="mb-3">
            <h5>
              <strong>{renderStatus(room.status)}</strong>
            </h5>
          </div>

          {room.status === 0 && (
            <button
              className="btn fw-semibold w-90"
              style={{
                background: "linear-gradient(90deg, #FFD43B, #00FF66)", // ไล่สีเหลือง→เขียว
                color: "black",
                border: "none",
                transition: "0.3s",
              }}
              onMouseEnter={
                (e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(90deg, #FFC107, #28A745)") // hover สีเข้มขึ้น
              }
              onMouseLeave={
                (e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(90deg, #FFD43B, #00FF66)") // กลับสีเดิม
              }
              onClick={() => onSelect(room)}
            >
              เลือกห้องนี้
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
