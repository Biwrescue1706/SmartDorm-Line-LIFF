import { useState } from "react";
import { API_BASE } from "../config";

export function usePayment(total: number) {
  const [copied, setCopied] = useState(false);
  const qrUrl = `${API_BASE}/qr/${total}`;

  const handleCopy = (account: string) => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (filename: string) => {
    try {
      const res = await fetch(qrUrl);
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

  return { qrUrl, copied, handleCopy, handleDownload };
}
