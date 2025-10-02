interface Props {
  total: number;
}

export default function PaymentSummary({ total }: Props) {
  return (
    <p className="text-center mb-3">
      ยอดรวมที่ต้องชำระ: <b>{total.toLocaleString()} บาท</b>
    </p>
  );
}
