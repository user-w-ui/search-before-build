const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'artifacts', 'brief.html'), 'utf8');
const m = html.match(/const encodedReport = "([A-Za-z0-9+/=]+)";/);
if (!m) { console.error('NO_BASE64'); process.exit(1); }
const decoded = Buffer.from(m[1], 'base64').toString('utf8');
fs.writeFileSync(path.join(__dirname, 'artifacts', 'brief-decoded.json'), decoded);
console.log('decoded bytes:', decoded.length);
const data = JSON.parse(decoded);
console.log('top keys:', Object.keys(data).join(', '));
if (data.candidates) console.log('candidates:', data.candidates.length);