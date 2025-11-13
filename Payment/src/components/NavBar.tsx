// src/components/NavBar.tsx
import { useNavigate, useLocation } from "react-router-dom";

export default function NavBar() {
  const nav = useNavigate();
  const location = useLocation();

  // ✅ ถ้าหน้าไม่ใช่ MyBills ให้แสดงปุ่มย้อนกลับ
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
        height: "60px",
        background: "linear-gradient(90deg, #43cea2, #185a9d)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: showBack ? "space-between" : "center",
        padding:
          "0 16px env(safe-area-inset-left) 0 env(safe-area-inset-right)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      {showBack && (
        <button
          onClick={() => nav(-1)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ←
        </button>
      )}

      {/* ✅ ส่วนกลาง: SmartDorm + โลโก้ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          flexGrow: 1,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
🏫SmartDorm🎉
</h3>
        <img
          src="https://smartdorm-admin.biwbong.shop/assets/SmartDorm.png"
          alt="SmartDorm Logo"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            background: "white",
            padding: "2px",
          }}
        />
      </div>

      {showBack && <div style={{ width: "30px" }}></div>}
    </nav>
  );
}
