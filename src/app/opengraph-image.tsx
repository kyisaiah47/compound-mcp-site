import { ImageResponse } from "next/og";

export const alt = "Compound Labs MCP, read-only lookups for live public data";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: "#0b0d0e", color: "#e7e9e5", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px", width: "100%", height: "100%", fontFamily: "monospace" }}>
      <div style={{ color: "#aeba5c", fontSize: 24, letterSpacing: 4 }}>COMPOUND LABS MCP</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "sans-serif", fontSize: 68, fontWeight: 600, lineHeight: 1.05 }}>Current answers<br />for questions that go stale.</div>
        <div style={{ color: "#979e9a", fontSize: 24 }}>11 read-only lookup tools backed by live public data.</div>
      </div>
      <div style={{ color: "#aeba5c", fontSize: 22 }}>compound-mcp.thecompound.tech</div>
    </div>,
    { ...size },
  );
}
