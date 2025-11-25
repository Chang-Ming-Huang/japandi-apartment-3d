// Playwright 截圖腳本 (ES Module)
import { chromium } from 'playwright';

// 可指定要截圖的視角，預設全部
const targetView = process.argv[2] || 'all';

async function takeScreenshot(view) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('http://localhost:5174');
  await page.waitForTimeout(2000);
  
  // 點擊對應按鈕切換視角
  await page.click(`button[data-view="${view}"]`);
  await page.waitForTimeout(1500);
  
  await page.screenshot({ path: `screenshot_${view}.png` });
  console.log(`截圖已儲存: screenshot_${view}.png`);
  
  await browser.close();
}

async function takeAllScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('http://localhost:5174');
  await page.waitForTimeout(2000);
  
  const views = ['overview', 'living', 'kitchen', 'master', 'study', 'bath'];
  
  for (const view of views) {
    await page.click(`button[data-view="${view}"]`);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `screenshot_${view}.png` });
    console.log(`截圖已儲存: screenshot_${view}.png`);
  }
  
  await browser.close();
}

// 執行
if (targetView === 'all') {
  takeAllScreenshots().catch(console.error);
} else {
  takeScreenshot(targetView).catch(console.error);
}
