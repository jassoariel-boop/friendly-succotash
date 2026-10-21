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
