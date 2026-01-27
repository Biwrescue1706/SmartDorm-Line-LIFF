// hooks/useUploadSlip.ts
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE } from "../config";
import type { UseUploadSlipProps, UseUploadSlipReturn } from "../types/UploadSlip";

export function useUploadSlip({
  room,
  accessToken,
}: UseUploadSlipProps): UseUploadSlipReturn {
  const nav = useNavigate();

  const [userName, setUserName] = useState("");
  const [ctitle, setCtitle] = useState("");
  const [cname, setCname] = useState("");
  const [csurname, setCsurname] = useState("");
  const [cphone, setCphone] = useState("");
  const [cmumId, setCmumId] = useState("");
  const [checkin, setCheckin] = useState("");
  const [slip, setSlip] = useState<File | null>(null);
  const [slipPreviewUrl, setSlipPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const todayLocal = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const toast = (text: string, icon: any = "warning") =>
    Swal.fire({ icon, title: text, timer: 2000, showConfirmButton: false });

  // โหลด LINE Profile
  useEffect(() => {
    fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => data.displayName && setUserName(data.displayName))
      .catch(() => {});
  }, [accessToken]);

  // preview slip
  useEffect(() => {
    if (!slip) {
      setSlipPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(slip);
    setSlipPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [slip]);

  const validate = () => {
    if (!ctitle) return toast("กรุณาเลือกคำนำหน้า"), false;
    if (!cname.trim()) return toast("กรุณากรอกชื่อ"), false;
    if (!csurname.trim()) return toast("กรุณากรอกนามสกุล"), false;

    if (cphone.replace(/\D/g, "").length !== 10)
      return toast("เบอร์โทรต้องครบ 10 ตัวเลข"), false;

    if (cmumId.replace(/\D/g, "").length !== 13)
      return toast("เลขบัตรประชาชนต้องครบ 13 ตัวเลข"), false;

    if (!checkin) return toast("กรุณาเลือกวันที่เข้าพัก"), false;
    if (checkin < todayLocal())
      return toast("ไม่สามารถเลือกวันที่ย้อนหลังได้"), false;

    if (!slip) return toast("กรุณาแนบสลิป"), false;
    if (slip.size > 5 * 1024 * 1024)
      return toast("ขนาดไฟล์ต้องไม่เกิน 5MB"), false;

    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // create booking
      const res = await axios.post(`${API_BASE}/booking/create`, {
        accessToken,
        roomId: room.roomId,
        ctitle,
        cname,
        csurname,
        cphone,
        cmumId,
        checkin,
      });

      const bookingId = res.data.booking.bookingId;

      // upload slip
      const form = new FormData();
      form.append("slip", slip!);

      await axios.post(`${API_BASE}/booking/${bookingId}/uploadSlip`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast("จองสำเร็จ", "success");
      nav("/thankyou");
    } catch (err: any) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        err.response?.data?.error || err.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    userName,
    ctitle,
    setCtitle,
    cname,
    setCname,
    csurname,
    setCsurname,
    cphone,
    setCphone,
    cmumId,
    setCmumId,
    checkin,
    setCheckin,
    slip,
    setSlip,
    slipPreviewUrl,
    loading,
    todayLocal,
    handleSubmit,
  };
}