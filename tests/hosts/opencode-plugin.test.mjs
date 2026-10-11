import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";

const ROOT = process.cwd();

async function register(specifier) {
  const { default: plugin } = await import(specifier);
  const added = [];
  await plugin.setup({
    skill: { transform: (callback) => callback({ add: (skill) => added.push(skill) }) },
  });
  return { plugin, added };
}

test("OpenCode entry registers every skill with a package prefix", async () => {
  // Import by package name so the exports field is exercised too.
  const { plugin, added } = await register("@superq/search-before-build");
  assert.equal(plugin.id, "search-before-build");

  const entries = await readdir(join(ROOT, "skills"), { withFileTypes: true });
  const skillDirs = entries.filter((entry) => entry.isDirectory());
  assert.equal(added.length, skillDirs.length);
  assert.equal(new Set(added.map((skill) => skill.id)).size, added.length);

  for (const skill of added) {
    assert.match(skill.id, /^search-before-build-[a-z0-9-]+$/);
    assert.equal(skill.name, skill.id);
    assert.ok(skill.description.length > 0);
    assert.ok(isAbsolute(skill.path) && existsSync(skill.path), skill.path);
    assert.ok(!skill.content.startsWith("---"), skill.id);
    // Package paths in a skill resolve from the directory of its SKILL.md.
    const references = resolve(dirname(skill.path), "../../references");
    assert.ok(existsSync(join(references, "research-method.md")), skill.id);
  }
});

test("OpenCode entry strips CRLF frontmatter", async () => {
  const directory = await mkdtemp(join(ROOT, "tests", ".tmp-opencode-"));
  try {
    await mkdir(join(directory, "skills", "demo"), { recursive: true });
    await copyFile(join(ROOT, "index.js"), join(directory, "index.js"));
    await writeFile(
      join(directory, "skills", "demo", "SKILL.md"),
      "---\r\nname: demo\r\ndescription: A demo skill\r\n---\r\n\r\n# Demo\r\n",
    );
    const { added } = await register(pathToFileURL(join(directory, "index.js")).href);
    assert.deepEqual(
      added.map(({ id, name, description, content }) => ({ id, name, description, content })),
      [{ id: "search-before-build-demo", name: "search-before-build-demo", description: "A demo skill", content: "# Demo" }],
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("npm package ships the plugin entry and everything skills reference", () => {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const output = execFileSync(npm, ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  const files = new Set(JSON.parse(output)[0].files.map((file) => file.path));
  for (const required of [
    "index.js",
    "plugin.json",
    "skills/assess/SKILL.md",
    "skills/quick-search/SKILL.md",
    "references/research-method.md",
    "dist/cli.js",
    "scripts/render-report.mjs",
    "scripts/setup-github-mcp.mjs",
    "assets/report-viewer.html",
  ]) {
    assert.ok(files.has(required), `missing from package: ${required}`);
  }
});
