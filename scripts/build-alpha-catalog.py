"""Process Alpha Photos (black bg -> transparent) and write seed product data."""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

SRC = Path(r"D:\Apollo\Alpha Photos")
DEST = Path(r"D:\Apollo\frontend\public\products")
DEST.mkdir(parents=True, exist_ok=True)

# source filename -> (slug, name, category, dose_label, price, featured, description)
CATALOG = [
    # Retatrutide
    ("RT5.png", "rt5-retatrutide-5mg", "Retatrutide 5mg", "Retatrutide", "5mg", 84.99, True,
     "Retatrutide (RT5) is a multi-agonist research peptide supplied as lyophilized powder for laboratory metabolic pathway studies. Purity >99%. For research use only."),
    ("RT10.png", "rt10-retatrutide-10mg", "Retatrutide 10mg", "Retatrutide", "10mg", 119.99, False,
     "Retatrutide 10mg research vial for controlled laboratory assays. Lyophilized powder, purity >99%. For research use only."),
    ("RT15.png", "rt15-retatrutide-15mg", "Retatrutide 15mg", "Retatrutide", "15mg", 149.99, False,
     "Retatrutide 15mg for extended research protocols. Laboratory grade lyophilized peptide. For research use only."),
    ("RT20.png", "rt20-retatrutide-20mg", "Retatrutide 20mg", "Retatrutide", "20mg", 179.99, True,
     "Retatrutide 20mg research peptide for metabolic and receptor studies. Purity >99%. For research use only."),
    ("RT30.png", "rt30-retatrutide-30mg", "Retatrutide 30mg", "Retatrutide", "30mg", 239.99, False,
     "Retatrutide 30mg vial for multi-assay laboratory work. Lyophilized powder. For research use only."),
    ("RT40.png", "rt40-retatrutide-40mg", "Retatrutide 40mg", "Retatrutide", "40mg", 279.99, False,
     "Retatrutide 40mg research supply for higher-volume laboratory protocols. For research use only."),
    ("RT50.png", "rt50-retatrutide-50mg", "Retatrutide 50mg", "Retatrutide", "50mg", 329.99, False,
     "Retatrutide 50mg lyophilized research peptide. High-purity material for laboratory use only."),
    ("RT60.png", "rt60-retatrutide-60mg", "Retatrutide 60mg", "Retatrutide", "60mg", 369.99, False,
     "Retatrutide 60mg for extended research programs. Purity >99%. For research use only."),
    ("RT100.png", "rt100-retatrutide-100mg", "Retatrutide 100mg", "Retatrutide", "100mg", 499.99, False,
     "Retatrutide 100mg bulk research vial for laboratory-scale studies. For research use only."),
    # Tirzepatide
    ("TR5 (2).png", "tr5-tirzepatide-5mg", "Tirzepatide 5mg", "Tirzepatide", "5mg", 74.99, True,
     "Tirzepatide (TR5) research peptide for dual-agonist pathway studies. Lyophilized, purity >99%. For research use only."),
    ("TR10.png", "tr10-tirzepatide-10mg", "Tirzepatide 10mg", "Tirzepatide", "10mg", 109.99, False,
     "Tirzepatide 10mg research vial for laboratory metabolic assays. For research use only."),
    ("TR15.png", "tr15-tirzepatide-15mg", "Tirzepatide 15mg", "Tirzepatide", "15mg", 139.99, False,
     "Tirzepatide 15mg lyophilized peptide for controlled research applications. For research use only."),
    ("TR20.png", "tr20-tirzepatide-20mg", "Tirzepatide 20mg", "Tirzepatide", "20mg", 169.99, True,
     "Tirzepatide 20mg research compound for receptor and metabolic pathway studies. For research use only."),
    ("TR30.png", "tr30-tirzepatide-30mg", "Tirzepatide 30mg", "Tirzepatide", "30mg", 229.99, False,
     "Tirzepatide 30mg for multi-assay laboratory protocols. Purity >99%. For research use only."),
    ("TR40.png", "tr40-tirzepatide-40mg", "Tirzepatide 40mg", "Tirzepatide", "40mg", 269.99, False,
     "Tirzepatide 40mg research supply. Lyophilized powder for laboratory use only."),
    ("TR50.png", "tr50-tirzepatide-50mg", "Tirzepatide 50mg", "Tirzepatide", "50mg", 319.99, False,
     "Tirzepatide 50mg high-quantity research vial. For laboratory research only."),
    # Blends
    ("GLOW70 (BGC70).png", "glow70-bgc70", "GLOW70 (BGC70)", "Peptide Blends", "70mg", 144.99, True,
     "GLOW70 research blend (TB 10mg + BPC 10mg + GHK-Cu) totaling 70mg. Designed for combination peptide studies. Purity >99%. For research use only."),
    ("KLOW80.png", "klow80", "KLOW80", "Peptide Blends", "80mg", 134.99, True,
     "KLOW80 research blend combining BPC-157 and GHK-Cu (80mg total) for laboratory investigation. For research use only."),
    ("BB10.png", "bb10-bpc-tb", "BB10 (BPC + TB)", "Peptide Blends", "10mg", 79.99, False,
     "BB10 research blend of BPC-157 5mg + TB500 5mg (10mg total) for comparative tissue-pathway studies. For research use only."),
    # Tesamorelin
    ("TSM5.png", "tsm5-tesamorelin-5mg", "Tesamorelin 5mg", "Tesamorelin", "5mg", 64.99, True,
     "Tesamorelin (TSM5) research peptide studied in GHRH pathway models. Lyophilized powder, purity >99%. For research use only."),
    ("TSM10.png", "tsm10-tesamorelin-10mg", "Tesamorelin 10mg", "Tesamorelin", "10mg", 94.99, False,
     "Tesamorelin 10mg research vial for laboratory hormone-pathway assays. For research use only."),
    ("TSM15.png", "tsm15-tesamorelin-15mg", "Tesamorelin 15mg", "Tesamorelin", "15mg", 119.99, False,
     "Tesamorelin 15mg lyophilized peptide for extended research protocols. For research use only."),
    ("TSM 20.png", "tsm20-tesamorelin-20mg", "Tesamorelin 20mg", "Tesamorelin", "20mg", 149.99, True,
     "Tesamorelin 20mg research supply for multi-assay laboratory work. For research use only."),
    # MOTS-c
    ("MS5.png", "ms5-mots-c-5mg", "MOTS-c 5mg", "MOTS-c", "5mg", 54.99, True,
     "MOTS-c (MS5) mitochondrial-derived research peptide for cellular metabolism studies. Purity >99%. For research use only."),
    ("MS10.png", "ms10-mots-c-10mg", "MOTS-c 10mg", "MOTS-c", "10mg", 84.99, False,
     "MOTS-c 10mg research vial for laboratory mitochondrial pathway assays. For research use only."),
    ("MS20.png", "ms20-mots-c-20mg", "MOTS-c 20mg", "MOTS-c", "20mg", 129.99, True,
     "MOTS-c 20mg lyophilized peptide for extended cellular research protocols. For research use only."),
    ("MS40.png", "ms40-mots-c-40mg", "MOTS-c 40mg", "MOTS-c", "40mg", 199.99, False,
     "MOTS-c 40mg high-quantity research supply. For laboratory use only."),
    # NAD+
    ("NJ500.png", "nj500-nad-500mg", "NAD+ 500mg", "NAD+", "500mg", 59.99, True,
     "NAD+ 500mg (NJ500) research-grade nicotinamide adenine dinucleotide for cellular energy and aging studies. For research use only."),
    ("NJ1000.png", "nj1000-nad-1000mg", "NAD+ 1000mg", "NAD+", "1000mg", 94.99, True,
     "NAD+ 1000mg research vial for higher-volume laboratory protocols. Purity >99%. For research use only."),
    # BPC-157
    ("BC5.png", "bc5-bpc157-5mg", "BPC-157 5mg", "BPC-157", "5mg", 39.99, True,
     "BPC-157 5mg research peptide for tissue and gut pathway laboratory studies. Lyophilized powder. For research use only."),
    ("BC10.png", "bc10-bpc157-10mg", "BPC-157 10mg", "BPC-157", "10mg", 49.99, True,
     "BPC-157 10mg research vial widely used in regenerative pathway assays. Purity >99%. For research use only."),
    ("BC20.png", "bc20-bpc157-20mg", "BPC-157 20mg", "BPC-157", "20mg", 74.99, False,
     "BPC-157 20mg lyophilized peptide for multi-assay research programs. For research use only."),
    # GHK-Cu
    ("CU50.png", "cu50-ghk-cu-50mg", "GHK-Cu 50mg", "GHK-Cu", "50mg", 44.99, True,
     "GHK-Cu 50mg copper peptide for regenerative and dermal research models. Purity >99%. For research use only."),
    ("CU1000.png", "cu1000-ghk-cu-1000mg", "GHK-Cu 1000mg", "GHK-Cu", "1000mg", 149.99, True,
     "GHK-Cu 1000mg bulk research supply for laboratory-scale copper peptide studies. For research use only."),
    # Accessories
    ("WA3.png", "wa3-bac-water-3ml", "BAC Water 3ml", "Accessories", "3ml", 4.99, True,
     "Bacteriostatic water 3ml (WA3) for reconstituting lyophilized research peptides in the lab. For research use only."),
    ("WA10.png", "wa10-bac-water-10ml", "BAC Water 10ml", "Accessories", "10ml", 9.99, True,
     "Bacteriostatic water 10ml (WA10) reconstitution solution for laboratory peptide preparation. For research use only."),
]


def remove_black_bg(img: Image.Image, tol: int = 28) -> Image.Image:
    img = img.convert("RGBA")
    # Downscale first for speed if huge
    w, h = img.size
    max_side = 1400
    if max(w, h) > max_side:
        scale = max_side / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)

    arr = np.array(img)
    rgb = arr[:, :, :3].astype(np.int16)
    near_black = (
        (rgb[:, :, 0] <= tol)
        & (rgb[:, :, 1] <= tol)
        & (rgb[:, :, 2] <= tol)
    )

    labeled, _ = ndimage.label(near_black, structure=np.ones((3, 3), dtype=bool))
    border = set(labeled[0, :].tolist()) | set(labeled[-1, :].tolist())
    border |= set(labeled[:, 0].tolist()) | set(labeled[:, -1].tolist())
    border.discard(0)
    bg = np.isin(labeled, list(border)) if border else near_black

    alpha = arr[:, :, 3].astype(np.float32)
    alpha[bg] = 0

    # Soft fringe
    dilated = ndimage.binary_dilation(bg, iterations=2)
    fringe = dilated & ~bg & near_black
    darkness = 255 - rgb.mean(axis=2)
    soft = np.clip((tol - (255 - darkness)) * (255 / max(tol, 1)), 0, 255)
    # For black fringe: use brightness of pixel (darker = more transparent)
    brightness = rgb.mean(axis=2)
    soft_alpha = np.clip(brightness * (255 / max(tol, 1)), 0, 255)
    alpha[fringe] = soft_alpha[fringe]

    # Zero RGB on transparent
    out_rgb = arr[:, :, :3].copy()
    out_rgb[alpha < 8] = 0
    alpha[alpha < 8] = 0

    arr[:, :, :3] = out_rgb
    arr[:, :, 3] = alpha.astype(np.uint8)
    out = Image.fromarray(arr, "RGBA")

    # Final export size
    ow, oh = out.size
    if max(ow, oh) > 1000:
        s = 1000 / max(ow, oh)
        out = out.resize((int(ow * s), int(oh * s)), Image.Resampling.LANCZOS)
    return out


def main() -> None:
    # Clear old product images
    for old in DEST.glob("*.png"):
        old.unlink()

    seed_products = []
    for src_name, slug, name, category, dose, price, featured, desc in CATALOG:
        src = SRC / src_name
        if not src.exists():
            raise FileNotFoundError(src)
        print(f"Processing {src_name} -> {slug}.png", flush=True)
        with Image.open(src) as im:
            cut = remove_black_bg(im)
            out = DEST / f"{slug}.png"
            cut.save(out, "PNG", optimize=True)
            print(f"  {out.stat().st_size // 1024}KB", flush=True)

        seed_products.append(
            {
                "slug": slug,
                "name": name,
                "description": desc,
                "price": price,
                "featured": featured,
                "category": category,
                "dose": dose,
            }
        )

    meta = Path(r"D:\Apollo\scripts\alpha-catalog.json")
    meta.write_text(json.dumps(seed_products, indent=2), encoding="utf-8")
    print(f"Wrote {len(seed_products)} products meta -> {meta}", flush=True)
    print("DONE", flush=True)


if __name__ == "__main__":
    main()
