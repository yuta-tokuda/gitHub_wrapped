import Link from "next/link";

export default function WrappedUserNotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-bold">ユーザーが見つかりません</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        入力したGitHubユーザー名が存在しないか、現在取得できません。
      </p>
      <Link
        className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90"
        href="/"
      >
        トップページに戻る
      </Link>
    </main>
  );
}
