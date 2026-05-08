// src/components/LiffNav.tsx
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function LiffNav() {
  const nav = useNavigate();
  const location = useLocation();

  const isCheckoutDetail =
    /^\/checkout\/[^/]+$/.test(
      location.pathname
    );

  return (
    <>
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
            "0 4px 12px rgba(0,0,0,.18)",
        }}
      >
        <div
          style={{
            height: "60px", // 🔥 ลดจาก 72
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "0 16px",
          }}
        >
          {/* BACK */}
          {isCheckoutDetail && (
            <button
              onClick={() => nav("/")}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform:
                  "translateY(-50%)",
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                border:
                  "1px solid rgba(255,255,255,.2)",
                background:
                  "rgba(255,255,255,.12)",
                color: "#fff",
                fontSize: "18px",
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
              gap: "10px",
            }}
          >
            {/* LOGO */}
            <div
              style={{
                width: "42px", // 🔥 ลด
                height: "42px",
                borderRadius: "14px",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                overflow: "hidden",
                boxShadow:
                  "0 3px 8px rgba(0,0,0,.15)",
              }}
            >
              <img
                src="https://manage.smartdorm-biwboong.shop/assets/SmartDorm.webp"
                alt="SmartDorm"
                style={{
                  width: "30px",
                  height: "30px",
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
                  fontSize: "1.4rem", // 🔥 ลด
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                SmartDorm
              </div>

              <div
                style={{
                  color:
                    "rgba(255,255,255,.85)",
                  fontSize: "12px",
                  marginTop: "2px",
                }}
              >
                Return Management
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* SPACER */}
      <div style={{ height: "64px" }} />
    </>
  );
}