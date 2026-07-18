"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm text-muted-foreground">Unexpected Error</p>
      <h1 className="mt-2 text-2xl font-bold">エラーが発生しました</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        {error.message || "時間をおいて再度お試しください。"}
      </p>
      <button
        className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90"
        onClick={reset}
        type="button"
      >
        再試行
      </button>
    </main>
  );
}
