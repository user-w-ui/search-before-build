// OpenCode v2 plugin entry: registers every skill under skills/ with a
// package prefix, so the shared references resolve from each SKILL.md.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const PREFIX = "search-before-build";
const packageRoot = fileURLToPath(new URL(".", import.meta.url));

function parseSkill(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") throw new Error("SKILL.md is missing YAML frontmatter");
  const end = lines.indexOf("---", 1);
  if (end === -1) throw new Error("SKILL.md frontmatter is not closed");
  const metadata = {};
  for (const line of lines.slice(1, end)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    metadata[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return { metadata, body: lines.slice(end + 1).join("\n").trim() };
}

function loadSkills() {
  const skillsDir = join(packageRoot, "skills");
  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(skillsDir, entry.name, "SKILL.md"))
    .filter((path) => existsSync(path))
    .map((path) => {
      const { metadata, body } = parseSkill(readFileSync(path, "utf8"));
      const id = `${PREFIX}-${metadata.name}`;
      return { id, name: id, description: metadata.description, path, content: body };
    });
}

export default {
  id: PREFIX,
  async setup(ctx) {
    const skills = loadSkills();
    await ctx.skill.transform((editor) => {
      for (const skill of skills) editor.add(skill);
    });
  },
};
