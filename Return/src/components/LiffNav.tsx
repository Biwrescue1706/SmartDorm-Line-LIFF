// src/components/LiffNav.tsx
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function LiffNav() {
  const nav = useNavigate();
  const location = useLocation();

  // ✅ แสดง back เฉพาะหน้า checkout detail
  const isCheckoutDetail =
    /^\/checkout\/[^/]+$/.test(
      location.pathname
    );

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 999,
          background:
            "linear-gradient(135deg,#4A0080,#7B2CBF)",
          boxShadow:
            "0 4px 14px rgba(0,0,0,.18)",
        }}
      >
        <div
          style={{
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "0 18px",
          }}
        >
          {/* BACK */}
          {isCheckoutDetail && (
            <button
              onClick={() => nav("/")}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform:
                  "translateY(-50%)",
                width: "42px",
                height: "42px",
                borderRadius: "14px",
                border:
                  "1px solid rgba(255,255,255,.2)",
                background:
                  "rgba(255,255,255,.12)",
                color: "#fff",
                fontSize: "22px",
                cursor: "pointer",
                backdropFilter:
                  "blur(10px)",
              }}
            >
              ←
            </button>
          )}

          {/* CENTER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* LOGO */}
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "18px",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                boxShadow:
                  "0 4px 10px rgba(0,0,0,.15)",
                overflow: "hidden",
              }}
            >
              <img
                src="https://manage.smartdorm-biwboong.shop/assets/SmartDorm.webp"
                alt="SmartDorm"
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit:
                    "contain",
                }}
              />
            </div>

            {/* TITLE */}
            <div>
              <div
                style={{
                  color: "#fff",
                  fontSize: "1.9rem",
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing:
                    "-0.5px",
                }}
              >
                SmartDorm
              </div>

              <div
                style={{
                  color:
                    "rgba(255,255,255,.88)",
                  fontSize: "15px",
                  marginTop: "4px",
                  fontWeight: 400,
                }}
              >
                Return Management
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* SPACER */}
      <div style={{ height: "76px" }} />
    </>
  );
}