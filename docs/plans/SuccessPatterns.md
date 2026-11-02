# Success Patterns: Cross-Podcast Advice Analysis

## Goal

Find out which pieces of success advice actually repeat across guests on three
interview podcasts, and how often:

- **The Tim Ferriss Show** (Tim Ferriss)
- **Huberman Lab** (Andrew Huberman)
- **The Diary of a CEO** (Steven Bartlett)

The output is a report answering: "What share of guests bring up theme X?",
broken down by show and (optionally) by guest type (founder, investor,
scientist, athlete, etc.).

## Non-goals

- Proving that any advice *causes* success. Every guest on these shows is
  already successful, so the data has survivorship bias built in. The report
  says so at the top.
- Republishing transcripts. Transcripts are copyrighted by the shows. They are
  kept locally in `data/transcripts/` (git-ignored) and only short snippets
  appear in the report as evidence.

## Data sources

| Show | Source | Access |
| --- | --- | --- |
| Tim Ferriss | Official transcripts at `tim.blog/podcast-transcripts/` | Free, personal non-commercial use with attribution |
| Huberman Lab | Official transcripts are for Premium members only. Use YouTube auto-captions (`.vtt`) instead. | Free via YouTube |
| Diary of a CEO | No official transcripts. Use YouTube auto-captions (`.vtt`). | Free via YouTube |

Network note: the cloud session must allow `tim.blog` (and `youtube.com` if
captions are fetched inside the session). Captions can also be downloaded on a
personal machine with `yt-dlp` and dropped into the data folder.

## Pipeline

```
fetch / import  ->  clean text  ->  score themes  ->  aggregate  ->  report
```

1. **Fetch (Ferriss).** `bun run fetch:ferriss [--limit N]` crawls the
   transcript index, downloads each post and saves cleaned text to
   `data/transcripts/ferriss/<slug>.txt`. It skips files that already exist and
   waits between requests.
2. **Import (YouTube captions).** `bun run import:vtt <dir> --show huberman|doac`
   converts `.vtt` caption files into plain text in
   `data/transcripts/<show>/`. Captions repeat lines heavily, so the converter
   removes those repeats.
3. **Score.** Each transcript is scored against a fixed **codebook**
   (`src/Codebook.ts`). A theme is a list of regex phrases. The scorer counts
   hits and normalises to hits per 10,000 words.
4. **Presence rule.** A theme counts as "present" in an episode when it has at
   least `MIN_HITS` (default 2) matches. A single passing mention doesn't
   count. Binary presence is the main metric, because "share of guests who
   brought it up" is easier to interpret than raw counts, and long episodes
   would otherwise dominate.
5. **Aggregate.** For each theme: share of episodes where it's present, overall
   and per show, mean density, and a "consensus" flag if it is present in at
   least 30% of episodes on every show.
6. **Report.** `bun run analyze` writes `reports/SuccessPatterns.md` and
   `reports/results.json`. The report includes up to 3 short evidence
   snippets per theme so a reader can check that matches are real.

## Codebook design

Themes come from the earlier qualitative synthesis **plus** themes that were
*not* predicted (luck and timing, reading, mentors, money mindset, customer
obsession, curiosity, and others). That way the analysis can contradict the
original hunch instead of only confirming it.

Rules for phrases:
- Prefer multi-word phrases ("long term", "compound interest") over single
  words that have many meanings ("focus", "health").
- Use word boundaries. Matching is case-insensitive.
- Every theme has a test fixture sentence that must match and one near miss
  that must not.

## Known limitations

- **Keyword matching is blunt.** It finds topics, not stances. "I don't believe
  in work-life balance" still counts as mentioning balance. A later version
  could add an LLM pass that classifies stance per snippet.
- **Host speech is included.** Ferriss transcripts label speakers and the
  cleaner drops lines spoken by the host where it can. Captions have no
  speaker labels, so host speech counts there.
- **Huberman's solo episodes** are mostly him teaching, not guests giving
  advice. Use `--guests-only` (filename list) or exclude them manually.
- **Sample selection.** Results depend on which episodes are included. The
  report lists how many episodes per show it used.

## File layout

```
src/
  Codebook.ts          theme definitions
  TranscriptCleaner.ts HTML -> text, VTT -> text, host-line removal
  ThemeScorer.ts       score one transcript
  ReportBuilder.ts     aggregate scores and render markdown
  FerrissFetcher.ts    crawl tim.blog transcript index
  cli.ts               commands: fetch:ferriss, import:vtt, analyze
tests/                 bun tests with fixtures
data/transcripts/      git-ignored transcript text
reports/               generated output
```

## Done when

- `bun test` passes.
- `bun run analyze` on the sample fixtures produces a readable report.
- With network access, `fetch:ferriss --limit 50` followed by `analyze`
  produces a real report.
