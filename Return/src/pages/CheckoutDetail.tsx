// src/pages/CheckoutDetail.tsx
import LiffNav from "../components/LiffNav";
import { useCheckoutDetail } from "../hooks/useCheckoutDetail";

const SCB_PURPLE = "#4A0080";
const SCB_LIGHT = "#F5EEFC";
const BG_SOFT = "#F6F4FA";
const CARD_BG = "#FFFFFF";
const TEXT_DARK = "#2D1A47";
const TEXT_SUB = "#7B7490";

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
            minHeight: "100vh",
            background: BG_SOFT,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: SCB_PURPLE,
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          กำลังโหลดข้อมูล...
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
          padding: "88px 16px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 430,
            margin: "0 auto",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <h1
              style={{
                margin: 0,
                color: SCB_PURPLE,
                fontSize: 26,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🏠 คืนห้องพัก
            </h1>

            <p
              style={{
                marginTop: 8,
                marginBottom: 0,
                color: TEXT_SUB,
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              ตรวจสอบรายละเอียดก่อนยืนยันการคืนห้อง
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: CARD_BG,
              borderRadius: 26,
              padding: 22,
              boxShadow: "0 10px 28px rgba(74,0,128,0.08)",
              border: "1px solid rgba(74,0,128,0.06)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top Accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 6,
                background: `linear-gradient(90deg, ${SCB_PURPLE}, #7B2BC7)`,
              }}
            />

            {/* Room */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: TEXT_SUB,
                    marginBottom: 6,
                    fontWeight: 600,
                  }}
                >
                  ห้องพัก
                </div>

                <h2
                  style={{
                    margin: 0,
                    color: SCB_PURPLE,
                    fontSize: 30,
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {booking.room?.number ?? "-"}
                </h2>
              </div>

              <div
                style={{
                  background: SCB_LIGHT,
                  color: SCB_PURPLE,
                  padding: "10px 14px",
                  borderRadius: 14,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                คืนห้อง
              </div>
            </div>

            {/* Info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {/* Name */}
              <div
                style={{
                  background: "#FAF9FC",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #EFE9F7",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: TEXT_SUB,
                    marginBottom: 5,
                    fontWeight: 600,
                  }}
                >
                  ชื่อผู้เช่า
                </div>

                <div
                  style={{
                    color: TEXT_DARK,
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {booking.fullName || "-"}
                </div>
              </div>

              {/* Phone */}
              <div
                style={{
                  background: "#FAF9FC",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #EFE9F7",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: TEXT_SUB,
                    marginBottom: 5,
                    fontWeight: 600,
                  }}
                >
                  เบอร์โทรศัพท์
                </div>

                <div
                  style={{
                    color: TEXT_DARK,
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {booking.cphone || "-"}
                </div>
              </div>

              {/* Date */}
              <div
                style={{
                  background: "#FAF9FC",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #EFE9F7",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: TEXT_SUB,
                    marginBottom: 8,
                    fontWeight: 600,
                  }}
                >
                  วันที่คืนห้อง
                </div>

                <input
                  type="date"
                  value={checkoutDate}
                  onChange={(e) => setCheckoutDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "13px 14px",
                    borderRadius: 14,
                    border: `1.5px solid ${SCB_PURPLE}30`,
                    outline: "none",
                    fontSize: 15,
                    fontWeight: 600,
                    color: TEXT_DARK,
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Button */}
            <button
              onClick={submitCheckout}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: 22,
                padding: "15px",
                borderRadius: 18,
                border: "none",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: 15,
                background: `linear-gradient(135deg, ${SCB_PURPLE}, #6F1AB6)`,
                color: "#fff",
                boxShadow: "0 8px 20px rgba(74,0,128,0.22)",
                transition: "0.2s",
              }}
            >
              ยืนยันคืนห้อง
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
