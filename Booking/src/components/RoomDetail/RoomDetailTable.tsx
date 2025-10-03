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
          <th style={{ width: "40%" }}>ห้อง</th>
          <td colSpan={2}>{room.number}</td>
        </tr>
        <tr>
          <th>ขนาด</th>
          <td colSpan={2}>{room.size}</td>
        </tr>
        <tr>
          <th>ค่าส่วนกลาง</th>
          <td>20</td>
          <td>บาท</td>
        </tr>
        <tr>
          <th>ค่าไฟฟ้า</th>
          <td>7</td>
          <td>บาท / หน่วย</td>
        </tr>
        <tr>
          <th>ค่าประปา</th>
          <td>19</td>
          <td>บาท / หน่วย</td>
        </tr>
        <tr>
          <th>ราคา</th>
          <td>{room.rent.toLocaleString()}</td>
          <td>บาท</td>
        </tr>
        <tr>
          <th>ประกันห้อง</th>
          <td>{room.deposit.toLocaleString()}</td>
          <td>บาท</td>
        </tr>
        <tr>
          <th>ค่าจองห้อง</th>
          <td>{room.bookingFee.toLocaleString()}</td>
          <td>บาท</td>
        </tr>
        <tr className="table-success fw-bold">
          <th>รวม</th>
          <td className="text-success">{total.toLocaleString()}</td>
          <td>บาท</td>
        </tr>
        <tr>
          <td colSpan={3} className="fst-italic text-muted small text-start">
            ( ค่าเช่ารายเดือนตัดรอบบิลทุกวันที่ 25 ของเดือน <br />
            ราคานี้ยังไม่รวม ค่าส่วนกลาง และค่าน้ำ-ไฟ <br />
            หากชำระเกินวันที่ 5 ของเดือน จะมีค่าปรับ 50 บาท/วัน )
          </td>
        </tr>
      </tbody>
    </table>
  );
}
