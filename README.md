# Chess Enrichment Hub

A single page for every course in the chess enrichment program: 4 terms, 3 levels each, 8 weeks per course.

Open `index.html` in a browser. You can:

- pick any term and level on the course map
- read each week's learning goals, activities and superpower
- search every lesson ("fork", "endgame", "patience")
- tick off the weeks you've taught (saved in your browser)
- open the original PDF for each term

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The hub (built file, do not edit by hand) |
| `hub/template.html` | Page layout, styles and script |
| `data/curriculum.json` | All course content |
| `courses/` | Original curriculum PDFs |
| `scripts/build_hub.py` | Rebuilds `index.html` from the template and data |

After changing the template or the data, run `python3 scripts/build_hub.py`.
