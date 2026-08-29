const STOPWORDS = new Set("a an the and or of to in on for with is are be by as at this that from how what which can should tool app system using use support plugin project 一个 一种 这个 那个 的 了 和 与 或 是 在 用 支持 工具 系统 项目 插件".split(" "));
export function tokenize(text) {
    const normalized = text.toLowerCase().normalize("NFKC");
    const tokens = [];
    for (const match of normalized.matchAll(/[a-z0-9]+(?:[._-][a-z0-9]+)*/g)) {
        const token = match[0];
        if (token.length > 1 && !STOPWORDS.has(token))
            tokens.push(token);
        for (const part of token.split(/[._-]/)) {
            if (part.length > 1 && part !== token && !STOPWORDS.has(part))
                tokens.push(part);
        }
    }
    for (const match of normalized.matchAll(/[\p{Script=Han}]+/gu)) {
        const sequence = match[0];
        if (sequence.length === 1)
            tokens.push(sequence);
        for (let index = 0; index + 1 < sequence.length; index += 1) {
            const token = sequence.slice(index, index + 2);
            if (!STOPWORDS.has(token))
                tokens.push(token);
        }
    }
    return tokens;
}
const IDENTITY_PRIORITY = {
    purl: 0,
    doi: 0,
    arxiv: 0,
    mcp: 0,
    github: 1,
    url: 2,
    provider: 3,
};
function identityKeys(record) {
    const keys = record.identities
        .filter((identity) => identity.scheme !== "provider")
        .map((identity) => `${identity.scheme}:${identity.value.toLowerCase()}`);
    return keys.length ? keys : [`record:${record.recordId}`];
}
function textOf(record) {
    return [
        record.title,
        record.text.snippet,
        record.text.description,
        ...(record.text.fragments ?? []),
        ...Object.values(record.attributes).map((value) => Array.isArray(value) ? value.join(" ") : String(value)),
    ]
        .filter(Boolean)
        .join(" ");
}
function mergeRecords(records) {
    const groups = [];
    const identityToGroup = new Map();
    for (const record of records) {
        if (record.status === "unusable")
            continue;
        const keys = identityKeys(record);
        const matchedGroups = [...new Set(keys.map((key) => identityToGroup.get(key)).filter((value) => value !== undefined))];
        const groupIndex = matchedGroups[0] ?? groups.length;
        if (!groups[groupIndex])
            groups[groupIndex] = [];
        groups[groupIndex]?.push(record);
        for (const extraIndex of matchedGroups.slice(1)) {
            const extra = groups[extraIndex];
            if (!extra?.length)
                continue;
            groups[groupIndex]?.push(...extra);
            groups[extraIndex] = [];
            for (const extraRecord of extra) {
                for (const key of identityKeys(extraRecord))
                    identityToGroup.set(key, groupIndex);
            }
        }
        for (const key of keys)
            identityToGroup.set(key, groupIndex);
    }
    return groups.filter((group) => group.length > 0).map((observations) => {
        const titles = observations.map((record) => record.title).filter((value) => Boolean(value));
        const identities = new Map();
        for (const record of observations) {
            for (const identity of record.identities)
                identities.set(`${identity.scheme}:${identity.value.toLowerCase()}`, identity);
        }
        const sourceCategories = [...new Set(observations.map((record) => record.kind).filter((value) => Boolean(value)))];
        const sortedIdentities = [...identities.values()].sort((a, b) => IDENTITY_PRIORITY[a.scheme] - IDENTITY_PRIORITY[b.scheme] || a.value.localeCompare(b.value));
        const preferredIdentity = sortedIdentities[0];
        const candidateId = preferredIdentity
            ? `${preferredIdentity.scheme}:${preferredIdentity.value.toLowerCase()}`
            : `record:${observations[0]?.recordId}`;
        return {
            id: candidateId,
            title: titles.sort((a, b) => b.length - a.length)[0] ?? observations[0]?.url ?? candidateId,
            url: observations.find((record) => record.url)?.url,
            kind: observations.find((record) => record.kind)?.kind,
            identities: sortedIdentities,
            sourceCategories,
            text: [...new Set(observations.map(textOf).filter(Boolean))].join(" "),
            observations,
            matchedCapabilities: [],
            lexical: 0,
            rrf: 0,
            evidence: 0,
            final: 0,
        };
    });
}
function termCounts(tokens) {
    const counts = new Map();
    for (const token of tokens)
        counts.set(token, (counts.get(token) ?? 0) + 1);
    return counts;
}
function bm25f(candidates, query) {
    const queryTerms = [...new Set(tokenize(query))];
    if (!queryTerms.length || !candidates.length)
        return candidates.map(() => 0);
    const fields = candidates.map((candidate) => ({
        title: tokenize(candidate.title),
        body: tokenize(candidate.text),
    }));
    const average = {
        title: fields.reduce((sum, field) => sum + field.title.length, 0) / fields.length || 1,
        body: fields.reduce((sum, field) => sum + field.body.length, 0) / fields.length || 1,
    };
    const documentFrequency = new Map();
    for (const term of queryTerms) {
        documentFrequency.set(term, fields.filter((field) => field.title.includes(term) || field.body.includes(term)).length);
    }
    const k1 = 1.2;
    const b = 0.75;
    return fields.map((field) => {
        const titleCounts = termCounts(field.title);
        const bodyCounts = termCounts(field.body);
        let score = 0;
        for (const term of queryTerms) {
            const df = documentFrequency.get(term) ?? 0;
            const idf = Math.log(1 + (candidates.length - df + 0.5) / (df + 0.5));
            const titleTf = (titleCounts.get(term) ?? 0) / (1 - b + b * (field.title.length / average.title));
            const bodyTf = (bodyCounts.get(term) ?? 0) / (1 - b + b * (field.body.length / average.body));
            const weightedTf = 3 * titleTf + bodyTf;
            if (weightedTf > 0)
                score += idf * ((k1 + 1) * weightedTf) / (k1 + weightedTf);
        }
        return score;
    });
}
function minMax(values) {
    if (!values.length)
        return [];
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (max === min)
        return values.map((value) => (value > 0 ? 1 : 0));
    return values.map((value) => (value - min) / (max - min));
}
function phraseMention(text, phrase) {
    const normalizedText = text.toLowerCase().normalize("NFKC");
    const normalizedPhrase = phrase.toLowerCase().normalize("NFKC").trim();
    if (!normalizedPhrase)
        return false;
    if (normalizedText.includes(normalizedPhrase))
        return true;
    const terms = [...new Set(tokenize(normalizedPhrase))];
    if (!terms.length)
        return false;
    const present = new Set(tokenize(normalizedText));
    return terms.filter((term) => present.has(term)).length / terms.length >= 0.6;
}
function capabilityMention(text, capability, aliases) {
    return [capability, ...aliases].some((phrase) => phraseMention(text, phrase));
}
function tokenJaccard(a, b) {
    const left = new Set(tokenize(a));
    const right = new Set(tokenize(b));
    if (!left.size || !right.size)
        return 0;
    let intersection = 0;
    for (const token of left)
        if (right.has(token))
            intersection += 1;
    return intersection / (left.size + right.size - intersection);
}
function evidenceQuality(candidate) {
    let score = 0;
    if (candidate.url)
        score += 0.35;
    if (candidate.text.length >= 80)
        score += 0.3;
    if (candidate.identities.some((identity) => identity.confidence === "exact"))
        score += 0.2;
    if (candidate.sourceCategories.some((kind) => ["repo", "package", "mcp", "paper", "page"].includes(kind)))
        score += 0.15;
    return Math.min(1, score);
}
function selectDiverse(candidates, topK, capabilities) {
    const selected = [];
    const remaining = new Set(candidates.map((_, index) => index));
    const covered = new Set();
    while (selected.length < topK && remaining.size) {
        let best = -1;
        let bestObjective = Number.NEGATIVE_INFINITY;
        for (const index of remaining) {
            const candidate = candidates[index];
            const redundancy = selected.length
                ? Math.max(...selected.map((other) => tokenJaccard(candidate.text, other.text)))
                : 0;
            const newCoverage = capabilities.length
                ? candidate.matchedCapabilities.filter((capability) => !covered.has(capability)).length / capabilities.length
                : 0;
            const objective = 0.75 * candidate.final - 0.15 * redundancy + 0.1 * newCoverage;
            if (objective > bestObjective || (objective === bestObjective && candidate.id < (candidates[best]?.id ?? "~"))) {
                bestObjective = objective;
                best = index;
            }
        }
        const chosen = candidates[best];
        selected.push(chosen);
        for (const capability of chosen.matchedCapabilities)
            covered.add(capability);
        remaining.delete(best);
    }
    return selected;
}
export function rankCandidates(records, query, fingerprint = {}, topK = 5) {
    const drafts = mergeRecords(records);
    const capabilities = [...new Set((fingerprint.mustHaveCapabilities ?? []).map((value) => value.trim()).filter(Boolean))];
    const expandedQuery = [query, fingerprint.desiredOutcome, fingerprint.operatingMode, ...capabilities]
        .filter(Boolean)
        .join(" ");
    const lexicalScores = minMax(bm25f(drafts, expandedQuery));
    const rrfRaw = drafts.map((candidate) => {
        const seen = new Set();
        let score = 0;
        for (const observation of candidate.observations) {
            const provenance = observation.provenance;
            const listId = `${provenance.requestId}:${provenance.provider ?? "unknown"}`;
            if (seen.has(listId))
                continue;
            seen.add(listId);
            if (provenance.providerRank)
                score += 1 / (60 + provenance.providerRank);
        }
        return score;
    });
    const rrfScores = minMax(rrfRaw);
    drafts.forEach((candidate, index) => {
        candidate.matchedCapabilities = capabilities.filter((capability) => capabilityMention(candidate.text, capability, fingerprint.capabilityAliases?.[capability] ?? []));
        candidate.lexical = lexicalScores[index] ?? 0;
        candidate.rrf = rrfScores[index] ?? 0;
        candidate.evidence = evidenceQuality(candidate);
        candidate.final = 0.65 * candidate.lexical + 0.25 * candidate.rrf + 0.1 * candidate.evidence;
    });
    drafts.sort((a, b) => b.final - a.final || a.id.localeCompare(b.id));
    const selected = selectDiverse(drafts, Math.max(1, Math.min(20, topK)), capabilities);
    return {
        candidates: selected.map((candidate, index) => ({
            id: candidate.id,
            rank: index + 1,
            title: candidate.title,
            ...(candidate.url ? { url: candidate.url } : {}),
            ...(candidate.kind ? { kind: candidate.kind } : {}),
            identities: candidate.identities,
            sourceCategories: candidate.sourceCategories,
            matchedCapabilities: candidate.matchedCapabilities,
            evidenceRefs: [...new Set(candidate.observations.flatMap((record) => [record.url, record.provenance.rawRef].filter((value) => Boolean(value))))],
            features: {
                lexicalFit: Number(candidate.lexical.toFixed(4)),
                reciprocalRank: Number(candidate.rrf.toFixed(4)),
                evidenceQuality: Number(candidate.evidence.toFixed(4)),
                finalScore: Number(candidate.final.toFixed(4)),
            },
            explanations: [
                candidate.lexical > 0.6 ? "Strong lexical fit with the functional fingerprint." : "Limited lexical fit; verify manually.",
                candidate.observations.length > 1 ? `Merged ${candidate.observations.length} observations by stable identity.` : "Single-source observation.",
                candidate.matchedCapabilities.length ? `Mentions: ${candidate.matchedCapabilities.join(", ")}.` : "No must-have capability mention detected.",
            ],
            observationCount: candidate.observations.length,
        })),
        uniqueCandidates: drafts.length,
        duplicateObservationsMerged: records.filter((record) => record.status !== "unusable").length - drafts.length,
    };
}
//# sourceMappingURL=rank.js.map