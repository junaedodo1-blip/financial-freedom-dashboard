import { chromium } from "playwright";

const RENDER_URL = "https://financial-freedom-dashboard-9hvw.onrender.com";

async function testRender() {
  console.log(`🌐 Connecting to Render Live URL: ${RENDER_URL}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // 1. Visit Login Page
    console.log("📍 Test 1: Accessing Login Page on Render...");
    const response = await page.goto(`${RENDER_URL}/auth/v1/login`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    console.log(` HTTP Response Status: ${response ? response.status() : "No response"}`);

    if (!response || response.status() >= 400) {
      console.log("⚠️ Render build might still be building or cold starting. Waiting 15s...");
      await page.waitForTimeout(15000);
      await page.goto(`${RENDER_URL}/auth/v1/login`, { waitUntil: "domcontentloaded", timeout: 45000 });
    }

    await page.waitForTimeout(1000);

    // 2. Perform Approved Login
    console.log("📍 Test 2: Submitting approved credentials (junaed / 1357)...");
    await page.fill("input[type='text']", "junaed");
    await page.fill("input[type='password']", "1357");
    await page.click("button[type='submit']");
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    console.log(` Current URL after login submit: ${currentUrl}`);

    if (currentUrl.includes("/dashboard")) {
      console.log("✅ Render Live Deployment Login & Redirect PASSED!");
    } else {
      console.log(`⚠️ Redirect check: ${currentUrl}`);
    }

    // 3. Check Dashboard Content
    const pageTitle = await page.title();
    console.log(` Live Render Page Title: "${pageTitle}"`);

  } catch (err) {
    console.error("❌ Render Test Failed:", err.message);
  } finally {
    await browser.close();
  }
}

testRender().catch(console.error);
