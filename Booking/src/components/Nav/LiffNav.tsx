import { useNavigate, useLocation } from "react-router-dom";

export default function LiffNav() {
  const nav = useNavigate();
  const location = useLocation();

  // ✅ แสดงปุ่มย้อนกลับในบางหน้า เช่น /bookings/:id, /payment, /upload-slip
  const showBack =
    location.pathname.startsWith("/bookings/") ||
    location.pathname.startsWith("/payment") ||
    location.pathname.startsWith("/upload-slip");

  // ✅ ฟังก์ชันย้อนกลับ
const handleBack = () => {
  if (location.pathname.startsWith("/upload-slip")) {
    nav("/payment");
  } else if (location.pathname.startsWith("/payment")) {
    nav("/bookings/");
  } else if (location.pathname.startsWith("/bookings/")) {
    nav(-1);
  } else {
    nav("/");
  }
};

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
      {/* 🔙 ปุ่มย้อนกลับ */}
      {showBack && (
        <button
          onClick={handleBack}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateX(-2px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateX(0)")
          }
        >
          ←
        </button>
      )}

      {/* 🏫 โลโก้ SmartDorm กลาง */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          flexGrow: 1,
        }}
      >
        <h5
          style={{
            margin: 0,
            fontWeight: 700,
            letterSpacing: "0.5px",
            fontFamily: "Segoe UI, Prompt, sans-serif",
          }}
        >
          SmartDorm
        </h5>
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

      {/* ช่องว่างขวาให้สมดุลกับปุ่มย้อนกลับ */}
      {showBack && <div style={{ width: "30px" }}></div>}
    </nav>
  );
}
