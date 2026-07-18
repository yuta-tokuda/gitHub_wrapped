import { ImageResponse } from "next/og";

import { APP_DESCRIPTION, APP_NAME } from "@/constants/app";

export const alt = APP_NAME;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgb(24, 24, 27), rgb(39, 39, 42), rgb(22, 163, 74))",
          color: "white",
          padding: "64px",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700 }}>{APP_NAME}</div>
        <div style={{ marginTop: 24, fontSize: 34 }}>{APP_DESCRIPTION}</div>
      </div>
    ),
    size,
  );
}
