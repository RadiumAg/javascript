import * as fs from 'fs';
import * as path from 'path';

// 日志级别枚举
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

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

// 创建日志写入流
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a', encoding: 'utf8' });

// 格式化日志消息
function formatMessage(level: LogLevel, message: string): string {
  const now = new Date();
  const timeStr = now.toISOString().replace('T', ' ').split('.')[0];
  return `[${timeStr}][${level.toUpperCase()}] ${message}`;
}

// 日志器类
class Logger {
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.DEBUG) {
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private log(level: LogLevel, message: string) {
    if (!this.shouldLog(level)) return;
    
    const formatted = formatMessage(level, message);
    
    // 文件日志 (全部级别)
    logStream.write(formatted + '\n');
    
    // 控制台日志 (info 及以上)
    if (levels.indexOf(level) >= levels.indexOf(LogLevel.INFO)) {
      if (level === LogLevel.ERROR) {
        console.error(formatted);
      } else if (level === LogLevel.WARN) {
        console.warn(formatted);
      } else {
        console.log(formatted);
      }
    }
  }

  debug(message: string) {
    this.log(LogLevel.DEBUG, message);
  }

  info(message: string) {
    this.log(LogLevel.INFO, message);
  }

  warn(message: string) {
    this.log(LogLevel.WARN, message);
  }

  error(message: string) {
    this.log(LogLevel.ERROR, message);
  }
}

const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];

// 初始化日志器
const logger = new Logger(LogLevel.DEBUG);

export default logger;
