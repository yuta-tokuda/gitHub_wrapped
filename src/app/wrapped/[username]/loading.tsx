export default function WrappedUserLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-4 px-6 py-16">
      <div
        aria-label="Wrappedデータを読み込み中"
        className="size-10 animate-spin rounded-full border-4 border-muted border-t-foreground"
        role="status"
      />
      <p className="text-sm text-muted-foreground">GitHubデータを取得中です...</p>
    </main>
  );
}
