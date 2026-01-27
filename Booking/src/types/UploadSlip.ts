import type { Room } from "./Room";

export interface UseUploadSlipProps {
  room: Room;
  accessToken: string;
}

export interface UseUploadSlipReturn {
  userName: string;

  ctitle: string;
  setCtitle: (v: string) => void;

  cname: string;
  setCname: (v: string) => void;

  csurname: string;
  setCsurname: (v: string) => void;

  cphone: string;
  setCphone: (v: string) => void;

  cmumId: string;
  setCmumId: (v: string) => void;

  checkin: string;
  setCheckin: (v: string) => void;

  slip: File | null;
  setSlip: (f: File | null) => void;

  slipPreviewUrl: string | null;
  loading: boolean;

  todayLocal: () => string;
  handleSubmit: (e: any) => void;
}