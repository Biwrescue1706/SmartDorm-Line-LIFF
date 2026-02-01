// src/components/LiffNav.tsx
import { useNavigate, useLocation } from "react-router-dom";

export default function LiffNav() {
  const nav = useNavigate();
  const location = useLocation();

  const showBack =
    location.pathname.startsWith("/bookings/") ||
    location.pathname.startsWith("/payment") ||
    location.pathname.startsWith("/upload-slip");

  const handleBack = () => nav(-1);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        minHeight: "55px",
        background: "linear-gradient(135deg, #38A3FF, #7B2CBF)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        zIndex: 999,
      }}
    >
      {/* ปุ่มย้อนกลับ */}
      {showBack && (
        <button
          onClick={handleBack}
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.35)",
            backdropFilter: "blur(10px)",
            color: "white",
            borderRadius: "12px",
            padding: "4px 10px",
            fontSize: "1.4rem",
            cursor: "pointer",
            transition: "all .2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          ←
        </button>
      )}

      {/* Title + Logo (อยู่กลางจริง) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: ".3px",
            fontFamily: "Prompt, Segoe UI, sans-serif",
            textShadow: "0 1px 3px #ffffffff",
          }}
        >
          🏫 SmartDorm
        </span>

        <img
          src="https://manage.smartdorm-biwboong.shop/assets/SmartDorm.webp"
          alt="SmartDorm Logo"
          style={{
            width: "22px",
            height: "22px",
            background: "white",
            borderRadius: "8px",
            padding: "2px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {/* Balance Right */}
      {showBack && <div style={{ width: "36px" }} />}
    </nav>
  );
}
