import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-bold">ページが見つかりません</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        URLをご確認のうえ、トップページから再度お試しください。
      </p>
      <Link
        className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90"
        href="/"
      >
        トップへ戻る
      </Link>
    </main>
  );
}
