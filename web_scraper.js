const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

// 确保 langchain 目录存在
const langchainDir = path.join(__dirname, 'langchain');
if (!fs.existsSync(langchainDir)) {
  fs.mkdirSync(langchainDir, { recursive: true });
}

async function scrapeWebsite(url) {
  console.log(`开始爬取网页: ${url}`);

  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: false, // 设置为 false 以便使用已登录的浏览器会话
    defaultViewport: null,
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // 打开新页面
    const page = await browser.newPage();

    // 导航到目标URL
    console.log('正在导航到页面...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // 等待页面加载完成
    console.log('等待页面加载...');
    await page.waitForSelector('body', { timeout: 30000 });

    // 获取页面标题
    const title = await page.title();
    console.log(`页面标题: ${title}`);

    // 获取页面内容
    console.log('提取页面内容...');
    const content = await page.evaluate(() => {
      // 尝试获取主要内容区域
      const mainContent =
        document.querySelector('main') ||
        document.querySelector('article') ||
        document.querySelector('.content') ||
        document.body;

      return {
        title: document.title,
        text: mainContent.innerText,
        html: mainContent.innerHTML,
      };
    });

    // 保存内容到文件
    const fileName = `${title.replace(/[^\dA-Za-z]/g, '_')}.txt`;
    const filePath = path.join(langchainDir, fileName);

    fs.writeFileSync(
      filePath,
      `标题: ${content.title}\n\n内容:\n${content.text}`
    );
    console.log(`内容已保存到: ${filePath}`);

    // 保存HTML到文件
    const htmlFileName = `${title.replace(/[^\dA-Za-z]/g, '_')}.html`;
    const htmlFilePath = path.join(langchainDir, htmlFileName);

    fs.writeFileSync(htmlFilePath, content.html);
    console.log(`HTML已保存到: ${htmlFilePath}`);

    return {
      title: content.title,
      filePath,
      htmlFilePath,
    };
  } catch (error) {
    console.error('爬取过程中出错:', error);
    throw error;
  } finally {
    // 关闭浏览器
    await browser.close();
  }
}

// 执行爬取
const targetUrl =
  'https://grow.alibaba-inc.com/course/4810000000001421/section/1830000000002486';
scrapeWebsite(targetUrl)
  .then(result => {
    console.log('爬取完成!');
    console.log(`标题: ${result.title}`);
    console.log(`文本文件: ${result.filePath}`);
    console.log(`HTML文件: ${result.htmlFilePath}`);
  })
  .catch(err => {
    console.error('爬取失败:', err);
  });
