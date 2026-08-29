from __future__ import annotations

from .common import ROOT, read_json, read_text


def validate() -> None:
    claude_manifest = read_json(".claude-plugin/plugin.json")
    codex_manifest = read_json(".codex-plugin/plugin.json")
    assert claude_manifest["name"] == "search-before-build"
    assert codex_manifest["name"] == "search-before-build"
    assert codex_manifest["skills"] == "./skills/"
    assert codex_manifest["interface"]["displayName"] == "Search Before Build"

    claude_marketplace = read_json(".claude-plugin/marketplace.json")
    assert claude_marketplace["name"] == "search-before-build"
    assert claude_marketplace.get("description")
    assert any(
        plugin["name"] == "search-before-build" and plugin["source"] == "./"
        for plugin in claude_marketplace["plugins"]
    ), "Claude marketplace must expose search-before-build from the repo root"

    marketplace = read_json(".agents/plugins/marketplace.json")
    assert marketplace["name"] == "search-before-build"
    assert marketplace["plugins"] == [
        {
            "name": "search-before-build",
            "source": {"source": "local", "path": "."},
            "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
            "category": "Productivity",
        }
    ]

    package = read_json("package.json")
    assert package["name"] == "@superq/search-before-build"
    assert package["license"] == "MIT"
    assert package["bin"] == {"search-before-build": "bin/install.mjs"}
    assert package["version"] == claude_manifest["version"] == codex_manifest["version"]
    assert package["scripts"]["prepublishOnly"] == "node scripts/verify-release.mjs"
    assert package["scripts"]["build"] == "tsc -p tsconfig.json"
    assert package["scripts"]["benchmark:offline"] == "npm run build && node bench/run-offline.mjs"
    assert package.get("dependencies", {}) == {}, "The decision kernel must keep zero runtime dependencies"
    assert set(package["devDependencies"]) == {"@types/node", "typescript"}
    assert {"codex-plugin", "plugin", "claude code"} <= set(package["keywords"])
    assert (ROOT / "LICENSE").is_file()

    for path in (
        "src/cli.ts",
        "src/normalize.ts",
        "src/pipeline.ts",
        "src/rank.ts",
        "src/types.ts",
        "schemas/retrieval-envelope.schema.json",
        "schemas/pipeline-input.schema.json",
        "schemas/normalization-result.schema.json",
        "schemas/decision-support.schema.json",
        "references/decision-kernel.md",
    ):
        assert (ROOT / path).is_file(), f"Missing decision-kernel resource: {path}"

    installer = read_text("bin/install.mjs")
    assert '"plugin", "marketplace", "add"' in installer
    assert '"plugin", "marketplace", "remove"' in installer
    assert '"plugin", "add"' in installer
    assert 'const RELEASE_REF = `v${PACKAGE.version}`' in installer
    assert '"--ref", "main"' not in installer
    assert '"--ref", RELEASE_REF' in installer

    release_verifier = read_text("scripts/verify-release.mjs")
    assert 'git(["status", "--porcelain"])' in release_verifier
    assert 'git(["rev-parse", "HEAD"])' in release_verifier
    assert 'git(["rev-parse", `${expectedTag}^{commit}`])' in release_verifier
    assert "packageVersion !== claudeVersion" in release_verifier
    assert "packageVersion !== codexVersion" in release_verifier
