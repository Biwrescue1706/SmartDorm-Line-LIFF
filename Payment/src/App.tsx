import { Routes, Route, Navigate } from "react-router-dom";
import { ensureLiffReady } from "./lib/liff";
import { useEffect } from "react";

// 📄 Pages
import MyBills from "./pages/MyBills";
import BillDetail from "./pages/BillDetail";
import PaymentChoice from "./pages/PaymentChoice";
import UploadSlip from "./pages/UploadSlip";
import ThankYou from "./pages/ThankYou";

export default function App() {
  // ✅ เริ่มต้น LIFF ตอนเปิดเว็บครั้งแรก
  useEffect(() => {
    ensureLiffReady();
  }, []);

  return (
    <Routes>
      {/* 📋 หน้ารายการบิลทั้งหมด */}
      <Route path="/" element={<MyBills />} />

      {/* 🔍 หน้ารายละเอียดบิล */}
      <Route path="/bill-detail" element={<BillDetail />} />

      {/* 💳 หน้าชำระเงิน (เลือกวิธีการจ่าย) */}
      <Route path="/payment-choice" element={<PaymentChoice />} />

      {/* 📸 หน้าส่งสลิปการชำระเงิน */}
      <Route path="/upload-slip" element={<UploadSlip />} />

      {/* 🎉 หน้าขอบคุณหลังส่งสลิปสำเร็จ */}
      <Route path="/thankyou" element={<ThankYou />} />

      {/* 🧭 default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
