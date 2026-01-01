// Booking/src/components/TitleSelect.tsx
interface TitleSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TitleSelect({ value, onChange }: TitleSelectProps) {
  return (
    <>
      <label className="form-label fw-semibold">คำนำหน้า</label>
      <select
        className="form-select mb-3"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- เลือก --</option>

        {/* ================= บุคคลทั่วไป ================= */}
          <option value="ด.ช.">เด็กชาย</option>
          <option value="นาย">นาย</option>
          <option value="ด.ญ.">เด็กหญิง</option>
          <option value="นาง">นาง</option>
          <option value="น.ส.">น.ส.</option>
      </select>
    </>
  );
}