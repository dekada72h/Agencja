const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext();

  // Intercept and block external requests to avoid timeouts (CSP/external fonts/images issue)
  await context.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
      route.continue();
    } else {
      route.abort();
    }
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:8000...');
  // Use domcontentloaded to avoid waiting for external resources
  await page.goto('http://localhost:8000', { waitUntil: 'domcontentloaded' });

  // Wait a bit to ensure JS initializes
  await page.waitForTimeout(1000);

  // Check initial state
  let navbarHasScrolled = await page.evaluate(() => document.querySelector('.navbar').classList.contains('scrolled'));
  let scrollTopIsVisible = await page.evaluate(() => document.querySelector('.scroll-top').classList.contains('visible'));

  console.log(`Initial state - Navbar scrolled: ${navbarHasScrolled}, Scroll top visible: ${scrollTopIsVisible}`);

  // Scroll down by 600 pixels
  console.log('Scrolling down by 600 pixels...');
  await page.evaluate(() => window.scrollTo(0, 600));

  // Wait for RAF and animations
  await page.waitForTimeout(1000);

  // Check new state
  navbarHasScrolled = await page.evaluate(() => document.querySelector('.navbar').classList.contains('scrolled'));
  scrollTopIsVisible = await page.evaluate(() => document.querySelector('.scroll-top').classList.contains('visible'));

  console.log(`Scrolled state - Navbar scrolled: ${navbarHasScrolled}, Scroll top visible: ${scrollTopIsVisible}`);

  if (navbarHasScrolled && scrollTopIsVisible) {
      console.log('Verification SUCCESS: Scroll events are correctly triggering DOM updates.');
  } else {
      console.error('Verification FAILED: DOM updates did not trigger correctly after scroll.');
      process.exit(1);
  }

  await browser.close();
})();
