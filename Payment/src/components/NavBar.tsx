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
        height: "62px",
        paddingTop: "env(safe-area-inset-top)",
        background: "linear-gradient(135deg, #38A3FF, #7B2CBF)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
        zIndex: 1500,
      }}
    >
      {/* ปุ่มย้อนกลับฝั่งซ้าย */}
      {showBack && (
        <button
          onClick={() => nav(-1)}
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            padding: "4px 10px",
            borderRadius: "10px",
            color: "white",
            fontSize: "1.4rem",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          ←
        </button>
      )}

      {/* โลโก้ + ข้อความอยู่ตรงกลางแท้ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          pointerEvents: "none",
          transform: "translateX(6px)",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "1.3rem" }}>🏫 SmartDorm</span>
        <img
          src="https://smartdorm-admin.biwbong.shop/assets/SmartDorm.webp"
          alt="SmartDorm Logo"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            background: "white",
            padding: "2px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      {/* เว้นพื้นที่ขวาให้บาลานซ์กับปุ่ม Back */}
      {showBack && <div style={{ width: "32px", position: "absolute", right: "16px" }}></div>}
    </nav>
  );
}