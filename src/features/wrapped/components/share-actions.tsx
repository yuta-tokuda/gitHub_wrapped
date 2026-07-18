"use client";

import { Copy, ExternalLink, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ShareActionsProps = {
  username: string;
};

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function createShareText(username: string): string {
  return `${username} のGitHub Wrappedをチェック！`;
}

function createXIntentUrl(text: string, url: string): string {
  const params = new URLSearchParams({
    text,
    url,
  });

  return `https://x.com/intent/tweet?${params.toString()}`;
}

export function ShareActions({ username }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shareUrl = useMemo(() => {
    if (!mounted || typeof window === "undefined") {
      return "";
    }

    return window.location.href;
  }, [mounted]);

  const shareText = createShareText(username);
  const xIntentUrl = shareUrl ? createXIntentUrl(shareText, shareUrl) : "#";
  const canUseNativeShare =
    mounted &&
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function";

  const handleCopy = async () => {
    if (!shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (!canUseNativeShare || !shareUrl) {
      return;
    }

    try {
      await navigator.share({
        title: "GitHub Wrapped",
        text: shareText,
        url: shareUrl,
      });
    } catch (error) {
      if (isAbortError(error)) {
        return;
      }
    }
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button
        className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        onClick={handleCopy}
        type="button"
      >
        <Copy className="size-3.5" />
        {copied ? "コピー済み" : "URLをコピー"}
      </button>
      <a
        className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        href={xIntentUrl}
        rel="noreferrer noopener"
        target="_blank"
      >
        <ExternalLink className="size-3.5" />
        Xでシェア
      </a>
      {canUseNativeShare ? (
        <button
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={handleNativeShare}
          type="button"
        >
          <Share2 className="size-3.5" />
          共有
        </button>
      ) : null}
    </div>
  );
}
