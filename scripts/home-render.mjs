import { product, appStoreURL } from "./product.mjs";

export const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const lines = (text) => text.map((line) => `<span>${escape(line)}</span>`).join("");

// Small, rounded illustrations use our own geometry, not vendor artwork.
const symbols = {
  water: '<path d="M32 10C23 23 17 31 17 40a15 15 0 0 0 30 0c0-9-6-17-15-30Z"/><path d="M24 40c0 5 3 8 7 9"/>',
  food: '<path d="M12 30h40l-5 20H17l-5-20Z"/><path d="M19 22c0-4 5-4 5-8m8 8c0-4 5-4 5-8m8 8c0-4 5-4 5-8"/>',
  weight: '<rect x="14" y="12" width="36" height="40" rx="11"/><path d="M24 27a11 11 0 0 1 16 0m-8 0 5-5"/>',
  care: '<path d="M25 13c-5 0-8 4-8 9v7c0 7 7 12 15 12s15-5 15-12v-7c0-5-3-9-8-9H25Z"/><path d="M23 20v10m9-10v10m9-10v10m-9 11v13"/>',
  pill: '<g transform="rotate(-35 32 32)"><rect x="10" y="22" width="44" height="20" rx="10"/><path d="M32 22v20"/></g>',
  custom: '<rect x="16" y="14" width="32" height="39" rx="8"/><rect x="25" y="9" width="14" height="10" rx="4"/><path d="M24 29h16m-16 8h11m-11 8h16"/>',
  tooth: '<path d="M17 14c7-5 10 0 15 0s8-5 15 0c9 8-1 37-7 39-5 1-3-17-8-17s-3 18-8 17c-6-2-16-31-7-39Z"/>',
  offline: '<rect x="20" y="9" width="25" height="46" rx="7"/><path d="M28 47h9M10 21c7-8 18-10 28-7m5 3 11 7M8 9l48 47"/>',
  lock: '<rect x="15" y="27" width="34" height="27" rx="9"/><path d="M23 27V17a9 9 0 0 1 18 0v10m-9 11v7"/>',
  backup: '<path d="M17 23V12h30v11m-31 4-4 26h40l-4-26H16Z"/><path d="M25 36h14m-7-13v-9m-5 5 5-5 5 5"/>',
};
const icon = (name) => `<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${symbols[name]}</svg>`;
const screenPath = (locale, name) => `/assets/home/${locale}/${name}.png`;
const phone = (locale, name, alt, extra = "", eager = false) => `<div class="device phone ${extra}"><img src="${screenPath(locale, name)}" width="660" height="1434" alt="${escape(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>`;

export function productHome(locale, h) {
  const download = `<a class="store-button" href="${appStoreURL}">${escape(h.download)} <span aria-hidden="true">↗</span></a>`;
  const screenshot = `${h.screenshot} · `;
  const types = ["water", "food", "weight", "care", "pill", "custom"].map((name, i) => `<div class="type-bubble type-${name}">${icon(name)}<span>${escape(h.records.types[i])}</span></div>`).join("");
  const tabs = h.records.tabs.map((text, i) => `<button type="button" role="tab" id="record-tab-${i}" aria-controls="record-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${escape(text)}</button>`).join("");
  const panels = ["02-record-types", "03-custom-record"].map((name, i) => `<div class="record-panel" id="record-panel-${i}" role="tabpanel" aria-labelledby="record-tab-${i}" ${i === 0 ? "" : "hidden"} tabindex="0"><p class="panel-caption">${escape(h.records.captions[i])}</p>${phone(locale, name, screenshot + h.records.tabs[i])}</div>`).join("");
  const careRows = ["care", "tooth", "pill"].map((name, i) => `<div class="care-row"><span class="care-row-icon icon-${name}">${icon(name)}</span><div><strong>${escape(h.care.rows[i])}</strong><span>${escape(h.care.repeat)} · ${["10:00", "19:00", "20:00"][i]}</span></div><span class="care-state ${i === 0 ? "is-done" : ""}">${i === 0 ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>' : '<span class="empty-check" aria-hidden="true"></span>'}<span class="sr-only">${escape(i === 0 ? h.care.done : h.care.pending)}</span></span></div>`).join("");
  const careDays = h.care.weekdays.map((day, i) => `<div class="${i === 2 ? "today" : ""}"><span>${escape(day)}</span><strong>${12 + i}</strong>${i === 2 ? '<span class="day-dot" aria-hidden="true"></span>' : ""}</div>`).join("");
  const ownership = ["offline", "lock", "backup"].map((name, i) => `<li>${icon(name)}<span>${escape(h.ownership.items[i])}</span></li>`).join("");
  return `
    <section class="product-hero" aria-labelledby="hero-title">
      <p class="product-kicker">Petter Days</p><h1 id="hero-title">${lines(h.hero)}</h1><p class="product-intro">${escape(h.intro)}</p>
      <div class="hero-actions">${download}<a class="explore-link" href="#features">${escape(h.explore)} <span aria-hidden="true">↓</span></a></div>
      <div class="hero-devices"><div class="hero-halo" aria-hidden="true"></div><div class="device tablet"><img src="${screenPath(locale, "ipad-today")}" width="900" height="1200" alt="${escape(screenshot + "iPad")}" loading="lazy" decoding="async"></div>${phone(locale, "01-today", screenshot + "iPhone", "hero-phone", true)}</div>
      <p class="device-caption">${escape(h.devices)}</p>
    </section>
    <section class="records-section product-section" id="features" aria-labelledby="records-title">
      <div class="records-copy"><p class="product-kicker">${escape(h.records.label)}</p><h2 id="records-title">${lines(h.records.title)}</h2><div class="record-tabs" role="tablist" aria-label="${escape(h.records.label)}">${tabs}</div><div class="type-cloud" aria-hidden="true">${types}</div></div>
      <div class="record-stage">${panels}</div>
    </section>
    <div class="life-grid product-section">
      <section class="life-card care-card" aria-labelledby="care-title"><div class="card-heading"><p class="product-kicker">${escape(h.care.label)}</p><h2 id="care-title">${lines(h.care.title)}</h2><p>${escape(h.care.intro)}</p></div><div class="care-illustration" role="img" aria-label="${escape(h.nfc.illustration + ' · ' + h.care.label)}"><div class="care-week">${careDays}</div><div class="care-tasks">${careRows}</div></div><small class="illustration-note">${escape(h.nfc.illustration)}</small></section>
      <section class="life-card supplies-card" aria-labelledby="supplies-title"><div class="card-heading"><p class="product-kicker">${escape(h.supplies.label)}</p><h2 id="supplies-title">${lines(h.supplies.title)}</h2><p>${escape(h.supplies.intro)}</p></div><div class="supplies-visual">${phone(locale, "04-warehouse", screenshot + h.supplies.label)}<div class="supply-labels" aria-hidden="true">${h.supplies.tags.map((tag) => `<span>${escape(tag)}</span>`).join("")}</div></div></section>
    </div>
    <section class="nfc-section product-section" id="nfc" aria-labelledby="nfc-title"><div class="nfc-copy"><p class="product-kicker">${escape(h.nfc.label)}</p><h2 id="nfc-title">${lines(h.nfc.title)}</h2><p>${escape(h.nfc.intro)}</p><small>${escape(h.nfc.note)}</small></div><figure class="nfc-art"><img src="/assets/home/${locale}/nfc.svg" width="1320" height="1550" alt="${escape(h.nfc.illustration + ' · ' + h.nfc.label)}" loading="lazy" decoding="async"><figcaption>${escape(h.nfc.illustration)}</figcaption></figure></section>
    <section class="ownership-section product-section" aria-labelledby="ownership-title"><h2 id="ownership-title">${lines(h.ownership.title)}</h2><ul>${ownership}</ul></section>
    <section class="product-closing"><img src="${product.icon}" width="88" height="88" alt="" loading="lazy"><h2>${escape(h.closing)}</h2><p>${escape(h.platforms)}</p>${download}</section>`;
}
