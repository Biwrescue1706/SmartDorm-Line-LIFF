import type { Room } from "../../types/Room";

interface Props {
  room: Room;
}

export default function RoomDetailTable({ room }: Props) {
  const total = room.rent + room.deposit + room.bookingFee;

  return (
    <table className="w-full text-left border-collapse">
      <tbody>
        <tr className="border-b">
          <td className="py-2 px-3 font-medium">ห้อง</td>
          <td className="py-2 px-3">{room.number}</td>
        </tr>
        <tr className="border-b">
          <td className="py-2 px-3 font-medium">ขนาด</td>
          <td className="py-2 px-3">{room.size}</td>
        </tr>
        <tr className="border-b">
          <td className="py-2 px-3 font-medium">ราคา</td>
          <td className="py-2 px-3">{room.rent.toLocaleString()}</td>
        </tr>
        <tr className="border-b">
          <td className="py-2 px-3 font-medium">ประกันห้อง</td>
          <td className="py-2 px-3">{room.deposit.toLocaleString()}</td>
        </tr>
        <tr className="border-b">
          <td className="py-2 px-3 font-medium">ค่าจองห้อง</td>
          <td className="py-2 px-3">{room.bookingFee.toLocaleString()}</td>
        </tr>
        <tr>
          <td className="py-2 px-3 font-bold">รวม</td>
          <td className="py-2 px-3 font-bold text-emerald-600">
            {total.toLocaleString()}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
