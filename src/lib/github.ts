import { unstable_cache } from "next/cache";
import { z } from "zod";

import {
  GITHUB_ACCEPT_HEADER,
  GITHUB_API_BASE_URL,
  GITHUB_API_REVALIDATE_SECONDS,
  GITHUB_EVENTS_REVALIDATE_SECONDS,
  GITHUB_GRAPHQL_URL,
  GITHUB_MAX_EVENTS,
  GITHUB_MAX_REPOS_PER_PAGE,
  GITHUB_PINNED_REPOSITORIES_LIMIT,
} from "@/constants/github";
import {
  githubPinnedRepositoryNodeSchema,
  githubPinnedRepositoriesSchema,
  githubPublicEventsSchema,
  githubRepositoryLanguagesSchema,
  githubRepositoriesSchema,
  githubUserSchema,
} from "@/lib/github.schemas";
import type {
  ContributionSummary,
  GitHubRepository,
  GitHubUser,
  LanguageStat,
  RepositoryMetrics,
  WrappedGitHubData,
} from "@/types/github";

const githubErrorSchema = z.object({
  message: z.string(),
  documentation_url: z.string().optional(),
});

const PINNED_REPOSITORIES_QUERY = `
  query GetPinnedRepositories($login: String!) {
    user(login: $login) {
      pinnedItems(first: ${GITHUB_PINNED_REPOSITORIES_LIMIT}, types: REPOSITORY) {
        nodes {
          ... on Repository {
            id
            name
            nameWithOwner
            description
            url
            stargazerCount
            forkCount
            primaryLanguage { name }
            createdAt
            updatedAt
            pushedAt
          }
        }
      }
    }
  }
`;

type GitHubFetchOptions = {
  revalidate?: number;
  tags?: string[];
};

type GitHubPublicEvent = z.infer<typeof githubPublicEventsSchema>[number];
type GitHubPinnedNode = z.infer<typeof githubPinnedRepositoryNodeSchema>;

export class GitHubApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
  }
}

function getGitHubToken(): string | undefined {
  return process.env.GITHUB_TOKEN;
}

function buildGitHubHeaders(): HeadersInit {
  const token = getGitHubToken();

  return {
    Accept: GITHUB_ACCEPT_HEADER,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const json = await response.json();
    const parsed = githubErrorSchema.safeParse(json);
    return parsed.success ? parsed.data.message : "GitHub API request failed";
  } catch {
    return "GitHub API request failed";
  }
}

async function fetchGitHubJson<T>(
  path: string,
  schema: z.ZodType<T>,
  options?: GitHubFetchOptions,
): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers: buildGitHubHeaders(),
    cache: "force-cache",
    next: {
      revalidate: options?.revalidate ?? GITHUB_API_REVALIDATE_SECONDS,
      tags: options?.tags ?? [],
    },
  });

  if (!response.ok) {
    const message = await parseErrorResponse(response);
    throw new GitHubApiError(message, response.status);
  }

  const json = await response.json();
  return schema.parse(json);
}

function toGitHubUser(value: z.infer<typeof githubUserSchema>): GitHubUser {
  return {
    login: value.login,
    name: value.name,
    avatarUrl: value.avatar_url,
    bio: value.bio,
    followers: value.followers,
    following: value.following,
    publicRepos: value.public_repos,
    createdAt: value.created_at,
    updatedAt: value.updated_at,
    htmlUrl: value.html_url,
  };
}

function toGitHubRepository(
  value: z.infer<typeof githubRepositoriesSchema>[number],
): GitHubRepository {
  return {
    id: value.id,
    name: value.name,
    fullName: value.full_name,
    description: value.description,
    htmlUrl: value.html_url,
    stargazersCount: value.stargazers_count,
    forksCount: value.forks_count,
    language: value.language,
    topics: value.topics,
    archived: value.archived,
    fork: value.fork,
    createdAt: value.created_at,
    updatedAt: value.updated_at,
    pushedAt: value.pushed_at,
    languages: value.language ? [value.language] : [],
    hasReadme: false,
  };
}

function toGitHubPinnedRepository(node: GitHubPinnedNode): GitHubRepository {
  return {
    id: node.id,
    name: node.name,
    fullName: node.nameWithOwner,
    description: node.description,
    htmlUrl: node.url,
    stargazersCount: node.stargazerCount,
    forksCount: node.forkCount,
    language: node.primaryLanguage?.name ?? null,
    topics: [],
    archived: false,
    fork: false,
    createdAt: node.createdAt,
    updatedAt: node.updatedAt,
    pushedAt: node.pushedAt,
    languages: node.primaryLanguage?.name ? [node.primaryLanguage.name] : [],
    hasReadme: false,
  };
}

function toSortedLanguageNames(value: Record<string, number>): string[] {
  return Object.entries(value)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}

async function getRepositoryLanguages(
  owner: string,
  repository: GitHubRepository,
): Promise<string[]> {
  try {
    const languages = await fetchGitHubJson(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository.name)}/languages`,
      githubRepositoryLanguagesSchema,
      {
        tags: [`github-repo-languages:${owner}:${repository.name}`],
      },
    );
    return toSortedLanguageNames(languages);
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 404) {
      return repository.language ? [repository.language] : [];
    }

    return repository.language ? [repository.language] : [];
  }
}

export async function withRepositoryLanguages(
  owner: string,
  repositories: GitHubRepository[],
): Promise<GitHubRepository[]> {
  const enriched = await Promise.all(
    repositories.map(async (repository) => {
      const languages = await getRepositoryLanguages(owner, repository);
      return {
        ...repository,
        languages,
      };
    }),
  );

  return enriched;
}

async function hasRepositoryReadme(
  owner: string,
  repository: GitHubRepository,
): Promise<boolean> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
        repository.name,
      )}/readme`,
      {
        headers: buildGitHubHeaders(),
        cache: "force-cache",
        next: {
          revalidate: GITHUB_API_REVALIDATE_SECONDS,
          tags: [`github-repo-readme:${owner}:${repository.name}`],
        },
      },
    );

    if (response.ok) {
      return true;
    }

    if (response.status === 404) {
      return false;
    }

    return false;
  } catch {
    return false;
  }
}

async function withRepositoryReadme(
  owner: string,
  repositories: GitHubRepository[],
): Promise<GitHubRepository[]> {
  const enriched = await Promise.all(
    repositories.map(async (repository) => ({
      ...repository,
      hasReadme: await hasRepositoryReadme(owner, repository),
    })),
  );

  return enriched;
}

export async function getGitHubUser(username: string): Promise<GitHubUser> {
  const data = await fetchGitHubJson(
    `/users/${encodeURIComponent(username)}`,
    githubUserSchema,
    { tags: [`github-user:${username}`] },
  );

  return toGitHubUser(data);
}

export async function getGitHubRepositories(
  username: string,
): Promise<GitHubRepository[]> {
  const data = await fetchGitHubJson(
    `/users/${encodeURIComponent(username)}/repos?per_page=${GITHUB_MAX_REPOS_PER_PAGE}&sort=updated`,
    githubRepositoriesSchema,
    { tags: [`github-repos:${username}`] },
  );

  return data.map(toGitHubRepository);
}

function getLanguageStats(repositories: GitHubRepository[]): LanguageStat[] {
  const counts = repositories.reduce<Map<string, number>>((acc, repository) => {
    if (!repository.language) {
      return acc;
    }

    const current = acc.get(repository.language) ?? 0;
    acc.set(repository.language, current + 1);
    return acc;
  }, new Map<string, number>());

  const total = Array.from(counts.values()).reduce((acc, value) => acc + value, 0);
  if (total === 0) {
    return [];
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      count,
      ratio: Number(((count / total) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count);
}

function getRepositoryMetrics(repositories: GitHubRepository[]): RepositoryMetrics {
  const totalStars = repositories.reduce(
    (acc, repository) => acc + repository.stargazersCount,
    0,
  );
  const totalForks = repositories.reduce(
    (acc, repository) => acc + repository.forksCount,
    0,
  );
  const topRepository =
    repositories
      .slice()
      .sort((a, b) => b.stargazersCount - a.stargazersCount || b.forksCount - a.forksCount)[0] ??
    null;
  const languageStats = getLanguageStats(repositories);

  return {
    totalStars,
    totalForks,
    topRepository,
    topLanguage: languageStats[0]?.name ?? null,
    languageStats,
  };
}

function countContributionUnit(event: GitHubPublicEvent): number {
  if (event.type === "PushEvent") {
    return event.payload?.commits?.length ?? 1;
  }

  if (event.type === "PullRequestEvent" || event.type === "IssuesEvent") {
    return 1;
  }

  return 0;
}

function summarizeContributions(events: GitHubPublicEvent[]): ContributionSummary {
  return {
    totalContributions: events.reduce(
      (acc, event) => acc + countContributionUnit(event),
      0,
    ),
    pushEvents: events.filter((event) => event.type === "PushEvent").length,
    pullRequestEvents: events.filter(
      (event) => event.type === "PullRequestEvent",
    ).length,
    issuesEvents: events.filter((event) => event.type === "IssuesEvent").length,
    sampledEvents: events.length,
  };
}

async function getContributionSummary(username: string): Promise<ContributionSummary> {
  const events = await fetchGitHubJson(
    `/users/${encodeURIComponent(username)}/events/public?per_page=${GITHUB_MAX_EVENTS}`,
    githubPublicEventsSchema,
    {
      revalidate: GITHUB_EVENTS_REVALIDATE_SECONDS,
      tags: [`github-events:${username}`],
    },
  );

  return summarizeContributions(events);
}

async function fetchPinnedRepositoriesResponse(
  username: string,
): Promise<z.infer<typeof githubPinnedRepositoriesSchema> | null> {
  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      ...buildGitHubHeaders(),
      "Content-Type": "application/json",
    },
    cache: "force-cache",
    next: {
      revalidate: GITHUB_API_REVALIDATE_SECONDS,
      tags: [`github-pinned:${username}`],
    },
    body: JSON.stringify({
      query: PINNED_REPOSITORIES_QUERY,
      variables: { login: username },
    }),
  });

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  const parsed = githubPinnedRepositoriesSchema.safeParse(json);
  return parsed.success ? parsed.data : null;
}

async function getPinnedRepositories(
  username: string,
): Promise<GitHubRepository[]> {
  if (!getGitHubToken()) {
    return [];
  }

  const parsed = await fetchPinnedRepositoriesResponse(username);
  const nodes = parsed?.data.user?.pinnedItems.nodes ?? [];
  return nodes.map(toGitHubPinnedRepository);
}

async function fetchWrappedGitHubData(
  username: string,
): Promise<WrappedGitHubData> {
  const [user, repositoriesBase, pinnedRepositories, contributions] = await Promise.all([
    getGitHubUser(username),
    getGitHubRepositories(username),
    getPinnedRepositories(username),
    getContributionSummary(username),
  ]);
  const repositories = await withRepositoryReadme(username, repositoriesBase);

  return {
    user,
    repositories,
    pinnedRepositories,
    metrics: getRepositoryMetrics(repositories),
    contributions,
  };
}

export async function getWrappedGitHubData(
  username: string,
): Promise<WrappedGitHubData> {
  const normalizedUsername = username.trim();

  return unstable_cache(
    async () => fetchWrappedGitHubData(normalizedUsername),
    [`wrapped-data:v2:${normalizedUsername}`],
    {
      revalidate: GITHUB_API_REVALIDATE_SECONDS,
      tags: [`wrapped:${normalizedUsername}`],
    },
  )();
}
