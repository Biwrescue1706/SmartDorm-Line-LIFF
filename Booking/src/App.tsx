// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { initLiff } from "./lib/liff";
import { useEffect } from "react";

// 📌 Pages
import Bookings from "./pages/Bookings";
import RoomDetail from "./pages/RoomDetail";
import UploadSlip from "./pages/UploadSlip";
import PaymentChoice from "./pages/PaymentChoice";
import ThankYou from "./pages/ThankYou";

export default function App() {
  useEffect(() => {
    initLiff();
  }, []);

  return (
    <div>
      {/* ✅ Routing */}
      <Routes>
        <Route path="/" element={<Bookings />} />
        <Route path="/bookings/:id" element={<RoomDetail />} />
        <Route path="/payment" element={<PaymentChoice />} />
        <Route path="/upload-slip" element={<UploadSlip />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/thankyou" element={<ThankYou />} />
      </Routes>
    </div>
  );
}
