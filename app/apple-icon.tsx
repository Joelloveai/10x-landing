import { ImageResponse } from "next/og";
import { LOGO_MARK_PATH } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0A0A0A" }}>
        <svg width="180" height="180" viewBox="0 0 1024 1024">
          <path d={LOGO_MARK_PATH} fill="#FFFFFF" />
        </svg>
      </div>
    ),
    size,
  );
}
