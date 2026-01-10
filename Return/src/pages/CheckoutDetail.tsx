// src/pages/CheckoutDetail.tsx
import LiffNav from "../components/LiffNav";
import { useCheckoutDetail } from "../hooks/useCheckoutDetail";

const SCB_PURPLE = "#4A0080";
const BG_SOFT = "#F6F2FB";
const CARD_BG = "#FFFFFF";

export default function CheckoutDetail() {
  const {
    checkingAuth,
    loading,
    booking,
    checkoutDate,
    setCheckoutDate,
    submitCheckout,
  } = useCheckoutDetail();

  if (checkingAuth || loading || !booking) {
    return (
      <>
        <LiffNav />
        <div
          style={{
            height: "100vh",
            paddingTop: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            color: SCB_PURPLE,
          }}
        >
          กำลังโหลดข้อมูล…
        </div>
      </>
    );
  }

  return (
    <>
      <LiffNav />

      <div
        style={{
          minHeight: "100vh",
          background: BG_SOFT,
          padding: 20,
          paddingTop: 90,
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <h3
            style={{
              marginBottom: 16,
              color: SCB_PURPLE,
              fontWeight: 700,
            }}
          >
            🏠 รายละเอียดการคืนห้อง
          </h3>

          <div
            style={{
              background: CARD_BG,
              borderRadius: 18,
              padding: 20,
              boxShadow: "0 6px 16px rgba(74,0,128,0.08)",
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <strong>ห้อง:</strong> {booking.room?.number ?? "-"}
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong>ชื่อผู้เช่า:</strong> {booking.fullName || "-"}
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong>เบอร์โทร:</strong> {booking.cphone || "-"}
            </div>

            <div style={{ marginBottom: 18 }}>
              <strong>วันที่คืนห้อง</strong>
              <input
                type="date"
                value={checkoutDate}
                onChange={(e) => setCheckoutDate(e.target.value)}
                style={{
                  marginTop: 6,
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <button
              onClick={submitCheckout}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 0",
                borderRadius: 14,
                border: "none",
                background: `linear-gradient(135deg, ${SCB_PURPLE}, #6A1BB1)`,
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ยืนยันขอคืนห้อง
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
