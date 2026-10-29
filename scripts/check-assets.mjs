import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { assetReferences } from "./optimize-assets.mjs";

export async function checkAssets(root) {
  const manifest = JSON.parse(await readFile(new URL("asset-manifest.json", root), "utf8"));
  const images = JSON.parse(await readFile(new URL("../web-images.json", import.meta.url), "utf8")).assets;
  const reverse = Object.fromEntries(Object.entries(manifest).map(([source, url]) => [url, source]));
  const normalize = (text) => text.replace(assetReferences, (url) => reverse[url] || url);
  const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
  for (const [source, url] of Object.entries(manifest)) {
    const bytes = await readFile(new URL(url.slice(1), root));
    assert.ok(url.startsWith(`/assets/cache/${digest(bytes).slice(0, 16)}/`), `Incorrect cache fingerprint: ${url}`);
    const original = await readFile(new URL(source.slice(1), root));
    if (images[source]) {
      const image = images[source];
      assert.ok(url.endsWith(".webp"));
      assert.equal(digest(original), image.sourceSHA256, `Stale image source: ${source}`);
      assert.equal(digest(bytes), image.sha256, `Incorrect image export: ${source}`);
      assert.equal(bytes.length, image.bytes);
      assert.ok(bytes.length < original.length, `Image size regression: ${source}`);
    } else if (source.endsWith(".css")) {
      assert.equal(normalize(bytes.toString()), original.toString(), `Stylesheet changed during fingerprinting: ${source}`);
      for (const reference of bytes.toString().match(assetReferences) || []) {
        assert.ok(reverse[reference], `Unversioned CSS dependency: ${reference}`);
        await readFile(new URL(reference.slice(1), root));
      }
    } else {
      assert.deepEqual(bytes, original, `Asset changed during fingerprinting: ${source}`);
    }
  }
  for (const source of Object.keys(images)) assert.ok(manifest[source], `Unused image export: ${source}`);
  const headers = await readFile(new URL("_headers", root), "utf8");
  assert.ok(headers.includes("/assets/cache/*\n  Cache-Control: public, max-age=31536000, immutable"));
  // Validate delivered URLs first, then let existing content/security checks use
  // logical source names. Never normalize an unknown or missing resource.
  return async function readHTML(file) {
    const html = await readFile(file, "utf8");
    for (const url of html.match(assetReferences) || []) {
      assert.ok(reverse[url] || url.startsWith("/assets/brand/"), `Unversioned page resource: ${url}`);
      await readFile(new URL(url.slice(1), root));
    }
    return normalize(html);
  };
}
