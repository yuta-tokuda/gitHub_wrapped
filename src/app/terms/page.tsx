import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約",
  description: "GitHub Wrapped の利用規約",
};

export default function TermsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-10 sm:py-14">
      <section className="glass-card p-6 sm:p-8">
        <p className="text-sm text-muted-foreground">Terms</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">利用規約</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          本サービスは、GitHub上で公開されている情報をもとに分析結果を表示する参考ツールです。
          ご利用前に以下の内容をご確認ください。
        </p>
      </section>

      <section className="mt-5 space-y-4">
        <article className="glass-card p-6">
          <h2 className="text-base font-semibold">1. 提供内容</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            本サービスは、GitHub REST API / GraphQL APIから取得できる公開情報を集計し、
            プロフィール・活動傾向・診断結果を表示します。分析結果は参考情報であり、
            実務能力や成果を保証するものではありません。
          </p>
        </article>

        <article className="glass-card p-6">
          <h2 className="text-base font-semibold">2. 取得データの範囲</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            取得対象は公開情報に限られます。Private Repositoryや非公開情報、
            利用者本人が公開していない情報は取得しません。
          </p>
        </article>

        <article className="glass-card p-6">
          <h2 className="text-base font-semibold">3. 利用上の注意</h2>
          <ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted-foreground">
            <li>・分析結果は公開データ量や更新状況により変動します。</li>
            <li>・公開情報であっても、第三者への転載や再利用は各種規約に従ってください。</li>
            <li>・本サービスの内容は予告なく変更・停止する場合があります。</li>
          </ul>
        </article>

        <article className="glass-card p-6">
          <h2 className="text-base font-semibold">4. 免責事項</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            本サービスの利用により生じた損害について、運営者は可能な範囲での改善対応を行いますが、
            直接・間接を問わず責任を負いかねる場合があります。
          </p>
        </article>

        <article className="glass-card p-6">
          <h2 className="text-base font-semibold">5. 規約の変更</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            本規約は必要に応じて改定されます。改定後は本ページへの掲載時点で効力を生じます。
          </p>
          <p className="mt-3 text-xs text-muted-foreground">最終更新日: 2026-07-19</p>
        </article>
      </section>

      <div className="mt-8">
        <Link
          className="inline-flex rounded-md border px-4 py-2 text-sm transition-colors hover:bg-accent"
          href="/"
        >
          トップへ戻る
        </Link>
      </div>
    </main>
  );
}
