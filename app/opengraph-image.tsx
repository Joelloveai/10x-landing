import { ImageResponse } from "next/og";
import { LOGO_MARK_PATH, LOGO_MARK_VIEWBOX } from "@/lib/brand";

export const alt = "10X: Stop Losing Leads After 6 PM";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rows = [
  { name: "Sarah Tan", status: "Viewing · Sat 2:00 PM", dot: "#16A34A" },
  { name: "Daniel Lim", status: "Follow-up · Day 3", dot: "#4ADE80" },
  { name: "Aisyah Rahman", status: "Assigned · Jason", dot: "#4ADE80" },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0A0A0A",
          color: "#FFFFFF",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 60,
            top: -260,
            width: 900,
            height: 900,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 700, letterSpacing: -2 }}>
          <svg width="44" height="42" viewBox={LOGO_MARK_VIEWBOX} style={{ marginRight: 14 }}>
            <path d={LOGO_MARK_PATH} fill="#FFFFFF" />
          </svg>
          10X
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 56,
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 0.98,
          }}
        >
          <span>Stop Losing Leads</span>
          <span>After 6 PM</span>
        </div>
        <div style={{ display: "flex", marginTop: 28, maxWidth: 640, fontSize: 26, lineHeight: 1.4, color: "#A1A1AA" }}>
          Capture, respond, book and follow up. For Malaysian service businesses.
        </div>
        <div
          style={{
            position: "absolute",
            right: 56,
            bottom: 56,
            width: 380,
            display: "flex",
            flexDirection: "column",
            borderRadius: 18,
            border: "1px solid #242424",
            background: "#111111",
            padding: 20,
          }}
        >
          <div style={{ display: "flex", fontSize: 15, color: "#71717A", marginBottom: 12 }}>Leads</div>
          {rows.map((r) => (
            <div
              key={r.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                marginTop: 8,
                borderRadius: 12,
                background: "#161616",
                fontSize: 17,
              }}
            >
              <span>{r.name}</span>
              <span style={{ display: "flex", alignItems: "center", color: "#A1A1AA", fontSize: 14 }}>
                <span style={{ width: 8, height: 8, borderRadius: 8, background: r.dot, marginRight: 8 }} />
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
