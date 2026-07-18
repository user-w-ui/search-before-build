from __future__ import annotations

import base64
import json
import re
import subprocess
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LEGACY_NAMES = ("should-" + "i-build", "Should " + "I Build")


def read_skill(name: str) -> tuple[dict[str, str], str]:
    path = ROOT / "skills" / name / "SKILL.md"
    text = path.read_text(encoding="utf-8")
    assert text.startswith("---\n"), f"{name}: missing YAML frontmatter"
    _, raw_frontmatter, body = text.split("---", 2)
    metadata: dict[str, str] = {}
    for line in raw_frontmatter.strip().splitlines():
        key, value = line.split(":", 1)
        metadata[key.strip()] = value.strip().strip('"')
    return metadata, body


def assert_legacy_name_removed() -> None:
    for path in ROOT.rglob("*"):
        if ".git" in path.parts or not path.is_file():
            continue
        relative = path.relative_to(ROOT).as_posix()
        assert not any(name in relative for name in LEGACY_NAMES), relative
        if path.suffix.lower() in {".md", ".json", ".mjs", ".py"}:
            text = path.read_text(encoding="utf-8")
            assert not any(name in text for name in LEGACY_NAMES), relative


def main() -> None:
    assert_legacy_name_removed()
    claude_manifest = json.loads(
        (ROOT / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8")
    )
    codex_manifest = json.loads(
        (ROOT / ".codex-plugin" / "plugin.json").read_text(encoding="utf-8")
    )
    assert claude_manifest["name"] == "search-before-build"
    assert codex_manifest["name"] == "search-before-build"
    assert codex_manifest["skills"] == "./skills/"
    assert codex_manifest["interface"]["displayName"] == "Search Before Build"

    claude_marketplace = json.loads(
        (ROOT / ".claude-plugin" / "marketplace.json").read_text(encoding="utf-8")
    )
    assert claude_marketplace["name"] == "search-before-build"
    assert claude_marketplace.get("description")
    assert any(
        plugin["name"] == "search-before-build" and plugin["source"] == "./"
        for plugin in claude_marketplace["plugins"]
    ), "Claude marketplace must expose search-before-build from the repo root"

    marketplace = json.loads(
        (ROOT / ".agents" / "plugins" / "marketplace.json").read_text(encoding="utf-8")
    )
    assert marketplace["name"] == "search-before-build"
    assert marketplace["plugins"] == [
        {
            "name": "search-before-build",
            "source": {"source": "local", "path": "."},
            "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
            "category": "Productivity",
        }
    ]

    package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    assert package["name"] == "@superq/search-before-build"
    assert package["license"] == "MIT"
    assert package["bin"] == {"search-before-build": "bin/install.mjs"}
    assert package["version"] == claude_manifest["version"] == codex_manifest["version"]
    assert package["scripts"]["prepublishOnly"] == "node scripts/verify-release.mjs"
    assert {"codex-plugin", "plugin", "claude code"} <= set(package["keywords"])
    assert (ROOT / "LICENSE").is_file()
    installer = (ROOT / "bin" / "install.mjs").read_text(encoding="utf-8")
    assert '"plugin", "marketplace", "add"' in installer
    assert '"plugin", "marketplace", "remove"' in installer
    assert '"plugin", "add"' in installer
    assert 'const RELEASE_REF = `v${PACKAGE.version}`' in installer
    assert '"--ref", "main"' not in installer
    assert '"--ref", RELEASE_REF' in installer

    release_verifier = (ROOT / "scripts" / "verify-release.mjs").read_text(encoding="utf-8")
    assert 'git(["status", "--porcelain"])' in release_verifier
    assert 'git(["rev-parse", "HEAD"])' in release_verifier
    assert 'git(["rev-parse", `${expectedTag}^{commit}`])' in release_verifier
    assert "packageVersion !== claudeVersion" in release_verifier
    assert "packageVersion !== codexVersion" in release_verifier

    assess_meta, assess = read_skill("search-before-build-assess")
    compare_meta, compare = read_skill("search-before-build-compare")
    research_method = (ROOT / "references" / "research-method.md").read_text(encoding="utf-8")

    assert {assess_meta["name"], compare_meta["name"]} == {
        "search-before-build-assess",
        "search-before-build-compare",
    }
    assert not (ROOT / "skills" / "search-before-build-research").exists()

    assert "at most five questions" in assess.lower()
    assert "ask one question per turn" in assess.lower()
    assert "do not narrate the workflow or use headings" in assess.lower()
    assert "three essential facts" in assess.lower()
    assert "five is a ceiling, not a target" in assess.lower()
    assert "never ask the user to repeat or confirm" in assess.lower()
    assert "continue from the best current understanding" in assess.lower()
    assert "continue with explicit unknowns" in assess.lower()
    assert "normal research is read-only" in research_method.lower()
    assert "only exception" in research_method.lower()
    assert "github-retrieval.md" in research_method
    assert "search-sources.md" in research_method
    assert "select only sources relevant" in research_method.lower()
    assert "explicit user approval" in research_method.lower()
    assert "docs/search-before-build/<topic-slug>/<competitor-slug>.md" in assess
    assert "docs/search-before-build/<topic-slug>/<competitor-slug>.md" in compare
    assert "read and execute all of `references/research-method.md`" in assess.lower()
    assert "read and execute all of `references/research-method.md`" in compare.lower()
    assert "sole final decision-maker" in assess.lower()
    assert "sole final decision-maker" in compare.lower()
    assert "recommendation meanings" in assess.lower()
    assert "recommendation meanings" in compare.lower()
    assert "key comparison" in compare.lower()
    assert "do not relabel capabilities independently" in compare.lower()
    for skill in (assess, compare):
        assert "github deep-search enhancement intent" in skill.lower()
        assert "references/github-retrieval.md" in skill
        assert "report the capability or setup result and stop" in skill.lower()
    assert "standalone request to enable, configure, or improve github deep search" in assess_meta["description"].lower()
    assert "github deep-search enhancement request includes" in compare_meta["description"].lower()
    assert "Do not put a Build, Adapt, Use existing, or Stop verdict" in research_method
    verdict_contract = "`Build`, `Adapt`, `Use existing`, or `Stop`"
    assert verdict_contract in assess
    assert verdict_contract in compare
    assert verdict_contract not in research_method
    for skill in (assess, compare):
        assert "${CLAUDE_PLUGIN_ROOT}" not in skill
        assert "$ARGUMENTS" not in skill
        assert "search-before-build:research" not in skill

    for reference in (
        "conversation-and-decision.md",
        "research-method.md",
        "report-template.md",
        "report-viewer.md",
        "github-retrieval.md",
        "search-sources.md",
    ):
        assert (ROOT / "references" / reference).is_file(), f"missing reference: {reference}"

    setup_script = ROOT / "scripts" / "setup-github-mcp.mjs"
    assert setup_script.is_file()
    setup_text = setup_script.read_text(encoding="utf-8")
    assert f'clientInfo: {{ name: "search-before-build-setup", version: "{package["version"]}" }}' in setup_text
    assert "--read-only" in setup_text
    assert '"--toolsets", "repos"' in setup_text
    assert "GITHUB_PERSONAL_ACCESS_TOKEN" not in setup_text
    assert "api.github.com/repos/github/github-mcp-server/releases" not in setup_text
    assert 'run(candidate, ["stdio", "--help"])' in setup_text

    research_method = (ROOT / "references" / "research-method.md").read_text(
        encoding="utf-8"
    )
    github_rules = (ROOT / "references" / "github-retrieval.md").read_text(encoding="utf-8")
    assert "本次未使用 GitHub 专属深度检索工具" in github_rules
    assert "当前环境无法完成外部检索" in research_method
    assert "当前环境无法完成外部检索" not in github_rules
    assert "api.github.com/search/repositories" in github_rules
    assert "Personal Access Token" in github_rules
    exposed_position = github_rules.index("tools already exposed")
    gh_position = github_rules.index("gh --version")
    offer_position = github_rules.index("offer the optional official MCP setup")
    assert exposed_position < gh_position < offer_position
    assert "gh auth status" in github_rules
    assert "Do not scan plugin directories" not in github_rules
    assert "relevant read-only call succeeds" in github_rules
    assert "Try the exposed route" in github_rules
    assert "If the calls fail" in github_rules
    assert "run a relevant read-only query" in github_rules
    assert "If any required check or query fails" in github_rules
    assert "enhancement intent, not installation consent" in github_rules
    assert "wait for explicit approval" in github_rules
    for exposed_route in (
        "a GitHub plugin or app",
        "a GitHub MCP server",
        "a GitHub connector or other built-in GitHub integration",
    ):
        assert exposed_route in github_rules
    for example_operation in (
        "search_repositories",
        "search_installed_repositories",
        "fetch_file",
        "get_file_contents",
        "get_repository",
        "search_code",
        "code_search",
    ):
        assert example_operation in github_rules
    assert "examples, not an exhaustive allowlist" in github_rules
    assert "do not treat an unfamiliar tool name as absence" in github_rules
    assert "capability checks, fallback order, optional setup" in research_method
    assert "explicit user approval" in research_method
    assert "Stop only when every external route is unavailable" in research_method
    assert "Generic Web search is not a prerequisite" in research_method
    assert "If generic Web search is unavailable" in research_method
    assert "name the specialized routes used" in research_method
    assert "explain the resulting coverage limits" in research_method
    assert "Stop only when every external route is unavailable" in research_method

    source_catalog = (ROOT / "references" / "search-sources.md").read_text(encoding="utf-8")
    for source in ("GitHub", "npm", "Ecosyste.ms", "Official MCP Registry", "Maven Central", "crates.io", "Hugging Face Hub", "arXiv"):
        assert f"## {source}" in source_catalog
    assert "Do not query every source by default" in source_catalog
    assert "Adding a user-provided source" in source_catalog
    assert "Follow [github-retrieval.md]" in source_catalog
    for canonical_detail, duplicated_detail in (
        ("api.github.com/search/repositories", "api.github.com/search/repositories"),
        ("api.github.com/repos/", "api.github.com/repos/"),
        ("code-search REST endpoint requires authentication", "Anonymous GitHub code search"),
        ("On `403` caused by rate limiting", "rate-limit `403`"),
    ):
        assert canonical_detail in github_rules
        assert duplicated_detail not in source_catalog
    for detailed_github_term in (
        "search_repositories",
        "search_installed_repositories",
        "get_file_contents",
        "gh --version",
    ):
        assert detailed_github_term in github_rules
        assert detailed_github_term not in assess
        assert detailed_github_term not in compare
        assert detailed_github_term not in research_method
        assert detailed_github_term not in source_catalog

    support_enums = ("native", "partial", "extensible", "unsupported", "unverified")
    for value in support_enums:
        assert f"`{value}`" in research_method
        assert f"`{value}`" not in assess
        assert f"`{value}`" not in compare
    assert "without translating them" in research_method
    assert "Do not translate them there" in research_method

    report_template = (ROOT / "references" / "report-template.md").read_text(encoding="utf-8")
    report_viewer = (ROOT / "references" / "report-viewer.md").read_text(encoding="utf-8")
    viewer_script = (ROOT / "scripts" / "render-report.mjs").read_text(encoding="utf-8")
    viewer_asset = (ROOT / "assets" / "report-viewer.html").read_text(encoding="utf-8")
    for skill in (assess, compare):
        assert "references/report-viewer.md" in skill
        assert "shared temporary html viewer" in skill.lower()
        assert "unless the user explicitly asks to persist selected competitors" in skill.lower()
        assert "all report paths" not in skill.lower()
    assert "do not write competitor reports into the current project by default" in report_template.lower()
    assert "user-initiated download or copy action" in report_template.lower()
    assert "optional persistence" in research_method.lower()
    assert "do not save competitor reports or render the viewer" in research_method.lower()
    assert "<temp>/search-before-build/latest.html" in report_viewer
    assert "do not fall back to creating reports in the project" in report_viewer.lower()
    assert "the viewer supplements the answer" in report_viewer.lower()
    assert "node <package-root>/scripts/render-report.mjs" in report_viewer
    assert "schemaVersion" in report_viewer
    assert "REQUIRED_CUSTOM_LABELS" in report_viewer
    assert "tmpdir()" in viewer_script
    assert '"latest.html"' in viewer_script
    assert "writeAtomically" in viewer_script
    assert "--consume-input" in viewer_script
    assert "REQUIRED_CUSTOM_LABELS" in viewer_script
    assert viewer_asset.count("__SEARCH_BEFORE_BUILD_REPORT_DATA__") == 1
    assert "https://cdn" not in viewer_asset
    assert 'src="http' not in viewer_asset
    assert "showSaveFilePicker" in viewer_asset
    assert "new Blob" in viewer_asset
    assert "Copy Markdown" in viewer_asset
    assert "Save Markdown" in viewer_asset
    assert "prefers-reduced-motion" in viewer_asset
    assert "@media (max-width: 680px)" in viewer_asset
    assert "@media print" in viewer_asset

    fixture = ROOT / "tests" / "fixtures" / "report-sample.json"
    assert fixture.is_file()
    fixture_data = json.loads(fixture.read_text(encoding="utf-8"))
    assert fixture_data["schemaVersion"] == 1
    assert len(fixture_data["competitors"]) >= 2
    with tempfile.TemporaryDirectory() as directory:
        rendered = Path(directory) / "report.html"
        result = subprocess.run(
            [
                "node",
                str(ROOT / "scripts" / "render-report.mjs"),
                "--input",
                str(fixture),
                "--output",
                str(rendered),
            ],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stderr
        rendered_text = rendered.read_text(encoding="utf-8")
        assert "__SEARCH_BEFORE_BUILD_REPORT_DATA__" not in rendered_text
        assert fixture_data["topic"] not in rendered_text, "payload must stay encoded"
        assert str(rendered) in result.stdout
        encoded = re.search(r'const encodedReport = "([A-Za-z0-9+/=]+)";', rendered_text)
        assert encoded
        decoded = json.loads(base64.b64decode(encoded.group(1)).decode("utf-8"))
        assert decoded == fixture_data

        unsupported_language = dict(fixture_data)
        unsupported_language["language"] = "fr-FR"
        unsupported_language["labels"] = {}
        invalid_input = Path(directory) / "invalid-language.json"
        invalid_input.write_text(json.dumps(unsupported_language), encoding="utf-8")
        invalid_result = subprocess.run(
            [
                "node",
                str(ROOT / "scripts" / "render-report.mjs"),
                "--input",
                str(invalid_input),
                "--output",
                str(Path(directory) / "invalid.html"),
            ],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )
        assert invalid_result.returncode != 0
        assert "REQUIRED_CUSTOM_LABELS" in invalid_result.stderr
    assert "github-retrieval.md" in report_template
    assert "authenticated `gh` CLI" in report_template
    assert "three coverage items required by `research-method.md`" in report_template
    localized_support_labels = (
        ("native", "原生支持", "Native support"),
        ("partial", "部分支持", "Partial support"),
        ("extensible", "可通过扩展实现", "Achievable through extension"),
        ("unsupported", "不支持", "Unsupported"),
        ("unverified", "尚未验证", "Unverified"),
    )
    for value, chinese, english in localized_support_labels:
        assert f"| `{value}` | {chinese} | {english} |" in report_template
    assert "language explicitly requested by the user" in report_template
    assert "language of the user's current request" in report_template
    assert "fall back to the English support labels" in report_template
    assert "Never switch because a source" in report_template
    semantic_sections = (
        "`overview`",
        "`comparison`",
        "`notable_designs`",
        "`reusable_lessons`",
        "`summary`",
        "`sources`",
    )
    positions = [report_template.index(section) for section in semantic_sections]
    assert positions == sorted(positions)
    assert "Do not print the semantic identifiers themselves" in report_template
    assert "Do not translate enum meanings ad hoc" in report_template
    for forbidden_section in ("need-clarification section", "necessity-gate section", "verdict section", "MVP section"):
        assert forbidden_section in report_template

    forbidden_jargon = ("用户画像", "核心价值主张", "市场细分信息", "商业闭环")
    conversation_rules = (ROOT / "references" / "conversation-and-decision.md").read_text(
        encoding="utf-8"
    )
    essential_items = (
        "Problem and need",
        "Core product or project",
        "Delivery form",
    )
    essential_positions = [conversation_rules.index(item) for item in essential_items]
    assert essential_positions == sorted(essential_positions)
    assert "A clear, unambiguous inference is sufficient" in conversation_rules
    assert "ask about it only when multiple plausible forms" in conversation_rules
    assert "If five questions have been exhausted" in conversation_rules
    assert "continue from the best current understanding" in conversation_rules
    assert "mark the unresolved item as unknown" in conversation_rules
    assert "broaden the search where needed" in conversation_rules
    assert "lower confidence in conclusions affected by the gap" in conversation_rules
    assert "use the remaining question budget sparingly" in conversation_rules
    assert "Five is not a quota" in conversation_rules
    assert "widely known, functionally similar examples" in conversation_rules
    assert "without live research" in conversation_rules
    assert "illustrative prompts, not verified competitors" in conversation_rules
    assert "never ask a secondary question merely because question budget remains" in conversation_rules
    assert "continue the assessment and research with explicit unknowns" in conversation_rules
    for phrase in forbidden_jargon:
        assert phrase not in assess
        assert phrase not in compare
        assert phrase in conversation_rules

    print("search-before-build plugin structure and behavior constraints: OK")


if __name__ == "__main__":
    main()
