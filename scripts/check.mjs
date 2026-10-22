import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { TextDecoder } from "node:util";
import { runInNewContext } from "node:vm";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { product, appStoreURL } from "./product.mjs";
import { guidePages, guideLocales } from "./guides.mjs";

const root = new URL("../dist/", import.meta.url);
const rootPath = fileURLToPath(root);
// Verify that published characters are the approved, unmodified IP exports.
const ipAssets = JSON.parse(await readFile(new URL("../ip-assets.json", import.meta.url), "utf8")).assets;
for (const id of ["cat-sitting-v2", "dog-sitting", "diary"]) {
  const asset = ipAssets[id];
  assert.equal(asset.url, `/assets/home/ip/${id}.png`);
  const bytes = await readFile(new URL(asset.url.slice(1), root));
  assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256, `${id} differs from the approved IP source`);
}
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

// Search Console serves this exact ownership proof as a plain verification file.
const verificationFile = "google044d9f950647aca5.html";
assert.equal((await readFile(new URL(verificationFile, root), "utf8")).trim(), `google-site-verification: ${verificationFile}`);
assert.equal((await readFile(new URL("BingSiteAuth.xml", root), "utf8")).replace(/\s+/g, ""), '<?xmlversion="1.0"?><users><user>8CEE0ECD144F66DCF1F89365EA2CD96F</user></users>');
const files = (await htmlFiles(rootPath)).filter((file) => file !== join(rootPath, verificationFile));
const homeFiles = new Set(["index.html", "zh-Hant/index.html", "en/index.html", "ja/index.html", "ko/index.html"].map((path) => join(rootPath, path)));
const expectedHTMLCount = 27 + guidePages.length * guideLocales.length;
if (files.length !== expectedHTMLCount) throw new Error(`Expected ${expectedHTMLCount} HTML files, found ${files.length}`);
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
  const dataBlocks = [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)];
  const executableHTML = html.replace(/<script type="application\/ld\+json">[^<]*<\/script>/g, "");
  if (/<script\b(?![^>]*src="\/assets\/(?:language|nfc-wire|home)\.js")[^>]*>/i.test(executableHTML)) throw new Error(`${file} contains inline or third-party executable script`);
  for (const [, json] of dataBlocks) {
    const data = JSON.parse(json);
    assert.equal(data["@context"], "https://schema.org");
    const app = data["@graph"].find((node) => node["@type"] === "MobileApplication");
    assert.equal(app.name, "Petter Days");
    assert.equal(app.downloadUrl, appStoreURL);
    assert.ok(!app.aggregateRating && !app.review && !app.offers, "Do not invent reviews, ratings or prices");
    const page = data["@graph"].find((node) => node["@type"] === "WebPage");
    assert.equal(page.url, html.match(/rel="canonical" href="([^"]+)"/)[1]);
  }
  if (homeFiles.has(file) || file.includes("/guide/")) assert.equal(dataBlocks.length, 1, `${file} needs structured product facts`);
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
    for (const id of ["features", "care", "supplies", "nfc", "devices-title", "hero-panel-0", "hero-panel-1", "hero-panel-2", "record-panel-0", "record-panel-1"]) {
      if (!html.includes(`id="${id}"`)) throw new Error(`${file} misses feature ${id}`);
    }
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${file} contains duplicate IDs`);
    for (const asset of Object.values(ipAssets)) assert.ok(html.includes(`src="${asset.url}"`), `${file} misses companion artwork`);
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
      await readFile(new URL(match[1].slice(1), root));
    }
  }
}

// Crawl the generated link graph, including alternate languages and sitemap URLs.
// This catches missing guide routes, accidental locale fallbacks and orphan pages.
const siteOrigin = "https://petterdays.wongkoo.group";
const sitemap = await readFile(new URL("sitemap.xml", root), "utf8");
const indexedURLs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(new Set(indexedURLs).size, expectedHTMLCount - 2);
for (const url of indexedURLs) {
  const path = new URL(url).pathname;
  const html = await readFile(new URL(`${path.slice(1)}index.html`, root), "utf8");
  assert.ok(!/name="robots"[^>]*content="[^"]*noindex/.test(html), `${path} unexpectedly excluded`);
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    const target = new URL(href.replaceAll("&amp;", "&"), url);
    if (target.origin !== siteOrigin) continue;
    const localPath = target.pathname.slice(1) + (target.pathname.endsWith("/") ? "index.html" : "");
    await readFile(new URL(localPath, root));
    if (target.hash && target.pathname === path) assert.ok(html.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `${path} has broken anchor ${target.hash}`);
  }
}
for (const locale of guideLocales) {
  const prefix = locale === "zh-Hans" ? "" : `${locale}/`;
  for (const page of guidePages) assert.ok(indexedURLs.includes(`${siteOrigin}/${prefix}${page}/`));
  const home = await readFile(new URL(`${prefix}index.html`, root), "utf8");
  assert.ok(home.includes(`href="/${prefix}guide/"`), "Guides must be discoverable from the homepage");
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

for (const [language, savedLanguage, destination] of [["en-US", null, "/en/"], ["en-US", "ja", "/ja/"]]) {
  let redirectedTo;
  const suffix = "?ref=shared%20link#nfc";
  runInNewContext(languageScript, {
    URL,
    navigator: { language, languages: [language] },
    window: {
      location: { href: `https://petterdays.wongkoo.group/${suffix}`, pathname: "/", replace: (path) => { redirectedTo = path; } },
      localStorage: { getItem: () => savedLanguage, setItem: () => {} },
      history: { replaceState: () => {} },
    },
  });
  assert.equal(redirectedTo, `${destination}${suffix}`, "Language routing must preserve shared-link parameters and section anchors");
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

const countVectors = [
  ["UEQBAwEgZbsrH_gryrWurvwBEwEBAwUBAwYBAwgIAAAAAAAAAAOWzW4n", 3],
  ["UEQBAwEgZbsrH_gryrWurvwBEwEBAwUBAwYBAwgIf_________8Ymboy", "9223372036854775807"],
];
for (const [token, count] of countVectors) {
  const fields = wireContext.PetterDaysNFCWire.decodeToken(token).fields;
  assert.equal(fields.find((field) => field.key === "urineClumpCount")?.value, count);
}
for (const token of [
  "UEQBAwEgZbsrH_gryrWurvwBEwEBAwUBAwYBAwgIAAAAAAAAAAAPxD-d",
  "UEQBAwEgZbsrH_gryrWurvwBEgEBAwUBAwYBAwgHAAAAAAAAAMVuS5s",
  "UEQBAwEgZbsrH_gryrWurvwBFAEBAwUBAwYBAwgJAAAAAAAAAAAA2pYpLQ",
  "UEQBAwEgZbsrH_gryrWurvwBCwEBAwUBAwYBAwgABNKJhQ",
  "UEQBAwEgZbsrH_gryrWurvwBEwEBAwUBAwYBAwgIgAAAAAAAAABc_7pH",
  "UEQBAwIgZbsrH_gryrWurvwBEwEBAwUBAwYBAwgIAAAAAAAAAAP7S519",
  "UEQBAwEgZbsrH_gryrWurvwBHQEBAwUBAwYBAwgIAAAAAAAAAAMICAAAAAAAAAADNyPcbg",
]) {
  assert.throws(() => wireContext.PetterDaysNFCWire.decodeToken(token), /Invalid NFC payload/);
}

function renderNFCFallback(token, rewritten, language = "zh-CN") {
  function element() {
    const children = new Map();
    let textContent = "";
    return {
      get textContent() { return textContent; },
      set textContent(value) { textContent = String(value); },
      hidden: true, open: false, appended: [],
      querySelector(selector) {
        if (!children.has(selector)) children.set(selector, element());
        return children.get(selector);
      },
      append(...nodes) { this.appended.push(...nodes); },
    };
  }
  const elements = new Map();
  const document = {
    readyState: "complete", documentElement: {}, createElement: element,
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, element());
      return elements.get(id);
    },
  };
  let replacement;
  runInNewContext(wireScript, {
    atob, TextDecoder, URL, document,
    navigator: { language, languages: [language] },
    location: new URL(rewritten ? `https://p.wongkoo.group/link/?route=e/${token}` : `https://p.wongkoo.group/2/e/${token}`),
    history: { replaceState: (_state, _title, path) => { replacement = path; } },
  });
  const details = document.getElementById("nfc-details");
  return {
    labels: details.querySelector("dl").appended.filter((_node, index) => index % 2 === 0).map((node) => node.textContent),
    values: details.querySelector("dl").appended.filter((_node, index) => index % 2 === 1).map((node) => node.textContent),
    summaryHidden: document.getElementById("nfc-summary").hidden,
    detailsHidden: details.hidden, detailsOpen: details.open, replacement,
  };
}

// Fixed Wire V1 fixtures: vaccine text collides with enum/prototype names;
// a toilet option alias is literally "normal", while urine color is built-in.
const renderingFixtures = [
  ["UEQBAAwgZbsrH_gBLAEFb3RoZXIDAm5vBAtjb25zdHJ1Y3RvcgUNPGI-Q2xpbmljPC9iPggDeWVz9-ZicQ",
    ["other", "no", "constructor", "<b>Clinic</b>", "yes"]],
  ["UEQBAAEgZbsrH_gBCwEBAwIBAQcDeWVzcAcBbm9ybWFsl5O50w",
    ["normal", "正常", "未知", "未知", "未观察", "未观察", "yes"]],
];
renderingFixtures.push(
  ["UEQBAwEgZbsrH_gryrWurvwBEwEBAwUBAwYBAwgIAAAAAAAAAAOWzW4n", ["中等", "未知", "未知", "未知", "未知", "未知", "3"]],
  ["UEQBAwEgZbsrH_gryrWurvwBEwEBAwUBAwYBAwgIf_________8Ymboy", ["中等", "未知", "未知", "未知", "未知", "未知", "9223372036854775807"]],
);
for (const [token, expectedValues] of renderingFixtures) {
  for (const rewritten of [false, true]) {
    const rendered = renderNFCFallback(token, rewritten);
    assert.deepEqual(rendered.values, expectedValues, "NFC details must preserve user text and translate only built-in options");
    assert.equal(rendered.summaryHidden, false);
    assert.equal(rendered.detailsHidden, false);
    assert.equal(rendered.detailsOpen, false, "Health details must remain collapsed until requested");
    assert.equal(rendered.replacement, "/link/", "Decoded payload must leave the address bar");
  }
}

for (const [language, label] of [["zh-CN", "尿团数"], ["zh-TW", "尿團數"], ["en", "Urine Clumps"], ["ja", "おしっこの塊の数"], ["ko", "소변 덩어리 수"]]) {
  const rendered = renderNFCFallback("UEQBAwEgZbsrH_gryrWurvwBEwEBAwUBAwYBAwgIAAAAAAAAAAOWzW4n", false, language);
  assert.equal(rendered.labels.at(-1), label);
  assert.equal(rendered.values.at(-1), "3");
}

console.log(`Validated ${files.length} HTML files: localized pages, NFC fixed vector, local-only scripts, no known trackers.`);
