// src/components/NavBar.tsx
import { useNavigate, useLocation } from "react-router-dom";

export default function NavBar() {
  const nav = useNavigate();
  const location = useLocation();

  // แสดงปุ่มย้อนกลับเฉพาะหน้าที่ต้องการ
  const showBack =
    location.pathname === "/bill-detail" ||
    location.pathname === "/payment-choice" ||
    location.pathname === "/upload-slip";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        minHeight: "55px", // ✅ ใช้ minHeight แทน height
        paddingTop: "env(safe-area-inset-top)", // รองรับ notch
        background: "linear-gradient(135deg, #38A3FF, #7B2CBF)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.12)", // เงาบางลง
        zIndex: 999,
      }}
    >
      {/* ปุ่มย้อนกลับฝั่งซ้าย */}
      {showBack && (
        <button
          onClick={() => nav(-1)}
          style={{
            position: "absolute",
            left: "16px",
            top: "50%", // ยึดกลางจริง
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            padding: "4px 10px",
            borderRadius: "10px",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          ←
        </button>
      )}

      {/* โลโก้ + ข้อความตรงกลาง */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          pointerEvents: "none",
          lineHeight: "1", // กันความสูงจาก emoji
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "1rem" }}>
          SmartDorm
        </span>
        <img
          src="https://manage.smartdorm-biwboong.shop/assets/SmartDorm.webp"
          alt="SmartDorm Logo"
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "6px",
            background: "white",
            padding: "2px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </nav>
  );
}