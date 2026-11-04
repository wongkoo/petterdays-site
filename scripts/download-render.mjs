import { product, campaignURL, campaignFor } from "./product.mjs";
import { homeContent } from "./home-content.mjs";

export const downloadCopy = {
  "zh-Hans": { short: "下载", title: "从今天开始，记下它的小日常。", scan: "用 iPhone 或 iPad 扫码下载", qr: "App Store 下载二维码" },
  "zh-Hant": { short: "下載", title: "從今天開始，記下牠的小日常。", scan: "用 iPhone 或 iPad 掃碼下載", qr: "App Store 下載 QR 碼" },
  en: { short: "Download", title: "Start recording their little days.", scan: "Scan with iPhone or iPad to download", qr: "App Store download QR code" },
  ja: { short: "ダウンロード", title: "今日から、あの子の毎日を記録。", scan: "iPhone・iPad でスキャンしてダウンロード", qr: "App Store ダウンロード用 QR コード" },
  ko: { short: "다운로드", title: "오늘부터, 소중한 하루를 기록해요.", scan: "iPhone 또는 iPad로 스캔해 다운로드", qr: "App Store 다운로드 QR 코드" },
};
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
export const storeLink = (page) => escape(campaignURL(page));

export function downloadQR(locale, page) {
  const c = downloadCopy[locale];
  return `<figure class="download-qr"><img src="/assets/download/${campaignFor(page)}.svg" width="180" height="180" alt="${escape(c.qr)}" loading="lazy" decoding="async"><figcaption>${escape(c.scan)}</figcaption></figure>`;
}

export function downloadCard(locale, page) {
  const c = downloadCopy[locale], h = homeContent[locale];
  return `<section class="download-card" aria-labelledby="download-title"><div><p class="download-kicker">Petter Days · iPhone &amp; iPad</p><h2 id="download-title">${escape(c.title)}</h2><p>${escape(h.intro)}</p><a class="download-button" data-download-end href="${storeLink(page)}">${escape(h.download)} <span aria-hidden="true">↗</span></a></div>${downloadQR(locale, page)}</section>`;
}

export function downloadBar(locale, page) {
  const c = downloadCopy[locale], h = homeContent[locale];
  return `<aside class="download-bar" data-download-bar hidden aria-label="${escape(h.download)}"><div class="download-bar-inner"><img src="${product.icon}" width="40" height="40" alt=""><div class="download-bar-copy"><strong>Petter Days</strong><span>${escape(h.platforms)}</span></div><a class="download-button" href="${storeLink(page)}" aria-label="${escape(h.download)}">${escape(c.short)} <span aria-hidden="true">↗</span></a></div></aside>`;
}
