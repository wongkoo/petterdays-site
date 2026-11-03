import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export const siteOrigin = "https://petterdays.app";
export const searchUpdatedDate = "2026-11-04";

const decode = (text) => text.replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => String.fromCodePoint(code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code)))
  .replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&nbsp;", " ").replaceAll("&amp;", "&");

// Export the same public main content as HTML. There is no separate AI-only copy.
export function pageMarkdown(html, canonical, locale) {
  let content = html.match(/<main id="content">([\s\S]*?)<\/main>/)[1];
  content = content.replace(/<(svg|script|style|button)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<img\b[^>]*alt="([^"]*)"[^>]*>/gi, (_, alt) => alt ? ` ${alt} ` : "")
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => `[${label.replace(/<[^>]+>/g, "")}](${new URL(decode(href), canonical).href}) `)
    .replace(/<h([1-6])\b[^>]*>/gi, (_, level) => `\n\n${"#".repeat(Number(level))} `)
    .replace(/<\/span>\s*<span\b[^>]*>/gi, " ")
    .replace(/<p\b[^>]*>/gi, "\n\n")
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<summary\b[^>]*>/gi, "\n\n### ")
    .replace(/<\/(?:h[1-6]|p|section|header|article|figure|figcaption|div|ul|ol|details|blockquote)>|<br\s*\/?\s*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "");
  content = decode(content).replace(/[\t ]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return `Source: ${canonical}\nLanguage: ${locale}\n\n${content}\n`;
}

export async function writeSearchContent(out, pages, appStoreURL) {
  for (const page of pages) {
    const file = join(out, new URL(page.markdown).pathname);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, page.markdownContent);
  }
  const locales = [...new Set(pages.map((p) => p.locale))];
  const localeNames = { "zh-Hans": "简体中文", "zh-Hant": "繁體中文", en: "English", ja: "日本語", ko: "한국어" };
  const index = `# Petter Days\n\n> Petter Days is a pet care journal for iPhone and iPad, published by ZhenHui Wang. Official website: ${siteOrigin}/.\n\n## Product facts\n\n- Record each pet's water, meals, weight, medication and grooming; create custom record fields, care plans and supply inventory.\n- Requires iOS 18 / iPadOS 18 or later. Available in Simplified Chinese, Traditional Chinese, English, Japanese and Korean.\n- Core records work offline and are stored on the device. No Petter Days account is required.\n- Optional iCloud sync and household sharing require Petter Days Pro. Each participating caregiver needs a separate Pro subscription. Sharing covers the whole household.\n- NFC shortcuts require a compatible iPhone and a separately obtained writable NFC tag. A tag opens the App; it does not measure a pet's health.\n- The App supports care records and observation, not veterinary diagnosis. It does not provide a user-facing AI assistant.\n- Prices and subscription availability are shown by Apple for the visitor's storefront; no fixed price or rating is asserted here.\n- George (cat / 乔治) and Biscuit (dog / 饼干) are the brand's illustrated characters. The developer-story pages are character storytelling, not factual developer biographies.\n\n## Official sources\n\n- [App Store](${appStoreURL}): Official download and current storefront information.\n- [Sitemap](${siteOrigin}/sitemap.xml): Canonical public HTML URLs.\n- [Public product documentation, full text](${siteOrigin}/llms-full.txt): Generated from the same guides in all five languages.\n\n`;
  const sections = locales.map((locale) => {
    const selected = pages.filter((p) => p.locale === locale && ["home", "guide", "guide/pet-care-records", "guide/nfc", "privacy", "choices", "terms", "support"].includes(p.page));
    return `## ${localeNames[locale]}\n\n${selected.map((p) => `- [${p.title}](${p.canonical}) ([Markdown](${p.markdown}))`).join("\n")}\n`;
  }).join("\n");
  await writeFile(join(out, "llms.txt"), index + sections);
  const full = pages.filter((p) => ["guide", "guide/pet-care-records", "guide/nfc"].includes(p.page));
  await writeFile(join(out, "llms-full.txt"), `${index}\n${full.map((p) => p.markdownContent).join("\n---\n\n")}`);
}
