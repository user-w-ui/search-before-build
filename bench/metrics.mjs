// 双臂量化提取器 v2 —— 本文件是 bench/results/METRICS.md（指标规范）的参考实现。
// 计算全部 L0（全自动）与 L1（规则匹配、人工复核）指标；L2 标注项输出辅助信息（陷阱提及矩阵、
// 内核 top-1、CT 抽样）供人工判定，分数由标注员填入 SUMMARY.md。
//
// 运行：node bench/metrics.mjs [--json]
// 输出：每 case×臂指标表 + 两臂聚合 + 归一化分类分 + 陷阱提及矩阵 + 内核 top-1（markdown，可粘入 SUMMARY.md）

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const RESULTS = join(ROOT, "bench", "results");
const AS_JSON = process.argv.includes("--json");

// ── 目录字典：host 正则 → 目录标签（METRICS.md §3 CC）───────────────────────
const CATALOGS = [
  [/api\.github\.com$/, "GitHub API"],
  [/registry\.npmjs\.(org|com)$/, "npm"],
  [/registry\.modelcontextprotocol\.io$/, "MCP Registry"],
  [/crates\.io$/, "crates.io"],
  [/search\.maven\.org$|^repo1\.maven\.org$/, "Maven Central"],
  [/packages\.ecosyste\.ms$/, "Ecosyste.ms"],
  [/huggingface\.co$/, "HF Hub"],
  [/export\.arxiv\.org$/, "arXiv"],
  [/hn\.algolia\.com$/, "HN Algolia"],
  [/html\.duckduckgo\.com$|^lite\.duckduckgo\.com$/, "DDG fallback"],
];

// ── 陷阱注册表（METRICS.md §6）与双语 case 注册表（LC 仅这些 case 计入）─────
const TRAPS = {
  "case-04-read-later-organizer": ["Pocket", "Omnivore"],
};
const BILINGUAL = new Set(["case-03-zh-asr-tool", "case-04-read-later-organizer"]);

const SEARCH_URL_RE = /([?&](q|search|query)=|\/search\/|hn\.algolia\.com\/api\/v1\/search|duckduckgo\.com\/html)/;
const URL_RE = /https?:\/\/[^\s"'<>)\]]+/g;
const DATE_RE = /\d{4}-\d{2}-\d{2}/;
const MAINT_RE = /github\.com\/[^/"']+\/[^/"']+\/(releases|commits|activity|pulse)|api\.github\.com\/repos\//;
const CONFIRM_RE = /^(confirmed\b|确认|yes, continue|继续|please\b|no, thanks|不用了|stop\b|停止)/i;
const hasCJK = (t) => /[\u4e00-\u9fff]/.test(t) || /%E[4-9][0-9A-F]/i.test(t || "");
const mean = (a) => { const v = a.filter((x) => x !== null && x !== undefined); return v.length ? v.reduce((x, y) => x + y, 0) / v.length : 0; };

// ── URL 规范键（METRICS.md §4.3 FVR 身份匹配）──────────────────────────────
// 注意顺序：api.github.com 必须先于泛 github.com 分支，否则 /repos/owner/repo 会被取错段。
function canonicalKey(raw) {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname.replace(/\/+$/, "");
    let m;
    if (host === "api.github.com") {
      m = path.match(/^\/repos\/([^/]+)\/([^/]+)/);
      return m ? `gh:${m[1]}/${m[2]}` : `gh:${path}`;
    }
    if (/(^|\.)github\.com$/.test(host) || host === "raw.githubusercontent.com") {
      m = path.match(/^\/([^/]+)\/([^/]+)/);
      return m ? `gh:${m[1]}/${m[2]}` : `gh:${path}`;
    }
    if (/npmjs\.com$/.test(host) || host === "registry.npmjs.org") {
      m = path.replace(/^\/(package|org\/details)/, "").match(/^\/(@[^/]+\/[^/]+|[^/]+)/);
      return m ? `npm:${m[1]}` : `npm:${path}`;
    }
    if (host === "crates.io") {
      m = path.match(/^\/crates\/([^/]+)/);
      return m ? `crate:${m[1]}` : `crate:${path}`;
    }
    return `${host}:${path}`;
  } catch {
    return null;
  }
}

function hostOf(raw) {
  try { return new URL(raw).hostname.replace(/^www\./, ""); } catch { return ""; }
}

// f 是否"关于"候选 c（同规范键 / GitHub 同仓库 / 同 host）
function isAbout(fetchedUrl, candKey, candHost) {
  const fk = canonicalKey(fetchedUrl);
  if (!fk || !candKey) return false;
  if (fk === candKey) return true;
  if (fk.startsWith("gh:") && candKey.startsWith("gh:") && fk.slice(3) === candKey.slice(3)) return true;
  return hostOf(fetchedUrl) === candHost;
}

// ── 会话解析 ────────────────────────────────────────────────────────────────
function parseSession(path) {
  const out = {
    toolCalls: 0, byTool: {}, webSearch: 0, webFetch: 0, tasksAgents: 0,
    zhQ: 0, enQ: 0, queryCount: 0, fetchUrls: [], catalogHits: new Set(),
    dateEvidence: false, assistantTexts: [], mentions: new Set(), qaEvents: [],
  };
  const pendingResolvedOpenIds = new Set();
  if (!existsSync(path)) return out;
  const lines = readFileSync(path, "utf8").split("\n").filter((l) => l.trim());
  const results = new Map();
  const raw = [];
  for (const l of lines) {
    let j; try { j = JSON.parse(l); } catch { continue; }
    const msg = j.message;
    if (!msg) continue;
    const c = msg.content;
    if (msg.role === "user" && Array.isArray(c)) {
      for (const item of c) {
        if (item.type === "tool_result") {
          results.set(item.tool_use_id, {
            isError: !!item.is_error,
            content: typeof item.content === "string" ? item.content : JSON.stringify(item.content ?? ""),
          });
        } else if (item.type === "text") {
          raw.push({ role: "user", text: item.text });
        }
      }
    } else if (msg.role === "user" && typeof c === "string") {
      raw.push({ role: "user", text: c });
    } else if (msg.role === "assistant") {
      const texts = [];
      if (typeof c === "string") texts.push(c);
      else if (Array.isArray(c)) {
        for (const item of c) {
          if (item.type === "text") texts.push(item.text);
          else if (item.type === "tool_use") {
            out.toolCalls++; out.byTool[item.name] = (out.byTool[item.name] || 0) + 1;
            handleToolUse(item, out);
          }
        }
      }
      const text = texts.join("");
      if (text) { raw.push({ role: "assistant", text }); out.assistantTexts.push(text); }
    }
  }
  // Older normalized logs retained search refs in the tool input and wrote the
  // exact resolved URLs into the matching result summary. Recover those URLs
  // only for open calls that had no directly recorded resolution metadata.
  for (const id of pendingResolvedOpenIds) {
    const result = results.get(id);
    if (!result) continue;
    for (const u of result.content.match(URL_RE) || []) {
      out.fetchUrls.push(u.replace(/[.;,]+$/, ""));
      scanCatalog(u, out);
    }
  }
  out.fetchUrls = [...new Set(out.fetchUrls)];

  // CT（澄清问答对）：见 METRICS.md §4.2 ——
  //   ① 截止点：第一条"建议性长消息"（含建议性结论词，>400 字符）之前的才算澄清；
  //      不用 markdown 标题做截止条件（compare 的基线提取等正当消息也用标题）；
  //   ② 问句判定：?/？ 出现在文本后 70% 区间（容忍尾部括号补语/加粗符号）；
  //   ③ 配对：其后存在一条非确认类的用户文本。
  const VERDICT_RE = /(recommendation|建议|use existing|don'?t build|别造|别从零|不值得)/i;
  const cutoff = raw.findIndex((e) => e.role === "assistant" && e.text.length > 400 && VERDICT_RE.test(e.text));
  for (let i = 0; i < raw.length; i++) {
    const e = raw[i];
    if (e.role !== "assistant") continue;
    if (cutoff >= 0 && i >= cutoff) break;
    const qi = Math.max(e.text.lastIndexOf("?"), e.text.lastIndexOf("？"));
    if (qi < 0 || qi < e.text.length * 0.3) continue;
    const next = raw.slice(i + 1).find((x) => x.role === "user");
    if (next && !CONFIRM_RE.test(next.text.trim())) {
      out.qaEvents.push({ q: e.text.slice(-120), a: next.text.slice(0, 60) });
    }
  }
  // 日期证据 + 陷阱提及（提及 = 出现在助手文本或任意工具结果内容中）
  for (const r of results.values()) {
    if (!out.dateEvidence && DATE_RE.test(r.content)) out.dateEvidence = true;
    for (const trapList of Object.values(TRAPS)) {
      for (const t of trapList) if (r.content.toLowerCase().includes(t.toLowerCase())) out.mentions.add(t);
    }
  }
  const allText = out.assistantTexts.join(" ").toLowerCase();
  for (const trapList of Object.values(TRAPS)) {
    for (const t of trapList) if (allText.includes(t.toLowerCase())) out.mentions.add(t);
  }
  return out;

  function handleToolUse(item, o) {
    if (item.name === "WebSearch") {
      o.webSearch++; o.queryCount++;
      const q = item.input?.query || "";
      if (hasCJK(q)) o.zhQ++; else o.enQ++;
    }
    if (item.name === "WebFetch") {
      o.webFetch++;
      const u = item.input?.url;
      if (u) { o.fetchUrls.push(u); scanCatalog(u, o); }
    }
    // Direct Codex subagent runs batch search/open operations through web__run.
    // Preserve the existing per-call counters while counting every batched query
    // and every directly recorded URL for the coverage metrics.
    if (item.name === "web__run") {
      const searches = Array.isArray(item.input?.search_query) ? item.input.search_query : [];
      const opens = Array.isArray(item.input?.open) ? item.input.open : [];
      const resolvedUrls = Array.isArray(item.input?.resolved_urls) ? item.input.resolved_urls : [];
      // Direct routed forms (METRICS.md §1/§4.1 口径)：{query, route} = 一次搜索；
      // {url, route} = 一次定向抓取（与 curl 中出现的 URL 同等对待）。
      const routedQuery = typeof item.input?.query === "string" ? item.input.query : "";
      const routedUrl = typeof item.input?.url === "string" ? item.input.url : "";
      if (searches.length || routedQuery) o.webSearch++;
      if (opens.length || routedUrl) o.webFetch++;
      if (routedQuery) {
        o.queryCount++;
        if (hasCJK(routedQuery)) o.zhQ++; else o.enQ++;
      }
      if (routedUrl && /^https?:\/\//i.test(routedUrl)) {
        o.fetchUrls.push(routedUrl);
        scanCatalog(routedUrl, o);
      }
      for (const search of searches) {
        const q = search?.q || "";
        o.queryCount++;
        if (hasCJK(q)) o.zhQ++; else o.enQ++;
      }
      let directlyResolved = 0;
      for (const open of opens) {
        const u = open?.ref_id;
        if (typeof u === "string" && /^https?:\/\//i.test(u)) {
          o.fetchUrls.push(u);
          scanCatalog(u, o);
          directlyResolved++;
        }
      }
      // Normalized Codex evidence logs retain the original ref_id inputs and
      // separately record the URLs that those refs resolved to.
      for (const u of resolvedUrls) {
        if (typeof u === "string" && /^https?:\/\//i.test(u)) {
          o.fetchUrls.push(u);
          scanCatalog(u, o);
          directlyResolved++;
        }
      }
      if (opens.length && directlyResolved === 0 && item.id) pendingResolvedOpenIds.add(item.id);
    }
    if (item.name === "Task" || item.name === "Agent") o.tasksAgents++;
    if (item.name === "Bash" || item.name === "PowerShell" || item.name === "curl.exe" || item.name === "curl") {
      // curl 类工具的 URL 可能直接出现在 input.url（如 curl.exe {url}），
      // 也嵌在 command/script 字符串里；统一按"curl 命令中出现的 URL"口径处理（METRICS.md §1）。
      const cmd = [item.input?.command, item.input?.script, item.input?.url].filter(Boolean).join(" ");
      if (hasCJK(cmd)) o.zhQ++;
      for (const u of cmd.match(URL_RE) || []) {
        o.fetchUrls.push(u);
        scanCatalog(u, o);
        if (SEARCH_URL_RE.test(u)) o.queryCount++;
      }
    }
  }
  function scanCatalog(u, o) {
    const host = hostOf(u);
    for (const [re, label] of CATALOGS) if (re.test(host)) o.catalogHits.add(label);
  }
}

// ── 简报 payload 解码（B 臂候选与引用的结构化来源）────────────────────────
function decodeBrief(briefPath) {
  if (!existsSync(briefPath)) return null;
  const html = readFileSync(briefPath, "utf8");
  const anchor = 'const encodedReport = "';
  const s = html.indexOf(anchor);
  if (s < 0) return null;
  const e = html.indexOf('"', s + anchor.length);
  try { return JSON.parse(Buffer.from(html.slice(s + anchor.length, e), "base64").toString("utf8")); }
  catch { return null; }
}

function urlsFromMarkdown(path) {
  if (!existsSync(path)) return [];
  return [...new Set(readFileSync(path, "utf8").match(URL_RE) || [])];
}

// ── 单臂指标计算（公式见 METRICS.md §3–§5）─────────────────────────────────
// CC 口径：URL 命中的目录 ∪ 内核 providerHint 声明的目录（仅 B 臂有内核；经宿主
// WebSearch 执行的目录路由不产生 URL，只能靠内核声明捕捉）。
const KERNEL_PROVIDER_TO_CATALOG = {
  github: "GitHub API", npm: "npm", hackernews: "HN Algolia", "ecosyste.ms": "Ecosyste.ms",
  maven: "Maven Central", "mcp-registry": "MCP Registry", crates: "crates.io",
  hf: "HF Hub", huggingface: "HF Hub", arxiv: "arXiv", duckduckgo: "DDG fallback", ddg: "DDG fallback",
};

function kernelProviders(kernelInputPath) {
  if (!existsSync(kernelInputPath)) return [];
  try {
    const k = JSON.parse(readFileSync(kernelInputPath, "utf8"));
    return (k.retrievals || [])
      .map((r) => KERNEL_PROVIDER_TO_CATALOG[String(r.providerHint || "").toLowerCase()])
      .filter(Boolean);
  } catch { return []; }
}

function computeArm(caseId, arm, sess, candUrls, citedUrls, kernelTop1, extraCatalogs = []) {
  const fetched = sess.fetchUrls;
  const cands = candUrls.map((u) => ({ url: u, key: canonicalKey(u), host: hostOf(u) })).filter((c) => c.key);

  const verified = cands.filter((c) => fetched.some((f) => isAbout(f, c.key, c.host)));
  const fvr = cands.length ? verified.length / cands.length : null;

  const depthPer = cands.map((c) => Math.min(3, fetched.filter((f) => isAbout(f, c.key, c.host)).length));
  const vd = cands.length ? depthPer.reduce((a, b) => a + b, 0) / cands.length : 0;

  const mrHits = cands.filter((c) =>
    fetched.some((f) => isAbout(f, c.key, c.host) && MAINT_RE.test(f))).length;
  const mr = cands.length ? mrHits / cands.length : null;

  const lcRaw = (sess.zhQ > 0 ? 0.5 : 0) + (sess.enQ > 0 ? 0.5 : 0);
  const bilingual = BILINGUAL.has(caseId);
  const catalogSet = new Set([...sess.catalogHits, ...extraCatalogs]);

  // 归一化（上限为配置项，见 METRICS.md §5；LC 仅双语 case 计入，其余 N/A）
  const n = {
    CC: catalogSet.size / 10,
    QV: Math.min(sess.queryCount / 30, 1),
    FV: Math.min(fetched.length / 30, 1),
    CD: Math.min(citedUrls / 15, 1),
    LC: bilingual ? lcRaw : null,
    CT: Math.min(sess.qaEvents.length / 5, 1),
    VD: Math.min(vd / 3, 1),
    FVR: fvr ?? null,
    MR: mr ?? null,
    DE: sess.dateEvidence ? 1 : 0,
  };
  const autoScores = {
    breadthAuto: mean([n.CC, n.QV, n.FV, n.CD, n.LC]),
    depthAuto: mean([n.CT, n.VD]),        // EL 为 L2，未计入
    credAuto: mean([n.FVR]),               // TR、KA 为 L1/L2，未计入
    timeAuto: mean([n.MR, n.DE]),          // THR 为 L2，未计入
  };

  return {
    caseId, arm,
    raw: {
      toolCalls: sess.toolCalls, webSearch: sess.webSearch, webFetch: sess.webFetch,
      QV: sess.queryCount, FV: fetched.length, CC: catalogSet.size, catalogs: [...catalogSet].sort(),
      CD: citedUrls, LC: bilingual ? lcRaw : null, CT: sess.qaEvents.length,
      candidates: cands.length, FVR: fvr, VD: +vd.toFixed(2), MR: mr,
      DE: sess.dateEvidence ? 1 : 0, tasksAgents: sess.tasksAgents, zhQ: sess.zhQ, enQ: sess.enQ,
    },
    normalized: n,
    autoScores,
    qaSample: sess.qaEvents,
    trapMentions: [...sess.mentions],
    kernelTop1,
  };
}

function kernelTop1(kernelPath) {
  if (!existsSync(kernelPath)) return null;
  try {
    const k = JSON.parse(readFileSync(kernelPath, "utf8"));
    const c = k.candidates?.[0];
    return c ? `${c.title ?? c.id} (${c.url ?? "no url"})` : null;
  } catch { return null; }
}

// ── 主流程 ─────────────────────────────────────────────────────────────────
const cases = readdirSync(RESULTS).filter((d) => d.startsWith("case-")).sort();
const arms = [];
for (const caseId of cases) {
  const base = join(RESULTS, caseId, "baseline");
  const plug = join(RESULTS, caseId, "plugin");
  // A 臂：候选来自 candidates.md，引用来自最终聊天答复
  const sessA = parseSession(join(base, "session.jsonl"));
  const finalA = [...sessA.assistantTexts].reverse().find((t) => /recommendation|建议/i.test(t) && t.length > 400)
    ?? sessA.assistantTexts.filter((t) => t.length > 400).pop() ?? "";
  arms.push(computeArm(caseId, "baseline", sessA, urlsFromMarkdown(join(base, "candidates.md")),
    new Set(finalA.match(URL_RE) || []).size, null));
  // B 臂：候选/引用来自简报 payload，内核 top-1 供 KA 标注
  const brief = decodeBrief(join(plug, "artifacts", "brief.html"));
  const candB = brief ? (brief.competitors || []).map((c) => c.url).filter(Boolean)
    : urlsFromMarkdown(join(plug, "candidates.md"));
  const citedB = brief
    ? new Set([...(brief.competitors || []).map((c) => c.url).filter(Boolean),
        ...(brief.competitors || []).flatMap((c) => (c.sources || []).map((s) => s.url))]).size
    : urlsFromMarkdown(join(plug, "candidates.md")).length;
  arms.push(computeArm(caseId, "plugin", parseSession(join(plug, "artifacts", "session.jsonl")),
    candB, citedB, kernelTop1(join(plug, "artifacts", "kernel-output.json")),
    kernelProviders(join(plug, "artifacts", "kernel-input.json"))));
}

if (AS_JSON) {
  console.log(JSON.stringify(arms, null, 2));
  process.exit(0);
}

// ── Markdown 输出（粘入 SUMMARY.md）────────────────────────────────────────
const label = (id) => {
  const parts = id.split("-");
  return `${parts[1]} ${parts[2]}`;
};
console.log("### 自动提取指标（v2，口径见 METRICS.md）\n");
console.log("| Case | 臂 | QV | FV | CC | CD | LC | CT | 候选数 | FVR | VD | MR | DE | 工具调用 | Task/Agent |");
console.log("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
for (const a of arms) {
  const r = a.raw;
  const fmt = (x) => (x === null || x === undefined) ? "—" : (typeof x === "number" ? +x.toFixed(2) : x);
  console.log(`| ${label(a.caseId)} | ${a.arm} | ${r.QV} | ${r.FV} | ${r.CC} | ${r.CD} | ${fmt(r.LC)} | ${r.CT} | ${r.candidates} | ${fmt(r.FVR)} | ${fmt(r.VD)} | ${fmt(r.MR)} | ${r.DE} | ${r.toolCalls} | ${r.tasksAgents} |`);
}
console.log("\n### 归一化自动分类分（0–1，L2 项未计入，见 METRICS.md §5）\n");
console.log("| 臂 | Breadth(auto) | Depth(auto) | Cred(auto) | Time(auto) |");
console.log("| --- | --- | --- | --- | --- |");
for (const arm of ["baseline", "plugin"]) {
  const rows = arms.filter((a) => a.arm === arm);
  const m = (k) => +mean(rows.map((a) => a.autoScores[k])).toFixed(3);
  console.log(`| ${arm} | ${m("breadthAuto")} | ${m("depthAuto")} | ${m("credAuto")} | ${m("timeAuto")} |`);
}
console.log("\n### 陷阱提及矩阵（提及≠正确处理；THR 判定规则见 METRICS.md §4.4，需人工标注）\n");
console.log("| Case | 陷阱 | baseline 提及 | plugin 提及 |");
for (const [caseId, traps] of Object.entries(TRAPS)) {
  for (const t of traps) {
    const b = arms.find((a) => a.caseId === caseId && a.arm === "baseline")?.trapMentions.includes(t) ? "✓" : "—";
    const p = arms.find((a) => a.caseId === caseId && a.arm === "plugin")?.trapMentions.includes(t) ? "✓" : "—";
    console.log(`| ${caseId} | ${t} | ${b} | ${p} |`);
  }
}
console.log("\n### 内核 top-1（供 KA 标注：与最终建议主推是否一致/覆盖是否有理由）\n");
for (const a of arms.filter((x) => x.arm === "plugin")) {
  console.log(`- ${a.caseId}: ${a.kernelTop1 ?? "（无内核产物）"}`);
}
console.log("\n### CT 抽样（澄清问答对，供人工确认 CT 代理是否误计）\n");
for (const a of arms) {
  for (const qa of a.qaSample.slice(0, 2)) console.log(`- [${label(a.caseId)}/${a.arm}] Q:“…${qa.q.slice(-60)}” → A:“${qa.a}”`);
}
