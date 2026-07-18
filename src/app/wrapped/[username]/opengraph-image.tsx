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
        <div style={{ marginTop: 16, fontSize: 72, fontWeight: 700 }}>{`@${username}`}</div>
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
    const topLanguages = wrapped.metrics.languageStats
      .slice(0, 3)
      .map((language) => language.name)
      .join(" / ");
    const bio =
      wrapped.user.bio && wrapped.user.bio.length > 84
        ? `${wrapped.user.bio.slice(0, 84)}...`
        : wrapped.user.bio ?? "公開プロフィールの自己紹介は未設定";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, rgb(9, 9, 11), rgb(15, 23, 42), rgb(6, 95, 70))",
            color: "white",
            padding: "40px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: "28px",
              border: "1px solid rgba(148, 163, 184, 0.35)",
              background: "rgba(2, 6, 23, 0.58)",
              padding: "36px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 24, opacity: 0.9 }}>{APP_NAME}</div>
                <div style={{ fontSize: 60, fontWeight: 700 }}>{`@${wrapped.user.login}`}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "16px",
                  border: "1px solid rgba(45, 212, 191, 0.5)",
                  background: "rgba(20, 184, 166, 0.16)",
                  padding: "14px 18px",
                }}
              >
                <div style={{ fontSize: 16, opacity: 0.9 }}>Developer Score</div>
                <div style={{ marginTop: "4px", fontSize: 34, fontWeight: 700 }}>
                  {`${score.totalScore} / 100`}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "18px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <img
                alt="avatar"
                height="116"
                src={wrapped.user.avatarUrl}
                style={{
                  width: "116px",
                  borderRadius: "58px",
                  border: "2px solid rgba(148, 163, 184, 0.4)",
                }}
                width="116"
              />
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ fontSize: 34, fontWeight: 600 }}>
                  {wrapped.user.name ?? wrapped.user.login}
                </div>
                <div style={{ marginTop: "8px", fontSize: 21, opacity: 0.88 }}>{bio}</div>
              </div>
            </div>

            <div style={{ marginTop: "20px", display: "flex", gap: "14px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "14px",
                  border: "1px solid rgba(34, 211, 238, 0.35)",
                  background: "rgba(14, 116, 144, 0.2)",
                  padding: "12px 14px",
                  flex: 1,
                }}
              >
                <div style={{ fontSize: 16, opacity: 0.9 }}>Repositories</div>
                <div style={{ marginTop: "4px", fontSize: 30, fontWeight: 700 }}>
                  {`${wrapped.repositories.length}`}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "14px",
                  border: "1px solid rgba(251, 191, 36, 0.35)",
                  background: "rgba(217, 119, 6, 0.2)",
                  padding: "12px 14px",
                  flex: 1,
                }}
              >
                <div style={{ fontSize: 16, opacity: 0.9 }}>Stars</div>
                <div style={{ marginTop: "4px", fontSize: 30, fontWeight: 700 }}>
                  {`${wrapped.metrics.totalStars}`}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "14px",
                  border: "1px solid rgba(74, 222, 128, 0.35)",
                  background: "rgba(22, 163, 74, 0.2)",
                  padding: "12px 14px",
                  flex: 1,
                }}
              >
                <div style={{ fontSize: 16, opacity: 0.9 }}>Followers</div>
                <div style={{ marginTop: "4px", fontSize: 30, fontWeight: 700 }}>
                  {`${wrapped.user.followers}`}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid rgba(148, 163, 184, 0.25)",
                paddingTop: "14px",
              }}
            >
              <div style={{ fontSize: 20 }}>{`Top Language: ${wrapped.metrics.topLanguage ?? "N/A"}`}</div>
              <div style={{ fontSize: 18, opacity: 0.9 }}>
                {`Languages: ${topLanguages || "N/A"}`}
              </div>
            </div>
          </div>
        </div>
      ),
      size,
    );
  } catch {
    return createFallbackImage(username);
  }
}
