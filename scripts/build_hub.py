"""Build index.html by embedding the curriculum (plus any termNPlans.json lesson plans) into hub/template.html."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

curriculum = json.loads((DATA / "curriculum.json").read_text(encoding="utf-8"))

for plans_file in sorted(DATA.glob("term*Plans.json")):
    plans = json.loads(plans_file.read_text(encoding="utf-8"))
    term = next(t for t in curriculum if t["term"] == plans["term"])
    term["frame"] = plans["frame"]
    for level in term["levels"]:
        level_plans = plans["levels"].get(level["name"], [])
        for week, plan in zip(level["weeks"], level_plans):
            week["plan"] = plan

payload = json.dumps(curriculum, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
template = (ROOT / "hub" / "template.html").read_text(encoding="utf-8")
(ROOT / "index.html").write_text(template.replace("/*CURRICULUM*/", payload), encoding="utf-8")
print("Wrote index.html")
