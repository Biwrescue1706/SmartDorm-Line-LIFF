export interface Room {
  roomId: string;
  number: string;
  size: string;
  rent: number;
  deposit: number;
  bookingFee: number;
  status: number; // 0=ว่าง, 1=จองแล้ว, 2=ไม่ว่าง
}
