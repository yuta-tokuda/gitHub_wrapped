import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { APP_NAME } from "@/constants/app";
import type {
  Achievement,
  DeveloperDnaProfile,
  DeveloperPersonality,
  DeveloperScoreResult,
  DeveloperType,
  MvpDiagnostic,
} from "@/features/wrapped/analysis/types";
import type { FuturePotentialInsight } from "@/features/wrapped/analysis/future-potential";
import type { GrowthCurveInsight } from "@/features/wrapped/analysis/growth-curve";
import type { LanguageDiversityInsight } from "@/features/wrapped/analysis/language-diversity";
import type { RecruiterSummary } from "@/features/wrapped/analysis/recruiter-summary";
import type { RepositoryHealthInsight } from "@/features/wrapped/analysis/repository-health";
import type { RepositoryInsights } from "@/features/wrapped/analysis/repository-insights";
import type { SkillArea } from "@/features/wrapped/analysis/skill-profile";
import type { EngineeringInsight } from "@/features/wrapped/analysis/engineering-insight";
import type { PublicDataInsight } from "@/features/wrapped/analysis/public-data-insight";
import { AchievementsCard } from "@/features/wrapped/components/achievements-card";
import { AnimatedCardSection } from "@/features/wrapped/components/animated-card-section";
import { ContributionsCard } from "@/features/wrapped/components/contributions-card";
import { DeveloperDnaCard } from "@/features/wrapped/components/developer-dna-card";
import { DeveloperPersonalityCard } from "@/features/wrapped/components/developer-personality-card";
import { DeveloperScoreCard } from "@/features/wrapped/components/developer-score-card";
import { DeveloperTypeCard } from "@/features/wrapped/components/developer-type-card";
import { EngineeringInsightCard } from "@/features/wrapped/components/engineering-insight-card";
import { FuturePotentialCard } from "@/features/wrapped/components/future-potential-card";
import { GrowthCurveCard } from "@/features/wrapped/components/growth-curve-card";
import { LanguageDiversityCard } from "@/features/wrapped/components/language-diversity-card";
import { LanguagePieChartCard } from "@/features/wrapped/components/language-pie-chart-card";
import { MetricsCard } from "@/features/wrapped/components/metrics-card";
import { MvpDiagnosticsCard } from "@/features/wrapped/components/mvp-diagnostics-card";
import { ProfileCard } from "@/features/wrapped/components/profile-card";
import { PublicDataInsightCard } from "@/features/wrapped/components/public-data-insight-card";
import { RepositoriesListCard } from "@/features/wrapped/components/repositories-list-card";
import { RecruiterSummaryCard } from "@/features/wrapped/components/recruiter-summary-card";
import { RepositoryHealthCard } from "@/features/wrapped/components/repository-health-card";
import { RepositoryInsightsCard } from "@/features/wrapped/components/repository-insights-card";
import { RepositoryRankingChartCard } from "@/features/wrapped/components/repository-ranking-chart-card";
import { ShareActions } from "@/features/wrapped/components/share-actions";
import { SkillProfileCard } from "@/features/wrapped/components/skill-profile-card";
import type { WrappedGitHubData } from "@/types/github";

type WrappedPageContentProps = {
  data: WrappedGitHubData;
  username: string;
  score: DeveloperScoreResult;
  developerDna: DeveloperDnaProfile;
  developerPersonality: DeveloperPersonality;
  developerType: DeveloperType;
  recruiterSummary: RecruiterSummary;
  skillProfile: SkillArea[];
  engineeringInsight: EngineeringInsight;
  publicDataInsight: PublicDataInsight;
  mvpDiagnostics: MvpDiagnostic[];
  languageDiversity: LanguageDiversityInsight;
  repositoryHealth: RepositoryHealthInsight;
  growthCurve: GrowthCurveInsight;
  futurePotential: FuturePotentialInsight;
  repositoryInsights: RepositoryInsights;
  achievements: Achievement[];
  rankingRepositories: WrappedGitHubData["repositories"];
};

function WrappedHeader({ username }: { username: string }) {
  return (
    <header className="glass-card p-6">
      <p className="text-sm text-muted-foreground">{APP_NAME}</p>
      <h1 className="mt-1 bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">
        {username} のレポート
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        GitHubデータをもとに、開発傾向を1ページ1カードで可視化しています。
      </p>
      <ShareActions username={username} />
      <Link className="mt-4 inline-flex text-sm underline underline-offset-4" href="/">
        別のユーザーを検索する
      </Link>
    </header>
  );
}

function PinnedSection({ repositories }: { repositories: WrappedGitHubData["repositories"] }) {
  if (repositories.length > 0) {
    return <RepositoriesListCard repositories={repositories} />;
  }

  return (
    <EmptyState
      description="ピン留めリポジトリは取得できませんでした。Token設定時に取得精度が向上します。"
      title="ピン留めリポジトリデータなし"
    />
  );
}

export function WrappedPageContent({
  data,
  username,
  score,
  developerDna,
  developerPersonality,
  developerType,
  recruiterSummary,
  skillProfile,
  engineeringInsight,
  publicDataInsight,
  mvpDiagnostics,
  languageDiversity,
  repositoryHealth,
  growthCurve,
  futurePotential,
  repositoryInsights,
  achievements,
  rankingRepositories,
}: WrappedPageContentProps) {
  return (
    <main className="report-surface mx-auto w-full max-w-6xl space-y-5 px-2 py-6 sm:space-y-6 sm:py-8">
      <AnimatedCardSection>
        <WrappedHeader username={username} />
      </AnimatedCardSection>
      <section className="grid gap-5 px-4 sm:px-6 lg:grid-cols-2">
        <AnimatedCardSection>
          <ProfileCard user={data.user} />
        </AnimatedCardSection>
        <AnimatedCardSection>
          <MetricsCard metrics={data.metrics} />
        </AnimatedCardSection>
      </section>
      <section className="grid gap-5 px-4 sm:px-6 lg:grid-cols-2">
        <AnimatedCardSection>
          <ContributionsCard contributions={data.contributions} />
        </AnimatedCardSection>
        <AnimatedCardSection>
          <DeveloperScoreCard score={score} />
        </AnimatedCardSection>
      </section>
      <section className="grid gap-5 px-4 sm:px-6 lg:grid-cols-2">
        <AnimatedCardSection>
          <DeveloperTypeCard developerType={developerType} />
        </AnimatedCardSection>
        <AnimatedCardSection>
          <RecruiterSummaryCard summary={recruiterSummary} />
        </AnimatedCardSection>
      </section>
      <section className="grid gap-5 px-4 sm:px-6 lg:grid-cols-2">
        <AnimatedCardSection>
          <DeveloperDnaCard profile={developerDna} />
        </AnimatedCardSection>
        <AnimatedCardSection>
          <DeveloperPersonalityCard personality={developerPersonality} />
        </AnimatedCardSection>
      </section>
      <AnimatedCardSection>
        <SkillProfileCard skills={skillProfile} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <EngineeringInsightCard insight={engineeringInsight} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <PublicDataInsightCard insight={publicDataInsight} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <AchievementsCard achievements={achievements} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <MvpDiagnosticsCard diagnostics={mvpDiagnostics} />
      </AnimatedCardSection>
      <section className="grid gap-5 px-4 sm:px-6 lg:grid-cols-2">
        <AnimatedCardSection>
          <LanguageDiversityCard insight={languageDiversity} />
        </AnimatedCardSection>
        <AnimatedCardSection>
          <RepositoryHealthCard insight={repositoryHealth} />
        </AnimatedCardSection>
      </section>
      <section className="grid gap-5 px-4 sm:px-6 lg:grid-cols-2">
        <AnimatedCardSection>
          <GrowthCurveCard insight={growthCurve} />
        </AnimatedCardSection>
        <AnimatedCardSection>
          <FuturePotentialCard insight={futurePotential} />
        </AnimatedCardSection>
      </section>
      <AnimatedCardSection>
        <RepositoryInsightsCard insight={repositoryInsights} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <LanguagePieChartCard languageStats={data.metrics.languageStats} />
      </AnimatedCardSection>
      <section className="grid gap-5 px-4 sm:px-6 lg:grid-cols-2">
        <AnimatedCardSection>
          <RepositoryRankingChartCard repositories={rankingRepositories} />
        </AnimatedCardSection>
        <AnimatedCardSection>
          <PinnedSection repositories={data.pinnedRepositories} />
        </AnimatedCardSection>
      </section>
      <AnimatedCardSection>
        <RepositoriesListCard repositories={rankingRepositories} />
      </AnimatedCardSection>
    </main>
  );
}
