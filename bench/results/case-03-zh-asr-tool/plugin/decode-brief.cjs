const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'artifacts', 'brief.html'), 'utf8');
const m = html.match(/const encodedReport = "([^"]+)"/);
if (!m) { console.error('NO_ENCODED_REPORT_FOUND'); process.exit(1); }
const decoded = JSON.parse(Buffer.from(m[1], 'base64').toString('utf8'));
fs.writeFileSync(path.join(__dirname, 'brief-decoded.json'), JSON.stringify(decoded, null, 2));
console.log('Decoded report sections:', Object.keys(decoded).join(', '));