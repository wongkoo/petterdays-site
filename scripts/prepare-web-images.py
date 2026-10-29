"""Create pixel-identical WebP delivery copies from checked-in approved PNGs.

Run with the existing website-asset-tools Python after refreshing screenshots.
No NAS access, resizing, palette changes, or source replacement is performed.
"""
import hashlib
import json
from pathlib import Path

from PIL import Image

site = Path(__file__).resolve().parents[1]
static = site / "static"
assets = {}
for source in sorted((static / "assets/home").rglob("*.png")):
    destination = source.with_suffix(".webp")
    with Image.open(source) as original:
        original.save(destination, "WEBP", lossless=True, method=6, exact=True)
        with Image.open(destination) as exported:
            if original.convert("RGBA").tobytes() != exported.convert("RGBA").tobytes():
                raise RuntimeError(f"Pixel mismatch: {source}")
        width, height = original.size
    if destination.stat().st_size >= source.stat().st_size:
        raise RuntimeError(f"WebP does not reduce size: {source}")
    assets["/" + source.relative_to(static).as_posix()] = {
        "url": "/" + destination.relative_to(static).as_posix(),
        "sourceSHA256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "sha256": hashlib.sha256(destination.read_bytes()).hexdigest(),
        "sourceBytes": source.stat().st_size,
        "bytes": destination.stat().st_size,
        "width": width,
        "height": height,
    }
(site / "web-images.json").write_text(json.dumps({"encoding": "lossless WebP", "assets": assets}, indent=2) + "\n")
before = sum(a["sourceBytes"] for a in assets.values())
after = sum(a["bytes"] for a in assets.values())
print(f"Verified {len(assets)} pixel-identical images: {before:,} -> {after:,} bytes ({1 - after / before:.1%} smaller)")
