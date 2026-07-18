import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { APP_NAME } from "@/constants/app";
import type {
  Achievement,
  DeveloperScoreResult,
  DeveloperType,
} from "@/features/wrapped/analysis/types";
import { AchievementsCard } from "@/features/wrapped/components/achievements-card";
import { AnimatedCardSection } from "@/features/wrapped/components/animated-card-section";
import { ContributionsCard } from "@/features/wrapped/components/contributions-card";
import { DeveloperScoreCard } from "@/features/wrapped/components/developer-score-card";
import { DeveloperTypeCard } from "@/features/wrapped/components/developer-type-card";
import { LanguagePieChartCard } from "@/features/wrapped/components/language-pie-chart-card";
import { MetricsCard } from "@/features/wrapped/components/metrics-card";
import { ProfileCard } from "@/features/wrapped/components/profile-card";
import { RepositoriesListCard } from "@/features/wrapped/components/repositories-list-card";
import { RepositoryRankingChartCard } from "@/features/wrapped/components/repository-ranking-chart-card";
import type { WrappedGitHubData } from "@/types/github";

type WrappedPageContentProps = {
  data: WrappedGitHubData;
  username: string;
  score: DeveloperScoreResult;
  developerType: DeveloperType;
  achievements: Achievement[];
  rankingRepositories: WrappedGitHubData["repositories"];
};

function WrappedHeader({ username }: { username: string }) {
  return (
    <header className="rounded-2xl border bg-card p-6">
      <p className="text-sm text-muted-foreground">{APP_NAME}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-5xl">
        {username} Wrapped
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        GitHubデータをもとに、開発傾向を1ページ1カードで可視化しています。
      </p>
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
      description="Pinned Repositoryは取得できませんでした。Token設定時に取得精度が向上します。"
      title="Pinned Repositoryデータなし"
    />
  );
}

export function WrappedPageContent({
  data,
  username,
  score,
  developerType,
  achievements,
  rankingRepositories,
}: WrappedPageContentProps) {
  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-auto">
      <AnimatedCardSection>
        <WrappedHeader username={username} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <ProfileCard user={data.user} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <MetricsCard metrics={data.metrics} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <ContributionsCard contributions={data.contributions} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <DeveloperScoreCard score={score} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <DeveloperTypeCard developerType={developerType} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <AchievementsCard achievements={achievements} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <LanguagePieChartCard languageStats={data.metrics.languageStats} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <RepositoryRankingChartCard repositories={rankingRepositories} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <PinnedSection repositories={data.pinnedRepositories} />
      </AnimatedCardSection>
      <AnimatedCardSection>
        <RepositoriesListCard repositories={rankingRepositories} />
      </AnimatedCardSection>
    </main>
  );
}
