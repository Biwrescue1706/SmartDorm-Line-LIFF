interface Props {
  total: number;
}

export default function PaymentSummary({ total }: Props) {
  return (
    <div className="p-3 mb-3 rounded shadow-sm text-center"
         style={{ background: "linear-gradient(135deg, #f8f9fa, #e9ecef)" }}>
      <h5 className="fw-bold mb-2">💰 ยอดรวมที่ต้องชำระ</h5>
      <p className="fs-5 fw-bold text-dark">{total.toLocaleString()} บาท</p>
    </div>
  );
}
