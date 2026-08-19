# Petter Days public site

Static, multilingual product, privacy, terms, and support site for Petter Days.

## Build

```sh
npm run build
npm run check
```

The deployable output is written to `dist/`. Cloudflare Pages uses `npm run build` and publishes `dist`.

The site intentionally has no analytics, cookies, form backend, third-party fonts, or runtime dependencies. A small first-party script selects the initial localized homepage from the browser language and stores only the visitor's explicit language preference locally.
