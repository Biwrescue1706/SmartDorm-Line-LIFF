// src/components/UploadSlip/UploadSlipForm.tsx
import { useState } from "react";
import UploadSlipPreview from "./UploadSlipPreview";

interface Props {
  onSubmit: (
    cname: string,
    csurname: string,
    cphone: string,
    cmumId: string,
    checkin: string,
    slip: File | null
  ) => void;
  loading: boolean;
  nav: any;
}

export default function UploadSlipForm({ onSubmit, loading, nav }: Props) {
  const [cname, setCname] = useState("");
  const [csurname, setCsurname] = useState("");
  const [cphone, setCphone] = useState("");
  const [cmumId, setCmumId] = useState("");
  const [checkin, setCheckin] = useState("");
  const [slip, setSlip] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(cname, csurname, cphone, cmumId, checkin, slip);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="ชื่อ"
        value={cname}
        onChange={(e) => setCname(e.target.value)}
        required
        className="w-full border rounded px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="นามสกุล"
        value={csurname}
        onChange={(e) => setCsurname(e.target.value)}
        required
        className="w-full border rounded px-3 py-2 text-sm"
      />
      <input
        type="tel"
        placeholder="เบอร์โทร"
        value={cphone}
        onChange={(e) => setCphone(e.target.value)}
        required
        className="w-full border rounded px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="เลขบัตรประชาชน"
        value={cmumId}
        onChange={(e) => setCmumId(e.target.value)}
        required
        className="w-full border rounded px-3 py-2 text-sm"
      />
      <input
        type="date"
        value={checkin}
        onChange={(e) => setCheckin(e.target.value)}
        required
        className="w-full border rounded px-3 py-2 text-sm"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSlip(e.target.files?.[0] || null)}
        required
        className="w-full border rounded px-3 py-2 text-sm"
      />

      {/* preview */}
      <UploadSlipPreview slip={slip} />

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => nav(-1)}
          className="flex-1 bg-red-500 text-white py-2 rounded text-sm"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-600 text-white py-2 rounded text-sm"
        >
          {loading ? "กำลังบันทึก..." : "ยืนยัน"}
        </button>
      </div>
    </form>
  );
}
