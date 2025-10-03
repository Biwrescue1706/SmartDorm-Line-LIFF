// src/components/RoomDetail/RoomDetailTable.tsx
import type { Room } from "../../types/Room";

interface Props {
  room: Room;
}

export default function RoomDetailTable({ room }: Props) {
  const total = room.rent + room.deposit + room.bookingFee;

  return (
    <table className="table table-bordered table-striped align-middle text-center shadow-sm">
      <tbody>
        <tr>
          <th className="text-start w-30">ห้อง</th>
          <td colSpan={2}>{room.number}</td>
        </tr>
        <tr>
          <th className="text-start w-30">ขนาด</th>
          <td colSpan={2}>{room.size}</td>
        </tr>
        <tr>
          <th className="text-start w-30">ค่าส่วนกลาง</th>
          <td>50</td>
          <td>บาท</td>
        </tr>
        <tr>
          <th className="text-start w-30">ค่าไฟฟ้า</th>
          <td>7</td>
          <td>บาท / หน่วย</td>
        </tr>
        <tr>
          <th className="text-start w-30">ค่าประปา</th>
          <td>19</td>
          <td>บาท / หน่วย</td>
        </tr>
        <tr>
          <th className="text-start w-30">ราคา</th>
          <td>{room.rent.toLocaleString()}</td>
          <td>บาท</td>
        </tr>
        <tr>
          <th className="text-start w-30">ประกันห้อง</th>
          <td>{room.deposit.toLocaleString()}</td>
          <td>บาท</td>
        </tr>
        <tr>
          <th className="text-start w-30">ค่าจองห้อง</th>
          <td>{room.bookingFee.toLocaleString()}</td>
          <td>บาท</td>
        </tr>
        <tr className="table-success fw-bold">
          <th className="text-start w-30">รวม</th>
          <td className="text-success">{total.toLocaleString()}</td>
          <td>บาท</td>
        </tr>
        <tr>
          <td colSpan={3} className="fst-italic text-muted small text-start">
            ( ค่าเช่ารายเดือนตัดรอบบิลทุกวันที่ 25 ของเดือน <br />
            ราคาในหน้านี้ยังไม่รวม ค่าส่วนกลาง และค่าประปา - ค่าไฟฟ้า <br />
            หากชำระเกินวันที่ 5 ของเดือน จะมีค่าปรับ 50 บาท/วัน )
          </td>
        </tr>
      </tbody>
    </table>
  );
}
