# Chess Course Hub

## Goal
One page where every chess course can be found: 4 terms × 3 levels (Beginner, Intermediate, Advanced), 8 weeks each, 96 weekly lessons in total.

## Source material
`courses/Term1.pdf` to `courses/Term4.pdf`, the original 8-week curriculum guides.

## Data model
`data/curriculum.json` is the single source of truth, extracted from the PDFs:

```
[{ term, levels: [{ name, focus, weeks: [{ week, title, goals[3], activities[3], superpower: { name, meaning } }] }] }]
```

## Page
- Course map: levels as rows, terms as columns. Each cell opens that course.
- Course view: the 8 weeks with learning goals, activities and the weekly superpower, plus a link to the term's PDF.
- Search across lesson titles, goals, activities and superpowers.
- "Taught" checkmarks per week, stored in the browser (localStorage) only.
- Deep links: `#t2-int` opens a course, `#t2-int-w3` opens one week.

## Build
`python3 scripts/build_hub.py` embeds the JSON into `hub/template.html` and writes `index.html`, so the page works when opened straight from disk.

## Adding a new term or course
Add an entry to `data/curriculum.json`, drop the PDF into `courses/`, and rebuild.

## Lesson-plan format (Term 1 added 2026-10-22, Terms 2 to 4 added 2026-10-22)
All four terms are rewritten to follow the "LEGO Engineering: Fall Term Lesson Plans" format.

- Shared frame for every class: Morning Circle 15, Board Challenge 25, Recess 20, Competition Round 40, Cleanup & Prizes 10. Includes tier rules, grade-band notes (1 and 2, 3 to 5, seniors, memory care), a chess kit tote and every-week setup.
- Each week keeps its original goals, activities and superpower, and adds: objective, 3 vocabulary words, a Read & Learn passage, materials, Morning Circle script, Board Challenge with 3 tiers, Competition Round with scoring, check-for-understanding questions, "when things go sideways" fixes and a seniors note.
- Week 8 of each level is a review and tournament week: it reviews all 21 vocabulary words, adds one new word and has its own Cleanup & Prizes.
- Data lives in `data/term1Plans.json` to `data/term4Plans.json` (frame plus `levels.<Level>[week]`). `scripts/build_hub.py` merges each one into the curriculum.
- Wording uses chess terms only: Thinker Cards, Board Challenge, Competition Round, chess kit tote. No terms from the LEGO source document (bricks, builds, test kit and so on).
- The hub shows the frame at the top of every course and the full plan inside each week. Search covers the plan text.
