import { useNavigate, useLocation } from "react-router-dom";

interface NavBarProps {
  showBack?: boolean; // ✅ เพิ่ม prop นี้ (optional)
}

export default function NavBar({ showBack = true }: NavBarProps) {
  const nav = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname === "/mybills") return;
    nav(-1);
  };

  return (
    <nav
      className="w-100 d-flex align-items-center justify-content-between shadow-sm px-3 py-2"
      style={{
        background: "linear-gradient(90deg, #43cea2, #185a9d)",
        color: "white",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999,
        height: "56px",
      }}
    >
      {/* 🔙 ปุ่มย้อนกลับ */}
      {showBack ? (
        <button
          onClick={handleBack}
          className="btn btn-sm text-white fw-bold"
          style={{ background: "transparent", border: "none" }}
        >
          ⬅️
        </button>
      ) : (
        <div style={{ width: "32px" }}></div> // ช่องว่างแทนปุ่ม
      )}

      {/* 🏠 ชื่อระบบ */}
      <h5 className="m-0 fw-bold text-center flex-grow-1">SmartDorm</h5>

      {/* เว้นที่ขวาให้สมดุล */}
      <div style={{ width: "32px" }}></div>
    </nav>
  );
}
