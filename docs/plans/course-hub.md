# Course Hub for the LEGO Design Enrichment Program

## Goal
One page where Coach Ari can find every course in the program: 4 terms x 3 levels (Beginner, Intermediate, Advanced), 8 weeks each, 96 weeks total.

## Sources
The curriculum PDFs, copied into `hub/pdfs/`:
- `term-1-lesson-plans.pdf`: LEGO Engineering Fall Term Lesson Plans (Oct 22, 2026). This is what the hub's Term 1 is built from. One course for all levels: 8 lessons with an objective, vocab with definitions, test kit, Morning Circle script, a three-tier Build Challenge, Competition Build, check questions, troubleshooting, and a seniors note. Also defines the class frame (15 / 25 / recess 20 / 40 / 10), the test kit tote, and the every-week setup.
- `term-1.pdf`: the earlier Term 1 literacy guide. Still the source of the Read & Learn passages the lesson plans refer to; no longer rendered as Term 1's weeks.
- `term-2.pdf`, `term-3.pdf`, `term-4.pdf`: 8-Week Curriculum Guides with learning goals, activities, and a Superpower per week, split into Beginner, Intermediate and Advanced.

## What the page does
- **Year at a glance**: a grid with levels as rows and terms as columns. Term 1 is one card spanning all three level rows, since its lessons are tiered rather than split by level. Each course card shows 8 studs (one per week).
- **Course view**: all 8 weeks for the chosen course. Term 1 shows the full lesson plan per week, with Tiers 1 to 3 colored to match the level colors. Terms 2 to 4 show goals and activities. Each week shows its Superpower.
- **Search**: matches across every week (themes, Superpowers, vocab, activities) and jumps to the week.
- **Level filter**: dims the other levels in the grid and limits search results.
- **Teaching toolkit**: the class frame from the Fall Term lesson plans, notes by group (tiers, grades 1-2, grades 3-5, seniors, memory care), every-week setup and test kit tote checklists (check-offs saved in the browser), and the Builder Card template.
- **Original files**: links to each PDF.
- Deep links: `#t1`, `#t3-advanced`, etc. open a course directly. Old `#t1-beginner` style links fall back to `#t1`.

## Structure
- `hub/index.html`: the whole page. Course data is embedded as plain arrays at the top of the script, so adding a term means adding one block to `LATER` (or `T1`-style data if it has a literacy plan) and one entry to `TERMS`.
- `hub/pdfs/`: source PDFs.

The file is written for publishing as a claude.ai Artifact, which wraps it in a document skeleton. Opening it straight from disk also works.

## Open items
- The toolkit's class frame now follows the Fall Term lesson plans (Competition Build 40 min, Cleanup 10 min). Confirm Terms 2 to 4 use the same frame.
- Terms 2 to 4 don't have tiered lesson plans yet. If those get written, they can use the `T1` lesson format.
- From Term 1: should reading passages match a grade level or reading standard per school?
