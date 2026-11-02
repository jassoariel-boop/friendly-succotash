# Lessons: Getting Podcast Transcripts

## Where transcripts live (checked October 2026)

- **The Tim Ferriss Show:** free official transcripts. The index moved to
  `https://tim.blog/2018/09/20/all-transcripts-from-the-tim-ferriss-show/`
  (16 pages, `?transcript-page=N`). Links are `tim.blog/?p=ID` with titles
  like `#884: ...`, not slugs containing "transcript". Personal, non-commercial use with
  attribution is allowed.
- **Huberman Lab:** official transcripts are a Premium (paid) feature. Third
  party sites are partial or paywalled. YouTube auto-captions are the
  practical free source.
- **The Diary of a CEO:** no official transcripts. Use YouTube auto-captions.

## Cloud session network

The default cloud session network policy blocks `tim.blog` and `youtube.com`
(DNS fails with `ENOTFOUND`). Web search still works, but page fetches do
not. Either add those hosts under the environment's allowed domains, or
download transcripts on a personal machine and copy them into
`data/transcripts/<show>/`.

## Data handling

- Don't commit transcripts. They are copyrighted, so `data/transcripts/`
  is git-ignored.
- Never commit a report generated from sample fixtures to `reports/`. It
  would look like real results. Use `--out` to write sample runs somewhere
  else.

## Keyword matching pitfalls

- Generic words ("trust", "users", "enough", "training") match ordinary
  conversation and push a theme close to 100% presence on long episodes.
  Use multi-word phrases.
- "patient" matches medical talk on Huberman. Use "patience".
- Matching finds topics, not stances: "consistent schedule" in a sleep
  discussion counts as the consistency theme. Read the Evidence section.

## Tim Ferriss page formats (checked November 2026)

- The legal notice sits before the conversation on older posts and after it
  on newer ones. Some posts drop its heading. Cut it by its paragraphs, not
  by position.
- Speaker labels vary: curly apostrophes ("D’Agostino"), lowercase name
  parts ("deGrasse"), and a space before the colon ("Morgan Housel :").
- A few pages (Reed Hastings #730) only have show notes, no transcript.
- Keep raw pages (gzipped) so cleaning fixes don't need another 25-minute
  download.

## YouTube from cloud sessions

Even with `youtube.com` allowed, `yt-dlp` fails with "Sign in to confirm
you're not a bot". Download captions on a personal machine instead.

## Reading keyword results

- Compare the same theme across groups (business vs all guests). Comparing
  different themes mostly reflects how common their words are.
- Bare "leverage" in investor interviews means debt ("leveraged buyout").
- Before publishing a number, sample random matches per theme and read them.
