import { chromium } from "playwright";

const RENDER_URL = "https://financial-freedom-dashboard-9hvw.onrender.com";

async function testRender() {
  console.log(`🌐 Connecting to Render Live URL: ${RENDER_URL}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Visit Login Page
    console.log("📍 Accessing Login Page on Render...");
    await page.goto(`${RENDER_URL}/auth/v1/login`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForTimeout(1000);

    // 2. Perform Approved Login
    console.log("📍 Submitting approved credentials (junaed / 1357)...");
    await page.fill("input[type='text']", "junaed");
    await page.fill("input[type='password']", "1357");
    await page.click("button[type='submit']");
    await page.waitForTimeout(5000);

    const currentUrl = page.url();
    console.log(` Current URL: ${currentUrl}`);

    // If still on login page or redirected, navigate to finance page
    await page.goto(`${RENDER_URL}/dashboard/finance`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(2000);

    // 3. Inspect page body for canvas / Kalo Active / Thinking Orb
    const htmlContent = await page.content();
    const hasCanvas = await page.locator("canvas").count();
    const hasKaloActive = htmlContent.includes("Kalo Active");
    const hasFreedom = htmlContent.includes("Freedom & Finance");

    console.log(`\n==========================================`);
    console.log(`📊 RENDER LIVE INSPECTION RESULTS`);
    console.log(`==========================================`);
    console.log(` Canvas Elements Found: ${hasCanvas}`);
    console.log(` "Kalo Active" Header Badge Found: ${hasKaloActive}`);
    console.log(` "Freedom & Finance" Page Content Found: ${hasFreedom}`);

    if (hasCanvas > 0 || hasKaloActive) {
      console.log("\n✨ Thinking Orbs deployment IS LIVE on Render!");
    } else {
      console.log("\n⚠️ Render build may still be deploying in background. Retrying in 20s...");
      await page.waitForTimeout(20000);
      await page.reload({ waitUntil: "domcontentloaded" });
      const recheckCanvas = await page.locator("canvas").count();
      console.log(` Retry Canvas Elements Found: ${recheckCanvas}`);
    }

  } catch (err) {
    console.error("❌ Render Inspection Failed:", err.message);
  } finally {
    await browser.close();
  }
}

testRender().catch(console.error);
