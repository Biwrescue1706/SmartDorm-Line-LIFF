interface Props {
  bank: string;
  account: string;
  owner: string;
  copied: boolean;
  onCopy: () => void;
}

export default function BankAccountCard({
  bank,
  account,
  owner,
  copied,
  onCopy,
}: Props) {
  return (
    <div className="bg-purple-700 text-white rounded-md p-4 mb-6 text-center">
      <h3 className="text-lg font-semibold">{bank}</h3>
      <p className="text-lg">{account}</p>
      <p>{owner}</p>

      <button
        onClick={onCopy}
        className={`w-full mt-4 px-4 py-2 rounded border-2 transition ${
          copied
            ? "bg-emerald-500 text-white border-emerald-500"
            : "border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
        }`}
      >
        {copied ? "คัดลอกแล้ว!" : "คัดลอกบัญชี"}
      </button>
    </div>
  );
}
