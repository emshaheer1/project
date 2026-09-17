from pathlib import Path
import re

p = Path(r"d:\Apollo\scripts\build-alpha-catalog.py")
t = p.read_text(encoding="utf-8")
names = re.findall(r'\("([^"]+\.png)"', t)
folder = {f.name for f in Path(r"D:\Apollo\Alpha Photos").glob("*.png")}
print("MISSING FROM FOLDER:")
for n in names:
    if n not in folder:
        print(" ", repr(n))
print("UNUSED IN FOLDER:")
for n in sorted(folder - set(names)):
    print(" ", repr(n))
