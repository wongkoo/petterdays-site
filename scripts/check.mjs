import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const root = new URL("../dist/", import.meta.url);
const rootPath = fileURLToPath(root);
const required = [
  "index.html", "privacy/index.html", "privacy/choices/index.html", "terms/index.html", "support/index.html",
  "link/index.html", "zh-Hant/index.html", "en/index.html", "ja/index.html", "ko/index.html", "robots.txt", "sitemap.xml", "_headers", "_redirects", "404.html",
  ".well-known/apple-app-site-association",
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
if (files.length !== 27) throw new Error(`Expected 27 HTML files, found ${files.length}`);
for (const file of files) {
  const html = await readFile(file, "utf8");
  for (const token of ["<title>", 'name="description"', 'rel="canonical"', 'href="/assets/styles.css"', "Petter Days"]) {
    if (!html.includes(token)) throw new Error(`${file} misses ${token}`);
  }
  const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/gi)].map((match) => match[1]);
  if (scripts.length !== 1 || scripts[0] !== "/assets/language.js") throw new Error(`${file} contains an unexpected script`);
  if (/<script\b(?![^>]*src="\/assets\/language\.js")[^>]*>/i.test(html)) throw new Error(`${file} contains inline or third-party script`);
  if (/google-analytics|googletagmanager|segment\.com|mixpanel|facebook\.net/i.test(html)) throw new Error(`${file} contains tracking reference`);
}

const headers = await readFile(new URL("_headers", root), "utf8");
if (!headers.includes("script-src 'self'")) throw new Error("Strict first-party script CSP missing");
if (!headers.includes("/.well-known/apple-app-site-association\n  Content-Type: application/json")) {
  throw new Error("AASA JSON Content-Type rule missing");
}
const association = JSON.parse(await readFile(new URL(".well-known/apple-app-site-association", root), "utf8"));
const associationDetails = association?.applinks?.details;
if (!Array.isArray(associationDetails) || associationDetails.length !== 1) {
  throw new Error("AASA must contain exactly one applinks detail");
}
const [associationDetail] = associationDetails;
if (associationDetail.appIDs?.length !== 1 || associationDetail.appIDs[0] !== "546HJ5BCYA.com.wongkoo.petterdays") {
  throw new Error("AASA App ID does not match the signed Petter Days identity");
}
if (associationDetail.components?.length !== 1 || associationDetail.components[0]?.["/"] !== "/1/*") {
  throw new Error("AASA must expose only version 1 Universal Link routes");
}
const redirects = await readFile(new URL("_redirects", root), "utf8");
if (!redirects.split("\n").some((line) => line.trim() === "/1/* /link/index.html?route=:splat 200")) {
  throw new Error("Universal Link fallback rewrite is missing");
}
await readFile(new URL("assets/language.js", root));
await readFile(new URL("app-icon.png", root));
const languageScript = await readFile(new URL("assets/language.js", root), "utf8");
for (const [language, destination] of [["zh-CN", undefined], ["zh-TW", "/zh-Hant/"], ["en-US", "/en/"], ["ja-JP", "/ja/"], ["ko-KR", "/ko/"]]) {
  let redirectedTo;
  runInNewContext(languageScript, {
    URL,
    navigator: { language, languages: [language] },
    window: {
      location: { href: "https://petterdays.wongkoo.group/", pathname: "/", replace: (path) => { redirectedTo = path; } },
      localStorage: { getItem: () => null, setItem: () => {} },
      history: { replaceState: () => {} },
    },
  });
  if (redirectedTo !== destination) throw new Error(`Language ${language} routed to ${redirectedTo}, expected ${destination}`);
}
console.log(`Validated ${files.length} HTML files: localized pages, metadata, first-party language routing, no known trackers.`);
