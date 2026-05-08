// src/components/LiffNav.tsx

import { useNavigate, useLocation } from "react-router-dom";

export default function LiffNav() {
  const nav = useNavigate();
  const location = useLocation();

  const showBack =
    location.pathname.startsWith("/bookings/") ||
    location.pathname.startsWith("/payment") ||
    location.pathname.startsWith("/upload-slip");

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top shadow-sm"
      style={{
        background:
          "linear-gradient(135deg,#4A0080 0%, #7B2BC7 100%)",
        minHeight: "64px",
        zIndex: 999,
      }}
    >
      <div className="container position-relative">

        {/* BACK BUTTON */}
        {showBack && (
          <button
            onClick={() => nav(-1)}
            className="btn btn-sm position-absolute start-0 top-50 translate-middle-y ms-2"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
              borderRadius: "14px",
              width: "42px",
              height: "42px",
              backdropFilter: "blur(8px)",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            ←
          </button>
        )}

        {/* CENTER */}
        <div
          className="mx-auto d-flex align-items-center gap-2"
          style={{
            userSelect: "none",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "14px",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.12)",
            }}
          >
            <img
              src="https://manage.smartdorm-biwboong.shop/assets/SmartDorm.webp"
              alt="SmartDorm"
              style={{
                width: "26px",
                height: "26px",
                objectFit: "contain",
              }}
            />
          </div>

          <div className="text-white">
            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: ".3px",
              }}
            >
              SmartDorm
            </div>

            <div
              style={{
                fontSize: "11px",
                opacity: 0.85,
                marginTop: 2,
              }}
            >
              Dormitory Management
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}