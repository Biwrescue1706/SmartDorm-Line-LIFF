// src/types/All.ts
import type React from "react";

export interface Room {
  roomId: string;
  number: string;
  size: string;
  rent: number;
  deposit: number;
  bookingFee: number;
  status: number;

  lockedUntil?: string | null;
  lockedBy?: string | null;

  [key: string]: unknown;
}

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
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}