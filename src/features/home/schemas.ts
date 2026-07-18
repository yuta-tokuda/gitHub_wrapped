import { z } from "zod";

const GITHUB_USERNAME_REGEX = /^(?!-)(?!.*--)[a-z\d-]{1,39}(?<!-)$/i;

export const searchGitHubUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "GitHubユーザー名を入力してください。")
    .regex(
      GITHUB_USERNAME_REGEX,
      "GitHubユーザー名の形式が正しくありません。",
    ),
});

export type SearchGitHubUsernameInput = z.infer<
  typeof searchGitHubUsernameSchema
>;
