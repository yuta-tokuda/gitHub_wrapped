# GitHub Wrapped

GitHubユーザーの公開活動を分析し、Spotify Wrapped風に可視化するWebサービスです。  
プロフィール情報だけでなく、開発傾向・スキル傾向・採用視点のサマリーまで表示します。

## 主な機能

- GitHubユーザー名検索（Server Action + Zodバリデーション）
- Wrappedレポート表示（プロフィール / 指標 /ランキング / チャート）
- Developer Score（100点満点）と内訳表示
- Developer Type 判定
- Achievement Badge（20種）
- Recruiter Summary（採用担当向け要約）
- Skill Map（非エンジニア向けスキル可視化）
- Engineering Insight（人物像・配属相性・面談質問）
- OGP画像生成（`next/og`）
- SEO対応（Metadata / OpenGraph / Twitter Card / JSON-LD / robots / sitemap）

## 技術スタック

- Next.js 15 (App Router / TypeScript / React Server Components)
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Framer Motion
- Recharts
- Zod
- Vitest + React Testing Library
- pnpm

## セットアップ

```bash
pnpm install
cp .env.example .env.local
pnpm dev -- -p 3001
```

> `3000` が他プロセスで利用中のケースがあるため、`3001` 起動例を推奨しています。  
> ブラウザ: `http://localhost:3001`

## 環境変数

`.env.local` に設定します。

- `NEXT_PUBLIC_APP_URL`
  - 公開URL（例: `https://your-app.vercel.app`）
  - Metadata / sitemap / robots / OGP のURL生成に使用
- `GITHUB_TOKEN`
  - GitHub APIトークン（推奨）
  - 未設定でも動作するが、レート制限やPinned Repository取得精度に影響

## スクリプト

- `pnpm dev`: 開発サーバ起動
- `pnpm build`: 本番ビルド
- `pnpm start`: 本番サーバ起動
- `pnpm lint`: ESLint実行
- `pnpm typecheck`: TypeScript型検査
- `pnpm test`: Vitest実行
- `pnpm test:watch`: Vitest watch
- `pnpm format`: Prettier整形
- `pnpm format:check`: Prettier検査

## ディレクトリ構成

主要実装は `src` 配下に集約しています。

- `src/app`: ルーティング、ページ、metadata、OGP
- `src/features`: 画面/ドメイン単位の機能実装
- `src/components`: 共通UIコンポーネント
- `src/lib`: APIクライアント・共通ロジック
- `src/constants`: 定数
- `src/types`: 型定義
- `src/hooks` / `src/utils` / `src/services`: 補助レイヤー

## APIとキャッシュ戦略

- GitHub API処理は `src/lib/github.ts` に集約
- 利用API:
  - REST API（ユーザー、リポジトリ、イベント）
  - GraphQL API（Pinned Repository、トークンがある場合）
- パフォーマンス対策:
  - `fetch` の `force-cache`
  - `next.revalidate`
  - `unstable_cache`

## 分析ロジック概要

### Developer Score（100点）

以下の重みで合算します（上限100点）。

- repositories: 15
- stars: 20
- followers: 15
- contributions: 20
- readmeCoverage: 10
- languageDiversity: 10
- recentActivity: 10

実装: `src/features/wrapped/analysis/developer-score.ts`

### Developer Type / Achievement / Insight

- Developer Type: 言語傾向・スター・活動量から判定
- Achievement: 条件ベースで最大20件
- Engineering Insight: 開発スタイル、協働傾向、成長シグナル、面談質問を生成

実装:

- `src/features/wrapped/analysis/developer-type.ts`
- `src/features/wrapped/analysis/achievements.ts`
- `src/features/wrapped/analysis/engineering-insight.ts`

## 制約と注意点

- 本サービスは **公開データベースの分析** です
- Private Repositoryの情報は原則対象外
- ContributionはGitHubの公開イベント履歴ベースのため、完全な実績を網羅しない場合があります

## デプロイ（Vercel）

1. Vercel にリポジトリを接続
2. Environment Variables を設定
   - `NEXT_PUBLIC_APP_URL`
   - `GITHUB_TOKEN`（推奨）
3. デプロイ後に確認
   - `/robots.txt`
   - `/sitemap.xml`
   - `/opengraph-image`
   - `/wrapped/<username>/opengraph-image`

## 品質チェック

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## トラブルシュート

- `ERR_PNPM_IGNORED_BUILDS` が出る
  - `pnpm-workspace.yaml` の `allowBuilds` を確認（`sharp`, `unrs-resolver`）
- `git status` で `.git` が見つからない
  - ディレクトリ名の大文字小文字違いに注意（`gitHub_wrapped` と `github-wrapped`）
