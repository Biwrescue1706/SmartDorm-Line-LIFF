// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { initLIFF } from "./lib/liff";

// pages
import ReturnableRooms from "./pages/ReturnableRooms";

export default function App() {
  useEffect(() => {
    initLIFF(); // init LIFF + login + เก็บ token
  }, []);

  return (
    <Routes>
      {/* เปิดมาเจอหน้าขอคืนห้องทันที */}
      <Route path="/" element={<ReturnableRooms />} />
</Routes>
  );
}