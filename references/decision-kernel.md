# Local decision kernel

Use the packaged decision kernel to make candidate handling repeatable without replacing the Agent's semantic judgment.

## Boundary

The kernel can:

- normalize JSON, Atom XML, DuckDuckGo-style HTML, Markdown, and plain text retrieval payloads;
- conservatively merge observations that share a stable identity;
- rank candidates with BM25F and reciprocal rank fusion;
- keep the final list diverse and expose must-have capability mentions;
- report failed requests, missing capability mentions, and a deterministic trace.

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
    "desiredOutcome": "the expected outcome",
    "operatingMode": "CLI, plugin, hosted, local, or another confirmed mode"
  },
  "retrievals": [
    {
      "requestId": "github-discovery-1",
      "providerHint": "github",
      "categoryHint": "repo",
      "outcome": "success",
      "payload": {}
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

When the tool exposes its raw JSON or text result, preserve that result as `payload`. When it does not, create the smallest directly observed object containing only fields such as `title`, `url`, and `snippet`. Do not invent missing dates, scores, identifiers, or capabilities.

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

Reuse fixed temporary paths such as `<temp>/search-before-build/kernel-input.json` and `kernel-output.json` so normal research does not accumulate project files.
