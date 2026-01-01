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
        <optgroup label="บุคคลทั่วไป">
          <option value="ด.ช.">ด.ช.</option>
          <option value="ด.ญ.">ด.ญ.</option>
          <option value="นาย">นาย</option>
          <option value="นาง">นาง</option>
          <option value="น.ส.">น.ส.</option>
        </optgroup>

        {/* ================= รด. ================= */}
        <optgroup label="รด.">
          <option value="ว่าที่ ร.ต.">ว่าที่ ร.ต.</option>
          <option value="ว่าที่ ร.ต.หญิง">ว่าที่ ร.ต.หญิง</option>
        </optgroup>

        {/* ================= วิชาการ ================= */}
        <optgroup label="วิชาการ">
          <option value="ดร.">ดร.</option>
          <option value="ผศ.">ผศ.</option>
          <option value="ผศ.ดร.">ผศ.ดร.</option>
          <option value="รศ.">รศ.</option>
          <option value="รศ.ดร.">รศ.ดร.</option>
          <option value="ศ.">ศ.</option>
          <option value="ศ.ดร.">ศ.ดร.</option>
        </optgroup>

        {/* ================= แพทย์ / สาธารณสุข ================= */}
        <optgroup label="แพทย์ / สาธารณสุข">
          <option value="นพ.">นพ.</option>
          <option value="พญ.">พญ.</option>
          <option value="ทพ.">ทพ.</option>
          <option value="ทพญ.">ทพญ.</option>
          <option value="ภก.">ภก.</option>
          <option value="ภกญ.">ภกญ.</option>
          <option value="พย.">พย.</option>
          <option value="สพ.">สพ.</option>
        </optgroup>
      </select>
    </>
  );
}