// src/App.tsx
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Bookings from "./pages/Bookings";
import Returns from "./pages/Returns";
import Payments from "./pages/Payments";

export default function App() {
  return (
    <div>
      {/* ✅ Routing */}
      <Routes>
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="*" element={<Navigate to="/bookings" replace />} />
      </Routes>
    </div>
  );
}
