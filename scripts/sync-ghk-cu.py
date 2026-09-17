import json
import re
from pathlib import Path

seed = Path(r"d:\Apollo\backend\prisma\seed.ts")
text = seed.read_text(encoding="utf-8")

# Fix 50mg price
text = re.sub(
    r'(slug: "cu50-ghk-cu-50mg",\n    name: "GHK-Cu 50mg",\n    description: "[^"]+",\n    price: )[0-9.]+',
    r"\g<1>45",
    text,
)

# Replace 1000mg product block with 100mg
old_block = '''  {
    slug: "cu1000-ghk-cu-1000mg",
    name: "GHK-Cu 1000mg",
    description: "GHK-Cu 1000mg bulk research supply for laboratory-scale copper peptide studies. For research use only.",
    price: 149.99,
    featured: true,
    category: "GHK-Cu",
  },'''

new_block = '''  {
    slug: "cu100-ghk-cu-100mg",
    name: "GHK-Cu 100mg",
    description: "GHK-Cu 100mg copper peptide for regenerative and dermal research models. Purity >99%. For research use only.",
    price: 99,
    featured: true,
    category: "GHK-Cu",
  },'''

if old_block in text:
    text = text.replace(old_block, new_block)
else:
    # flexible replace
    text = re.sub(
        r'\{[^}]*slug: "cu1000-ghk-cu-1000mg"[^}]*\},',
        new_block.strip() + ",",
        text,
        count=1,
        flags=re.S,
    )

seed.write_text(text, encoding="utf-8")

catalog = Path(r"d:\Apollo\scripts\alpha-catalog.json")
data = json.loads(catalog.read_text(encoding="utf-8"))
for item in data:
    if item["slug"] == "cu50-ghk-cu-50mg":
        item["price"] = 45
        item["name"] = "GHK-Cu 50mg"
    if item["slug"] in ("cu1000-ghk-cu-1000mg", "cu100-ghk-cu-100mg"):
        item["slug"] = "cu100-ghk-cu-100mg"
        item["name"] = "GHK-Cu 100mg"
        item["price"] = 99
        item["dose"] = "100mg"
        item["description"] = (
            "GHK-Cu 100mg copper peptide for regenerative and dermal research models. "
            "Purity >99%. For research use only."
        )
catalog.write_text(json.dumps(data, indent=2), encoding="utf-8")
print("seed + catalog updated")
