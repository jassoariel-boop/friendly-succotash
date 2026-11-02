import { decodeEntities, htmlToText, removeHostLines, SPEAKER_LABEL } from "./TranscriptCleaner.ts";

export const TRANSCRIPT_INDEX_URL = "https://tim.blog/2018/09/20/all-transcripts-from-the-tim-ferriss-show/";

export const indexPageUrl = (page: number): string =>
  page <= 1 ? TRANSCRIPT_INDEX_URL : `${TRANSCRIPT_INDEX_URL}?transcript-page=${page}`;

export type TranscriptLink = Readonly<{ episode: number; title: string; slug: string; url: string }>;

// Episodes that are not a guest interview: solo Q&As, banter with friends,
// book-reading episodes and compilations of clips from earlier guests.
const NON_INTERVIEW =
  /Q&A with Tim|Random Show|Books I.ve Loved|Drunk Dialing|KevKev|Interviews Tim Ferriss|Corners Tim Ferriss|vs\. Tim Ferriss|Tim Ferriss Goes|Tim Ferriss and Matt Mullenweg|How I Built The Tim Ferriss Show|Tips from|Insights from Dr|Investing Wisdom from|Lessons Learned from Jeff Bezos|Lessons from Richard Branson|When to Quit|Lessons and Warnings|Best Investments, Bad Advice|Recommendations and Resolutions|Psychedelic News Hour|Workweek Revisited|Lessons Learned Traveling|^(How to Say|How to Live|Tools and Tips|The Magic of Mindfulness|Accelerated Learning and Mentors)/i;

export const isGuestInterview = (title: string): boolean => !NON_INTERVIEW.test(title);

const slugify = (text: string): string =>
  text
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .slice(0, 60)
    .replace(/-$/, "");

// Index entries look like: <a href="https://tim.blog/?p=117133">#884: How to Spot ...
export const parseTranscriptLinks = (indexHtml: string): readonly TranscriptLink[] => {
  const links = [...indexHtml.matchAll(/<a [^>]*href="(https:\/\/tim\.blog\/[^"]+)"[^>]*>#(\d+):\s*([^<]*)/gi)].map(
    (m): TranscriptLink => {
      const title = decodeEntities(m[3] ?? "").trim();
      const episode = Number(m[2]);
      return { episode, title, url: decodeEntities(m[1] ?? ""), slug: `${episode}-${slugify(title)}` };
    },
  );
  return links.filter((link, i) => links.findIndex((l) => l.episode === link.episode) === i);
};

export const lastIndexPage = (indexHtml: string): number =>
  Math.max(1, ...[...indexHtml.matchAll(/transcript-page=(\d+)/g)].map((m) => Number(m[1])));

export type FetchResult = Readonly<{ ok: true; text: string } | { ok: false; error: string }>;

export const fetchText = async (url: string): Promise<FetchResult> => {
  try {
    const response = await fetch(url, { headers: { "User-Agent": "success-patterns research script" } });
    return response.ok ? { ok: true, text: await response.text() } : { ok: false, error: `HTTP ${response.status}` };
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
};

// Every post carries a legal notice, sometimes before the conversation and
// sometimes after it. It runs from this heading to the "not allowed" paragraph.
const LEGAL_START = /^DUE TO SOME HEADACHES/;
// Its last paragraph, about photos, is sometimes split onto its own line.
const LEGAL_END = /No one is authorized|Getty Images/;
const LEGAL_MAX_LINES = 10;
// Some posts drop the heading but keep the notice's paragraphs.
const LEGAL_LINE = /^(WHAT IS NOT ALLOWED|WHAT YOU.RE WELCOME TO DO|Tim Ferriss owns the copyright)/;

// The share buttons and comment form follow the conversation.
const FOOTER = /^(Share this:?|Share on |Like this:|Subscribe$|Related$|Comment Rules:)/;

export const withoutLegalNotice = (lines: readonly string[]): readonly string[] => {
  const start = lines.findIndex((line) => LEGAL_START.test(line));
  if (start === -1) return lines;
  const block = lines.slice(start, start + LEGAL_MAX_LINES);
  const length = block.findLastIndex((line) => LEGAL_END.test(line));
  return length === -1 ? lines.slice(0, start) : [...lines.slice(0, start), ...lines.slice(start + length + 1)];
};

// The conversation starts at the first labelled turn and ends at the footer.
export const conversationOnly = (text: string): string => {
  const lines = withoutLegalNotice(text.split("\n")).filter((line) => !LEGAL_LINE.test(line));
  const start = Math.max(0, lines.findIndex((line) => SPEAKER_LABEL.test(line)));
  const length = lines.slice(start).findIndex((line) => FOOTER.test(line));
  return lines.slice(start, length === -1 ? undefined : start + length).join("\n");
};

export const transcriptFromPost = (html: string): string =>
  removeHostLines(conversationOnly(htmlToText(html)), ["Tim Ferriss", "Tim"]);
