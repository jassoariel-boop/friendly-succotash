import { describe, expect, test } from "bun:test";
import { buildReport, renderMarkdown } from "../src/ReportBuilder.ts";
import { scoreEpisode, type Episode } from "../src/ThemeScorer.ts";

// Synthetic text written for tests. These are not quotes from real episodes.
const EPISODES: readonly Episode[] = [
  { show: "ferriss", id: "a", text: "Be consistent. Consistency wins. I read every single day. Luck helped." },
  { show: "ferriss", id: "b", text: "Sleep matters. I sleep eight hours. Discipline and consistency." },
  { show: "doac", id: "c", text: "Therapy helped. My childhood shaped me. Be consistent, show up every day." },
  { show: "huberman", id: "d", text: "Sleep is the foundation. Morning sunlight, then sleep well." },
];

describe("scoreEpisode", () => {
  test("counts hits and normalises per 10k words", () => {
    const score = scoreEpisode(EPISODES[0]!);
    const consistency = score.themes.find((t) => t.themeId === "consistency")!;
    expect(consistency.hits).toBe(3);
    expect(consistency.per10k).toBeCloseTo((3 / score.words) * 10_000);
    expect(consistency.snippets.length).toBe(2);
  });
});

describe("buildReport", () => {
  const report = buildReport(EPISODES.map((e) => scoreEpisode(e)), { minHits: 2, consensusShare: 0.5 });
  const theme = (id: string) => report.themes.find((t) => t.theme.id === id)!;

  test("computes presence share overall and per show", () => {
    expect(report.episodeCount).toBe(4);
    expect(theme("consistency").share).toBe(0.75);
    expect(theme("consistency").shareByShow).toEqual({ ferriss: 1, doac: 1, huberman: 0 });
    expect(theme("luck-timing").share).toBe(0);
  });

  test("flags consensus only when every show passes the threshold", () => {
    expect(theme("consistency").consensus).toBe(false);
    expect(theme("health-foundation").shareByShow).toEqual({ ferriss: 0.5, doac: 0, huberman: 1 });
    expect(theme("health-foundation").consensus).toBe(false);
  });

  test("sorts themes by share and renders markdown", () => {
    expect(report.themes[0]!.theme.id).toBe("consistency");
    const md = renderMarkdown(report, { minHits: 2, consensusShare: 0.5 });
    expect(md).toContain("Episodes analysed: **4**");
    expect(md).toContain("| Consistency and showing up daily | 75% |");
  });
});
