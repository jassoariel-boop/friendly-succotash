import { htmlToText, removeHostLines } from "./TranscriptCleaner.ts";

export const TRANSCRIPT_INDEX_URL = "https://tim.blog/podcast-transcripts/";

export type TranscriptLink = Readonly<{ slug: string; url: string }>;

// Transcript posts on tim.blog contain "transcript" in their slug.
export const parseTranscriptLinks = (indexHtml: string): readonly TranscriptLink[] => {
  const urls = [...indexHtml.matchAll(/href="(https:\/\/tim\.blog\/[^"#?]*transcript[^"#?]*)"/gi)]
    .map((m) => m[1] ?? "")
    .filter((url) => url !== TRANSCRIPT_INDEX_URL);
  return [...new Set(urls)].map((url) => ({
    url,
    slug: url.replace(/\/$/, "").split("/").pop() ?? url,
  }));
};

export type FetchResult = Readonly<{ ok: true; text: string } | { ok: false; error: string }>;

export const fetchText = async (url: string): Promise<FetchResult> => {
  try {
    const response = await fetch(url, { headers: { "User-Agent": "success-patterns research script" } });
    return response.ok ? { ok: true, text: await response.text() } : { ok: false, error: `HTTP ${response.status}` };
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
};

export const transcriptFromPost = (html: string): string => removeHostLines(htmlToText(html), "Tim Ferriss");
