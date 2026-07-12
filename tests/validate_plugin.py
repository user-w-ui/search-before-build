from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


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


def main() -> None:
    manifest = json.loads((ROOT / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8"))
    assert manifest["name"] == "should-i-build"

    assess_meta, assess = read_skill("assess")
    compare_meta, compare = read_skill("compare")
    research_meta, research = read_skill("research")

    assert assess_meta["disable-model-invocation"] == "true"
    assert compare_meta["disable-model-invocation"] == "true"
    assert "disable-model-invocation" not in research_meta
    assert {assess_meta["name"], compare_meta["name"], research_meta["name"]} == {
        "assess",
        "compare",
        "research",
    }

    assert "at most five questions" in assess.lower()
    assert "ask one question per turn" in assess.lower()
    assert "do not narrate the workflow or use headings" in assess.lower()
    assert "never create, edit, or delete files" in research.lower()
    assert "docs/should-i-build/<topic-slug>.md" in assess
    assert "docs/should-i-build/<topic-slug>.md" in compare
    assert "should-i-build:research" in assess
    assert "should-i-build:research" in compare

    for reference in (
        "conversation-and-decision.md",
        "research-method.md",
        "report-template.md",
    ):
        assert (ROOT / "references" / reference).is_file(), f"missing reference: {reference}"

    forbidden_jargon = ("用户画像", "核心价值主张", "市场细分信息", "商业闭环")
    conversation_rules = (ROOT / "references" / "conversation-and-decision.md").read_text(
        encoding="utf-8"
    )
    for phrase in forbidden_jargon:
        assert phrase not in assess
        assert phrase not in compare
        assert phrase in conversation_rules

    print("should-i-build plugin structure and behavior constraints: OK")


if __name__ == "__main__":
    main()
