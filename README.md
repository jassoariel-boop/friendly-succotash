# Success Patterns

Counts which pieces of success advice come up again and again across guests on
The Tim Ferriss Show, Huberman Lab and The Diary of a CEO. The design is in
[`docs/plans/SuccessPatterns.md`](docs/plans/SuccessPatterns.md).

## Setup

```sh
bun install
bun test
```

## 1. Get transcripts

Transcripts are copyrighted by the shows, so they stay in `data/transcripts/`,
which git ignores.

**Tim Ferriss** publishes free transcripts. To download them:

```sh
bun run fetch:ferriss --limit 100
```

**Huberman Lab and Diary of a CEO** don't publish free transcripts, so use
YouTube captions. On your own computer (YouTube blocks cloud servers), install
[yt-dlp](https://github.com/yt-dlp/yt-dlp) and [Deno](https://deno.com), which
yt-dlp now needs for YouTube, then run:

```sh
yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs en --sub-format vtt --match-filter "duration > 2400" --playlist-end 150 --sleep-requests 1 --sleep-subtitles 3 -o "captions/doac/%(upload_date)s-%(id)s-%(title).60s.%(ext)s" "https://www.youtube.com/@TheDiaryOfACEO/videos"

yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs en --sub-format vtt --match-filter "duration > 2400" --playlist-end 150 --sleep-requests 1 --sleep-subtitles 3 -o "captions/huberman/%(upload_date)s-%(id)s-%(title).60s.%(ext)s" "https://www.youtube.com/@hubermanlab/videos"
```

- `--match-filter "duration > 2400"` keeps videos over 40 minutes, so short
  clips are skipped and only full episodes remain.
- `--playlist-end 150` looks at the newest 150 uploads.
- The sleep options slow requests down so YouTube is less likely to block you.
- If you still get "Sign in to confirm you're not a bot", add
  `--cookies-from-browser chrome` (or `firefox`, `safari`, `edge`). The
  cookies stay on your computer.

Then convert the captions:

```sh
bun run import:vtt captions/doac --show doac
bun run import:vtt captions/huberman --show huberman
```

`fetch:ferriss` keeps the raw pages gzipped in `data/raw/`, so running it
again only re-cleans the text; it doesn't download anything twice. Episode
titles are saved to `data/transcripts/ferriss/titles.json`.

Note: YouTube blocks caption downloads from cloud servers ("Sign in to
confirm you're not a bot"), so run `yt-dlp` on your own computer.

Huberman's solo episodes are him teaching, not guests giving advice. Delete
those `.txt` files before analysing if you only want guest advice.

## 2. Analyse

```sh
bun run analyze                 # writes reports/SuccessPatterns.md and reports/results.json
bun run analyze --min-hits 3    # stricter: a theme needs 3 matches to count for an episode
bun run analyze --business-only --out reports/ferriss-business-guests
                                # only founders, CEOs and investors (by episode title)
```

Episodes with fewer than 1,000 guest words (solo host episodes) are skipped;
change that with `--min-words`. The current write-up is
[`reports/Findings.md`](reports/Findings.md).

Try it on the synthetic sample first:

```sh
bun run analyze --data tests/fixtures/sample --out /tmp/sample-report
```

## Changing the themes

Themes and their phrases are in `src/Codebook.ts`. Every theme needs a
matching case in `tests/Codebook.test.ts` (one sentence that should match and
one near miss that shouldn't). Check the **Evidence** section of the report
after any change to confirm the matches are real.
