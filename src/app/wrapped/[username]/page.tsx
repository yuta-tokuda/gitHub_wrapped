import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { APP_NAME, APP_URL } from "@/constants/app";
import { collectAchievements } from "@/features/wrapped/analysis/achievements";
import { TOP_REPOSITORIES_LIMIT } from "@/features/wrapped/analysis/constants";
import { calculateDeveloperScore } from "@/features/wrapped/analysis/developer-score";
import { buildDeveloperDnaProfile } from "@/features/wrapped/analysis/developer-dna";
import { analyzeDeveloperPersonality } from "@/features/wrapped/analysis/developer-personality";
import { analyzeDeveloperType } from "@/features/wrapped/analysis/developer-type";
import { buildEngineeringInsight } from "@/features/wrapped/analysis/engineering-insight";
import { buildFuturePotentialInsight } from "@/features/wrapped/analysis/future-potential";
import { buildGrowthCurveInsight } from "@/features/wrapped/analysis/growth-curve";
import { buildLanguageDiversityInsight } from "@/features/wrapped/analysis/language-diversity";
import { buildMvpDiagnostics } from "@/features/wrapped/analysis/mvp-diagnostics";
import { buildPublicDataInsight } from "@/features/wrapped/analysis/public-data-insight";
import { buildRecruiterSummary } from "@/features/wrapped/analysis/recruiter-summary";
import { buildRepositoryHealthInsight } from "@/features/wrapped/analysis/repository-health";
import { buildRepositoryInsights } from "@/features/wrapped/analysis/repository-insights";
import { buildSkillProfile } from "@/features/wrapped/analysis/skill-profile";
import { WrappedPageContent } from "@/features/wrapped/components/wrapped-page-content";
import {
  GitHubApiError,
  getWrappedGitHubData,
  withRepositoryLanguages,
} from "@/lib/github";

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
  const developerDna = buildDeveloperDnaProfile(data);
  const developerPersonality = analyzeDeveloperPersonality(developerDna);
  const developerType = analyzeDeveloperType(data);
  const recruiterSummary = buildRecruiterSummary(data, score, developerType);
  const skillProfile = buildSkillProfile(data);
  const engineeringInsight = buildEngineeringInsight(data, score);
  const publicDataInsight = buildPublicDataInsight(data);
  const languageDiversity = buildLanguageDiversityInsight(data);
  const mvpDiagnostics = buildMvpDiagnostics(data);
  const repositoryHealth = buildRepositoryHealthInsight(data);
  const growthCurve = buildGrowthCurveInsight(data);
  const futurePotential = buildFuturePotentialInsight(developerDna, score, growthCurve);
  const repositoryInsights = buildRepositoryInsights(data);
  const achievements = collectAchievements(data);
  const rankingRepositoriesBase = data.repositories
    .slice()
    .sort((a, b) => b.stargazersCount - a.stargazersCount)
    .slice(0, TOP_REPOSITORIES_LIMIT);
  const rankingRepositories = await withRepositoryLanguages(
    data.user.login,
    rankingRepositoriesBase,
  );

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: createJsonLd(username) }}
        type="application/ld+json"
      />
      <WrappedPageContent
        achievements={achievements}
        data={data}
        developerDna={developerDna}
        developerPersonality={developerPersonality}
        developerType={developerType}
        engineeringInsight={engineeringInsight}
        futurePotential={futurePotential}
        growthCurve={growthCurve}
        languageDiversity={languageDiversity}
        mvpDiagnostics={mvpDiagnostics}
        publicDataInsight={publicDataInsight}
        recruiterSummary={recruiterSummary}
        repositoryHealth={repositoryHealth}
        repositoryInsights={repositoryInsights}
        skillProfile={skillProfile}
        rankingRepositories={rankingRepositories}
        score={score}
        username={data.user.login}
      />
    </>
  );
}
