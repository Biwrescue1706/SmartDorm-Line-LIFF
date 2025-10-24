import type { Room } from "../../types/Room";

interface Props {
  room: Room;
  onSelect: (room: Room) => void;
}

export default function RoomCard({ room, onSelect }: Props) {
  const isAvailable = room.status === 0;

  const renderStatus = () => {
    switch (room.status) {
      case 0:
        return <span className="badge bg-success">ว่าง</span>;
      case 1:
        return <span className="badge bg-danger">ห้องเต็ม</span>;
      default:
        return <span className="badge bg-secondary">ไม่ทราบ</span>;
    }
  };

  return (
    <div
      className={`card text-center h-100 ${
        isAvailable ? "bg-light" : "bg-body-secondary"
      } shadow-sm border-0`}
    >
      <div className="card-body">
        <h2 className="card-title fw-bold">ห้อง {room.number}</h2>

        <div className="mb-2">
          <small className="text-muted">ขนาด: {room.size}</small>
          <br />
          <small className="text-muted">
            ค่าเช่า: {room.rent.toLocaleString("th-TH")} บาท
          </small>
        </div>

        <div className="mb-3">{renderStatus()}</div>

        {isAvailable ? (
          <button
            className="btn fw-semibold w-100 text-dark"
            style={{
              background: "linear-gradient(90deg, #FFD43B, #00FF66)",
              border: "none",
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #FFC107, #00FF66)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #FFD43B, #00FF66)")
            }
            onClick={() => onSelect(room)}
          >
            เลือกห้องนี้
          </button>
        ) : (
          <button className="btn btn-secondary w-100" disabled>
            ไม่สามารถจองได้
          </button>
        )}
      </div>
    </div>
  );
}
