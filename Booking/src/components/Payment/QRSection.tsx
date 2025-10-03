import liff from "@line/liff";

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

      // ✅ ถ้าเปิดใน LIFF → แชร์แทนดาวน์โหลด
      if (liff.isInClient()) {
        const base64 = await blob
          .arrayBuffer()
          .then((buf) => btoa(String.fromCharCode(...new Uint8Array(buf))));
        await liff.shareTargetPicker([
          {
            type: "image",
            originalContentUrl: `data:image/png;base64,${base64}`,
            previewImageUrl: `data:image/png;base64,${base64}`,
          },
        ]);
        return;
      }

      // ✅ ถ้าไม่ใช่ LIFF → ดาวน์โหลดปกติ
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
    <div className="p-3 mb-3 rounded shadow-sm text-center"
         style={{ background: "linear-gradient(135deg, #f8f9fa, #e9ecef)" }}>
      <h6 className="fw-semibold mb-2">📲 สแกนเพื่อชำระผ่าน PromptPay</h6>
      <img
        src={qrUrl}
        alt="QR PromptPay"
        width="200"
        className="border rounded shadow-sm my-2"
      />
      <p className="small text-muted">กดปุ่มด้านล่างเพื่อบันทึก QR</p>
      <button
        className="btn w-100 fw-semibold"
        style={{
          background: "linear-gradient(90deg, #42e695, #3bb2b8)",
          color: "black",
        }}
        onClick={() => handleDownload(qrUrl, `PromptPay-${total}.png`)}
      >
        📥 บันทึก QR PromptPay
      </button>
    </div>
  );
}
