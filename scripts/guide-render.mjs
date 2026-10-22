import { escape } from "./home-render.mjs";
import { appStoreURL } from "./product.mjs";
import { storyContent } from "./story-content.mjs";
import { guideVisualContent } from "./guide-visual-content.mjs";

const lines = (values) => values.map((value) => `<span>${escape(value)}</span>`).join("");
const paragraphs = (values) => values.map((value) => `<p>${escape(value)}</p>`).join("");
const character = (id) => `<img src="/assets/home/ip/${id === "cat" ? "cat-sitting-v2" : "dog-sitting"}.png" width="1400" height="${id === "cat" ? "1677" : "1568"}" alt="" loading="lazy" decoding="async">`;
const phone = (locale, name, alt) => `<div class="tour-phone"><img src="/assets/home/${locale}/${name}.png" width="660" height="1434" alt="${escape(alt)}" loading="lazy" decoding="async"></div>`;
const photo = (id, copy, eager = false) => `<figure class="work-photo"><img src="/assets/guide/${id}-at-work.webp" width="1448" height="1086" alt="${escape(copy[id + "Alt"])}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"><figcaption>${escape(copy[id + "Caption"])}</figcaption></figure>`;
const arrowLink = (href, label, extra = "") => `<a class="tour-link ${extra}" href="${href}">${escape(label)} <span aria-hidden="true">↗</span></a>`;
const tinyIcon = (kind) => {
  const paths = {
    device: '<rect x="17" y="7" width="30" height="50" rx="8"/><path d="M27 48h10m-11-27 5 5 9-10"/>',
    folder: '<path d="M8 20v31h48V17H32l-6-6H8v9Zm0 0h48"/><path d="M25 36h14m-7-7v14"/>',
    backup: '<path d="M13 20a23 23 0 1 1-3 20M13 8v12H1"/><path d="M32 18v15l11 6"/>',
  };
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${paths[kind]}</svg>`;
};

export function productGuide(locale, copy, home, pathFor) {
  const v = guideVisualContent[locale];
  const s = storyContent[locale];
  const data = copy.pages.guide;
  const sections = Object.fromEntries(data.sections.map((section) => [section.id, section]));
  const heading = (id, index) => `<p class="tour-kicker"><span>${String(index + 1).padStart(2, "0")}</span> ${escape(v.sections[index])}</p><h2 id="${id}-title">${escape(sections[id].title)}</h2>${paragraphs(sections[id].paragraphs)}`;
  const screenLabel = (name) => `${home.screenshot} · ${name}`;
  const nav = data.sections.map((section, i) => `<a href="#${section.id}">${escape(v.sections[i])}</a>`).join("");
  return `<div class="feature-tour">
    <header class="tour-hero tour-width"><div class="tour-hero-copy"><p class="tour-kicker">${escape(v.eyebrow)}</p><h1>${lines(v.title)}</h1><p class="tour-intro">${escape(data.intro)}</p><div class="tour-actions"><a class="tour-button" href="#records">${escape(copy.explore)} <span aria-hidden="true">↓</span></a>${arrowLink(pathFor(locale, "guide/our-story"), s.label)}</div></div><figure class="tour-hero-art"><img src="/assets/home/ip/diary.png" width="1400" height="860" alt="${escape(home.showcase.diary)}" fetchpriority="high" decoding="async"><figcaption>${escape(v.catQuote)}</figcaption></figure></header>
    <nav class="tour-nav tour-width" aria-label="${escape(home.showcase.nav)}">${nav}</nav>
    <section class="tour-records tour-width tour-section" id="records" aria-labelledby="records-title"><div class="tour-copy">${heading("records", 0)}<ul class="tour-tags">${home.records.types.map((type) => `<li>${escape(type)}</li>`).join("")}</ul><p class="tour-aside">${escape(v.recordNote)}</p>${arrowLink(pathFor(locale, "guide/pet-care-records"), v.recordsLink)}</div><figure class="tour-record-screens"><div class="tour-phone-pair">${phone(locale, "02-record-types", screenLabel(home.records.tabs[0]))}${phone(locale, "03-custom-record", screenLabel(home.records.tabs[1]))}</div><figcaption>${escape(home.screenshot)} · ${escape(home.records.tabs.join(" / "))}</figcaption></figure></section>
    <div class="tour-pair tour-width"><section class="tour-panel tour-care" id="care" aria-labelledby="care-title"><div class="tour-copy">${heading("care", 1)}<p class="tour-aside">${escape(v.careNote)}</p></div><figure><img class="care-art" src="/assets/guide/care-plan.svg" data-asset-id="care-plan" width="1536" height="1024" alt="${escape(v.careAlt)}" loading="lazy" decoding="async"><figcaption>${escape(v.illustration)}</figcaption></figure></section><section class="tour-panel tour-supplies" id="supplies" aria-labelledby="supplies-title"><div class="tour-copy">${heading("supplies", 2)}<ul class="tour-tags">${home.supplies.tags.map((tag) => `<li>${escape(tag)}</li>`).join("")}</ul></div><figure>${phone(locale, "04-warehouse", screenLabel(home.supplies.label))}<figcaption>${escape(screenLabel(home.supplies.label))}</figcaption></figure></section></div>
    <section class="tour-nfc tour-width tour-section" id="nfc" aria-labelledby="nfc-title"><figure><img src="/assets/home/${locale}/nfc.svg" width="1320" height="1550" alt="${escape(home.nfc.illustration + ' · ' + home.nfc.label)}" loading="lazy" decoding="async"><figcaption>${escape(home.nfc.illustration)}</figcaption></figure><div class="tour-copy">${heading("nfc", 3)}<ol class="tour-steps">${v.nfcSteps.map((step) => `<li>${escape(step)}</li>`).join("")}</ol><p class="tour-aside">${escape(home.nfc.note)}</p>${arrowLink(pathFor(locale, "guide/nfc"), v.nfcLink)}<div class="tour-paw-note">${character("dog")}<p>${escape(v.dogQuote)}</p></div></div></section>
    <div class="tour-pair tour-width"><section class="tour-panel tour-data" id="data" aria-labelledby="data-title"><div class="tour-copy">${heading("data", 4)}<p class="tour-aside">${escape(v.dataNote)}</p></div><ol class="tour-data-flow">${["device", "folder", "backup"].map((kind, i) => `<li>${tinyIcon(kind)}<span>${escape(home.ownership.items[i])}</span></li>`).join("")}</ol>${arrowLink(pathFor(locale, "choices"), v.dataLink)}</section><section class="tour-panel tour-sharing" id="sharing" aria-labelledby="sharing-title"><div class="tour-copy">${heading("sharing", 5)}<p class="tour-aside">${escape(v.sharingNote)}</p></div><div class="tour-companions" aria-hidden="true">${character("cat")}<span>＋</span>${character("dog")}</div>${arrowLink(pathFor(locale, "privacy"), v.sharingLink)}</section></div>
    <section class="tour-story tour-width" id="our-story" aria-labelledby="story-teaser-title"><div class="tour-story-copy"><p class="tour-kicker">${escape(s.label)}</p><h2 id="story-teaser-title">${escape(v.storyHeading)}</h2><p>${escape(s.teaser)}</p>${arrowLink(pathFor(locale, "guide/our-story"), s.read, "story-cta")}</div><div class="tour-story-photos"><img src="/assets/guide/cat-at-work.webp" width="1448" height="1086" alt="${escape(s.catAlt)}" loading="lazy" decoding="async"><img src="/assets/guide/dog-at-work.webp" width="1448" height="1086" alt="${escape(s.dogAlt)}" loading="lazy" decoding="async"></div></section>
    <section class="tour-start tour-width" aria-labelledby="guide-start-title"><p class="tour-kicker">${escape(copy.practice)}</p><h2 id="guide-start-title">${escape(v.guideIntro)}</h2><div class="tour-guide-links">${arrowLink(pathFor(locale, "guide/pet-care-records"), copy.relatedRecords)}${arrowLink(pathFor(locale, "guide/nfc"), copy.relatedNFC)}</div><a class="tour-button" href="${appStoreURL}">${escape(copy.download)} <span aria-hidden="true">↗</span></a><ul class="tour-facts">${data.facts.map((fact) => `<li>${escape(fact)}</li>`).join("")}</ul><p class="tour-demo">${escape(home.demo)}</p></section>
  </div>`;
}

export function developerStory(locale, pathFor) {
  const s = storyContent[locale];
  const [start, cat, dog, end] = s.page.sections;
  const text = (section) => `<h2>${escape(section.title)}</h2>${paragraphs(section.paragraphs)}`;
  return `<article class="developer-story">
    <header class="developer-hero tour-width"><a class="tour-back" href="${pathFor(locale, "guide")}">← ${escape(s.back)}</a><p class="tour-kicker">${escape(s.eyebrow)}</p><h1>${lines(s.title)}</h1><p class="tour-intro">${escape(s.intro)}</p><p class="story-byline">George &amp; Biscuit</p><p class="story-disclosure">${escape(s.disclosure)}</p><div class="developer-portraits">${photo("cat", s, true)}${photo("dog", s)}</div></header>
    <section class="story-opening story-reading" id="first-note"><p class="tour-kicker">01</p>${text(start)}</section>
    <section class="story-chapter tour-width" id="cat-desk">${photo("cat", s)}<div class="story-voice"><p class="tour-kicker">02 · ${escape(s.catRole)}</p>${text(cat)}<div class="story-signature">${character("cat")}<span>— ${escape(s.cat)}</span></div></div></section>
    <section class="story-chapter story-chapter-dog tour-width" id="dog-test">${photo("dog", s)}<div class="story-voice"><p class="tour-kicker">03 · ${escape(s.dogRole)}</p>${text(dog)}<div class="story-signature">${character("dog")}<span>— ${escape(s.dog)}</span></div></div></section>
    <section class="story-ending story-reading" id="better-days"><p class="tour-kicker">04 · ${escape(s.together)}</p>${text(end)}<img src="/assets/home/ip/diary.png" width="1400" height="860" alt="" loading="lazy" decoding="async"><blockquote>${escape(s.quote)}</blockquote>${arrowLink(pathFor(locale, "guide"), s.back)}</section>
  </article>`;
}
