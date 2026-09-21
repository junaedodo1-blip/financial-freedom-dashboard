import { chromium } from "playwright";

const BASE_URL = "http://localhost:3000";

async function runLoginTest() {
  console.log("🔐 Starting Playwright Approved Login Verification Test...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Test 1: Invalid login credentials
  console.log("\n🧪 Test 1: Attempting unapproved user login (user: 'unapproved_user', pass: 'wrongpass')...");
  await page.goto(`${BASE_URL}/auth/v1/login`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);

  await page.fill("input[type='text']", "unapproved_user");
  await page.fill("input[type='password']", "wrongpass");
  await page.click("button[type='submit']");
  await page.waitForTimeout(1000);

  const errorText = await page.innerText("body");
  if (errorText.includes("Access denied")) {
    console.log("✅ PASSED: Unapproved login rejected with error message.");
  } else {
    console.error("❌ FAILED: Unapproved login was not rejected correctly!");
  }

  // Test 2: Approved login credentials
  console.log("\n🧪 Test 2: Attempting approved user login (user: 'junaed', pass: '1357')...");
  await page.fill("input[type='text']", "junaed");
  await page.fill("input[type='password']", "1357");
  await page.click("button[type='submit']");
  await page.waitForTimeout(2000);

  const currentUrl = page.url();
  if (currentUrl.includes("/dashboard")) {
    console.log(`✅ PASSED: Approved login succeeded! Redirected to: ${currentUrl}`);
  } else {
    console.error(`❌ FAILED: Approved login did not redirect to dashboard! Current URL: ${currentUrl}`);
  }

  await browser.close();
}

runLoginTest().catch((err) => {
  console.error("Login test script error:", err);
  process.exit(1);
});
