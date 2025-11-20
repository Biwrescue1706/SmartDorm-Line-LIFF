// src/types/Room.ts

export interface Room {
  roomId: string;
  number: string;
  size: string;
  rent: number;
  deposit: number;
  bookingFee: number;
  status: number;

  // 🔥 เพิ่มตรงนี้
  lockedUntil?: string | null;
  lockedBy?: string | null;

  // ถ้ามีฟิลด์อื่นก็ตามของเดิมต่อได้เลย
  [key: string]: any; // ถ้าอยากกัน error ฟิลด์อื่น ๆ
}