import type { Room } from "../../types/Room";

interface Props {
  room: Room;
}

export default function RoomDetailTable({ room }: Props) {
  const total = room.rent + room.deposit + room.bookingFee;

  return (
    <table className="table table-bordered align-middle text-center shadow-sm">
      <tbody>
        <tr>
          <th className="text-start w-30">หมายเลขห้อง</th>
          <td colSpan={2}>{room.number}</td>
        </tr>
        <tr>
          <th className="text-start w-30">ขนาดห้อง</th>
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
          <th className="text-start w-30">ค่าน้ำ</th>
          <td>19</td>
          <td>บาท / หน่วย</td>
        </tr>
        <tr>
          <th className="text-start w-30">ค่าเช่า</th>
          <td>{room.rent.toLocaleString("th-TH")}</td>
          <td>บาท</td>
        </tr>
        <tr>
          <th className="text-start w-30">เงินประกัน</th>
          <td>{room.deposit.toLocaleString("th-TH")}</td>
          <td>บาท</td>
        </tr>
        <tr>
          <th className="text-start w-30">ค่าจอง</th>
          <td>{room.bookingFee.toLocaleString("th-TH")}</td>
          <td>บาท</td>
        </tr>
        <tr className="table-success fw-bold">
          <th className="text-start w-30">รวมทั้งหมด</th>
          <td className="text-success">{total.toLocaleString("th-TH")}</td>
          <td>บาท</td>
        </tr>
        <tr>
          <td colSpan={3} className="fst-italic text-muted small text-start">
            ( ตัดรอบบิลทุกวันที่ 25 ของเดือน <br />
            ราคานี้ยังไม่รวมค่าส่วนกลาง, ค่าน้ำ, ค่าไฟ <br />
            หากชำระเกินวันที่ 5 ของเดือน จะมีค่าปรับ 50 บาท/วัน )
          </td>
        </tr>
      </tbody>
    </table>
  );
}
