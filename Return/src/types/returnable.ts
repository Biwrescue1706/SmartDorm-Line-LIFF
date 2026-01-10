// src/types/returnable.ts
export type Room = {
  number: string;
};

export type Booking = {
  bookingId: string;
  createdAt?: string;
  bookingDate?: string;
  checkinAt?: string;
  room?: Room | null;
};
