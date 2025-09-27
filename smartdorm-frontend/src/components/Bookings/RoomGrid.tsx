import type { Room } from "../../types/Room";
import RoomCard from "./RoomCard";

interface Props {
  rooms: Room[];
  onSelect: (room: Room) => void;
}

export default function RoomGrid({ rooms, onSelect }: Props) {
  if (!rooms.length) {
    return <div className="text-center text-gray-500">ไม่มีห้องว่าง</div>;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {rooms.map((room) => (
        <RoomCard key={room.roomId} room={room} onSelect={onSelect} />
      ))}
    </div>
  );
}
