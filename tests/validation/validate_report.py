from __future__ import annotations

import base64
from copy import deepcopy
import json
import re
import subprocess
import tempfile
from pathlib import Path

from .common import ROOT, read_skill, read_text


def _run_renderer(input_path: Path, output_path: Path, *extra_args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [
            "node",
            str(ROOT / "scripts" / "render-report.mjs"),
            "--input",
            str(input_path),
            "--output",
            str(output_path),
            *extra_args,
        ],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
    )


def _assert_renderer_rejects(
    payload: dict[str, object], directory: Path, case: str, expected_error: str
) -> None:
    input_path = directory / f"{case}.json"
    output_path = directory / f"{case}.html"
    input_path.write_text(json.dumps(payload), encoding="utf-8")
    result = _run_renderer(input_path, output_path)
    assert result.returncode != 0, case
    assert expected_error in result.stderr, result.stderr
    assert not output_path.exists(), case


def _css_rule(source: str, selector: str) -> str:
    match = re.search(rf"{re.escape(selector)}\s*\{{([^}}]+)\}}", source)
    assert match, f"missing CSS rule: {selector}"
    return match.group(1)


def _css_px(source: str, selector: str, property_name: str) -> float:
    rule = _css_rule(source, selector)
    match = re.search(rf"{re.escape(property_name)}:\s*([\d.]+)px", rule)
    assert match, f"missing {property_name} in CSS rule: {selector}"
    return float(match.group(1))


def validate() -> None:
    assess = read_skill("search-before-build-assess")[1]
    compare = read_skill("search-before-build-compare")[1]
    research_method = read_text("references/research-method.md")
    report_template = read_text("references/report-template.md")
    report_viewer = read_text("references/report-viewer.md")
    viewer_script = read_text("scripts/render-report.mjs")
    viewer_asset = read_text("assets/report-viewer.html")

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
    assert _css_px(viewer_asset, ".matrix thead th", "font-size") >= 12
    assert _css_px(viewer_asset, ".content-title", "font-size") >= 14
    assert _css_px(viewer_asset, ".comparison-table", "font-size") >= 14
    assert _css_px(viewer_asset, ".comparison-table th", "font-size") >= 12
    primary_hover = _css_rule(viewer_asset, ".button-primary:hover")
    assert "color: #eff8f3" in primary_hover

    fixture = ROOT / "tests" / "fixtures" / "report-sample.json"
    assert fixture.is_file()
    fixture_data = json.loads(fixture.read_text(encoding="utf-8"))
    assert fixture_data["schemaVersion"] == 1
    assert len(fixture_data["competitors"]) >= 2
    with tempfile.TemporaryDirectory() as directory:
        rendered = Path(directory) / "report.html"
        result = _run_renderer(fixture, rendered)
        assert result.returncode == 0, result.stderr
        rendered_text = rendered.read_text(encoding="utf-8")
        assert "__SEARCH_BEFORE_BUILD_REPORT_DATA__" not in rendered_text
        assert fixture_data["topic"] not in rendered_text, "payload must stay encoded"
        assert str(rendered) in result.stdout
        encoded = re.search(r'const encodedReport = "([A-Za-z0-9+/=]+)";', rendered_text)
        assert encoded
        decoded = json.loads(base64.b64decode(encoded.group(1)).decode("utf-8"))
        assert decoded == fixture_data

        duplicate_source_payload = deepcopy(fixture_data)
        duplicate_source_payload["competitors"][0]["url"] = (
            "https://example.com/product/"
        )
        duplicate_source_payload["competitors"][0]["sources"] = [
            {
                "label": "Official page duplicate",
                "url": "https://EXAMPLE.com/product?utm_source=report#overview",
            },
            {
                "label": "Supplementary documentation",
                "url": "https://example.com/product/docs",
            },
        ]
        duplicate_source_input = Path(directory) / "duplicate-source.json"
        duplicate_source_output = Path(directory) / "duplicate-source.html"
        duplicate_source_input.write_text(
            json.dumps(duplicate_source_payload), encoding="utf-8"
        )
        duplicate_source_result = _run_renderer(
            duplicate_source_input, duplicate_source_output
        )
        assert duplicate_source_result.returncode == 0, duplicate_source_result.stderr
        duplicate_source_html = duplicate_source_output.read_text(encoding="utf-8")
        duplicate_source_encoded = re.search(
            r'const encodedReport = "([A-Za-z0-9+/=]+)";', duplicate_source_html
        )
        assert duplicate_source_encoded
        filtered_payload = json.loads(
            base64.b64decode(duplicate_source_encoded.group(1)).decode("utf-8")
        )
        assert filtered_payload["competitors"][0]["sources"] == [
            {
                "label": "Supplementary documentation",
                "url": "https://example.com/product/docs",
            }
        ]

        unknown_candidate = deepcopy(fixture_data)
        unknown_candidate["capabilities"][0]["candidates"]["missing-candidate"] = {
            "status": "native",
            "note": "must be rejected",
        }
        _assert_renderer_rejects(
            unknown_candidate,
            Path(directory),
            "unknown-candidate",
            "references unknown competitor id: missing-candidate",
        )

        invalid_recommendation = deepcopy(fixture_data)
        invalid_recommendation["recommendation"]["value"] = "Maybe"
        _assert_renderer_rejects(
            invalid_recommendation,
            Path(directory),
            "invalid-recommendation",
            "recommendation.value must be Build, Adapt, Use existing, or Stop",
        )

        invalid_support = deepcopy(fixture_data)
        invalid_support["capabilities"][0]["current"]["status"] = "automatic"
        _assert_renderer_rejects(
            invalid_support,
            Path(directory),
            "invalid-support",
            "status must be one of: native, partial, extensible, unsupported, unverified",
        )

        invalid_coverage = deepcopy(fixture_data)
        invalid_coverage["coverage"][0]["status"] = "unknown"
        _assert_renderer_rejects(
            invalid_coverage,
            Path(directory),
            "invalid-coverage",
            "coverage[0].status must be used, limited, or unavailable",
        )

        duplicate_competitor = deepcopy(fixture_data)
        duplicate_competitor["competitors"][1]["id"] = duplicate_competitor["competitors"][0]["id"]
        _assert_renderer_rejects(
            duplicate_competitor,
            Path(directory),
            "duplicate-competitor",
            "competitors[1].id must be unique",
        )

        invalid_competitor_id = deepcopy(fixture_data)
        invalid_competitor_id["competitors"][0]["id"] = "Not Kebab Case"
        _assert_renderer_rejects(
            invalid_competitor_id,
            Path(directory),
            "invalid-competitor-id",
            "competitors[0].id must use lowercase kebab-case",
        )

        invalid_generated_at = deepcopy(fixture_data)
        invalid_generated_at["generatedAt"] = "July 18, 2026"
        _assert_renderer_rejects(
            invalid_generated_at,
            Path(directory),
            "invalid-generated-at",
            "generatedAt must be an ISO-8601 date-time",
        )

        unsupported_language = dict(fixture_data)
        unsupported_language["language"] = "fr-FR"
        unsupported_language["labels"] = {}
        invalid_input = Path(directory) / "invalid-language.json"
        invalid_input.write_text(json.dumps(unsupported_language), encoding="utf-8")
        invalid_result = _run_renderer(
            invalid_input, Path(directory) / "invalid.html"
        )
        assert invalid_result.returncode != 0
        assert "REQUIRED_CUSTOM_LABELS" in invalid_result.stderr

        consume_result = _run_renderer(
            fixture,
            Path(directory) / "consume-outside-temp.html",
            "--consume-input",
        )
        assert consume_result.returncode != 0
        assert "Refusing to consume input outside" in consume_result.stderr
        assert fixture.exists(), "rejected --consume-input must not delete the source"
        assert not (Path(directory) / "consume-outside-temp.html").exists()

        oversized_input = Path(directory) / "oversized.json"
        oversized_input.write_bytes(b" " * (5 * 1024 * 1024 + 1))
        oversized_output = Path(directory) / "oversized.html"
        oversized_result = _run_renderer(oversized_input, oversized_output)
        assert oversized_result.returncode != 0
        assert "Input exceeds 5242880 bytes" in oversized_result.stderr
        assert not oversized_output.exists()

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
    for forbidden_section in (
        "need-clarification section",
        "necessity-gate section",
        "verdict section",
        "MVP section",
    ):
        assert forbidden_section in report_template
