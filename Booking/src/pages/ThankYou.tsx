// src/pages/ThankYou.tsx
import liff from "@line/liff";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function ThankYou() {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (liff.isInClient()) {
        liff.closeWindow(); // ✅ ปิดอัตโนมัติถ้าอยู่ใน LINE
      } else {
        // ถ้าไม่ใช่ใน LINE ให้ถามผู้ใช้แทน
        Swal.fire({
          title: "✅ ส่งข้อมูลเรียบร้อย",
          text: "ขอบคุณที่ใช้บริการ SmartDorm!",
          icon: "success",
          confirmButtonText: "กลับหน้าหลัก",
        }).then(() => {
          window.location.href = "/"; // กลับหน้าแรก
        });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center bg-light text-center"
      style={{
        background:
          "linear-gradient(135deg, rgba(240,255,240,1), rgba(220,248,255,1))",
      }}
    >
      <div className="p-4 rounded shadow-sm bg-white border">
        <h2 className="fw-bold text-success mb-3">🎉 ขอบคุณที่ใช้บริการ!</h2>
        <p className="text-muted mb-1">
          ระบบได้รับข้อมูลของคุณเรียบร้อยแล้ว
        </p>
        <p className="text-secondary small">
          หน้าต่างนี้จะปิดโดยอัตโนมัติภายในไม่กี่วินาที...
        </p>
      </div>
    </div>
  );
}
