// Payment/src/pages/UploadSlip.tsx

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE } from "../config";
import { refreshLiffToken } from "../lib/liff";
import NavBar from "../components/NavBar";

const compressImage = (
  file: File,
  quality = 0.4
): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();

    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      const maxW = 720;

      let w = img.width;
      let h = img.height;

      if (w > maxW) {
        h = (maxW / w) * h;
        w = maxW;
      }

      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          resolve(
            new File(
              [blob!],
              file.name.replace(/\.\w+$/, ".jpg"),
              {
                type: "image/jpeg",
              }
            )
          );
        },
        "image/jpeg",
        quality
      );
    };
  });
};

export default function UploadSlip() {
  const { state } = useLocation();

  const nav = useNavigate();

  const bill = state as any;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onSelectFile = async (
    file: File | null
  ) => {
    if (!file) return;

    Swal.fire({
      title: "กำลังประมวลผลรูป...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const compressed = await compressImage(file);

    Swal.close();

    if (compressed.size > 1 * 1024 * 1024) {
      return Swal.fire(
        "ไฟล์ใหญ่เกิน",
        "กรุณาเลือกรูปไม่เกิน 1MB",
        "warning"
      );
    }

    setFile(compressed);

    setPreview(
      URL.createObjectURL(compressed)
    );
  };

  const handleSubmit = async () => {
    if (!bill?.billId) {
      return Swal.fire(
        "ไม่พบบิล",
        "กรุณากลับไปเลือกบิลใหม่",
        "error"
      );
    }

    if (!file) {
      return Swal.fire(
        "กรุณาเลือกสลิปก่อนส่ง",
        "",
        "warning"
      );
    }

    try {
      setLoading(true);

      const token = await refreshLiffToken();

      if (!token) {
        throw new Error("ไม่มี token");
      }

      const form = new FormData();

      form.append("billId", bill.billId);
      form.append("accessToken", token);
      form.append("slip", file);

      await axios.post(
        `${API_BASE}/payment/create`,
        form,
        {
          timeout: 30000,
          withCredentials: false,
        }
      );

      Swal.fire({
        icon: "success",
        title: "ส่งสลิปสำเร็จ",
        text: "ขอบคุณที่ชำระเงิน",
        showConfirmButton: false,
        timer: 1800,
      }).then(() => {
        nav("/thankyou");
      });
    } catch (err: any) {
      console.log("SERVER ERROR:", err);

      Swal.fire(
        "❌ ไม่สามารถส่งสลิปได้",
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!bill) {
    return (
      <>
        <NavBar />

        <div
          style={{
            minHeight: "100vh",
            background: "#F6F4FA",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: 20,
          }}
        >
          <h4
            style={{
              color: "#dc3545",
              marginBottom: 18,
            }}
          >
            ❌ ไม่พบบิล
          </h4>

          <button
            onClick={() => nav("/")}
            style={{
              border: "none",
              background:
                "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            กลับหน้าแรก
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />

      <div
        style={{
          minHeight: "100vh",
          background: "#F6F4FA",
          padding: "88px 16px 40px",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            margin: "0 auto",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: "#fff",
              borderRadius: 30,
              padding: 28,
              marginBottom: 20,
              boxShadow:
                "0 12px 28px rgba(74,0,128,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 6,
                background:
                  "linear-gradient(90deg,#4A0080 0%, #7B2BC7 100%)",
              }}
            />

            <h1
              style={{
                margin: 0,
                fontSize: 30,
                fontWeight: 800,
                color: "#4A0080",
              }}
            >
              📄 อัปโหลดสลิป
            </h1>

            <p
              style={{
                marginTop: 10,
                marginBottom: 0,
                color: "#7B7490",
                lineHeight: 1.7,
              }}
            >
              กรุณาแนบสลิปการโอนเงิน
              <br />
              เพื่อยืนยันการชำระเงิน
            </p>
          </div>

          {/* BILL CARD */}
          <div
            style={{
              background: "#fff",
              borderRadius: 30,
              padding: 24,
              marginBottom: 20,
              boxShadow:
                "0 12px 28px rgba(74,0,128,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  color: "#7B7490",
                }}
              >
                ห้องพัก
              </span>

              <strong
                style={{
                  color: "#2D1A47",
                }}
              >
                ห้อง {bill.room?.number ?? "-"}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: "#7B7490",
                }}
              >
                ยอดชำระ
              </span>

              <strong
                style={{
                  color: "#4A0080",
                  fontSize: 22,
                }}
              >
                ฿{" "}
                {bill.total?.toLocaleString(
                  "th-TH"
                )}
              </strong>
            </div>
          </div>

          {/* UPLOAD CARD */}
          <div
            style={{
              background: "#fff",
              borderRadius: 30,
              padding: 24,
              boxShadow:
                "0 12px 28px rgba(74,0,128,0.08)",
            }}
          >
            <div
              onClick={() =>
                document
                  .getElementById("slipInput")
                  ?.click()
              }
              style={{
                border: file
                  ? "2px solid #4A0080"
                  : "2px dashed #D9CFF0",
                background: "#FAF9FC",
                borderRadius: 24,
                padding: "36px 20px",
                textAlign: "center",
                cursor: "pointer",
                transition: ".2s",
              }}
            >
              {!preview ? (
                <>
                  <div
                    style={{
                      fontSize: 52,
                      marginBottom: 12,
                    }}
                  >
                    📤
                  </div>

                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#4A0080",
                      marginBottom: 8,
                    }}
                  >
                    เลือกสลิป
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      color: "#7B7490",
                      lineHeight: 1.7,
                    }}
                  >
                    รองรับไฟล์รูปภาพทุกประเภท
                    <br />
                    ขนาดไม่เกิน 1MB
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={preview}
                    alt="preview"
                    style={{
                      width: "100%",
                      maxWidth: 300,
                      borderRadius: 20,
                      boxShadow:
                        "0 8px 18px rgba(0,0,0,0.08)",
                    }}
                  />

                  <div
                    style={{
                      marginTop: 16,
                      color: "#4A0080",
                      fontWeight: 700,
                      wordBreak: "break-all",
                    }}
                  >
                    ✔ {file?.name}
                  </div>
                </>
              )}

              <input
                id="slipInput"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  onSelectFile(
                    e.target.files?.[0] || null
                  )
                }
              />
            </div>

            {/* SUBMIT */}
            <button
              disabled={loading}
              onClick={handleSubmit}
              style={{
                width: "100%",
                marginTop: 24,
                padding: "16px",
                borderRadius: 20,
                border: "none",
                background: loading
                  ? "#B7A7D8"
                  : "linear-gradient(135deg,#4A0080 0%, #6E1AB5 100%)",
                color: "#fff",
                fontSize: 18,
                fontWeight: 800,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                boxShadow:
                  "0 10px 24px rgba(74,0,128,0.18)",
              }}
            >
              {loading
                ? "กำลังส่งข้อมูล..."
                : "ยืนยันส่งสลิป"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}