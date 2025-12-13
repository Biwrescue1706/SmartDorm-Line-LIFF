import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ensureLiffReady } from "./lib/liff";

import ReturnableRooms from "./pages/ReturnableRooms";
import CheckoutDetail from "./pages/CheckoutDetail";
import ThankYou from "./pages/ThankYou";

export default function App() {
  useEffect(() => {
    ensureLiffReady();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<ReturnableRooms />} />
      <Route path="/checkout/:bookingId" element={<CheckoutDetail />} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  );
}
