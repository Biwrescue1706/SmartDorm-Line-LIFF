import { useNavigate, useLocation } from "react-router-dom";

export default function LiffNav() {
  const nav = useNavigate();
  const location = useLocation();

  // กำหนด path ที่จะกลับ
  const handleBack = () => {
    if (location.pathname.startsWith("/payment")) {
      nav("/bookings"); // ถ้าอยู่ในหน้า payment กลับ bookings
    } else if (location.pathname.startsWith("/upload-slip")) {
      nav("/payment");
    } else {
      location.pathname.startsWith("/bookings/");
      nav("/bookings");
    }
  };

  return (
    <nav
      className="navbar navbar-light bg-white shadow-sm sticky-top"
      style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(90deg, #43cea2, #185a9d)",
        padding: "0 1rem",
        zIndex: 10,
      }}
    >
      {/* 🔙 ปุ่มย้อนกลับ */}
      <button
        className="btn btn-outline-secondary d-flex align-items-center fw-semibold"
        style={{ borderRadius: "10px" }}
        onClick={handleBack}
      >
        ←
      </button>

      {/* 🏢 ชื่อ SmartDorm */}
      <h5
        className="fw-bold m-0 text-success"
        style={{
          fontFamily: "Segoe UI, Prompt, sans-serif",
          letterSpacing: "0.5px",
        }}
      >
        SmartDorm
      </h5>

      {/* เว้นขนาดเท่าปุ่ม เพื่อให้ชื่ออยู่กลาง */}
      <div style={{ width: "90px" }}></div>
    </nav>
  );
}
