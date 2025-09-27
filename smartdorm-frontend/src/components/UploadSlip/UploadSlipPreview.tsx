// src/components/UploadSlip/UploadSlipPreview.tsx
import { useEffect, useState } from "react";

interface Props {
  slip: File | null;
}

export default function UploadSlipPreview({ slip }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!slip) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(slip);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [slip]);

  if (!slip) {
    return (
      <div className="text-sm text-gray-500 italic text-center">
        (ยังไม่ได้เลือกไฟล์)
      </div>
    );
  }

  return (
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-600 mb-2">📎 ตัวอย่างสลิป:</p>
      <img
        src={previewUrl || ""}
        alt="Slip Preview"
        className="max-h-64 mx-auto rounded border shadow"
      />
      <p className="text-xs text-gray-500 mt-1">{slip.name}</p>
    </div>
  );
}
