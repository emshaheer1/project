import re
from pathlib import Path

p = Path(r"d:\Apollo\backend\prisma\seed.ts")
t = p.read_text(encoding="utf-8")
prices = {
    "tr5-tirzepatide-5mg": 79,
    "tr10-tirzepatide-10mg": 99,
    "tr15-tirzepatide-15mg": 120,
    "tr20-tirzepatide-20mg": 149,
    "tr30-tirzepatide-30mg": 179,
    "tr40-tirzepatide-40mg": 200,
    "tr50-tirzepatide-50mg": 250,
}
for slug, price in prices.items():
    t = re.sub(
        rf'(slug: "{slug}",\n    name: "[^"]+",\n    description: "[^"]+",\n    price: )[0-9.]+',
        rf"\g<1>{price}",
        t,
    )
p.write_text(t, encoding="utf-8")
for slug, price in prices.items():
    m = re.search(rf'slug: "{slug}".{{0,220}}price: ([0-9.]+)', t, re.S)
    print(slug, "->", m.group(1) if m else "MISSING")
