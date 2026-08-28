const fs = require('fs');
let content = fs.readFileSync('n1code/main/tests/Interests.test.jsx', 'utf8');
content = content.replace('anime: { lists: [] },', `anime: { lists: [{ entries: [{ id: 1, status: 'CURRENT', progress: 5, media: { id: 1, title: { english: 'Test' }, episodes: 12, coverImage: { large: 'test.jpg' } } }] }] },`);
fs.writeFileSync('n1code/main/tests/Interests.test.jsx', content);
