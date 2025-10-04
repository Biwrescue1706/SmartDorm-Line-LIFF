// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { initLIFF } from "./lib/liff";
import { useEffect } from "react";

// 📌 Pages
import Returned from "./pages/CheckoutRequest";

export default function App() {
  useEffect(() => {
    initLIFF(); // ✅ จะเก็บ userId ทันทีที่ login สำเร็จ
  }, []);

  return (
    <div>
      {/* ✅ Routing */}
      <Routes>
        <Route path="/" element={<Returned />} />
      </Routes>
    </div>
  );
}
