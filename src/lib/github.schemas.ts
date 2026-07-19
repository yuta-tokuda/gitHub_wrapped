import { z } from "zod";

export const githubUserSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  avatar_url: z.url(),
  bio: z.string().nullable(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
  public_repos: z.number().int().nonnegative(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  html_url: z.url(),
});

export const githubRepositorySchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  html_url: z.url(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  language: z.string().nullable(),
  topics: z.array(z.string()).nullish().transform((value) => value ?? []),
  archived: z.boolean(),
  fork: z.boolean(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  // Empty repos can have null pushed_at
  pushed_at: z.iso.datetime().nullable(),
});

export const githubRepositoriesSchema = z.array(githubRepositorySchema);

const githubEventPayloadSchema = z
  .object({
    commits: z.array(z.object({})).nullish(),
  })
  .passthrough();

export const githubPublicEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  created_at: z.iso.datetime(),
  payload: githubEventPayloadSchema.nullish(),
});

export const githubPublicEventsSchema = z.array(githubPublicEventSchema);

export const githubPinnedRepositoryNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameWithOwner: z.string(),
  description: z.string().nullable(),
  url: z.url(),
  stargazerCount: z.number().int().nonnegative(),
  forkCount: z.number().int().nonnegative(),
  primaryLanguage: z
    .object({
      name: z.string(),
    })
    .nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  pushedAt: z.iso.datetime().nullable(),
});

export const githubPinnedRepositoriesSchema = z.object({
  data: z.object({
    user: z
      .object({
        pinnedItems: z.object({
          // GraphQL may include null nodes for deleted/inaccessible items
          nodes: z.array(githubPinnedRepositoryNodeSchema.nullable()),
        }),
      })
      .nullable(),
  }),
});

export const githubRepositoryLanguagesSchema = z.record(
  z.string(),
  z.number().int().nonnegative(),
);
