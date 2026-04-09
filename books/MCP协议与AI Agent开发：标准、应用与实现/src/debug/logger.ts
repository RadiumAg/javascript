import winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

// 日志输出路径
const LOG_DIR = 'logs';
const now = new Date();
const timestamp = now.toISOString()
  .replace(/[:.]/g, '-')
  .replace('T', '_')
  .split('.')[0];
const LOG_FILE = path.join(LOG_DIR, `mcp_mailagent_${timestamp}.log`);

// 确保日志目录存在
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// 日志格式定义
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}][${level.toUpperCase()}] ${message}`;
  })
);

// 初始化日志器
const logger = winston.createLogger({
  level: 'debug',
  format: logFormat,
  transports: [
    // 文件日志处理器
    new winston.transports.File({
      filename: LOG_FILE,
      level: 'debug',
      encoding: 'utf8',
    }),
    // 控制台日志处理器
    new winston.transports.Console({
      level: 'info',
    }),
  ],
});

export default logger;
