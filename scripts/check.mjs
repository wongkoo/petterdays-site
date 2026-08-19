import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../dist/", import.meta.url);
const rootPath = fileURLToPath(root);
const required = [
  "index.html", "privacy/index.html", "privacy/choices/index.html", "terms/index.html", "support/index.html",
  "zh-Hant/index.html", "en/index.html", "ja/index.html", "ko/index.html", "robots.txt", "sitemap.xml", "_headers", "404.html",
];
for (const path of required) {
  await readFile(new URL(path, root));
}

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await htmlFiles(path));
    else if (entry.name.endsWith(".html")) result.push(path);
  }
  return result;
}

const files = await htmlFiles(rootPath);
if (files.length !== 26) throw new Error(`Expected 26 HTML files, found ${files.length}`);
for (const file of files) {
  const html = await readFile(file, "utf8");
  for (const token of ["<title>", 'name="description"', 'rel="canonical"', 'href="/assets/styles.css"', "Petter Days"]) {
    if (!html.includes(token)) throw new Error(`${file} misses ${token}`);
  }
  if (/<script\b/i.test(html)) throw new Error(`${file} unexpectedly contains script`);
  if (/google-analytics|googletagmanager|segment\.com|mixpanel|facebook\.net/i.test(html)) throw new Error(`${file} contains tracking reference`);
}

const headers = await readFile(new URL("_headers", root), "utf8");
if (!headers.includes("script-src 'none'")) throw new Error("Strict script CSP missing");
console.log(`Validated ${files.length} HTML files: localized pages, metadata, no scripts, no known trackers.`);
