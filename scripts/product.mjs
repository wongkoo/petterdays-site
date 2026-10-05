import { readFileSync } from "node:fs";

export const product = JSON.parse(readFileSync(new URL("../product.json", import.meta.url), "utf8"));
export const appStoreURL = `https://apps.apple.com/app/id${product.appStoreAppleID}`;
