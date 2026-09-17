import json
import re
from pathlib import Path

prices = {
    "bc5-bpc157-5mg": 55,
    "bc10-bpc157-10mg": 99,
    "bc20-bpc157-20mg": 164,
}

seed = Path(r"d:\Apollo\backend\prisma\seed.ts")
text = seed.read_text(encoding="utf-8")
for slug, price in prices.items():
    text = re.sub(
        rf'(slug: "{slug}",\n    name: "[^"]+",\n    description: "[^"]+",\n    price: )[0-9.]+',
        rf"\g<1>{price}",
        text,
    )
seed.write_text(text, encoding="utf-8")

catalog = Path(r"d:\Apollo\scripts\alpha-catalog.json")
data = json.loads(catalog.read_text(encoding="utf-8"))
for item in data:
    if item["slug"] in prices:
        item["price"] = prices[item["slug"]]
catalog.write_text(json.dumps(data, indent=2), encoding="utf-8")
print("seed + catalog synced")
