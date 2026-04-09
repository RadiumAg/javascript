/**
 * 邮件上下文类型定义
 * 从 Python Pydantic 模型翻译而来
 */

// 通用邮件结构定义

/**
 * 邮件元数据
 */
export interface MailMeta {
  /** 发件人邮箱地址 */
  sender: string;
  /** 收件人邮箱地址 */
  receiver: string;
  /** 邮件主题 */
  subject: string;
  /** 邮件接收时间 */
  timestamp: Date;
}

/**
 * 邮件正文
 */
export interface MailBody {
  /** 邮件正文内容 */
  plain_text: string;
  /** HTML格式正文（如有） */
  html?: string;
}

/**
 * 邮件附件
 */
export interface MailAttachment {
  /** 附件名称 */
  filename: string;
  /** 文件类型，如pdf、jpg */
  filetype: string;
  /** 文件大小KB */
  filesize_kb: number;
}

/**
 * 完整邮件上下文
 */
export interface MailContext {
  /** 邮件元数据 */
  meta: MailMeta;
  /** 邮件正文 */
  body: MailBody;
  /** 邮件附件列表 */
  attachments?: MailAttachment[];
}

// 分类结构

/**
 * 分类结果
 */
export interface ClassificationResult {
  /** 邮件类别，如事务、系统、广告 */
  category: string;
  /** 分类置信度 */
  confidence: number;
}

// 摘要结构

/**
 * 摘要结果
 */
export interface SummaryResult {
  /** 生成的摘要内容 */
  summary: string;
}

// 回复建议结构

/**
 * 回复建议
 */
export interface ReplyCandidate {
  /** 建议回复内容 */
  reply_text: string;
  /** 意图类型，如确认、拒绝、需跟进 */
  intent?: string;
}

// 归档结构

/**
 * 归档元数据
 */
export interface ArchiveMetadata {
  /** 归档文件夹名称 */
  folder: string;
  /** 归档标签 */
  tags: string[];
}
