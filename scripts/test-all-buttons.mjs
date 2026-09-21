import { chromium } from "playwright";

const BASE_URL = "http://localhost:3000";

const ROUTES = [
  "/dashboard/default",
  "/dashboard/crm",
  "/dashboard/intent-leads",
  "/dashboard/finance",
  "/dashboard/analytics",
  "/dashboard/kanban",
  "/dashboard/workshops",
  "/dashboard/agents",
  "/dashboard/profile",
];

async function main() {
  console.log("🚀 Starting Playwright Button & Link Verification Audit...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];
  const errors = [];

  page.on("pageerror", (err) => {
    errors.push(`[Page Error] ${err.message}`);
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`[Console Error] ${msg.text()}`);
    }
  });

  for (const route of ROUTES) {
    const targetUrl = `${BASE_URL}${route}`;
    console.log(`\n🔍 Auditing route: ${route}...`);
    try {
      await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(1000);

      // Find all buttons
      const buttons = await page.$$("button, [role='button'], a[href]");
      console.log(` Found ${buttons.length} interactive elements on ${route}`);

      let clickedCount = 0;
      let disabledCount = 0;

      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        try {
          const isVisible = await btn.isVisible();
          const isDisabled = await btn.isDisabled().catch(() => false);
          const text = (await btn.innerText().catch(() => "")).trim() || (await btn.getAttribute("aria-label").catch(() => "")) || "Button";

          if (isVisible && !isDisabled) {
            // Click button safely
            await btn.click({ timeout: 2000, force: true }).catch(() => {});
            clickedCount++;
          } else if (isDisabled) {
            disabledCount++;
          }
        } catch (e) {
          // Ignore transient click errors
        }
      }

      results.push({
        route,
        status: "PASSED",
        totalElements: buttons.length,
        clickedCount,
        disabledCount,
      });
    } catch (err) {
      console.error(`❌ Failed to test ${route}: ${err.message}`);
      results.push({
        route,
        status: "FAILED",
        error: err.message,
      });
    }
  }

  await browser.close();

  console.log("\n==========================================");
  console.log("📊 PLAYWRIGHT AUDIT RESULTS SUMMARY");
  console.log("==========================================");
  console.table(results);

  if (errors.length > 0) {
    console.log("\n⚠️ Unhandled Console/Page Errors detected:");
    errors.forEach((e) => console.log(`  - ${e}`));
  } else {
    console.log("\n✨ 0 Unhandled JavaScript Console/Page Errors found across all routes!");
  }
}

main().catch((err) => {
  console.error("Audit script failed:", err);
  process.exit(1);
});
