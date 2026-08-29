const fs = require("fs");
const data = JSON.parse(
  fs.readFileSync(
    "D:\\Learning\\BrainStorming\\should-i-build\\bench\\results\\case-05-rust-code-search-cli\\plugin\\decoded-brief.json",
    "utf8"
  )
);
console.log("=== TOPIC ===");
console.log(data.topic);
console.log("=== RECOMMENDATION ===");
console.log(JSON.stringify(data.recommendation, null, 2));
console.log("=== FINGERPRINT ===");
console.log(JSON.stringify(data.fingerprint, null, 2));
console.log("=== COVERAGE ===");
console.log(JSON.stringify(data.coverage, null, 2));
console.log("=== COMPETITORS ===");
console.log(JSON.stringify(data.competitors, null, 2));
console.log("=== UNKNOWNS ===");
console.log(JSON.stringify(data.unknowns, null, 2));
console.log("=== OTHER KEYS ===");
console.log(Object.keys(data));