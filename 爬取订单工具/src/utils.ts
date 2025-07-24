import puppeteer from 'puppeteer-core';

async function startProcess() {
  const browser = await puppeteer.launch({
    executablePath:
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows
    headless: false, // 使用全新 Headless 模式
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.goto(
    'https://vendorcentral.amazon.com/hz/vendor/members/coop?ref_=vc_xx_favb'
  );

  return page;
}

export { startProcess };
