const fs = require("fs");
const html = fs.readFileSync(
  "D:\\Learning\\BrainStorming\\should-i-build\\bench\\results\\case-05-rust-code-search-cli\\plugin\\artifacts\\brief.html",
  "utf8"
);
const m = html.match(/const encodedReport = "([^"]+)";/);
if (!m) {
  console.error("encodedReport not found");
  process.exit(1);
}
const decoded = Buffer.from(m[1], "base64").toString("utf8");
fs.writeFileSync(
  "D:\\Learning\\BrainStorming\\should-i-build\\bench\\results\\case-05-rust-code-search-cli\\plugin\\decoded-brief.json",
  decoded
);
console.log(decoded.slice(0, 2000));