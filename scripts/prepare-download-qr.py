"""Regenerate local campaign QR SVGs. Optional tooling: pip install qrcode==8.2."""
import json
from pathlib import Path

import qrcode
from qrcode.image.svg import SvgPathFillImage

site = Path(__file__).resolve().parents[1]
campaigns = json.loads((site / "campaigns.json").read_text())
product = json.loads((site / "product.json").read_text())
destination = site / "static/assets/download"
destination.mkdir(exist_ok=True)
for key, token in campaigns["campaigns"].items():
    url = (f'https://apps.apple.com/app/apple-store/id{product["appStoreAppleID"]}'
           f'?pt={campaigns["providerToken"]}&ct={token}&mt=8')
    code = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=10, border=4)
    code.add_data(url)
    code.make(fit=True)
    code.make_image(image_factory=SvgPathFillImage).save(destination / f"{key}.svg")
    print(f"{key}: {url}")
