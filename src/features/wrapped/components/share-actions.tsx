"use client";

import { Copy, Download, ExternalLink, Share2 } from "lucide-react";
import { useMemo, useState } from "react";

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

function createOgImageUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname.replace(/\/$/, "")}/opengraph-image`;
  } catch {
    return "";
  }
}

export function ShareActions({ username }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.location.href;
  }, []);

  const shareText = createShareText(username);
  const xIntentUrl = shareUrl ? createXIntentUrl(shareText, shareUrl) : "#";
  const ogImageUrl = shareUrl ? createOgImageUrl(shareUrl) : "#";
  const canUseNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

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

  const handleDownload = async () => {
    if (!ogImageUrl || ogImageUrl === "#" || downloading) {
      return;
    }

    setDownloading(true);

    try {
      const response = await fetch(ogImageUrl);
      if (!response.ok) {
        return;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${username}-github-wrapped.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDownloading(false);
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
      <button
        className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        disabled={downloading}
        onClick={handleDownload}
        type="button"
      >
        <Download className="size-3.5" />
        {downloading ? "生成中..." : "画像を保存"}
      </button>
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
