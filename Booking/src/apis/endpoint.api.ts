
export const GetAllBooking = `/booking/getall`;
export const CreateBooking = `/booking/create`;

export const GetAllRoom = `/room/getall`;
export const GetRoomById = (id: string) => `/room/${id}`;

export const GeneratePaymentQR = (total: number) => `/qr/${total}`;



