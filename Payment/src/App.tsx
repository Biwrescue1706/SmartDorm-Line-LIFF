import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ensureLiffReady } from "./lib/liff";

import MyBills from "./pages/MyBills";
import BillDetail from "./pages/BillDetail";
import PaymentChoice from "./pages/PaymentChoice";
import UploadSlip from "./pages/UploadSlip";
import ThankYou from "./pages/ThankYou";

export default function App() {
  useEffect(() => {
    ensureLiffReady();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MyBills />} />
      <Route path="/bill-detail" element={<BillDetail />} />
      <Route path="/payment-choice" element={<PaymentChoice />} />
      <Route path="/upload-slip" element={<UploadSlip />} />
      <Route path="/thankyou" element={<ThankYou />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
