import type { Room } from "../../types/Room";
import RoomCard from "./RoomCard";

interface Props {
  rooms: Room[];
  onSelect: (room: Room) => void;
}

export default function RoomGrid({ rooms, onSelect }: Props) {
  if (rooms.length === 0)
    return <div className="text-center text-muted">ไม่มีห้องให้แสดง</div>;

  return (
    <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-6 g-3">
      {rooms.map((room) => (
        <div key={room.roomId} className="col">
          <RoomCard room={room} onSelect={onSelect} />
        </div>
      ))}
    </div>
  );
}
