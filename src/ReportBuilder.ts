import { CODEBOOK, type Theme } from "./Codebook.ts";
import { SHOW_NAMES, type EpisodeScore, type Show } from "./ThemeScorer.ts";

export type ReportOptions = Readonly<{ minHits: number; consensusShare: number }>;

export const DEFAULT_OPTIONS: ReportOptions = { minHits: 2, consensusShare: 0.3 };

export type ThemeSummary = Readonly<{
  theme: Theme;
  share: number;
  shareByShow: Readonly<Partial<Record<Show, number>>>;
  meanPer10k: number;
  consensus: boolean;
  evidence: readonly Readonly<{ episode: string; show: Show; snippet: string }>[];
}>;

export type Report = Readonly<{
  episodeCount: number;
  episodesByShow: Readonly<Partial<Record<Show, number>>>;
  themes: readonly ThemeSummary[];
}>;

const fraction = (count: number, total: number): number => (total === 0 ? 0 : count / total);

const showsIn = (episodes: readonly EpisodeScore[]): readonly Show[] => [...new Set(episodes.map((e) => e.show))];

const themeScoreOf = (episode: EpisodeScore, themeId: string) => episode.themes.find((t) => t.themeId === themeId);

export const buildReport = (
  episodes: readonly EpisodeScore[],
  options: ReportOptions = DEFAULT_OPTIONS,
  codebook: readonly Theme[] = CODEBOOK,
): Report => {
  const shows = showsIn(episodes);
  const episodesByShow = Object.fromEntries(shows.map((s) => [s, episodes.filter((e) => e.show === s).length]));

  const summarise = (theme: Theme): ThemeSummary => {
    const isPresent = (e: EpisodeScore): boolean => (themeScoreOf(e, theme.id)?.hits ?? 0) >= options.minHits;
    const shareByShow = Object.fromEntries(
      shows.map((s) => {
        const ofShow = episodes.filter((e) => e.show === s);
        return [s, fraction(ofShow.filter(isPresent).length, ofShow.length)];
      }),
    );
    const densest = [...episodes]
      .filter(isPresent)
      .sort((a, b) => (themeScoreOf(b, theme.id)?.per10k ?? 0) - (themeScoreOf(a, theme.id)?.per10k ?? 0))
      .slice(0, 3);
    return {
      theme,
      share: fraction(episodes.filter(isPresent).length, episodes.length),
      shareByShow,
      meanPer10k: fraction(
        episodes.reduce((sum, e) => sum + (themeScoreOf(e, theme.id)?.per10k ?? 0), 0),
        episodes.length,
      ),
      consensus: shows.length > 0 && shows.every((s) => (shareByShow[s] ?? 0) >= options.consensusShare),
      evidence: densest.flatMap((e) => {
        const snippet = themeScoreOf(e, theme.id)?.snippets[0];
        return snippet === undefined ? [] : [{ episode: e.id, show: e.show, snippet }];
      }),
    };
  };

  return {
    episodeCount: episodes.length,
    episodesByShow,
    themes: codebook.map(summarise).sort((a, b) => b.share - a.share),
  };
};

const SHOW_SOURCES: Readonly<Record<Show, string>> = {
  ferriss: "transcripts from [The Tim Ferriss Show](https://tim.blog/podcast), quoted for non-commercial use",
  huberman: "YouTube auto-captions from [Huberman Lab](https://www.hubermanlab.com)",
  doac: "YouTube auto-captions from [The Diary of a CEO](https://www.youtube.com/@TheDiaryOfACEO)",
};

const pct = (value: number): string => `${Math.round(value * 100)}%`;

export const renderMarkdown = (report: Report, options: ReportOptions = DEFAULT_OPTIONS): string => {
  const shows = Object.keys(report.episodesByShow) as Show[];
  // Per-show columns and the cross-show check only mean something with several shows.
  const multiShow = shows.length > 1;
  const showColumns = multiShow ? shows : [];
  const header = `| Theme | Episodes | ${showColumns.map((s) => `${SHOW_NAMES[s]} | `).join("")}Mentions / 10k words |${multiShow ? " In every show? |" : ""}`;
  const divider = `| --- | --- | ${showColumns.map(() => "--- | ").join("")}--- |${multiShow ? " --- |" : ""}`;
  const rows = report.themes.map(
    (t) =>
      `| ${t.theme.label}${t.theme.predicted ? "" : " *"} | ${pct(t.share)} | ${showColumns
        .map((s) => `${pct(t.shareByShow[s] ?? 0)} | `)
        .join("")}${t.meanPer10k.toFixed(1)} |${multiShow ? ` ${t.consensus ? "yes" : ""} |` : ""}`,
  );
  const consensus = report.themes.filter((t) => t.consensus).map((t) => `- ${t.theme.label} (${pct(t.share)})`);
  const consensusSection = multiShow
    ? [
        `## Themes that come up on every show (at least ${pct(options.consensusShare)} of episodes on each)`,
        "",
        ...(consensus.length === 0 ? ["_None at this threshold._"] : consensus),
        "",
      ]
    : [];
  const evidence = report.themes.flatMap((t) => [
    `### ${t.theme.label}`,
    "",
    ...(t.evidence.length === 0
      ? ["_No episodes passed the threshold._"]
      : t.evidence.map((e) => `- **${SHOW_NAMES[e.show]}, ${e.episode}:** "${e.snippet}"`)),
    "",
  ]);

  return [
    "# Success Patterns Across Three Podcasts",
    "",
    `Episodes analysed: **${report.episodeCount}** (${shows
      .map((s) => `${SHOW_NAMES[s]}: ${report.episodesByShow[s] ?? 0}`)
      .join(", ")}).`,
    "",
    "Every guest on these shows is already successful, so this shows what successful people *talk about*,",
    "not what *caused* their success. A theme counts as present in an episode when its phrases match at",
    `least ${options.minHits} times. Themes marked * were not in the original hypothesis.`,
    "",
    "## How often each theme comes up",
    "",
    header,
    divider,
    ...rows,
    "",
    ...consensusSection,
    "## Evidence",
    "",
    "Short excerpts from the episodes where each theme was densest, so you can check the matches are real.",
    "",
    ...evidence,
    "## Sources",
    "",
    ...shows.map((s) => `- ${SHOW_NAMES[s]}: ${SHOW_SOURCES[s]}`),
    "",
  ].join("\n");
};
