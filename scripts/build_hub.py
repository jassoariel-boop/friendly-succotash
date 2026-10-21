"""Build index.html by embedding data/curriculum.json into hub/template.html."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

data = json.loads((ROOT / "data" / "curriculum.json").read_text(encoding="utf-8"))
payload = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
template = (ROOT / "hub" / "template.html").read_text(encoding="utf-8")
(ROOT / "index.html").write_text(template.replace("/*CURRICULUM*/", payload), encoding="utf-8")
print("Wrote index.html")
