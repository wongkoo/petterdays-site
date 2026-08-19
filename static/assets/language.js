(() => {
  const routes = {
    "zh-Hans": "/",
    "zh-Hant": "/zh-Hant/",
    en: "/en/",
    ja: "/ja/",
    ko: "/ko/",
  };
  const preferenceKey = "petterdays-language";
  const url = new URL(window.location.href);
  const explicitLanguage = url.searchParams.get("lang");

  if (Object.hasOwn(routes, explicitLanguage)) {
    try { window.localStorage.setItem(preferenceKey, explicitLanguage); } catch {}
    url.searchParams.delete("lang");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    return;
  }

  if (url.pathname !== "/") return;

  let preferredLanguage;
  try { preferredLanguage = window.localStorage.getItem(preferenceKey); } catch {}

  if (!Object.hasOwn(routes, preferredLanguage)) {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    preferredLanguage = languages.map((language) => {
      const normalized = language.toLowerCase();
      if (normalized.startsWith("zh-hant") || normalized.startsWith("zh-tw") || normalized.startsWith("zh-hk") || normalized.startsWith("zh-mo")) return "zh-Hant";
      if (normalized.startsWith("zh")) return "zh-Hans";
      if (normalized.startsWith("ja")) return "ja";
      if (normalized.startsWith("ko")) return "ko";
      if (normalized.startsWith("en")) return "en";
      return null;
    }).find(Boolean) || "en";
  }

  const destination = routes[preferredLanguage];
  if (destination && destination !== url.pathname) window.location.replace(destination);
})();
