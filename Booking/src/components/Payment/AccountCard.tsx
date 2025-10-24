import Swal from "sweetalert2";

export default function AccountCard() {
  const account = "5052997156";
  const bank = "ธนาคารไทยพาณิชย์";
  const owner = "นายภูวณัฐ พาหะละ";

  const handleCopy = () => {
    navigator.clipboard.writeText(account);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "คัดลอกเลขบัญชีแล้ว",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <div
      className="p-3 mb-3 rounded shadow-sm text-center text-white"
      style={{
        background: "linear-gradient(135deg, #5d00ff, #9bc5ee)",
      }}
    >
      <h5 className="fw-bold mb-1">{bank}</h5>
      <p className="mb-1 fw-semibold">เลขบัญชี: {account}</p>
      <p className="mb-2">ชื่อบัญชี: {owner}</p>

      <button
        className="btn fw-semibold w-100"
        style={{
          background: "linear-gradient(90deg, #ffcc70, #ff8177)",
          border: "none",
          color: "black",
        }}
        onClick={handleCopy}
      >
        📋 คัดลอกเลขบัญชี
      </button>
    </div>
  );
}
