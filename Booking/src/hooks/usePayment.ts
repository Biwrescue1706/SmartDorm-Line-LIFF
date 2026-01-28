import { useState } from "react";
import { API_BASE } from "../config";

export function usePayment(total: number) {
  const [copied, setCopied] = useState(false);
  const [qrSrc, setQrSrc] = useState<string>("");

  const makeQR = async () => {
    const url = `${API_BASE}/qr/${total}?t=${Date.now()}`;

    try {
      const res = await fetch(url);
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data.qrUrl) {
          setQrSrc(data.qrUrl);
          return;
        }
      }

      setQrSrc(url);
    } catch (err) {
      console.error("สร้าง QR ไม่สำเร็จ", err);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (filename: string) => {
    try {
      const res = await fetch(qrSrc);
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

  return {
    qrSrc,
    makeQR,
    copied,
    handleCopy,
    handleDownload,
  };
}