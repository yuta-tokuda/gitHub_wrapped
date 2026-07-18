# GitHub Wrapped

GitHubユーザーの活動を Spotify Wrapped 風に可視化する Web サービスです。

## Tech Stack

- Next.js 15 (App Router / TypeScript / RSC)
- Tailwind CSS
- shadcn/ui
- Zod
- Recharts
- Framer Motion
- Vitest + React Testing Library

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

ブラウザで `http://localhost:3000` を開いて確認できます。

## Environment Variables

- `NEXT_PUBLIC_APP_URL`: サイトの公開URL
  - local 例: `http://localhost:3000`
  - production 例: `https://your-app.vercel.app`
- `GITHUB_TOKEN`: GitHub API 用の Personal Access Token
  - 未設定でも動作しますが、レート制限や Pinned Repository 取得精度に影響します

## Scripts

- `pnpm dev`: 開発サーバ起動
- `pnpm build`: 本番ビルド
- `pnpm start`: 本番サーバ起動
- `pnpm lint`: ESLint実行
- `pnpm typecheck`: TypeScript型検査
- `pnpm test`: Vitest実行
- `pnpm test:watch`: Vitest watch
- `pnpm format`: Prettier整形
- `pnpm format:check`: Prettier検査

## Directory

主要ディレクトリは `src` 配下に集約しています。

- `src/app`
- `src/components`
- `src/features`
- `src/lib`
- `src/hooks`
- `src/types`
- `src/utils`
- `src/services`
- `src/constants`

## Deployment (Vercel)

1. Vercel にリポジトリを接続
2. Environment Variables に以下を設定
   - `NEXT_PUBLIC_APP_URL`
   - `GITHUB_TOKEN` (推奨)
3. デプロイ後に以下を確認
   - `/robots.txt`
   - `/sitemap.xml`
   - `/opengraph-image`
   - `/wrapped/<username>/opengraph-image`

## Quality Check

出荷前は以下を実行してください。

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
