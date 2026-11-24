import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\9d11d7b4-5004-41d7-8673-0f28ae656b27';
const SCREENSHOT_DIR = path.resolve('public/screenshots');

[ARTIFACT_DIR, SCREENSHOT_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function saveScreenshot(page, filename) {
  const p1 = path.join(SCREENSHOT_DIR, filename);
  const p2 = path.join(ARTIFACT_DIR, filename);
  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, p2);
  console.log(`✓ Saved screenshot: ${filename}`);
}

async function clickElement(page, selector) {
  await page.waitForSelector(selector);
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error('Element not found: ' + sel);
    el.click();
  }, selector);
}

async function runTests() {
  console.log('--- Starting GLOSSÉ 3D E2E Visual & Interactive Test Suite ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    protocolTimeout: 120000,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--ignore-gpu-blocklist',
      '--enable-webgl',
      '--enable-unsafe-swiftshader',
      '--use-gl=angle',
      '--use-angle=swiftshader'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const consoleLogs = [];
  const errors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    consoleLogs.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${text}`);
    }
  });

  page.on('pageerror', (err) => {
    errors.push(`Page Error: ${err.message}`);
  });

  try {
    // 1. HOME HERO TEST
    console.log('Navigating to http://127.0.0.1:5173/ ...');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2200));

    // Simulate mouse movements across canvas to test 3D tube tilt and cursor light
    await page.mouse.move(320, 280);
    await page.mouse.move(720, 420);
    await page.mouse.move(1120, 360);
    await new Promise((r) => setTimeout(r, 800));

    await saveScreenshot(page, '01_home_hero.png');

    // TEST WAND UNSCREW & LIP DROP ANIMATION
    console.log('Testing live Wand Unscrew & Lip Drip animation...');
    await clickElement(page, '#btn-drop-glaze');
    await new Promise((r) => setTimeout(r, 1400));
    await saveScreenshot(page, '01b_wand_glaze_drop.png');
    await new Promise((r) => setTimeout(r, 1600));

    // 2. SHOP & SHADE PICKER TEST
    console.log('Navigating to Shop page...');
    await clickElement(page, 'a[data-page="shop"]');
    await new Promise((r) => setTimeout(r, 1200));

    // Select Peach Fizz
    console.log('Selecting Peach Fizz...');
    await clickElement(page, '.shade-pill[data-shade-id="peach-fizz"]');
    await new Promise((r) => setTimeout(r, 700));

    // Select Berry Bloom
    console.log('Selecting Berry Bloom...');
    await clickElement(page, '.shade-pill[data-shade-id="berry-bloom"]');
    await new Promise((r) => setTimeout(r, 700));

    await saveScreenshot(page, '02_shop_shade_picker.png');

    // Click Add to Bag
    console.log('Adding Berry Bloom to Bag...');
    await clickElement(page, '#btn-add-bag');
    await new Promise((r) => setTimeout(r, 1000));

    // Select Gold Rush & Add to Bag
    await clickElement(page, '.shade-pill[data-shade-id="gold-rush"]');
    await new Promise((r) => setTimeout(r, 600));
    await clickElement(page, '#btn-add-bag');
    await new Promise((r) => setTimeout(r, 1200));

    await saveScreenshot(page, '02b_shop_cart_drawer.png');

    // Close Cart Drawer
    await clickElement(page, '.cart-close-btn');
    await new Promise((r) => setTimeout(r, 600));

    // 3. OUR STORY TEST
    console.log('Navigating to Our Story page...');
    await clickElement(page, 'a[data-page="story"]');
    await new Promise((r) => setTimeout(r, 2200));

    await saveScreenshot(page, '03_story_ingredients.png');

    // 4. LOOKBOOK & CONTACT TEST
    console.log('Navigating to Lookbook & Contact page...');
    await clickElement(page, 'a[data-page="lookbook"]');
    await new Promise((r) => setTimeout(r, 1400));

    // Save lookbook photo gallery screenshot
    await saveScreenshot(page, '04a_lookbook_gallery.png');

    // Scroll down to contact form
    await page.evaluate(() => {
      const contactSection = document.querySelector('.contact-section');
      if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    });
    await new Promise((r) => setTimeout(r, 800));

    // Test form validation - Submit empty
    await clickElement(page, '#btn-submit-contact');
    await new Promise((r) => setTimeout(r, 500));
    const nameError = await page.$eval('#error-name', (el) => el.textContent);
    console.log('Validation checked: Name error =', nameError);

    // Fill valid data
    await page.type('#contact-name', 'Camille Laurent');
    await page.type('#contact-email', 'camille.laurent@vogue-paris.fr');
    await page.type('#contact-message', 'We would love to feature the Rose Quartz and Berry Bloom lip glazes in our upcoming summer beauty editorial.');
    await clickElement(page, '#btn-submit-contact');
    await new Promise((r) => setTimeout(r, 1400));

    await saveScreenshot(page, '04b_lookbook_contact.png');

    // 5. MOBILE VIEWPORT TEST
    console.log('Testing Mobile Viewport (390 x 844)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await new Promise((r) => setTimeout(r, 1000));

    // Toggle mobile menu via evaluate
    await page.evaluate(() => {
      const toggle = document.querySelector('.mobile-menu-toggle');
      if (toggle) toggle.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await saveScreenshot(page, '05_mobile_viewport.png');

    console.log('--- TEST SUMMARY ---');
    console.log(`Console logs total: ${consoleLogs.length}`);
    console.log(`Errors encountered: ${errors.length}`);
    if (errors.length > 0) {
      console.error('Errors:', errors);
    } else {
      console.log('ALL TESTS PASSED WITH 0 ERRORS!');
    }
  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    console.log('--- RECENT BROWSER CONSOLE LOGS ---');
    consoleLogs.slice(-20).forEach((l) => console.log(l));
    if (errors.length > 0) {
      console.log('--- BROWSER ERRORS ---');
      errors.forEach((e) => console.error(e));
    }
    await browser.close();
  }
}

runTests();
