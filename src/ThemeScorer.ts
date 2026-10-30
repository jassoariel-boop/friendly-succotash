import { CODEBOOK, type Theme } from "./Codebook.ts";
import { wordCount } from "./TranscriptCleaner.ts";

export type Show = "ferriss" | "huberman" | "doac";

export const SHOW_NAMES: Readonly<Record<Show, string>> = {
  ferriss: "The Tim Ferriss Show",
  huberman: "Huberman Lab",
  doac: "The Diary of a CEO",
};

export type Episode = Readonly<{ show: Show; id: string; text: string }>;

export type ThemeScore = Readonly<{
  themeId: string;
  hits: number;
  per10k: number;
  snippets: readonly string[];
}>;

export type EpisodeScore = Readonly<{
  show: Show;
  id: string;
  words: number;
  themes: readonly ThemeScore[];
}>;

const SNIPPET_RADIUS = 110;
const MAX_SNIPPETS = 2;

const snippetAround = (text: string, index: number, length: number): string => {
  const start = Math.max(0, index - SNIPPET_RADIUS);
  const end = Math.min(text.length, index + length + SNIPPET_RADIUS);
  return `${start > 0 ? "..." : ""}${text.slice(start, end).replace(/\s+/g, " ").trim()}${end < text.length ? "..." : ""}`;
};

export const scoreTheme = (theme: Theme, text: string, words: number): ThemeScore => {
  const matches = theme.patterns.flatMap((pattern) => [...text.matchAll(pattern)]);
  return {
    themeId: theme.id,
    hits: matches.length,
    per10k: words === 0 ? 0 : (matches.length / words) * 10_000,
    snippets: matches.slice(0, MAX_SNIPPETS).map((m) => snippetAround(text, m.index, m[0].length)),
  };
};

export const scoreEpisode = (episode: Episode, codebook: readonly Theme[] = CODEBOOK): EpisodeScore => {
  const words = wordCount(episode.text);
  return {
    show: episode.show,
    id: episode.id,
    words,
    themes: codebook.map((theme) => scoreTheme(theme, episode.text, words)),
  };
};
