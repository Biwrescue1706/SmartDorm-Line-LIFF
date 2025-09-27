import type { Room } from "../../types/Room";

interface Props {
  room: Room;
}

export default function PaymentSummary({ room }: Props) {
  const total = room.rent + room.deposit + room.bookingFee;

  return (
    <p className="mb-6 text-center">
      ยอดรวมที่ต้องชำระ:{" "}
      <b className="text-emerald-600">{total.toLocaleString()} บาท</b>
    </p>
  );
}
