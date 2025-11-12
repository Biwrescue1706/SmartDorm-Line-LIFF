// src/pages/ThankYou.tsx
import { useEffect, useState } from "react";
import { logoutLiff, ensureLiffReady } from "../lib/liff";
import NavBar from "../components/NavBar"; // ✅ Navbar ด้านบน

export default function ThankYou() {
  const [countdown, setCountdown] = useState(10); // ✅ ตัวนับถอยหลัง (10 วินาที)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>; // ✅ ใช้ ReturnType แทน NodeJS.Timeout
    const startCountdown = () => {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    startCountdown();

    const timer = setTimeout(async () => {
      const ready = await ensureLiffReady();
      if (ready) await logoutLiff();
    }, 10000); // ✅ ออกจากระบบอัตโนมัติหลัง 10 วิ

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="smartdorm-page justify-content-center text-center">
      <NavBar /> {/* ✅ Navbar ด้านบน */}
      <div className="mt-5"></div> {/* เผื่อพื้นที่ Navbar */}

      {/* 🔹 โลโก้ SmartDorm */}
      <div className="text-center mb-3">
        <img
          src="https://smartdorm-admin.biwbong.shop/assets/SmartDorm.png"
          alt="SmartDorm Logo"
          className="smartdorm-logo"
        />
      </div>

      {/* 🔹 การ์ดขอบคุณ */}
      <div className="smartdorm-card text-center shadow-sm animate__animated animate__fadeIn">
        <h2 className="fw-bold text-success mb-3">
          🎉 ขอบคุณที่ชำระเงินเรียบร้อย!
        </h2>

        <p className="text-muted mb-2">
          ระบบได้บันทึกข้อมูลการชำระของคุณเรียบร้อยแล้ว
        </p>

        <p className="text-muted small mb-0">
          (หน้าต่างนี้จะปิดโดยอัตโนมัติภายใน{" "}
          <b>{countdown}</b> วินาที)
        </p>

        <div className="mt-4">
          <div
            className="spinner-border text-success"
            style={{ width: "2.5rem", height: "2.5rem" }}
          ></div>
          <p className="mt-2 text-secondary small">กำลังกลับไปยังหน้าหลัก...</p>
        </div>
      </div>
    </div>
  );
}
