export default function AccountCard() {
  const account = "5052997156";
  const bank = "ธนาคารไทยพาณิชย์";
  const owner = "นายภูวณัฐ พาหะละ";

  const handleCopy = () => {
    navigator.clipboard.writeText(account);
    alert("📋 คัดลอกเลขบัญชีเรียบร้อยแล้ว!");
  };

  return (
    <div
      className="p-3 mb-3 rounded shadow-sm text-center"
      style={{ background: "linear-gradient(135deg, #f8f9fa, #e9ecef)", color: "black" }}
    >
      <h5 className="fw-bold">{bank}</h5>
      <p className="mb-1 fw-semibold">เลขที่บัญชี: {account}</p>
      <p className="mb-2">ชื่อบัญชี: {owner}</p>
      <button
        className="btn w-100 fw-semibold"
        style={{
          background: "linear-gradient(90deg, #ffcc70, #ff8177)",
          color: "black",
        }}
        onClick={handleCopy}
      >
        📋 คัดลอกเลขบัญชี
      </button>
    </div>
  );
}
