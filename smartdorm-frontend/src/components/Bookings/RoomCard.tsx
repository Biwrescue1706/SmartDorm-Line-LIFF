import type { Room } from "../../types/Room";

interface Props {
  room: Room;
  onSelect: (room: Room) => void;
}

export default function RoomCard({ room, onSelect }: Props) {
  return (
    <button
      key={room.roomId}
      onClick={() => onSelect(room)}
      className="bg-emerald-600 hover:bg-emerald-600 text-white font-semibold rounded-lg py-3 transition transform hover:scale-105"
    >
      {room.number}
    </button>
  );
}
