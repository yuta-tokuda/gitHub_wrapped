import { ImageResponse } from "next/og";

import { APP_NAME } from "@/constants/app";
import { calculateDeveloperScore } from "@/features/wrapped/analysis/developer-score";
import { getWrappedGitHubData } from "@/lib/github";

export const alt = "GitHub Wrapped Card";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type WrappedOgImageProps = {
  params: Promise<{ username: string }>;
};

function createFallbackImage(username: string): ImageResponse {
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
            "linear-gradient(140deg, rgb(23, 23, 23), rgb(22, 101, 52), rgb(20, 184, 166))",
          color: "white",
          padding: "64px",
        }}
      >
        <div style={{ fontSize: 34, opacity: 0.9 }}>{APP_NAME}</div>
        <div style={{ marginTop: 16, fontSize: 72, fontWeight: 700 }}>
          @{username}
        </div>
      </div>
    ),
    size,
  );
}

export default async function WrappedOpenGraphImage({
  params,
}: WrappedOgImageProps) {
  const { username } = await params;

  try {
    const wrapped = await getWrappedGitHubData(username);
    const score = calculateDeveloperScore(wrapped);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background:
              "linear-gradient(135deg, rgb(9, 9, 11), rgb(15, 118, 110), rgb(21, 128, 61))",
            color: "white",
            padding: "56px",
          }}
        >
          <div style={{ fontSize: 28 }}>{APP_NAME}</div>
          <div>
            <div style={{ fontSize: 68, fontWeight: 700 }}>@{wrapped.user.login}</div>
            <div style={{ marginTop: 14, fontSize: 32 }}>
              Score {score.totalScore} / 100
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", fontSize: 28 }}>
            <div>Repos {wrapped.repositories.length}</div>
            <div>Stars {wrapped.metrics.totalStars}</div>
            <div>Top {wrapped.metrics.topLanguage ?? "N/A"}</div>
          </div>
        </div>
      ),
      size,
    );
  } catch {
    return createFallbackImage(username);
  }
}
