import 'dotenv/config';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

// 配置
const CONFIG = {
  url: 'https://bm.ruankao.org.cn/query/score/result',
  cookie: process.env.COOKIE,
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

// 已通知记录，避免重复发送
let lastNotifiedData = null;

// 创建邮件传输器
const transporter = nodemailer.createTransport(CONFIG.smtp);

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
        Cookie: CONFIG.cookie,
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    const result = await response.json();
    console.log('返回数据:', JSON.stringify(result, null, 2));

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

// 主函数
async function main() {
  console.log('========================================');
  console.log('  软考成绩查询监控已启动');
  console.log('  每10分钟自动查询一次');
  console.log('  有结果将邮件通知:', CONFIG.emailTo);
  console.log('========================================\n');

  // 立即执行一次
  await checkScore();

  // 每3分钟执行一次
  cron.schedule('*/10 * * * *', checkScore);
}

main();
