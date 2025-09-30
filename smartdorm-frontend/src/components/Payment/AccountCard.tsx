import { useState } from "react";

interface Props {
  account: string;
  bank: string;
  owner: string;
}

export default function AccountCard({ account, bank, owner }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-3 text-white mb-2 text-center" style={{ backgroundColor: "#6819c9ff" }}>
      <h5>{bank}</h5>
      <p>{account}</p>
      <p>{owner}</p>
      <button className="btn btn-outline-success mt-2" onClick={handleCopy}>
        {copied ? "คัดลอกแล้ว!" : "คัดลอกบัญชี"}
      </button>
    </div>
  );
}
