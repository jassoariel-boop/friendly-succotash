# Lessons: Getting Podcast Transcripts

## Where transcripts live (checked October 2026)

- **The Tim Ferriss Show:** free official transcripts at
  `https://tim.blog/podcast-transcripts/`. Personal, non-commercial use with
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
