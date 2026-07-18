import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import type { GitHubRepository } from "@/types/github";

import { formatDate, formatNumber } from "../utils";

type RepositoriesListCardProps = {
  repositories: GitHubRepository[];
};

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
    <section className="rounded-2xl border bg-card p-6">
      <h2 className="text-xl font-semibold">リポジトリランキング</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Stars順の上位リポジトリを表示しています。
      </p>
      <ol className="mt-5 space-y-3">
        {repositories.map((repository, index) => (
          <li className="rounded-lg border p-4" key={`${repository.id}-${repository.name}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">#{index + 1}</p>
                <h3 className="font-semibold">{repository.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  更新日: {formatDate(repository.updatedAt)}
                </p>
              </div>
              <div className="text-right text-sm">
                <p>★ {formatNumber(repository.stargazersCount)}</p>
                <p className="text-muted-foreground">
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
