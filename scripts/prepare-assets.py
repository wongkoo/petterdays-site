"""Refresh checked-in website assets from approved App Store screens and App fonts.

Run build first so font subsets include the current localized page copy.
Requires fonttools, brotli and pillow. These are build-time tools, not site dependencies.
"""
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import argparse
import re
import shutil

from fontTools import subset
from fontTools.ttLib import TTCollection
from PIL import Image


class PageText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, value):
        self.parts.append(value)


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--app-root", type=Path, default=Path(__file__).resolve().parents[2])
args = parser.parse_args()
app = args.app_root
site = app / "website"
assets = site / "static/assets"
locales = [("zh-Hans", "zh-Hans", "", 0, "sc"), ("zh-Hant", "zh-Hant", "zh-Hant", 1, "tc"),
           ("en", "en-US", "en", 0, "sc"), ("ja", "ja", "ja", 2, "j"), ("ko", "ko", "ko", 3, "k")]
raw = app / "AppStore/raw-screenshots"
nfc_template = (app / "AppStore/artwork/nfc-quick-record.svg").read_text()
# The SVG is the already approved NFC composition; only its labels are localized.
water = {"zh-Hans": "饮水", "zh-Hant": "飲水", "en": "Water", "ja": "水分", "ko": "수분"}
for locale, store_locale, prefix, face, suffix in locales:
    dest = assets / "home" / locale
    dest.mkdir(parents=True, exist_ok=True)
    for name in ["01-today", "02-record-types", "03-custom-record", "04-warehouse", "ipad-today"]:
        source = raw / store_locale / f"{name}.png"
        if name == "ipad-today":
            source = raw / "ipad" / store_locale / "01-today.png"
        with Image.open(source) as image:
            image = image.convert("RGB")
            width = 900 if name == "ipad-today" else 660
            image = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
            image.save(dest / f"{name}.png", "PNG", optimize=True)
            (dest / f"{name}.webp").unlink(missing_ok=True)
    nfc = nfc_template.replace("{{PET_NAME}}", "乔治").replace("{{RECORD_TITLE}}", water[locale]).replace("{{AMOUNT}}", "180").replace("{{UNIT}}", "ml")
    nfc = re.sub(r"<title id=\"title\">.*?</title>", f'<title id="title">Petter Days · NFC · {escape(water[locale])}</title>', nfc)
    nfc = re.sub(r"<desc id=\"desc\">.*?</desc>", '<desc id="desc">NFC feature illustration</desc>', nfc)
    (dest / "nfc.svg").write_text(nfc)

font_dir = assets / "fonts"
font_dir.mkdir(exist_ok=True)
collection = app / "PetterDaysApp/Resources/Fonts/PetterDaysRounded-Bold.ttc"
# Latin text is shared by the Simplified Chinese and English subset.
texts = {"sc": [], "tc": [], "j": [], "k": []}
for locale, store_locale, prefix, face, suffix in locales:
    pages = [site / "dist" / prefix / p for p in ["index.html", "privacy/index.html", "privacy/choices/index.html", "terms/index.html", "support/index.html"]]
    for page in pages:
        reader = PageText()
        reader.feed(page.read_text())
        texts[suffix].extend(reader.parts)
    texts[suffix].append("乔治 NFC 180 ml 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz")

for face, suffix, family_suffix in [(0, "sc", "SC"), (1, "tc", "TC"), (2, "j", "J"), (3, "k", "K")]:
    # One face at a time avoids retaining the large original TTC in memory.
    font = TTCollection(collection, lazy=True).fonts[face]
    font.recalcTimestamp = False
    text = "".join(texts[suffix])
    available = font.getBestCmap()
    # Decorative symbols may use the system fallback; locale letters must exist.
    missing = {char for char in text if char.isalnum() and ord(char) not in available}
    if missing:
        raise RuntimeError(f"Rounded font {suffix} is missing characters: {sorted(missing)}")
    options = subset.Options()
    options.flavor = "woff2"
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14, 16, 17]
    options.name_legacy = True
    options.name_languages = [0x409]
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text="".join(char for char in text if ord(char) in available))
    subsetter.subset(font)
    family = f"Petter Days Web Rounded {family_suffix}"
    postscript = f"PetterDaysWebRounded{family_suffix}-Bold"
    replacements = {1: family, 2: "Bold", 3: postscript, 4: family + " Bold", 6: postscript, 16: family, 17: "Bold"}
    for record in font["name"].names:
        if record.nameID in replacements:
            record.string = replacements[record.nameID].encode(record.getEncoding())
    if "CFF " in font:
        cff = font["CFF "].cff
        cff.fontNames = [postscript]
        cff.topDictIndex[0].FullName = family + " Bold"
        cff.topDictIndex[0].FamilyName = family
    font.flavor = "woff2"
    path = font_dir / f"rounded-{suffix}.woff2"
    font.save(path)
    print(f"{path.relative_to(site)}: {path.stat().st_size:,} bytes")
shutil.copyfile(app / "PetterDaysApp/Resources/Fonts/ResourceHanRounded-OFL.txt", font_dir / "OFL.txt")
print("Refreshed 25 PNG screens, 5 localized NFC illustrations and 4 licensed rounded font subsets.")
