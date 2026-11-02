import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, join } from "node:path";
import {
  fetchText,
  indexPageUrl,
  isGuestInterview,
  lastIndexPage,
  parseTranscriptLinks,
  transcriptFromPost,
  TRANSCRIPT_INDEX_URL,
} from "./FerrissFetcher.ts";
import { buildReport, DEFAULT_OPTIONS, renderMarkdown } from "./ReportBuilder.ts";
import { scoreEpisode, SHOW_NAMES, type Episode, type Show } from "./ThemeScorer.ts";
import { vttToText, wordCount } from "./TranscriptCleaner.ts";

const DATA_DIR = "data/transcripts";
const RAW_DIR = "data/raw";
const REPORT_DIR = "reports";
const REQUEST_DELAY_MS = 1000;
const MIN_GUEST_WORDS = 1000;
const TITLES_FILE = "titles.json";

// Episode titles that mark a business guest: founders, operators and investors.
const BUSINESS_TITLE =
  /founder|\bCEO\b|chairman|investor|investing|entrepreneur|billion|venture|startup|business|company|companies|CFO|COO|president of|private equity|hedge fund|Shopify|Netflix|Amazon|Airbnb|Duolingo|LinkedIn|PayPal/i;

const isShow = (value: string): value is Show => value in SHOW_NAMES;

const flag = (args: readonly string[], name: string): string | undefined => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};

const fetchFerriss = async (args: readonly string[]): Promise<void> => {
  const limit = Number(flag(args, "--limit") ?? Infinity);
  const outDir = join(DATA_DIR, "ferriss");
  await mkdir(outDir, { recursive: true });

  const first = await fetchText(indexPageUrl(1));
  if (!first.ok) throw new Error(`Could not load ${TRANSCRIPT_INDEX_URL}: ${first.error}`);
  const pages = [first.text];
  for (let page = 2; page <= lastIndexPage(first.text); page++) {
    const next = await fetchText(indexPageUrl(page));
    if (next.ok) pages.push(next.text);
    else console.warn(`skipped index page ${page}: ${next.error}`);
    await Bun.sleep(REQUEST_DELAY_MS);
  }
  const all = pages.flatMap(parseTranscriptLinks);
  const links = all.filter((link) => isGuestInterview(link.title)).slice(0, limit);
  console.log(`Found ${all.length} transcripts, ${links.length} guest interviews selected.`);
  await writeFile(join(outDir, TITLES_FILE), JSON.stringify(Object.fromEntries(links.map((l) => [l.slug, l.title])), null, 2));

  // Raw pages are kept (gzipped) so transcripts can be re-cleaned without downloading again.
  const rawDir = join(RAW_DIR, "ferriss");
  await mkdir(rawDir, { recursive: true });
  for (const link of links) {
    const rawPath = join(rawDir, `${link.slug}.html.gz`);
    if (!existsSync(rawPath)) {
      const post = await fetchText(link.url);
      if (!post.ok) {
        console.warn(`skipped ${link.slug}: ${post.error}`);
        continue;
      }
      await writeFile(rawPath, Bun.gzipSync(new TextEncoder().encode(post.text)));
      console.log(`downloaded ${link.slug}`);
      await Bun.sleep(REQUEST_DELAY_MS);
    }
    const html = new TextDecoder().decode(Bun.gunzipSync(await readFile(rawPath)));
    await writeFile(join(outDir, `${link.slug}.txt`), transcriptFromPost(html));
  }
};

const importVtt = async (args: readonly string[]): Promise<void> => {
  const [sourceDir] = args;
  const show = flag(args, "--show") ?? "";
  if (sourceDir === undefined || !isShow(show)) {
    throw new Error("Usage: import:vtt <dir-with-vtt-files> --show huberman|doac|ferriss");
  }
  const outDir = join(DATA_DIR, show);
  await mkdir(outDir, { recursive: true });
  const files = (await readdir(sourceDir)).filter((f) => f.endsWith(".vtt"));
  for (const file of files) {
    const id = basename(file).replace(/(\.[a-z-]+)?\.vtt$/i, "");
    await writeFile(join(outDir, `${id}.txt`), vttToText(await readFile(join(sourceDir, file), "utf8")));
  }
  console.log(`Imported ${files.length} caption files into ${outDir}.`);
};

type LoadedEpisode = Episode & Readonly<{ title: string }>;

const readTitles = async (dir: string): Promise<Readonly<Record<string, string>>> => {
  const path = join(dir, TITLES_FILE);
  return existsSync(path) ? (JSON.parse(await readFile(path, "utf8")) as Record<string, string>) : {};
};

const loadEpisodes = async (root: string): Promise<readonly LoadedEpisode[]> => {
  const showDirs = existsSync(root) ? (await readdir(root)).filter(isShow) : [];
  const perShow = await Promise.all(
    showDirs.map(async (show) => {
      const dir = join(root, show);
      const titles = await readTitles(dir);
      const files = (await readdir(dir)).filter((f) => f.endsWith(".txt"));
      return Promise.all(
        files.map(async (f) => {
          const id = f.replace(/\.txt$/, "");
          return { show, id, title: titles[id] ?? id.replace(/-/g, " "), text: await readFile(join(dir, f), "utf8") };
        }),
      );
    }),
  );
  return perShow.flat();
};

const analyze = async (args: readonly string[]): Promise<void> => {
  const root = flag(args, "--data") ?? DATA_DIR;
  const options = { ...DEFAULT_OPTIONS, minHits: Number(flag(args, "--min-hits") ?? DEFAULT_OPTIONS.minHits) };
  const outDir = flag(args, "--out") ?? REPORT_DIR;
  const minWords = Number(flag(args, "--min-words") ?? MIN_GUEST_WORDS);
  const loaded = await loadEpisodes(root);
  // Solo host episodes leave little or no text once the host's lines are removed.
  const longEnough = loaded.filter((e) => wordCount(e.text) >= minWords);
  const businessOnly = args.includes("--business-only");
  const episodes = businessOnly ? longEnough.filter((e) => BUSINESS_TITLE.test(e.title)) : longEnough;
  if (episodes.length === 0) throw new Error(`No transcripts found under ${root}/<show>/*.txt`);
  console.log(`Skipped ${loaded.length - longEnough.length} episodes with fewer than ${minWords} guest words.`);
  if (businessOnly) console.log(`Kept ${episodes.length} episodes whose titles mark a business guest.`);

  const report = buildReport(episodes.map((e) => scoreEpisode(e)), options);
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, "SuccessPatterns.md"), renderMarkdown(report, options));
  await writeFile(join(outDir, "results.json"), JSON.stringify(report, (_key, value: unknown) => (value instanceof RegExp ? value.source : value), 2));
  console.log(`Analysed ${episodes.length} episodes. Wrote ${outDir}/SuccessPatterns.md`);
};

const COMMANDS: Readonly<Record<string, (args: readonly string[]) => Promise<void>>> = {
  "fetch:ferriss": fetchFerriss,
  "import:vtt": importVtt,
  analyze,
};

const [command = "", ...rest] = process.argv.slice(2);
const run = COMMANDS[command];
if (run === undefined) {
  console.error(`Unknown command "${command}". Use one of: ${Object.keys(COMMANDS).join(", ")}`);
  process.exit(1);
}
run(rest).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
