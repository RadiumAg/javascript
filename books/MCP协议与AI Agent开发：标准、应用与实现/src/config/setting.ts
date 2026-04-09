/**
 * 应用配置设置
 * 从 Python config/settings.py 翻译而来
 * 使用 Zod 进行环境变量验证和类型安全
 */

import { z } from 'zod';

// 配置验证 Schema
const AppSettingsSchema = z.object({
  // DeepSeek Chat 接口相关
  DEEPSEEK_API_KEY: z.string().min(1, 'DEEPSEEK_API_KEY 环境变量未设置'),
  DEEPSEEK_BASE_URL: z
    .string()
    .url('DEEPSEEK_BASE_URL 必须是有效的 URL')
    .default('https://api.DeepSeek.com'),
  DEEPSEEK_MODEL: z.string().default('deepseek-chat'),

  // 日志等级
  LOG_LEVEL: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']).default('INFO'),

  // Prompt路径（如有）
  PROMPT_PATH: z.string().default('prompt_templates/'),

  // 上下文最大长度限制
  MAX_CONTEXT_LENGTH: z.coerce.number().int().positive().default(4096),

  // 是否启用调试模式
  DEBUG_MODE: z
    .enum(['true', 'false', '1', '0'])
    .transform((val) => val === 'true' || val === '1')
    .default(false as any),
});

// 配置类型
export type AppSettings = z.infer<typeof AppSettingsSchema>;

/**
 * 从环境变量加载配置
 * @returns 验证后的配置对象
 */
function loadSettings(): AppSettings {
  try {
    // 从 process.env 读取并验证
    const settings = AppSettingsSchema.parse(process.env);
    return settings;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError;
      const missingVars = zodError.issues
        .filter((e) => e.code === 'invalid_type' || e.code === 'invalid_value')
        .map((e) => e.path.join('.'));

      console.error('配置验证失败:');
      console.error(zodError.issues.map((e) => `  - ${e.path.join('.')}: ${e.message}`).join('\n'));

      if (missingVars.length > 0) {
        console.error(`\n缺少必需的环境变量: ${missingVars.join(', ')}`);
        console.error('请检查 .env 文件或环境变量设置');
      }

      throw new Error('配置加载失败');
    }
    throw error;
  }
}

/**
 * 全局配置对象
 */
export const settings = loadSettings();

export default settings;
