import { readFileSync } from "node:fs";

export const product = JSON.parse(readFileSync(new URL("../product.json", import.meta.url), "utf8"));
export const appStoreURL = `https://apps.apple.com/app/id${product.appStoreAppleID}`;

// Public attribution token generated in App Store Connect; never an API credential.
export const campaigns = JSON.parse(readFileSync(new URL("../campaigns.json", import.meta.url), "utf8"));
export const campaignFor = (page) => page === "home" ? "home" : page === "guide" ? "features" : "guides";
export const campaignURL = (page) => `https://apps.apple.com/app/apple-store/id${product.appStoreAppleID}?pt=${campaigns.providerToken}&ct=${campaigns.campaigns[campaignFor(page)]}&mt=8`;
