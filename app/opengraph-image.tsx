import { ImageResponse } from "next/og";

export const alt = "Gravel Cost Calculator - estimate gravel cubic yards, tons and cost";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0b3d3a 0%, #14947f 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.1 }}>Gravel Cost Calculator</div>
        <div style={{ fontSize: 38, marginTop: 28, opacity: 0.9 }}>
          Estimate cubic yards, tons and total cost
        </div>
        <div style={{ fontSize: 28, marginTop: 56, opacity: 0.75 }}>gravelcostcalculator.com</div>
      </div>
    ),
    { ...size },
  );
}
