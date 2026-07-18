import { Search } from "lucide-react";

import { searchGitHubUserAction } from "@/features/home/actions";

type SearchFormProps = {
  defaultUsername: string;
  errorMessage: string | null;
};

export function SearchForm({ defaultUsername, errorMessage }: SearchFormProps) {
  return (
    <form action={searchGitHubUserAction} className="mt-8 w-full max-w-xl">
      <label className="sr-only" htmlFor="github-username">
        GitHubユーザー名
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          aria-describedby={errorMessage ? "github-username-error" : undefined}
          className="h-12 w-full rounded-md border bg-card px-4 text-base text-card-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue={defaultUsername}
          id="github-username"
          name="username"
          placeholder="例: torvalds"
          required
          type="text"
        />
        <button
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
          type="submit"
        >
          <Search className="size-4" aria-hidden />
          検索
        </button>
      </div>
      {errorMessage ? (
        <p
          className="mt-3 text-left text-sm text-destructive"
          id="github-username-error"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
