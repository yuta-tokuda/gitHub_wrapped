import Link from "next/link";
import { ListOrdered } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { CardHeader } from "@/features/wrapped/components/card-header";
import type { GitHubRepository } from "@/types/github";

import { formatDate, formatNumber } from "../utils";

type RepositoriesListCardProps = {
  repositories: GitHubRepository[];
};

const LANGUAGE_BADGE_COLORS = [
  "border-emerald-300/40 bg-emerald-500/10 text-emerald-100",
  "border-sky-300/40 bg-sky-500/10 text-sky-100",
  "border-violet-300/40 bg-violet-500/10 text-violet-100",
  "border-amber-300/40 bg-amber-500/10 text-amber-100",
  "border-rose-300/40 bg-rose-500/10 text-rose-100",
] as const;

const RANK_HIGHLIGHT_COLORS = [
  "border-yellow-300/50 bg-yellow-500/15 text-yellow-100",
  "border-slate-300/50 bg-slate-500/15 text-slate-100",
  "border-orange-300/50 bg-orange-500/15 text-orange-100",
] as const;

export function RepositoriesListCard({ repositories }: RepositoriesListCardProps) {
  if (repositories.length === 0) {
    return (
      <EmptyState
        description="このユーザーには公開リポジトリが見つかりませんでした。"
        title="Repositoryデータがありません"
      />
    );
  }

  return (
    <section className="glass-card border-l-4 border-l-blue-400/70 p-6">
      <CardHeader
        description="Stars順の上位リポジトリに、概要と技術情報を添えて表示しています。"
        icon={ListOrdered}
        iconClassName="bg-blue-500/15 text-blue-300"
        title="リポジトリランキング"
      />
      <ol className="mt-5 space-y-3">
        {repositories.map((repository, index) => (
          <li
            className="rounded-lg border border-blue-300/20 bg-blue-500/[0.03] p-4"
            key={`${repository.id}-${repository.name}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${
                    RANK_HIGHLIGHT_COLORS[index] ??
                    "border-blue-300/40 bg-blue-500/10 text-blue-100"
                  }`}
                >
                  #{index + 1}
                </p>
                <h3 className="font-semibold">{repository.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {repository.description ?? "説明が未設定です。"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  更新日: {formatDate(repository.updatedAt)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {(repository.languages ?? (repository.language ? [repository.language] : [])).map(
                    (language, languageIndex) => (
                      <span
                        className={`rounded-md border px-2 py-1 font-medium ${
                          LANGUAGE_BADGE_COLORS[languageIndex % LANGUAGE_BADGE_COLORS.length]
                        }`}
                        key={language}
                      >
                        {language}
                      </span>
                    ),
                  )}
                  {repository.topics.slice(0, 3).map((topic) => (
                    <span
                      className="rounded-md border border-cyan-300/30 bg-cyan-500/10 px-2 py-1 text-cyan-100"
                      key={topic}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-amber-200">
                  ★ {formatNumber(repository.stargazersCount)}
                </p>
                <p className="text-sky-200/90">
                  Fork {formatNumber(repository.forksCount)}
                </p>
              </div>
            </div>
            <Link
              className="mt-3 inline-flex text-sm underline underline-offset-4"
              href={repository.htmlUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              リポジトリを見る
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
