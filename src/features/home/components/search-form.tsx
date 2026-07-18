import { searchGitHubUserAction } from "@/features/home/actions";
import { SearchSubmitButton } from "@/features/home/components/search-submit-button";

type SearchFormProps = {
  defaultUsername: string;
  errorMessage: string | null;
};

export function SearchForm({ defaultUsername, errorMessage }: SearchFormProps) {
  return (
    <form
      action={searchGitHubUserAction}
      aria-live="polite"
      className="mt-8 w-full max-w-xl"
    >
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
        <SearchSubmitButton />
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
