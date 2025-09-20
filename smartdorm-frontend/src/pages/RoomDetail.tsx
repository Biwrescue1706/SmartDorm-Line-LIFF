import { useLocation, useNavigate, useParams } from "react-router-dom";

interface Room {
  id: string;
  number: string;
  size: string;
  rent: number;
  deposit: number;
  bookingFee: number;
}

export default function RoomDetail() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const room = state as Room; // ✅ รับจาก Bookings.tsx

  if (!room) {
    return <div className="p-3">ไม่พบข้อมูลห้อง {id}</div>;
  }

  const total = room.rent + room.deposit + room.bookingFee;

  const handleConfirm = () => {
    nav("/payment", { state: room }); // ไปหน้าชำระเงิน
  };

  return (
    <div className="container py-4 text-center">
      <h4 className="mb-3">รายละเอียดห้อง</h4>
      <table className="table text-start">
        <tbody>
          <tr>
            <td>ห้อง</td>
            <td>{room.number}</td>
          </tr>
          <tr>
            <td>ขนาด</td>
            <td>{room.size}</td>
          </tr>
          <tr>
            <td>ราคา</td>
            <td>{room.rent.toLocaleString()}</td>
          </tr>
          <tr>
            <td>ประกันห้อง</td>
            <td>{room.deposit.toLocaleString()}</td>
          </tr>
          <tr>
            <td>ค่าจองห้อง</td>
            <td>{room.bookingFee.toLocaleString()}</td>
          </tr>
          <tr>
            <td>รวม</td>
            <td>{total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div className="d-flex justify-content-around mt-4">
        <button className="btn btn-danger" onClick={() => nav(-1)}>
          ยกเลิก
        </button>
        <button className="btn btn-success" onClick={handleConfirm}>
          ยืนยัน
        </button>
      </div>
    </div>
  );
}
