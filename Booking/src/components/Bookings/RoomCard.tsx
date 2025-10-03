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
        return <span className="badge bg-danger">จองแล้ว</span>;
      default:
        return <span className="badge bg-dark">-</span>; // กัน error ถ้ามีค่าอื่นหลุดมา
    }
  };

  return (
    <div className="col mb-3">
      <div className="card bg-light shadow-sm text-center h-100">
        <div className="card-body">
          <h5 className="card-title">ห้อง {room.number}</h5>
          <p className="card-text mb-2">
            ขนาด: {room.size} <br />
            ค่าเช่า: {room.rent.toLocaleString("th-TH")} บาท <br />
            มัดจำ: {room.deposit.toLocaleString("th-TH")} บาท
          </p>

          <div className="mb-3">{renderStatus(room.status)}</div>

          {room.status === 0 ? (
            <button
              className="btn btn-success w-100 fw-semibold"
              onClick={() => onSelect(room)}
            >
              เลือกห้องนี้
            </button>
          ) : (
            <button className="btn btn-secondary w-100 fw-semibold" disabled>
              ห้องนี้จองแล้ว
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
