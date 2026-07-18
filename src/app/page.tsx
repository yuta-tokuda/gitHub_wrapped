import type { Metadata } from "next";

import { APP_DESCRIPTION, APP_NAME } from "@/constants/app";
import { SearchForm } from "@/features/home/components/search-form";

type HomePageProps = {
  searchParams?: Promise<{
    error?: string;
    username?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Top",
  description: APP_DESCRIPTION,
};

function decodeParam(value: string | undefined): string {
  if (!value) {
    return "";
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = (await searchParams) ?? {};
  const errorMessage = decodeParam(params.error);
  const defaultUsername = decodeParam(params.username);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="rounded-full border bg-card px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
        Spotify Wrapped Inspired
      </p>
      <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
        {APP_NAME}
      </h1>
      <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
        GitHubユーザー名を入力すると、プロフィール・リポジトリ傾向・活動量を
        1ページ1カードのWrapped形式で表示します。
      </p>
      <SearchForm defaultUsername={defaultUsername} errorMessage={errorMessage || null} />
      <section className="mt-10 grid w-full max-w-4xl gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Profile Insights</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Followers・Repository・Top Languageを可視化
          </p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Developer Score</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            活動量や更新頻度などから100点満点で算出
          </p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Achievement</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            コーディング傾向に応じた独自バッジを付与
          </p>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Share Ready</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            SNSシェア向けOG画像を自動生成
          </p>
        </article>
      </section>
    </main>
  );
}
