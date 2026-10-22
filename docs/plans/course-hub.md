# Course Hub for the LEGO Design Enrichment Program

## Goal
One page where Coach Ari can find every course in the program: 4 terms x 3 levels (Beginner, Intermediate, Advanced), 8 weeks each, 96 weeks total.

## Sources
The four curriculum PDFs, copied into `hub/pdfs/`:
- `term-1.pdf`: 8-Week Curriculum with Literacy. Has the full 90-minute class plan per week (Morning Circle, Read & Learn, Build Challenge, Competition), vocab words, tablet research weeks, Builder Card, and the weekly prep checklist.
- `term-2.pdf`, `term-3.pdf`, `term-4.pdf`: 8-Week Curriculum Guides with learning goals, activities, and a Superpower per week.

## What the page does
- **Year at a glance**: a grid with levels as rows and terms as columns. Each course card shows 8 studs (one per week), the level focus, and the first few themes.
- **Course view**: all 8 weeks for the chosen course. Term 1 weeks show the four class blocks and vocab; Terms 2 to 4 show goals and activities. Each week shows its Superpower.
- **Search**: matches across every week (themes, Superpowers, vocab, activities) and jumps to the week.
- **Level filter**: dims the other levels in the grid and limits search results.
- **Teaching toolkit**: the 90-minute schedule, Read & Learn routine, Builder Card template, and a prep checklist (check-offs saved in the browser).
- **Original files**: links to each term's PDF.
- Deep links: `#t1-beginner`, `#t3-advanced`, etc. open a course directly.

## Structure
- `hub/index.html`: the whole page. Course data is embedded as plain arrays at the top of the script, so adding a term means adding one block to `LATER` (or `T1`-style data if it has a literacy plan) and one entry to `TERMS`.
- `hub/pdfs/`: source PDFs.

The file is written for publishing as a claude.ai Artifact, which wraps it in a document skeleton. Opening it straight from disk also works.

## Open items
- Terms 2 to 4 don't have literacy passages or vocab yet. If those get written, they can use the Term 1 week format.
- From Term 1: should reading passages match a grade level or reading standard per school?
