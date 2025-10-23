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
      title: "คัดลอกสำเร็จ!",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <div
      className="p-3 mb-3 rounded shadow-sm text-center"
      style={{
        background: "linear-gradient(135deg, #5d00ff, rgba(155, 197, 238, 1))",
        color: "white",
      }}
    >
      <h5 className="fw-bold">{bank}</h5>
      <p className="mb-1 fw-semibold">เลขที่บัญชี: {account}</p>
      <p className="mb-2">ชื่อบัญชี: {owner}</p>
      <button
        className="btn w-100 fw-semibold"
        style={{
          background: "linear-gradient(90deg, #ffcc70, #ff8177)",
          color: "black",
          border: "none",
          transition: "0.3s",
        }}
        onMouseEnter={
          (e) =>
            (e.currentTarget.style.background =
              "linear-gradient(90deg, #ffcc70, #ff8177)") // hover สีเข้มขึ้น
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background =
            "linear-gradient(90deg, #ffa751, #ff5f6d)")
        }
        onClick={handleCopy}
      >
         คัดลอกเลขบัญชี
      </button>
    </div>
  );
}
