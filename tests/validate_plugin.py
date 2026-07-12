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
    assert "--read-only" in setup_text
    assert '"--toolsets", "repos"' in setup_text
    assert "GITHUB_PERSONAL_ACCESS_TOKEN" not in setup_text
    assert "api.github.com/repos/github/github-mcp-server/releases" not in setup_text
    assert 'run(candidate, ["stdio", "--help"])' in setup_text

    github_rules = (ROOT / "references" / "github-retrieval.md").read_text(encoding="utf-8")
    assert "本次未使用 GitHub 专属深度检索工具" in github_rules
    assert "当前环境无法完成外部检索" in github_rules
    assert "api.github.com/search/repositories" in github_rules
    assert "Personal Access Token" in github_rules

    source_catalog = (ROOT / "references" / "search-sources.md").read_text(encoding="utf-8")
    for source in ("GitHub", "npm", "Ecosyste.ms", "Official MCP Registry", "Maven Central", "crates.io", "Hugging Face Hub", "arXiv"):
        assert f"## {source}" in source_catalog
    assert "Do not query every source by default" in source_catalog
    assert "Adding a user-provided source" in source_catalog

    report_template = (ROOT / "references" / "report-template.md").read_text(encoding="utf-8")
    assert "github-retrieval.md" in report_template
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
    for phrase in forbidden_jargon:
        assert phrase not in assess
        assert phrase not in compare
        assert phrase in conversation_rules

    print("search-before-build plugin structure and behavior constraints: OK")


if __name__ == "__main__":
    main()
