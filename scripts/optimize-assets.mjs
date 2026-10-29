import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
export const assetReferences = /\/assets\/[\w./-]+\.(?:css|js|woff2|png|webp|svg)\b/g;

// Content addresses make long-lived browser caching safe across deployments.
// Keep original URLs available for old pages and approved-source verification.
export async function optimizeAssets(out) {
  const images = JSON.parse(await readFile(new URL("../web-images.json", import.meta.url), "utf8")).assets;
  for (const [source, image] of Object.entries(images)) {
    for (const [url, expected] of [[source, image.sourceSHA256], [image.url, image.sha256]]) {
      if (digest(await readFile(join(out, url.slice(1)))) !== expected) {
        throw new Error(`Stale web image: ${url}; run scripts/prepare-web-images.py`);
      }
    }
  }
  const manifest = {};
  async function fingerprint(source) {
    if (source.startsWith("/assets/brand/")) return source;
    if (manifest[source]) return manifest[source];
    const delivery = images[source]?.url || source;
    let bytes = await readFile(join(out, delivery.slice(1)));
    // Resolve font/image dependencies before hashing their parent stylesheet.
    if (source.endsWith(".css")) bytes = Buffer.from(await rewrite(bytes.toString()));
    const url = `/assets/cache/${digest(bytes).slice(0, 16)}/${delivery.slice("/assets/".length)}`;
    await mkdir(dirname(join(out, url.slice(1))), { recursive: true });
    await writeFile(join(out, url.slice(1)), bytes);
    manifest[source] = url;
    return url;
  }
  async function rewrite(text) {
    for (const source of new Set(text.match(assetReferences) || [])) {
      text = text.replaceAll(source, await fingerprint(source));
    }
    return text;
  }
  async function visit(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "assets") await visit(path);
      else if (entry.isFile() && entry.name.endsWith(".html")) {
        await writeFile(path, await rewrite(await readFile(path, "utf8")));
      }
    }
  }
  await visit(out);
  await writeFile(join(out, "asset-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
}
