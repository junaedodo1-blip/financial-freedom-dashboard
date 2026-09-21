import { chromium } from "playwright";
import path from "path";

const RENDER_URL = "https://financial-freedom-dashboard-9hvw.onrender.com";
const SCREENSHOT_PATH = "C:/Users/High Tech/.gemini/antigravity/brain/6239d325-c056-4677-aa77-8084e4d9ce2d/render-live-dashboard.png";

async function captureScreen() {
  console.log("📸 Launching Playwright to capture live Render screenshot...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // 1. Visit Login Page
    console.log("📍 Navigating to Render Login Page...");
    await page.goto(`${RENDER_URL}/auth/v1/login`, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(1000);

    // 2. Submit Login
    console.log("📍 Filling credentials junaed / 1357...");
    await page.fill("input[type='text']", "junaed");
    await page.fill("input[type='password']", "1357");
    await page.click("button[type='submit']");

    console.log("📍 Waiting for navigation to /dashboard/default...");
    await page.waitForURL("**/dashboard/**", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);

    // 3. Take screenshot
    await page.screenshot({ path: SCREENSHOT_PATH, fullPage: false });
    console.log(`📸 Screenshot saved to: ${SCREENSHOT_PATH}`);

    // Check header text & canvas
    const headerText = await page.innerText("header").catch(() => "Header not found");
    console.log(`Header Text: "${headerText.replace(/\n/g, " ")}"`);

  } catch (err) {
    console.error("❌ Screenshot capture failed:", err.message);
  } finally {
    await browser.close();
  }
}

captureScreen().catch(console.error);
