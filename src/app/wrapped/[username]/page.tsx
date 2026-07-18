import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { APP_NAME, APP_URL } from "@/constants/app";
import { collectAchievements } from "@/features/wrapped/analysis/achievements";
import { TOP_REPOSITORIES_LIMIT } from "@/features/wrapped/analysis/constants";
import { calculateDeveloperScore } from "@/features/wrapped/analysis/developer-score";
import { analyzeDeveloperType } from "@/features/wrapped/analysis/developer-type";
import { buildEngineeringInsight } from "@/features/wrapped/analysis/engineering-insight";
import { buildRecruiterSummary } from "@/features/wrapped/analysis/recruiter-summary";
import { buildSkillProfile } from "@/features/wrapped/analysis/skill-profile";
import { WrappedPageContent } from "@/features/wrapped/components/wrapped-page-content";
import { GitHubApiError, getWrappedGitHubData } from "@/lib/github";

type WrappedPageProps = {
  params: Promise<{
    username: string;
  }>;
};

function toTitle(username: string): string {
  return `${username} Wrapped`;
}

export async function generateMetadata({
  params,
}: WrappedPageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: toTitle(username),
    description: `${username} のGitHub Wrapped`,
    alternates: {
      canonical: `/wrapped/${username}`,
    },
    openGraph: {
      title: toTitle(username),
      description: `${username} のGitHub Wrapped`,
      url: `${APP_URL}/wrapped/${username}`,
      images: [`/wrapped/${username}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: toTitle(username),
      description: `${username} のGitHub Wrapped`,
      images: [`/wrapped/${username}/opengraph-image`],
    },
  };
}

async function fetchWrappedData(username: string) {
  try {
    return await getWrappedGitHubData(username);
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}

function createJsonLd(username: string): string {
  const payload = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${username} Wrapped`,
    url: `${APP_URL}/wrapped/${username}`,
    description: `${username} のGitHub Wrappedページ`,
    isPartOf: {
      "@type": "WebSite",
      name: APP_NAME,
      url: APP_URL,
    },
  };

  return JSON.stringify(payload);
}

export default async function WrappedPage({ params }: WrappedPageProps) {
  const { username } = await params;
  const data = await fetchWrappedData(username);
  const score = calculateDeveloperScore(data);
  const developerType = analyzeDeveloperType(data);
  const recruiterSummary = buildRecruiterSummary(data, score, developerType);
  const skillProfile = buildSkillProfile(data);
  const engineeringInsight = buildEngineeringInsight(data, score);
  const achievements = collectAchievements(data);
  const rankingRepositories = data.repositories
    .slice()
    .sort((a, b) => b.stargazersCount - a.stargazersCount)
    .slice(0, TOP_REPOSITORIES_LIMIT);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: createJsonLd(username) }}
        type="application/ld+json"
      />
      <WrappedPageContent
        achievements={achievements}
        data={data}
        developerType={developerType}
        engineeringInsight={engineeringInsight}
        recruiterSummary={recruiterSummary}
        skillProfile={skillProfile}
        rankingRepositories={rankingRepositories}
        score={score}
        username={data.user.login}
      />
    </>
  );
}
