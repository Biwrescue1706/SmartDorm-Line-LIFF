import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ensureLiffReady } from "./lib/liff";

import ReturnableRooms from "./pages/ReturnableRooms";

export default function App() {
  useEffect(() => {
    ensureLiffReady();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<ReturnableRooms />} />
    </Routes>
  );
}