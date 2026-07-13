from __future__ import annotations

import json
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
    assert {"codex-plugin", "plugin", "claude code"} <= set(package["keywords"])
    assert (ROOT / "LICENSE").is_file()
    installer = (ROOT / "bin" / "install.mjs").read_text(encoding="utf-8")
    assert '"plugin", "marketplace", "add"' in installer
    assert '"plugin", "add"' in installer

    assess_meta, assess = read_skill("search-before-build-assess")
    compare_meta, compare = read_skill("search-before-build-compare")
    research_meta, research = read_skill("search-before-build-research")

    assert {assess_meta["name"], compare_meta["name"], research_meta["name"]} == {
        "search-before-build-assess",
        "search-before-build-compare",
        "search-before-build-research",
    }

    assert "at most five questions" in assess.lower()
    assert "ask one question per turn" in assess.lower()
    assert "do not narrate the workflow or use headings" in assess.lower()
    assert "three essential facts" in assess.lower()
    assert "five is a ceiling, not a target" in assess.lower()
    assert "never ask the user to repeat or confirm" in assess.lower()
    assert "continue from the best current understanding" in assess.lower()
    assert "continue with explicit unknowns" in assess.lower()
    assert "normal research is read-only" in research.lower()
    assert "only exception" in research.lower()
    assert "github-retrieval.md" in research
    assert "search-sources.md" in research
    assert "select only relevant sources" in research.lower()
    assert "explicit user approval" in research.lower()
    assert "docs/search-before-build/<topic-slug>/<competitor-slug>.md" in assess
    assert "docs/search-before-build/<topic-slug>/<competitor-slug>.md" in compare
    assert "bundled `search-before-build-research` skill" in assess
    assert "bundled `search-before-build-research` skill" in compare
    for skill in (assess, compare, research):
        assert "${CLAUDE_PLUGIN_ROOT}" not in skill
        assert "$ARGUMENTS" not in skill
        assert "search-before-build:research" not in skill

    for reference in (
        "conversation-and-decision.md",
        "research-method.md",
        "report-template.md",
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
    assert "follow the capability check, fallback order" in research
    assert "obtain explicit installation consent" in research
    assert "Stop only when all external routes are unavailable" in research
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
        assert detailed_github_term not in research
        assert detailed_github_term not in research_method
        assert detailed_github_term not in source_catalog

    support_labels = (
        "原生支持",
        "部分支持",
        "可通过扩展实现",
        "不支持",
        "尚未验证",
    )
    for label in support_labels:
        assert label in research_method
        assert label in research
        assert label in compare
    english_label_contract = "native, partial, extensible, unsupported, or unverified"
    assert english_label_contract not in research
    assert english_label_contract not in compare

    report_template = (ROOT / "references" / "report-template.md").read_text(encoding="utf-8")
    assert "github-retrieval.md" in report_template
    assert "authenticated `gh` CLI" in report_template
    assert "three coverage items required by `research-method.md`" in report_template
    required_headings = (
        "## 简介",
        "## 与 <当前项目名称> 的对比",
        "## 值得 <当前项目名称> 关注的设计",
        "## 可复用或参考的启发",
        "## 一句话总结",
        "## 资料来源",
    )
    positions = [report_template.index(heading) for heading in required_headings]
    assert positions == sorted(positions)
    for forbidden_section in (
        "## 你想解决什么",
        "## 这个需求真的需要开发吗",
        "## 如果仍然决定开发",
        "## 一句话结论",
    ):
        assert forbidden_section not in report_template

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
