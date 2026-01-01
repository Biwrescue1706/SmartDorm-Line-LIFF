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

        {/* ----------------- บุคคลทั่วไป ----------------- */}
        <option value="ด.ช.">ด.ช.</option>
        <option value="ด.ญ.">ด.ญ.</option>
        <option value="นาย">นาย</option>
        <option value="นาง">นาง</option>
        <option value="น.ส.">น.ส.</option>

        {/* ----------------- รด./วิชาการ ----------------- */}
        <option value="ว่าที่ ร.ต.">ว่าที่ ร.ต.</option>
        <option value="ว่าที่ ร.ต.หญิง">ว่าที่ ร.ต.หญิง</option>

        <option value="ดร.">ดร.</option>
        <option value="ผศ.">ผศ.</option>
        <option value="ผศ.ดร.">ผศ.ดร.</option>
        <option value="รศ.">รศ.</option>
        <option value="รศ.ดร.">รศ.ดร.</option>
        <option value="ศ.">ศ.</option>
        <option value="ศ.ดร.">ศ.ดร.</option>

        {/* ----------------- แพทย์ ----------------- */}
        <option value="นพ.">นพ.</option>
        <option value="พญ.">พญ.</option>

        {/* ----------------- ตำรวจ ----------------- */}
        {/* บก */}
        <option value="ส.ต.ต.">ส.ต.ต.</option>
        <option value="ส.ต.ต.หญิง">ส.ต.ต.หญิง</option>
        <option value="ส.ต.ท.">ส.ต.ท.</option>
        <option value="ส.ต.ท.หญิง">ส.ต.ท.หญิง</option>
        <option value="ส.ต.อ.">ส.ต.อ.</option>
        <option value="ส.ต.อ.หญิง">ส.ต.อ.หญิง</option>

        <option value="จ.ส.ต.">จ.ส.ต.</option>
        <option value="จ.ส.ต.หญิง">จ.ส.ต.หญิง</option>
        <option value="จ.ส.ท.">จ.ส.ท.</option>
        <option value="จ.ส.ท.หญิง">จ.ส.ท.หญิง</option>
        <option value="จ.ส.อ.">จ.ส.อ.</option>
        <option value="จ.ส.อ.หญิง">จ.ส.อ.หญิง</option>

        <option value="ด.ต.">ด.ต.</option>
        <option value="ด.ต.หญิง">ด.ต.หญิง</option>

        <option value="ร.ต.ต.">ร.ต.ต.</option>
        <option value="ร.ต.ต.หญิง">ร.ต.ต.หญิง</option>
        <option value="พ.ต.ต.">พ.ต.ต.</option>
        <option value="พ.ต.ต.หญิง">พ.ต.ต.หญิง</option>
        <option value="พล.ต.ต.">พล.ต.ต.</option>
        <option value="พล.ต.ต.หญิง">พล.ต.ต.หญิง</option>

        {/* อากาศ */}
        <option value="ส.อ.อากาศ">ส.อ.อากาศ</option>
        <option value="ส.อ.อากาศหญิง">ส.อ.อากาศหญิง</option>
        <option value="ส.ท.อากาศ">ส.ท.อากาศ</option>
        <option value="ส.ท.อากาศหญิง">ส.ท.อากาศหญิง</option>
        <option value="ร.ต.อ.อากาศ">ร.ต.อ.อากาศ</option>
        <option value="ร.ต.อ.อากาศหญิง">ร.ต.อ.อากาศหญิง</option>

        {/* น้ำ */}
        <option value="ส.อ.น้ำ">ส.อ.น้ำ</option>
        <option value="ส.อ.น้ำหญิง">ส.อ.น้ำหญิง</option>
        <option value="ร.ต.อ.น้ำ">ร.ต.อ.น้ำ</option>
        <option value="ร.ต.อ.น้ำหญิง">ร.ต.อ.น้ำหญิง</option>

        {/* ----------------- ทหาร ----------------- */}
        {/* บก */}
        <option value="พลทหาร">พลทหาร</option>
        <option value="จ่าสิบตรี">จ่าสิบตรี</option>
        <option value="จ่าสิบโท">จ่าสิบโท</option>
        <option value="จ่าสิบเอก">จ่าสิบเอก</option>
        <option value="ร.ต.">ร.ต.</option>
        <option value="พ.ต.">พ.ต.</option>
        <option value="พ.อ.">พ.อ.</option>
        <option value="พล.อ.">พล.อ.</option>

        {/* อากาศ */}
        <option value="พลทหารอากาศ">พลทหารอากาศ</option>
        <option value="จ.ส.อ.อากาศ">จ.ส.อ.อากาศ</option>
        <option value="จ.ส.อ.อากาศหญิง">จ.ส.อ.อากาศหญิง</option>
        <option value="ร.อ.อากาศ">ร.อ.อากาศ</option>
        <option value="ร.อ.อากาศหญิง">ร.อ.อากาศหญิง</option>
        <option value="พ.อ.อากาศ">พ.อ.อากาศ</option>

        {/* น้ำ */}
        <option value="พลทหารเรือ">พลทหารเรือ</option>
        <option value="จ.ส.อ.น้ำ">จ.ส.อ.น้ำ</option>
        <option value="จ.ส.อ.น้ำหญิง">จ.ส.อ.น้ำหญิง</option>
        <option value="ร.อ.น้ำ">ร.อ.น้ำ</option>
        <option value="ร.อ.น้ำหญิง">ร.อ.น้ำหญิง</option>
        <option value="พ.อ.น้ำ">พ.อ.น้ำ</option>
      </select>
    </>
  );
}