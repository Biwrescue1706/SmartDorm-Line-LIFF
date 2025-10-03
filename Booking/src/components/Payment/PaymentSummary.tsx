interface Props {
  total: number;
}

export default function PaymentSummary({ total }: Props) {
  return (
    <div
      className="p-3 mb-3 rounded shadow-sm text-center"
      style={{ background: "linear-gradient(135deg, #b1f370ff, #b3efeaff)" }}
    >
      <h5 className="fw-bold mb-2">
        💰 ยอดรวมที่ต้องชำระ {total.toLocaleString()} บาท{" "}
      </h5>
    </div>
  );
}
