// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ensureLiffReady } from "./lib/liff";

// pages
import ReturnableRooms from "./pages/ReturnableRooms";

export default function App() {
  useEffect(() => {
  ensureLiffReady();
}, []);

  return (
    <Routes>
      {/* เปิดมาเจอหน้าขอคืนห้องทันที */}
      <Route path="/" element={<ReturnableRooms />} />
</Routes>
  );
}