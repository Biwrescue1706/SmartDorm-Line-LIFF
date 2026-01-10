export type Room = {
  number: string;
};

export type Checkout = {
  checkout?: string | null;
  checkoutAt?: string | null;
};

export type Booking = {
  bookingId: string;
  fullName?: string;
  cphone?: string;
  room?: Room | null;

  // รองรับทั้ง backend แบบ flatten และ array
  checkout?: string | null;
  checkouts?: Checkout[];
};
