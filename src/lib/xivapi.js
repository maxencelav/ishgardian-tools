import { languages } from "$lib/constants";

const BASE_URL = "https://v2.xivapi.com/api";

// The schema is pinned so field names don't change under us after an EXDSchema
// update, the game version can stay on "latest" so new items show up.
// Version: "latest" or a version name such as "7.56x1".
// Schema: "exdschema@2:rev:<commit hash>".
// See https://v2.xivapi.com/docs/guides/pinning/
const VERSION = "latest";
const SCHEMA = "exdschema@2:rev:e773c41";

const codes = Object.keys(languages);

const ITEM_FIELDS = [
    ...codes.map((code) => `Name@lang(${code})`),
    ...codes.map((code) => `Description@lang(${code})`),
    "Icon",
    // Raw value only, otherwise the whole ItemLevel row gets embedded
    "LevelItem@as(raw)",
];

// Quotes and backslashes would break out of the query string literal
const escape = (value) => value.replace(/[\\"]/g, "\\$&");

export async function searchItems(query) {
    const params = new URLSearchParams({
        sheets: "Item",
        query: codes.map((code) => `Name@${code}~"${escape(query)}"`).join(" "),
        fields: ITEM_FIELDS.join(","),
        version: VERSION,
        schema: SCHEMA,
    });

    const response = await fetch(`${BASE_URL}/search?${params}`);
    if (!response.ok) {
        throw new Error(`XIVAPI search failed with status ${response.status}`);
    }
    const data = await response.json();
    return data.results;
}

export function assetUrl(path) {
    const params = new URLSearchParams({ path, format: "webp" });
    return `${BASE_URL}/asset?${params}`;
}
