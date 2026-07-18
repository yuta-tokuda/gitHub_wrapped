import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";

import type { GitHubUser } from "@/types/github";
import { CardHeader } from "@/features/wrapped/components/card-header";

import { formatDate, formatNumber } from "../utils";

type ProfileCardProps = {
  user: GitHubUser;
};

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-emerald-400/70 p-6">
      <CardHeader
        description="プロフィールと基本指標"
        icon={UserRound}
        iconClassName="bg-emerald-500/15 text-emerald-300"
        title="プロフィール"
      />
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
        <Image
          alt={`${user.login} icon`}
          className="size-24 rounded-full border"
          height={96}
          src={user.avatarUrl}
          width={96}
        />
        <div className="min-w-0">
          <h2 className="text-2xl font-bold">{user.name ?? user.login}</h2>
          <p className="text-sm text-muted-foreground">@{user.login}</p>
          {user.bio ? <p className="mt-3 text-sm text-card-foreground">{user.bio}</p> : null}
          <p className="mt-3 text-xs text-muted-foreground">
            GitHub参加日: {formatDate(user.createdAt)}
          </p>
          <Link
            className="mt-4 inline-flex rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
            href={user.htmlUrl}
            rel="noreferrer noopener"
            target="_blank"
          >
            GitHubプロフィールを見る
          </Link>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border px-3 py-4">
          <dt className="text-xs text-muted-foreground">フォロワー</dt>
          <dd className="mt-1 text-xl font-semibold">{formatNumber(user.followers)}</dd>
        </div>
        <div className="rounded-lg border px-3 py-4">
          <dt className="text-xs text-muted-foreground">フォロー中</dt>
          <dd className="mt-1 text-xl font-semibold">{formatNumber(user.following)}</dd>
        </div>
        <div className="rounded-lg border px-3 py-4">
          <dt className="text-xs text-muted-foreground">公開リポジトリ</dt>
          <dd className="mt-1 text-xl font-semibold">{formatNumber(user.publicRepos)}</dd>
        </div>
      </dl>
    </section>
  );
}
