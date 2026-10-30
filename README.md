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
YouTube auto-captions. On any machine with [yt-dlp](https://github.com/yt-dlp/yt-dlp):

```sh
# Last 100 episodes of a channel, English auto-captions only, no video
yt-dlp --skip-download --write-auto-subs --sub-langs en --sub-format vtt \
  --playlist-end 100 -o "captions/doac/%(title)s.%(ext)s" \
  "https://www.youtube.com/@TheDiaryOfACEO/videos"

yt-dlp --skip-download --write-auto-subs --sub-langs en --sub-format vtt \
  --playlist-end 100 -o "captions/huberman/%(title)s.%(ext)s" \
  "https://www.youtube.com/@hubermanlab/videos"
```

Then convert the captions:

```sh
bun run import:vtt captions/doac --show doac
bun run import:vtt captions/huberman --show huberman
```

Huberman's solo episodes are him teaching, not guests giving advice. Delete
those `.txt` files before analysing if you only want guest advice.

## 2. Analyse

```sh
bun run analyze                 # writes reports/SuccessPatterns.md and reports/results.json
bun run analyze --min-hits 3    # stricter: a theme needs 3 matches to count for an episode
```

Try it on the synthetic sample first:

```sh
bun run analyze --data tests/fixtures/sample --out /tmp/sample-report
```

## Changing the themes

Themes and their phrases are in `src/Codebook.ts`. Every theme needs a
matching case in `tests/Codebook.test.ts` (one sentence that should match and
one near miss that shouldn't). Check the **Evidence** section of the report
after any change to confirm the matches are real.
