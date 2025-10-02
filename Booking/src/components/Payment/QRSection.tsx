interface Props {
  qrUrl: string;
  total: number;
}

export default function QRSection({ qrUrl, total }: Props) {
  const handleDownload = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("โหลด QR ล้มเหลว");

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      link.click();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("❌ Error downloading QR:", err);
    }
  };

  return (
    <div className="mb-3 text-center">
      <h6>หรือสแกน QR พร้อมเพย์</h6>
      <img src={qrUrl} alt="QR PromptPay" width="250" />
      <p className="small text-muted">กดปุ่มด้านล่างเพื่อบันทึกรูป</p>
      <button
        className="btn btn-outline-primary mt-2"
        onClick={() => handleDownload(qrUrl, `PromptPay-${total}.png`)}
      >
        บันทึกรูป QR
      </button>
    </div>
  );
}
