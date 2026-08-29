const fs = require('fs');
const path = process.argv[2];
const html = fs.readFileSync(path, 'utf8');
const m = html.match(/const encodedReport = "([A-Za-z0-9+/=]+)";/);
if (!m) { console.error('NO ENCODED PAYLOAD FOUND'); process.exit(1); }
const decoded = Buffer.from(m[1], 'base64').toString('utf8');
fs.writeFileSync(path + '.decoded.json', decoded);
console.log('decoded bytes: ' + decoded.length);
console.log(decoded.slice(0, 500));