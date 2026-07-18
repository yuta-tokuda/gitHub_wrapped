"use client";

import { Loader2, Search } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SearchSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      aria-busy={pending}
      className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 px-5 text-sm font-medium text-white shadow-lg shadow-emerald-500/25 transition-all hover:opacity-95 hover:shadow-emerald-500/35 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <>
          <Loader2 aria-hidden className="size-4 animate-spin" />
          取得中...
        </>
      ) : (
        <>
          <Search aria-hidden className="size-4" />
          検索
        </>
      )}
    </button>
  );
}
