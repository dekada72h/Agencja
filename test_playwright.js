
const { chromium } = require('playwright');

(async () => {
  console.log('Attempting to launch browser...');
  try {
    const browser = await chromium.launch();
    console.log('Browser launched successfully.');
    await browser.close();
    console.log('Browser closed successfully.');
  } catch (error) {
    console.error('An error occurred during browser launch:', error);
  }
})();
