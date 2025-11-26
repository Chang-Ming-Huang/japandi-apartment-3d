// Playwright 截圖腳本 (ES Module)
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

// 可指定要截圖的視角，預設全部
const targetView = process.argv[2] || 'all';
const SCREENSHOT_DIR = 'screenshots';

async function ensureDir() {
  if (!existsSync(SCREENSHOT_DIR)) {
    await mkdir(SCREENSHOT_DIR, { recursive: true });
  }
}

const DEV_SERVER_URL = 'http://localhost:5173';

/**
 * 隱藏截圖時不需要的 UI 元素
 */
async function hideUIElements(page) {
  await page.evaluate(() => {
    // 隱藏信息面板
    const infoPanel = document.getElementById('info-panel');
    if (infoPanel) infoPanel.style.cssText = 'display: none !important;';

    // 隱藏導覽列
    const navBar = document.getElementById('nav-bar');
    if (navBar) navBar.style.cssText = 'display: none !important;';

    // 隱藏控制說明
    const controls = document.getElementById('controls');
    if (controls) controls.style.cssText = 'display: none !important;';
  });
}

/**
 * 恢復導覽列顯示（用於 takeAllScreenshots 中的下一次點擊）
 */
async function showNavBar(page) {
  await page.evaluate(() => {
    const navBar = document.getElementById('nav-bar');
    if (navBar) navBar.style.cssText = '';
  });
}

async function takeScreenshot(view) {
  await ensureDir();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto(DEV_SERVER_URL);
  await page.waitForSelector('#loading.hidden', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(1000);

  // 點擊對應按鈕切換視角
  await page.waitForSelector(`button[data-view="${view}"]`, { state: 'visible', timeout: 10000 });
  await page.click(`button[data-view="${view}"]`);
  await page.waitForTimeout(1500);

  // 隱藏 UI 元素（在視角切換完成後）
  await hideUIElements(page);
  
  const filePath = `${SCREENSHOT_DIR}/screenshot_${view}.png`;
  await page.screenshot({ path: filePath });
  console.log(`截圖已儲存: ${filePath}`);
  
  await browser.close();
}

async function takeAllScreenshots() {
  await ensureDir();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto(DEV_SERVER_URL);
  await page.waitForTimeout(2000);

  const views = ['overview', 'living', 'kitchen', 'master', 'study', 'bath'];

  for (const view of views) {
    await page.waitForSelector(`button[data-view="${view}"]`, { state: 'visible', timeout: 10000 });
    await page.click(`button[data-view="${view}"]`);
    await page.waitForTimeout(1500);

    // 隱藏 UI 元素（在每個視角切換完成後）
    await hideUIElements(page);

    const filePath = `${SCREENSHOT_DIR}/screenshot_${view}.png`;
    await page.screenshot({ path: filePath });
    console.log(`截圖已儲存: ${filePath}`);

    // 恢復導覽列顯示（以便下一次點擊）
    await showNavBar(page);
  }
  
  await browser.close();
}

// 執行
if (targetView === 'all') {
  takeAllScreenshots().catch(console.error);
} else {
  takeScreenshot(targetView).catch(console.error);
}
