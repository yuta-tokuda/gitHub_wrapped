"use server";

import { redirect } from "next/navigation";

import { searchGitHubUsernameSchema } from "@/features/home/schemas";

const ERROR_QUERY_KEY = "error";
const USERNAME_QUERY_KEY = "username";

function createHomeRedirectUrl(error: string, username: string): string {
  const params = new URLSearchParams();
  params.set(ERROR_QUERY_KEY, error);
  params.set(USERNAME_QUERY_KEY, username);
  return `/?${params.toString()}`;
}

export async function searchGitHubUserAction(formData: FormData): Promise<void> {
  const rawUsername = String(formData.get("username") ?? "");
  const result = searchGitHubUsernameSchema.safeParse({ username: rawUsername });

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "入力内容を確認してください。";
    redirect(createHomeRedirectUrl(message, rawUsername.trim()));
  }

  redirect(`/wrapped/${result.data.username}`);
}
