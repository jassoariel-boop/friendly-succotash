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
- **Class tracker**: one row per teaching location, one stud per lesson for the chosen term. Tapping a stud records the date it was taught; each row shows a done count and links to the next lesson. Locations can be renamed, added and removed, and each keeps a level for Terms 2 to 4. Stored in the artifact's `db` capability at `locations/<id>` = `{name, level, order, done: {"<courseId>-w<n>": "YYYY-MM-DD"}}`, so it syncs across devices and Claude can read it. Seeded with Location 1 to 5.
- **Original files**: links to each PDF.
- Deep links: `#t1`, `#t3-advanced`, etc. open a course directly. Old `#t1-beginner` style links fall back to `#t1`.

## Structure
- `hub/index.html`: the whole page. Course data is embedded as plain arrays at the top of the script, so adding a term means adding one block to `LATER` (or `T1`-style data if it has a literacy plan) and one entry to `TERMS`.
- `hub/pdfs/`: source PDFs.

The file is written for publishing as a claude.ai Artifact, which wraps it in a document skeleton. Opening it straight from disk also works.

## Term 2 Beginner lesson plans
Rewritten in the Fall Term lesson-plan format (`LESSON_PLANS["2-beg"]` in `hub/index.html`). The themes, Superpowers and activities stay the same as in `term-2.pdf`. Each week adds an engineering idea, three vocab words, a short echo-reading passage (80 to 95 words, vocab in bold; Week 9 is a tablet research week instead), a tote-only test, Tiers 1 to 3, check questions, troubleshooting and a seniors note.

| Week | Theme | Engineering idea | Competition test (tote only) |
| --- | --- | --- | --- |
| 1 | Underwater World | A thick hull resists pressure | Pressure test: books stacked on a submarine |
| 2 | Space Exploration | Wide legs land safely | Moon landing: drop from 20 to 60 cm onto the cookie sheet |
| 3 | Medieval Castles | Thick, overlapped walls defend | Battering ram: ram car down a ramp that gets steeper |
| 4 | Robots & Automatons | Joints let robots move and hold a pose | Robot strongman: pennies in a cup on an outstretched arm |
| 5 | Nature & Gardens | Roots and a strong trunk hold up branches | Windy day: file-folder wind, widest branch spread wins |
| 6 | Sports Stadium | Columns hold up a crowd | Crowd test: pennies in a cup on the top row of the stands |
| 7 | Color Mastery | High contrast is seen from farther away | Long-distance sign: farthest distance a volunteer can read it |
| 8 | Bridges Over Water | An arch pushes weight out to the sides | Penny bridge rematch at a 20 cm span |
| 9 | Animal Habitats | A shelter protects from weather and predators | Storm shelter: wind, then shake, then books on the roof (tablet research week) |
| 10 | Gallery Exhibition | Presenting and curating | Rematch of any past test, then a gallery walk with compliment notes |

## Term 2 Intermediate lesson plans
Same format (`LESSON_PLANS["2-int"]`). Passages run 105 to 130 words for popcorn reading; Week 5 is a tablet research week.

| Week | Theme | Engineering idea | Competition test |
| --- | --- | --- | --- |
| 1 | Gear Systems | Gear size changes speed; each gear flips direction | Spin count: last-gear turns per crank turn |
| 2 | Bridge Engineering | Efficiency: load per brick | Efficiency score: pennies held ÷ bricks used |
| 3 | Technic Building | Crossed plate layers make a stiff chassis | Haul test: pennies on a truck bed down the ramp |
| 4 | Rube Goldberg Machines | Each step triggers the next | Class chain reaction, with a bonus for hand-offs |
| 5 | Architecture Styles | A cantilever needs an anchor | Fallingwater balcony: longest that holds 10 pennies |
| 6 | Lighting & Effects | Light travels straight; opaque bricks cast shadows | Shadow show: class guesses each silhouette |
| 7 | Constraint Building | Plan within limits | Mystery challenge: tallest tower from 25 pre-picked pieces |
| 8 | Gear-Up Racers | Gear up for speed, gear down for strength; iteration | 3-crank distance, 3 tries with one change each |
| 9 | Towers Against the Wind | A wide base and braces resist wind load | Wind tunnel: tallest tower after 5 folder waves |
| 10 | Design Competition | Judging with criteria | Timed themed build, peer judging with feedback notes |

Weeks 1 and 8 need a gear bag that is not in the 10696 box (Technic gears in 2 sizes, axles, Technic bricks with holes). Each has a no-gears fallback in its troubleshooting. Week 3 is written for plain bricks and plates; Technic beams are optional. Week 6 uses the phone flashlight from the tote instead of light bricks.

## Term 3 and Term 4 Beginner lesson plans
Same format (`LESSON_PLANS["3-beg"]`, `LESSON_PLANS["4-beg"]`), beginner-length passages for echo reading, tote-only tests.

| Week | Term 3 Beginner | Test | Term 4 Beginner | Test |
| --- | --- | --- | --- | --- |
| 1 | Fantasy Creatures | Longest neck balanced by a tail | All-Time Favorites | Beat your best: biggest improvement |
| 2 | Amusement Park | Thrill ride: steepest ramp that keeps the passenger | Fairy Tale Scenes | Huff and puff: folder wind from closer and closer |
| 3 | Emergency Vehicles | Ladder rescue: longest reach with a penny cup | Dinosaur World | Dino weigh-in: pennies on the back |
| 4 | Jungle Adventure | Temple tower: tallest stepped temple that holds a book | Farm & Countryside | Silo fill: most pennies poured in |
| 5 | City Services | Trash pickup: pennies hauled and dumped onto the tray | Secret Agent Base | Vault challenge: hidden penny, 60-second search |
| 6 | Winter Wonderland | Sled race: smooth bottoms, less friction | Celebration Party | Waiter walk: cake carried across the room on a tray |
| 7 | Music & Performance | Shaker test: most pennies with no escapes | Friendship Collaboration | Two-hand tower with a partner |
| 8 | Playground Design | Swing test: pennies in a swinging cup | Toy Inventor | Toy lab: play, drop and shake tests |
| 9 | Rescue Bridges | Rescue crossing: loaded car pushed across | Build-Off Rematch | Record day: growth over 3 tries |
| 10 | Dream Project Day | Dream showcase: each build passes a term test | Year-End Showcase | Gallery, growth cards and graduation |

Term 3 Week 9 needs one test car built ahead of time that can carry the cup.

Every course runs 10 weeks (the two added weeks sit before each final week). Week keys stay `w1`-`w7`, then `w9`, `w10`, and `w8` for the final week, so tracker check-offs made before the change keep their dates.

Week 3 needs one "battering ram" car built ahead of time from the 10696 box. Week 4 uses any turning piece (a wheel on its pin) as a joint, so it does not depend on hinge pieces.

## Open items
- The toolkit's class frame now follows the Fall Term lesson plans (Competition Build 40 min, Cleanup 10 min). Confirm Terms 2 to 4 use the same frame.
- Terms 2 to 4 don't have tiered lesson plans yet. If those get written, they can use the `T1` lesson format.
- From Term 1: should reading passages match a grade level or reading standard per school?
