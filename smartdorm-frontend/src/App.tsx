// src/App.tsx
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { initLIFF } from "./lib/liff";

// 📌 Pages
import Bookings from "./pages/Bookings";
import Payment from "./pages/Payment";
import RoomDetail from "./pages/RoomDetail";
import UploadSlip from "./pages/UploadSlip";

export default function App() {
  useEffect(() => {
    initLIFF(); // ✅ จะเก็บ userId ทันทีที่ login สำเร็จ
  }, []);

  return (
    <div>
      {/* ✅ Routing */}
      <Routes>
        <Route path="/" element={<Bookings />} />
        <Route path="/bookings/:id" element={<RoomDetail />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/upload-slip" element={<UploadSlip />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
