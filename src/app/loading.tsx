export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-16">
      <div
        aria-label="ページを読み込み中"
        className="size-10 animate-spin rounded-full border-4 border-muted border-t-foreground"
        role="status"
      />
    </main>
  );
}
