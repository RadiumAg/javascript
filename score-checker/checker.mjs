import 'dotenv/config';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COOKIE_FILE = path.join(__dirname, '.cookie');

// 配置
const CONFIG = {
  url: 'https://bm.ruankao.org.cn/query/score/result',
  emailTo: process.env.EMAIL_TO,
  // QQ邮箱SMTP配置
  smtp: {
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_AUTH_CODE,
    },
  },
};

let cookie = '';

// 已通知记录，避免重复发送
let lastNotifiedData = null;

// 创建邮件传输器
const transporter = nodemailer.createTransport(CONFIG.smtp);

const LOGIN_EXPIRED_MSG = '查询次数过多，您已被退出登录！';

// 从命令行读取 Cookie
function promptCookie(msg) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(msg, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// 从文件读取上次保存的 Cookie
function loadSavedCookie() {
  try {
    if (fs.existsSync(COOKIE_FILE)) {
      return fs.readFileSync(COOKIE_FILE, 'utf-8').trim();
    }
  } catch {}
  return '';
}

// 更新 Cookie 并保存到文件
function setCookie(newCookie) {
  cookie = newCookie;
  fs.writeFileSync(COOKIE_FILE, newCookie, 'utf-8');
  console.log('✅ Cookie 已设置！\n');
}

// 判断响应是否为登录失效
function isLoginExpired(result) {
  if (!result) return false;
  const str = JSON.stringify(result);
  return str.includes('退出登录') || str.includes(LOGIN_EXPIRED_MSG);
}

// 查询成绩
async function checkScore() {
  try {
    console.log(`[${new Date().toLocaleString()}] 正在查询成绩...`);
    const formData = new FormData();
    formData.append('stage', '2026年上半年');
    const response = await fetch(CONFIG.url, {
      method: 'post',
      body: formData,
      headers: {
        Cookie: cookie,
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    const result = await response.json();
    console.log('返回数据:', JSON.stringify(result, null, 2));

    // 检测是否被退出登录
    if (isLoginExpired(result)) {
      console.log('🔴 Cookie 已失效！');
      let newCookie = '';
      while (!newCookie) {
        newCookie = await promptCookie('请重新输入 Cookie: ');
      }
      setCookie(newCookie);
      console.log('正在用新 Cookie 重新查询...');
      await checkScore();
      return;
    }

    // 检查data是否有数据
    if (
      result.data &&
      (Array.isArray(result.data)
        ? result.data.length > 0
        : Object.keys(result.data).length > 0)
    ) {
      const dataStr = JSON.stringify(result.data);

      // 避免重复通知
      if (dataStr !== lastNotifiedData) {
        console.log('✅ 发现成绩数据，准备发送邮件通知...');
        await sendEmail(result.data);
        lastNotifiedData = dataStr;
      } else {
        console.log('数据未变化，跳过通知');
      }
    } else {
      console.log('暂无成绩数据');
    }
  } catch (error) {
    console.error('查询失败:', error.message);
  }
}

// 发送邮件
async function sendEmail(data) {
  try {
    const mailOptions = {
      from: CONFIG.smtp.auth.user,
      to: CONFIG.emailTo,
      subject: '🎓 软考成绩已出！',
      html: `
        <h2>软考成绩查询结果</h2>
        <p>查询时间：${new Date().toLocaleString()}</p>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
${JSON.stringify(data, null, 2)}
        </pre>
        <p><a href="${CONFIG.url}">点击查看详情</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ 邮件发送成功！');
  } catch (error) {
    console.error('邮件发送失败:', error.message);
  }
}

// 启动时输入 Cookie
async function promptInitialCookie() {
  const saved = loadSavedCookie();
  if (saved) {
    const masked =
      saved.length > 40 ? saved.slice(0, 20) + '...' + saved.slice(-10) : saved;
    console.log(`检测到上次保存的 Cookie: ${masked}`);
    console.log('直接回车使用上次的 Cookie，或输入新的 Cookie:');
    while (!cookie) {
      const input = await promptCookie('Cookie: ');
      if (input === '') {
        setCookie(saved);
        console.log('✅ 使用上次保存的 Cookie！\n');
      } else {
        setCookie(input);
      }
    }
  } else {
    console.log('请从浏览器复制 Cookie 粘贴到这里:');
    while (!cookie) {
      const input = await promptCookie('Cookie: ');
      if (input) {
        setCookie(input);
      } else {
        console.log('Cookie 不能为空，请重新输入');
      }
    }
  }
}

// 主函数
async function main() {
  console.log('========================================');
  console.log('  软考成绩查询监控已启动');
  console.log('  每30分钟自动查询一次');
  console.log('  有结果将邮件通知:', CONFIG.emailTo);
  console.log('========================================\n');

  // 启动时输入 Cookie
  await promptInitialCookie();

  // 立即执行一次
  await checkScore();

  // 每30分钟执行一次
  cron.schedule('*/30 * * * *', checkScore);
}

main();
