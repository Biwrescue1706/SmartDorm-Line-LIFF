import { Routes, Route, Navigate } from "react-router-dom";
import { ensureLiffReady } from "./lib/liff";
import { useEffect } from "react";

// 📌 Pages
import Bookings from "./pages/Bookings";
import RoomDetail from "./pages/RoomDetail";
import UploadSlip from "./pages/UploadSlip";
import PaymentChoice from "./pages/PaymentChoice";
import ThankYou from "./pages/ThankYou";

export default function App() {
  // ✅ เริ่มต้น LIFF ตอนเปิดเว็บครั้งแรก
  useEffect(() => {
    ensureLiffReady();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Bookings />} />
      <Route path="/bookings/:id" element={<RoomDetail />} />
      <Route path="/payment" element={<PaymentChoice />} />
      <Route path="/upload-slip" element={<UploadSlip />} />
      <Route path="/thankyou" element={<ThankYou />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
