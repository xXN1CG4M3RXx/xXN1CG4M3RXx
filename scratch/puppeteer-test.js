const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('Error') || msg.text().includes('Exception')) {
      console.log('BROWSER ERROR MSG:', msg.text());
    } else {
      console.log('BROWSER MSG:', msg.text());
    }
  });
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:5174/interests');
  await new Promise(r => setTimeout(r, 5000));
  
  await browser.close();
})();
