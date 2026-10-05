"""Export the production App icon and App Store identity for the standalone website.

Uses Pillow from the existing website asset environment. Generated assets are
checked in, so the publishing mirror does not need the App checkout or Pillow.
"""
import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path

from PIL import Image

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--app-root", type=Path, default=Path(__file__).resolve().parents[2])
args = parser.parse_args()
app = args.app_root
site = app / "website"
match = re.search(r"ASSETCATALOG_COMPILER_APPICON_NAME:\s*(\w+)", (app / "project.yml").read_text())
if not match:
    raise RuntimeError("Cannot find the production App icon name")
catalog = app / "PetterDaysApp/Resources/Assets.xcassets" / f"{match[1]}.appiconset"
entries = json.loads((catalog / "Contents.json").read_text())["images"]
primary = [entry for entry in entries if entry.get("filename") and not entry.get("appearances")]
if len(primary) != 1:
    raise RuntimeError("Expected one primary marketing icon; choose its source explicitly")
source = catalog / primary[0]["filename"]
source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
apple_id = str(json.loads((app / "AppStore/metadata.json").read_text())["appStoreAppleID"])
if not re.fullmatch(r"[0-9]+", apple_id):
    raise RuntimeError("Invalid App Store Apple ID")
dest = site / "static/assets/brand"
dest.mkdir(parents=True, exist_ok=True)
manifest = {"appStoreAppleID": apple_id, "iconSource": str(source.relative_to(app)),
            "iconSourceSHA256": source_hash, "assets": {}}
with Image.open(source) as image:
    if image.size != (1024, 1024):
        raise RuntimeError("Production marketing icon must be 1024 × 1024")
    image = image.convert("RGB")
    for field, stem, size in [("icon", "app-icon", 512), ("favicon", "favicon", 32),
                              ("touchIcon", "apple-touch-icon", 180)]:
        path = dest / f"{stem}-{source_hash[:12]}.png"
        image.resize((size, size), Image.Resampling.LANCZOS).save(path, "PNG", optimize=True)
        url = "/" + str(path.relative_to(site / "static"))
        manifest[field] = url
        manifest["assets"][url] = hashlib.sha256(path.read_bytes()).hexdigest()
# Keep the previous public URL compatible, but every current page uses a
# fingerprinted URL so an old browser favicon cannot hide a brand update.
shutil.copyfile(source, site / "static/app-icon.png")
(site / "product.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
print(f"Brand updated from {match[1]} · App Store {apple_id} · {source_hash[:12]}")
