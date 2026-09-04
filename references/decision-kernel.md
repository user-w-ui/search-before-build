# Local decision kernel

Use the packaged decision kernel to make candidate handling repeatable without replacing the Agent's semantic judgment.

## Boundary

The kernel can:

- normalize JSON, Atom XML, DuckDuckGo-style HTML, Markdown, and plain text retrieval payloads;
- conservatively merge observations that share a stable identity;
- rank candidates with BM25F, reciprocal rank fusion, and activity-recency scoring;
- keep the final list diverse and expose must-have capability mentions;
- report failed requests, missing capability mentions, flattened-payload warnings, and a deterministic trace.

The kernel cannot prove that a capability is supported. `candidate_mention` means only that the candidate text matched the capability lexically. Verify important capabilities against primary sources and assign the stable support enums yourself.

## Availability

Use the kernel when Node.js 18 or later and `<package-root>/dist/cli.js` are available. Do not install dependencies during a research request.

If the kernel is unavailable or exits non-zero, continue with the existing research workflow. Add one coverage limitation saying that deterministic candidate fusion was unavailable; do not block the assessment or comparison.

## Input

Write one temporary JSON file under the operating-system temporary directory. Do not place it in the user's project.

```json
{
  "schemaVersion": 1,
  "query": "the confirmed research question",
  "fingerprint": {
    "mustHaveCapabilities": ["one concrete capability"],
    "capabilityAliases": {
      "one concrete capability": ["short evidence phrase", "另一种直接说法"]
    },
    "desiredOutcome": "the expected outcome",
    "operatingMode": "CLI, plugin, hosted, local, or another confirmed mode"
  },
  "retrievals": [
    {
      "requestId": "github-discovery-1",
      "providerHint": "github",
      "categoryHint": "repo",
      "outcome": "success",
      "payload": {
        "items": [
          {
            "full_name": "owner/repo",
            "description": "observed description",
            "html_url": "https://github.com/owner/repo",
            "stargazers_count": 123,
            "pushed_at": "2026-08-01T00:00:00Z"
          }
        ]
      }
    },
    {
      "requestId": "web-discovery-1",
      "providerHint": "host-web",
      "categoryHint": "web",
      "outcome": "error",
      "error": { "kind": "timeout", "message": "tool timed out" }
    }
  ],
  "topK": 5
}
```

Pass the provider's raw response **verbatim** as `payload`: the full JSON body, the raw item array, or the raw HTML/text exactly as received. Never re-type, rename, summarize, or flatten provider fields into a uniform `title`/`url`/`snippet` shape. Specialized sources carry structured fields that downstream identity merging and recency ranking depend on — for example GitHub `full_name`/`pushed_at`/`stargazers_count`, registry `server.name`/`repository.url`/`transports`, npm `name`/`links`/`date`, crates.io `crate`/`max_stable_version`, Maven `id`/`latestVersion`, Hugging Face `modelId`/`downloads`, arXiv `published`/`summary`. A flattened payload silently disables cross-source merging and freshness signals, and the kernel will flag it with a `flattened_payload` warning.

Only when a tool genuinely cannot expose its raw output — for example a host search tool that returns its own summarized shape — pass that tool-native shape through unchanged, and do not invent missing dates, scores, identifiers, or capabilities. When a payload must be trimmed for length, drop whole items from the end; never rewrite the fields of the items you keep.

For each must-have capability, add a small `capabilityAliases` list containing only short phrases that express the same requirement and are likely to appear in evidence. Include Chinese and English forms when the search is bilingual. Aliases improve deterministic lexical matching; they are not evidence that a candidate supports the capability.

Use a distinct `requestId` for each tool call. Set `providerHint` and `categoryHint` from the route that was actually used, not from guesses about the result.

## Run

```bash
node <package-root>/dist/cli.js run --input <temp-input.json> --output <temp-output.json>
```

Run it after the discovery pools contain representative candidates. Rerun after primary-source verification only when those results materially change the candidate evidence.

If `evidence.needsFollowUp` is true and a missing must-have capability could change the final recommendation, execute at most one targeted follow-up round using `evidence.suggestedQueries`. Append the new retrieval envelopes and rerun. Do not loop again.

## Consume the artifact

- Use `candidates[].rank` to decide which candidates deserve deep verification first.
- Use `identities` and `observationCount` to avoid counting the same project or page twice.
- Use `coverage` and `evidence.missingCapabilities` to identify gaps, never as proof of absence.
- Use `retrieval.failedRequests` and warnings in the source coverage limitations.
- Preserve `evidenceRefs` when building the final evidence package.
- Keep the final Build / Adapt / Use existing / Stop recommendation in the calling Skill.

The existing report schema remains authoritative. Translate verified candidate evidence into `report-template.md`; do not send the kernel artifact directly to the report viewer.

Use a fresh run directory under the operating-system temporary directory for every research request: `<temp>/search-before-build/runs/<run-id>/`, where `<run-id>` combines a UTC timestamp and a short random suffix (the minting pattern is described in `report-viewer.md`). Keep `kernel-input.json`, `kernel-output.json`, and any raw payload scratch files inside that run directory. Never reuse a fixed filename across research requests: concurrent sessions share the temp directory and would overwrite each other's files. This keeps normal research from accumulating project files while staying safe under concurrency.
