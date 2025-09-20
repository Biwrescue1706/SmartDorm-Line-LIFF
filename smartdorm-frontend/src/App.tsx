// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Bookings from "./pages/Bookings";
// import Returns from "./pages/Returns";
import Payment from "./pages/Payment";
import RoomDetail from "./pages/RoomDetail";
import UploadSlip from "./pages/UploadSlip";

export default function App() {
  return (
    <div>
      {/* ✅ Routing */}
      <Routes>
        <Route path="/" element={<Bookings />} />
        <Route path="/bookings" element={<Bookings />} /> {/* 📌 รายการห้อง */}
        <Route path="/bookings/:id" element={<RoomDetail />} />{" "}
        <Route path="/payment" element={<Payment />} />
        <Route path="/upload-slip" element={<UploadSlip />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
