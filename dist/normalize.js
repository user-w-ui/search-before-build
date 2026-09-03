const KNOWN_ITEM_PATHS = [
    "results",
    "items",
    "crates",
    "hits",
    "response.docs",
    "message.items",
    "servers",
    "notableCandidates",
    "data.results",
    "data.items",
];
const TRACKING_PARAMS = new Set([
    "fbclid",
    "gclid",
    "ref",
    "ref_src",
    "source",
    "spm",
]);
// Provider-native field signatures: when a specialized provider's payload carries none of
// these fields, the caller most likely flattened it into a uniform title/url/snippet shape,
// which silently disables cross-source identity merging and recency ranking. The contract
// in references/decision-kernel.md requires the raw response verbatim.
const NATIVE_SIGNATURES = [
    [/github/, ["full_name", "stargazers_count", "pushed_at", "html_url", "archived", "topics"]],
    [/npm/, ["links", "version", "keywords", "date"]],
    [/crates/, ["crate", "max_stable_version", "recent_downloads", "repository"]],
    [/maven/, ["latestVersion", "timestamp", "canonical_url", "version"]],
    [/registry|mcp/, ["server", "transports", "repository", "repository_url"]],
    [/huggingface|^hf$/, ["modelId", "model_id", "pipeline_tag", "downloads", "likes"]],
    [/arxiv/, ["published", "summary", "updated"]],
];
function asObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value)
        ? value
        : undefined;
}
function getPath(value, path) {
    let current = value;
    for (const part of path.split(".")) {
        const object = asObject(current);
        if (!object)
            return undefined;
        current = object[part];
    }
    return current;
}
function firstString(value, paths) {
    for (const path of paths) {
        const candidate = getPath(value, path);
        if (typeof candidate === "string" && candidate.trim())
            return candidate.trim();
        if (Array.isArray(candidate)) {
            const strings = candidate.filter((item) => typeof item === "string");
            if (strings.length)
                return strings.join(" ").trim();
        }
    }
    return undefined;
}
function firstNumber(value, paths) {
    for (const path of paths) {
        const candidate = getPath(value, path);
        if (typeof candidate === "number" && Number.isFinite(candidate))
            return candidate;
        if (typeof candidate === "string" && candidate.trim() && Number.isFinite(Number(candidate))) {
            return Number(candidate);
        }
    }
    return undefined;
}
function stableHash(value) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
}
export function normalizeUrl(value) {
    if (!value)
        return undefined;
    let input = value.trim();
    if (/^10\.\d{4,9}\//i.test(input))
        input = `https://doi.org/${input}`;
    try {
        const url = new URL(input);
        if (url.protocol !== "http:" && url.protocol !== "https:")
            return undefined;
        url.protocol = "https:";
        url.hostname = url.hostname.toLowerCase();
        url.hash = "";
        for (const key of [...url.searchParams.keys()]) {
            if (key.toLowerCase().startsWith("utm_") || TRACKING_PARAMS.has(key.toLowerCase())) {
                url.searchParams.delete(key);
            }
        }
        if (url.pathname.length > 1)
            url.pathname = url.pathname.replace(/\/+$/, "");
        return url.toString();
    }
    catch {
        return undefined;
    }
}
function normalizeDate(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        const milliseconds = value < 10_000_000_000 ? value * 1000 : value;
        const date = new Date(milliseconds);
        return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
    }
    if (typeof value === "string" && value.trim()) {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
    }
    if (Array.isArray(value) && Array.isArray(value[0])) {
        const parts = value[0];
        const year = Number(parts[0]);
        const month = Number(parts[1] ?? 1);
        const day = Number(parts[2] ?? 1);
        if (Number.isInteger(year) && year > 0) {
            return new Date(Date.UTC(year, month - 1, day)).toISOString();
        }
    }
    return undefined;
}
function decodeHtml(value) {
    return value
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function decodeDuckDuckGoUrl(value) {
    const decoded = decodeHtml(value);
    try {
        const url = new URL(decoded, "https://duckduckgo.com");
        return url.searchParams.get("uddg") ?? url.toString();
    }
    catch {
        return decoded;
    }
}
function parseAtom(xml) {
    const entries = [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)];
    return entries.map((match, index) => {
        const body = match[1] ?? "";
        const read = (tag) => decodeHtml(body.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] ?? "");
        const link = body.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1];
        return {
            value: {
                title: read("title"),
                summary: read("summary"),
                id: read("id"),
                published: read("published"),
                updated: read("updated"),
                url: link,
            },
            rawRef: `$.entry[${index}]`,
            rank: index + 1,
        };
    });
}
function parseHtmlResults(html) {
    const anchors = [...html.matchAll(/<a\b[^>]*class=["'][^"']*result__a[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
    if (anchors.length) {
        return anchors.map((match, index) => {
            const rest = html.slice((match.index ?? 0) + match[0].length, (match.index ?? 0) + match[0].length + 2500);
            const snippet = rest.match(/class=["'][^"']*result__snippet[^"']*["'][^>]*>([\s\S]*?)<\//i)?.[1];
            return {
                value: {
                    title: decodeHtml(match[2] ?? ""),
                    url: decodeDuckDuckGoUrl(match[1] ?? ""),
                    snippet: snippet ? decodeHtml(snippet) : undefined,
                },
                rawRef: `$.html.results[${index}]`,
                rank: index + 1,
            };
        });
    }
    const text = decodeHtml(html);
    return text ? [{ value: { content: text }, rawRef: "$.html", rank: 1 }] : [];
}
function candidateSignals(value) {
    const object = asObject(value);
    if (!object)
        return typeof value === "string" ? 1 : 0;
    return ["title", "name", "identity", "full_name", "url", "html_url", "repo", "description", "desc", "snippet", "summary"]
        .filter((key) => object[key] !== undefined).length;
}
function textFragments(value) {
    if (typeof value === "string")
        return value.trim() ? [value.trim()] : [];
    if (Array.isArray(value))
        return value.flatMap(textFragments);
    const object = asObject(value);
    return object ? Object.values(object).flatMap(textFragments) : [];
}
function locateItems(payload) {
    if (Array.isArray(payload)) {
        return payload.map((value, index) => ({ value, rawRef: `$[${index}]`, rank: index + 1 }));
    }
    const object = asObject(payload);
    if (!object)
        return [{ value: payload, rawRef: "$", rank: 1 }];
    for (const path of KNOWN_ITEM_PATHS) {
        const value = getPath(object, path);
        if (!Array.isArray(value))
            continue;
        return value.map((item, index) => ({
            value: path === "servers" ? (asObject(item)?.server ?? item) : item,
            rawRef: `$.${path}[${index}]${path === "servers" ? ".server" : ""}`,
            rank: index + 1,
        }));
    }
    const queue = [{ value: object, path: "$", depth: 0 }];
    while (queue.length) {
        const current = queue.shift();
        if (!current || current.depth >= 3)
            continue;
        const currentObject = asObject(current.value);
        if (!currentObject)
            continue;
        for (const [key, value] of Object.entries(currentObject)) {
            if (Array.isArray(value) && value.some((item) => candidateSignals(item) >= 2)) {
                return value.map((item, index) => ({
                    value: item,
                    rawRef: `${current.path}.${key}[${index}]`,
                    rank: index + 1,
                }));
            }
            if (asObject(value))
                queue.push({ value, path: `${current.path}.${key}`, depth: current.depth + 1 });
        }
    }
    return [{ value: object, rawRef: "$", rank: 1 }];
}
function parsePayload(payload) {
    if (typeof payload !== "string")
        return locateItems(payload);
    const trimmed = payload.trim();
    if (!trimmed)
        return [];
    try {
        return locateItems(JSON.parse(trimmed));
    }
    catch {
        if (/<feed\b|<entry\b/i.test(trimmed))
            return parseAtom(trimmed);
        if (/<html\b|result__a/i.test(trimmed))
            return parseHtmlResults(trimmed);
        return [{ value: { content: trimmed }, rawRef: "$.text", rank: 1 }];
    }
}
function providerName(envelope) {
    return envelope.providerHint?.trim().toLowerCase() || undefined;
}
function inferKind(envelope, item) {
    if (envelope.categoryHint)
        return envelope.categoryHint;
    const provider = providerName(envelope) ?? "";
    if (/github/.test(provider) || firstString(item, ["full_name", "stargazers_url"]))
        return "repo";
    if (/huggingface/.test(provider) || provider === "hf")
        return "model";
    if (/npm|crates|maven|ecosystem/.test(provider))
        return "package";
    if (/mcp/.test(provider))
        return "mcp";
    if (/arxiv|crossref|openalex/.test(provider))
        return "paper";
    if (/wikipedia/.test(provider))
        return "wiki";
    if (/hacker|algolia/.test(provider))
        return "community";
    return undefined;
}
function collectIdentities(item, kind, provider, title, url) {
    const identities = [];
    const seen = new Set();
    const add = (identity) => {
        const key = `${identity.scheme}:${identity.value.toLowerCase()}`;
        if (!seen.has(key)) {
            seen.add(key);
            identities.push(identity);
        }
    };
    const purl = firstString(item, ["purl", "package.purl"]);
    if (purl)
        add({ scheme: "purl", value: purl, confidence: "exact" });
    const doi = firstString(item, ["DOI", "doi"]);
    if (doi)
        add({ scheme: "doi", value: doi.toLowerCase(), confidence: "exact" });
    const explicitId = firstString(item, ["id", "uuid", "identity", "server.name"]);
    const repositoryIdentity = firstString(item, ["full_name", "identity"]);
    if (kind === "repo" && repositoryIdentity?.includes("/")) {
        add({ scheme: "github", value: repositoryIdentity.toLowerCase(), confidence: "derived" });
    }
    if (kind === "mcp" && (title || explicitId)) {
        add({ scheme: "mcp", value: title ?? explicitId, confidence: "exact" });
    }
    if (kind === "package" && provider?.includes("maven")) {
        // Maven Central search items expose `id` as "group:artifact" — the only stable
        // cross-source identity when repository links were not preserved.
        const mavenId = firstString(item, ["id"]);
        if (mavenId && /^[^:\s]+:[^:\s]+$/.test(mavenId)) {
            const [group, artifact] = mavenId.split(":");
            add({ scheme: "purl", value: `pkg:maven/${group}/${artifact}`, confidence: "derived" });
        }
    }
    if (kind === "package" && title) {
        const ecosystem = provider?.includes("crate")
            ? "cargo"
            : provider?.includes("maven")
                ? "maven"
                : provider?.includes("npm")
                    ? "npm"
                    : undefined;
        if (ecosystem)
            add({ scheme: "purl", value: `pkg:${ecosystem}/${title}`, confidence: "derived" });
    }
    if (url) {
        const github = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/?#]+)/i);
        if (github) {
            add({
                scheme: "github",
                value: `${github[1]}/${github[2]?.replace(/\.git$/i, "")}`.toLowerCase(),
                confidence: "derived",
            });
        }
        const arxiv = url.match(/arxiv\.org\/(?:abs|pdf)\/([^/?#]+)/i);
        if (arxiv)
            add({ scheme: "arxiv", value: arxiv[1], confidence: "derived" });
        add({ scheme: "url", value: url, confidence: "derived" });
    }
    if (provider && explicitId) {
        add({ scheme: "provider", value: `${provider}:${explicitId}`, confidence: "exact" });
    }
    return identities;
}
function projectItem(located, envelope) {
    const item = located.value;
    const warnings = [];
    const provider = providerName(envelope);
    const kind = inferKind(envelope, item);
    const title = firstString(item, ["title", "name", "identity", "full_name", "display_name", "server.name", "modelId"]);
    const rawUrl = firstString(item, [
        // html_url before url: GitHub search items expose both, and the API URL
        // (api.github.com/repos/...) neither reads well nor matches the github
        // identity extraction below.
        "html_url",
        "url",
        "canonical_url",
        "repo",
        "repository",
        "link",
        "repository_url",
        "repository.url",
        "links.repository",
        "links.homepage",
        "links.npm",
        "homepage",
        "DOI",
        "doi",
    ]);
    let url = normalizeUrl(rawUrl);
    if (!url && kind === "model") {
        // Hugging Face Hub items identify models by `modelId` ("org/name") and often
        // carry no URL; the canonical model page is deterministic from it.
        const modelId = firstString(item, ["modelId", "model_id"]);
        if (modelId)
            url = normalizeUrl(`https://huggingface.co/${modelId}`);
    }
    if (rawUrl && !url)
        warnings.push({ code: "invalid_url", message: `Could not normalize URL: ${rawUrl}`, rawRef: located.rawRef });
    const snippet = firstString(item, ["snippet", "text", "extract"]);
    const description = firstString(item, ["description", "desc", "findings", "finding", "summary", "content", "abstract"]);
    const fragments = [
        ...textFragments(getPath(item, "verified_capabilities")),
        ...textFragments(getPath(item, "tools")),
        ...textFragments(getPath(item, "transport")),
        ...textFragments(getPath(item, "runtime")),
    ];
    // Source-native date fields: GitHub exposes pushed_at (and created_at), Hugging Face
    // lastModified, npm date, Maven timestamp, Hacker News created_at — without these
    // mappings even a verbatim raw payload carries no recency signal.
    const publishedRaw = getPath(item, "published") ?? getPath(item, "published_at") ?? getPath(item, "publish_date") ?? getPath(item, "created_at") ?? getPath(item, "published.date-parts");
    const updatedRaw = getPath(item, "updated") ?? getPath(item, "pushed_at") ?? getPath(item, "updated_at") ?? getPath(item, "last_synced_at") ?? getPath(item, "lastModified") ?? getPath(item, "date") ?? getPath(item, "timestamp");
    const publishedAt = normalizeDate(publishedRaw);
    const updatedAt = normalizeDate(updatedRaw);
    if (publishedRaw !== undefined && !publishedAt)
        warnings.push({ code: "invalid_date", message: "Could not parse published date.", rawRef: located.rawRef });
    if (updatedRaw !== undefined && !updatedAt)
        warnings.push({ code: "invalid_date", message: "Could not parse updated date.", rawRef: located.rawRef });
    const attributes = {};
    const attributePaths = [
        ["stars", ["stars", "stargazers_count"]],
        ["downloads", ["downloads", "downloads_count", "recent_downloads"]],
        ["citations", ["cited_by_count", "citation_count"]],
    ];
    for (const [name, paths] of attributePaths) {
        const number = firstNumber(item, paths);
        if (number !== undefined)
            attributes[name] = number;
    }
    for (const [name, paths] of [
        ["language", ["language"]],
        ["ecosystem", ["ecosystem", "platform"]],
        ["license", ["license.spdx_id", "license.name", "license"]],
    ]) {
        const value = firstString(item, paths);
        if (value)
            attributes[name] = value;
    }
    const providerScore = firstNumber(item, ["score", "relevance_score"]);
    const identities = collectIdentities(item, kind, provider, title, url);
    if (!identities.length)
        warnings.push({ code: "missing_identity", message: "No stable identity was found; cross-source merging is disabled.", rawRef: located.rawRef });
    if (!title && !snippet && !description && !fragments.length)
        warnings.push({ code: "missing_text", message: "No searchable text was found.", rawRef: located.rawRef });
    const hasText = Boolean(title || snippet || description || fragments.length);
    // A textless record with a stable identity (e.g. Maven Central's {id, latestVersion,
    // timestamp}) is still a real cross-source observation: keep it mergeable as "partial"
    // instead of discarding it, so registry/package hits can merge into richer candidates.
    const status = hasText && (url || identities.length)
        ? "usable"
        : hasText || identities.length
            ? "partial"
            : "unusable";
    if (status !== "usable")
        warnings.push({ code: "partial_item", message: `Record is ${status} and will use only available signals.`, rawRef: located.rawRef });
    const identitySeed = identities[0] ? `${identities[0].scheme}:${identities[0].value}` : `${envelope.requestId}:${located.rawRef}`;
    return {
        recordId: `rec-${stableHash(identitySeed)}`,
        status,
        ...(kind ? { kind } : {}),
        identities,
        ...(title ? { title } : {}),
        ...(url ? { url } : {}),
        text: {
            ...(snippet ? { snippet } : {}),
            ...(description ? { description } : {}),
            ...(fragments.length ? { fragments: [...new Set(fragments)] } : {}),
        },
        ...((publishedAt || updatedAt) ? { dates: { ...(publishedAt ? { publishedAt } : {}), ...(updatedAt ? { updatedAt } : {}) } } : {}),
        attributes,
        provenance: {
            requestId: envelope.requestId,
            ...(provider ? { provider } : {}),
            providerRank: located.rank,
            ...(providerScore !== undefined ? { providerScore } : {}),
            rawRef: located.rawRef,
        },
        warnings,
    };
}
export function normalizeRetrieval(envelope) {
    if (!envelope || typeof envelope.requestId !== "string" || !envelope.requestId.trim()) {
        throw new Error("Retrieval envelope requires a non-empty requestId.");
    }
    if (envelope.outcome === "error") {
        return {
            requestId: envelope.requestId,
            records: [],
            rejected: [],
            observedCapabilities: {},
            batchWarnings: [{
                    code: "retrieval_error",
                    message: `${envelope.error.kind}: ${envelope.error.message}`,
                }],
        };
    }
    const batchWarnings = [];
    const rejected = [];
    const located = parsePayload(envelope.payload);
    if (!located.length) {
        batchWarnings.push({ code: "unknown_shape", message: "Payload did not contain any usable item." });
    }
    const provider = providerName(envelope);
    const signature = provider ? NATIVE_SIGNATURES.find(([pattern]) => pattern.test(provider)) : undefined;
    if (signature && located.length) {
        const hasNativeField = located.some((item) => {
            const object = asObject(item.value);
            return object ? signature[1].some((key) => object[key] !== undefined) : false;
        });
        if (!hasNativeField) {
            batchWarnings.push({
                code: "flattened_payload",
                message: `Provider "${provider}" payload lacks native fields (${signature[1].slice(0, 4).join(", ")}); identity merging and recency ranking are degraded. Pass the raw response verbatim.`,
            });
        }
    }
    const records = [];
    for (const item of located) {
        try {
            records.push(projectItem(item, envelope));
        }
        catch (error) {
            rejected.push({ rawRef: item.rawRef, reason: error instanceof Error ? error.message : String(error) });
        }
    }
    if (records.length === 1 && records[0]?.status === "unusable") {
        batchWarnings.push({ code: "unknown_shape", message: "Payload shape was preserved but could not be projected into a candidate.", rawRef: records[0].provenance.rawRef });
    }
    return {
        requestId: envelope.requestId,
        records,
        rejected,
        observedCapabilities: {
            multipleResults: records.length > 1,
            providerScore: records.some((record) => record.provenance.providerScore !== undefined),
            publishedDate: records.some((record) => record.dates?.publishedAt !== undefined),
            stableIdentity: records.some((record) => record.identities.some((identity) => identity.scheme !== "provider")),
            fullText: records.some((record) => Boolean(record.text.description && record.text.description.length > 500)),
        },
        batchWarnings,
    };
}
//# sourceMappingURL=normalize.js.map