
const { chromium } = require('playwright');

(async () => {
  console.log('Starting screenshot script...');
  try {
    const browser = await chromium.launch();
    console.log('Browser launched.');
    const page = await browser.newPage();
    console.log('New page created.');
    await page.goto('http://localhost:8000/Glamour-Beauty/index.html');
    console.log('Navigated to page.');
    await page.screenshot({ path: 'glamour_beauty_screenshot.png' });
    console.log('Screenshot taken.');
    await browser.close();
    console.log('Browser closed.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
