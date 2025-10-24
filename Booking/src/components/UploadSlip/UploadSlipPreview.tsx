// src/components/UploadSlipPreview.tsx
interface UploadSlipPreviewProps {
  slip: File | null;
}

export function UploadSlipPreview({ slip }: UploadSlipPreviewProps) {
  if (!slip) return null;

  const imageUrl = URL.createObjectURL(slip);

  return (
    <div className="mt-3 text-center">
      <p className="fw-semibold mb-2">📷 ตัวอย่างสลิป</p>
      <img
        src={imageUrl}
        alt="Slip Preview"
        style={{
          width: "100%",
          maxWidth: "300px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
}
