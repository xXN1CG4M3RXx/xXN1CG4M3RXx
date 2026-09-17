const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('n1code/main/package.json', 'utf8'));
pkg.scripts.build = "vite build && node scripts/inject-seo.js && node scripts/generate-sitemap.js";
fs.writeFileSync('n1code/main/package.json', JSON.stringify(pkg, null, 2));
