import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { TextDecoder } from "node:util";
import { runInNewContext } from "node:vm";
import { createHash } from "node:crypto";
import { product, appStoreURL } from "./product.mjs";

const root = new URL("../dist/", import.meta.url);
const rootPath = fileURLToPath(root);
if (!/^[0-9]+$/.test(product.appStoreAppleID) || !/^[0-9a-f]{64}$/.test(product.iconSourceSHA256)) throw new Error("Invalid product identity");
for (const key of ["icon", "favicon", "touchIcon"]) {
  if (!product[key]?.startsWith("/assets/brand/") || !product[key].includes(product.iconSourceSHA256.slice(0, 12))) throw new Error(`Invalid fingerprinted ${key}`);
  const bytes = await readFile(new URL(product[key].slice(1), root));
  if (createHash("sha256").update(bytes).digest("hex") !== product.assets[product[key]]) throw new Error(`${key} does not match the exported App brand`);
}
const compatibilityIcon = await readFile(new URL("app-icon.png", root));
if (createHash("sha256").update(compatibilityIcon).digest("hex") !== product.iconSourceSHA256) throw new Error("Compatibility icon still contains an older brand");
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
const homeFiles = new Set(["index.html", "zh-Hant/index.html", "en/index.html", "ja/index.html", "ko/index.html"].map((path) => join(rootPath, path)));
if (files.length !== 27) throw new Error(`Expected 27 HTML files, found ${files.length}`);
for (const file of files) {
  const html = await readFile(file, "utf8");
  for (const token of ["<title>", 'name="description"', 'rel="canonical"', 'href="/assets/styles.css"', "Petter Days"]) {
    if (!html.includes(token)) throw new Error(`${file} misses ${token}`);
  }
  const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/gi)].map((match) => match[1]);
  const expectedScripts = file.endsWith("/link/index.html")
    ? ["/assets/language.js", "/assets/nfc-wire.js"]
    : homeFiles.has(file) ? ["/assets/language.js", "/assets/home.js"] : ["/assets/language.js"];
  if (JSON.stringify(scripts) !== JSON.stringify(expectedScripts)) throw new Error(`${file} contains an unexpected script`);
  if (/<script\b(?![^>]*src="\/assets\/(?:language|nfc-wire|home)\.js")[^>]*>/i.test(html)) throw new Error(`${file} contains inline or third-party script`);
  if (/google-analytics|googletagmanager|segment\.com|mixpanel|facebook\.net/i.test(html)) throw new Error(`${file} contains tracking reference`);
  if (/\{\{APP_(?:ICON|STORE)_|\{\{(?:FAVICON|TOUCH_ICON)_|(?:src|href)="\/app-icon\.png"/.test(html)) throw new Error(`${file} contains an unresolved or obsolete brand reference`);
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/brand\/[^"]+)"/g)) {
    if (!Object.hasOwn(product.assets, match[1])) throw new Error(`${file} references an older icon ${match[1]}`);
  }
  for (const token of [`href="${product.favicon}"`, `href="${product.touchIcon}"`, `app-id=${product.appStoreAppleID}`]) {
    if (!html.includes(token)) throw new Error(`${file} misses the current product identity ${token}`);
  }
  if (file.endsWith("/link/index.html") && !html.includes(`id="nfc-store" href="${appStoreURL}"`)) throw new Error("NFC fallback must offer the actual App Store listing");
  if (homeFiles.has(file)) {
    if (/\bPro\b|\bfree\b|subscription|免费|免費|订阅|訂閱|無料|購読|무료|구독/i.test(html)) throw new Error(`${file} still contains plan marketing`);
    if (/上架准备中|上架準備中|Getting ready for the App Store|公開準備中|출시 준비 중/i.test(html)) throw new Error(`${file} still contains prelaunch copy`);
    if (html.split(`class="store-button" href="${appStoreURL}"`).length - 1 !== 2) throw new Error(`${file} needs working store destinations in the hero and closing`);
    for (const id of ["features", "nfc", "record-panel-0", "record-panel-1"]) {
      if (!html.includes(`id="${id}"`)) throw new Error(`${file} misses feature ${id}`);
    }
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
      await readFile(new URL(match[1].slice(1), root));
    }
  }
}
for (const suffix of ["sc", "tc", "j", "k"]) await readFile(new URL(`assets/fonts/rounded-${suffix}.woff2`, root));
await readFile(new URL("assets/fonts/OFL.txt", root));
const homeScript = await readFile(new URL("assets/home.js", root), "utf8");
if (/fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage/.test(homeScript)) throw new Error("Home interaction must not collect data or make network requests");

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
if (JSON.stringify(associationDetail.components?.map((item) => item["/"])) !== JSON.stringify(["/1/*", "/2/*"])) {
  throw new Error("AASA must expose only the published version 1 and NFC preset version 2 routes");
}
const redirects = await readFile(new URL("_redirects", root), "utf8");
if (!redirects.split("\n").some((line) => line.trim() === "/1/* /link/?route=:splat 200")) {
  throw new Error("Universal Link fallback rewrite is missing");
}
if (!redirects.includes("/2/* /link/?route=:splat 200")) throw new Error("NFC preset fallback rewrite is missing");
await readFile(new URL("assets/language.js", root));
await readFile(new URL("assets/nfc-wire.js", root));
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

const wireScript = await readFile(new URL("assets/nfc-wire.js", root), "utf8");
if (/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage)\b/.test(wireScript)) {
  throw new Error("NFC fallback decoder must remain local-only and stateless");
}
const wireContext = { atob, TextDecoder, URL };
runInNewContext(wireScript, wireContext);
const vector = "UEQBAwEgZbsrH_gryrWurvwBCQEBAwUBAwYBA3jKH1Y";
const decoded = wireContext.PetterDaysNFCWire.decodeToken(vector);
if (decoded.version !== 1 || decoded.record !== "urination" || decoded.mode !== "direct" || !decoded.hasPrefill) {
  throw new Error("NFC Swift/JavaScript fixed vector did not decode as published");
}
const corrupted = `${vector.slice(0, 20)}A${vector.slice(21)}`;
let acceptedCorruption = false;
try { wireContext.PetterDaysNFCWire.decodeToken(corrupted); acceptedCorruption = true; } catch (_) {}
if (acceptedCorruption) throw new Error("NFC fallback decoder accepted a corrupted checksum");

console.log(`Validated ${files.length} HTML files: localized pages, NFC fixed vector, local-only scripts, no known trackers.`);
