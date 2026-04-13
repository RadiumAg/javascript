import { tool } from '@langchain/core/tools';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore zod v4 的 exports types 指向 .d.cts，nodenext 下 TS 无法解析 ESM 类型
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * 获取工作目录，默认为当前进程目录
 */
function resolveFilePath(filePath: string): string {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  return path.resolve(process.cwd(), filePath);
}

// ============================================================
// 文件操作工具
// ============================================================

export const readFileTool = tool(
  async ({ filePath }) => {
    const absolutePath = resolveFilePath(filePath);
    try {
      const content = await fs.readFile(absolutePath, 'utf-8');
      return `文件内容 (${absolutePath}):\n\n${content}`;
    } catch (error) {
      return `读取文件失败: ${(error as Error).message}`;
    }
  },
  {
    name: 'read_file',
    description:
      '读取指定路径的文件内容。支持相对路径和绝对路径。用于查看代码、配置文件等。',
    schema: z.object({
      filePath: z.string().describe('要读取的文件路径，支持相对路径和绝对路径'),
    }),
  },
);

export const writeFileTool = tool(
  async ({ filePath, content }) => {
    const absolutePath = resolveFilePath(filePath);
    try {
      const directory = path.dirname(absolutePath);
      await fs.mkdir(directory, { recursive: true });
      await fs.writeFile(absolutePath, content, 'utf-8');
      return `文件已成功写入: ${absolutePath}`;
    } catch (error) {
      return `写入文件失败: ${(error as Error).message}`;
    }
  },
  {
    name: 'write_file',
    description:
      '将内容写入指定路径的文件。如果文件不存在会自动创建，如果目录不存在会自动创建目录。用于创建新文件或覆盖修改现有文件。',
    schema: z.object({
      filePath: z.string().describe('要写入的文件路径'),
      content: z.string().describe('要写入的文件内容'),
    }),
  },
);

export const listFilesTool = tool(
  async ({ directoryPath, recursive = false }) => {
    const absolutePath = resolveFilePath(directoryPath);
    try {
      const entries = await fs.readdir(absolutePath, { withFileTypes: true });
      const results: string[] = [];

      for (const entry of entries) {
        const entryPath = path.join(absolutePath, entry.name);
        const prefix = entry.isDirectory() ? '📁' : '📄';
        results.push(`${prefix} ${entry.name}`);

        if (recursive && entry.isDirectory()) {
          const subEntries = await fs.readdir(entryPath, {
            withFileTypes: true,
          });
          for (const subEntry of subEntries) {
            const subPrefix = subEntry.isDirectory() ? '📁' : '📄';
            results.push(`  ${subPrefix} ${entry.name}/${subEntry.name}`);
          }
        }
      }

      return `目录内容 (${absolutePath}):\n${results.join('\n')}`;
    } catch (error) {
      return `列出目录失败: ${(error as Error).message}`;
    }
  },
  {
    name: 'list_files',
    description:
      '列出指定目录下的文件和子目录。可选择是否递归列出子目录内容（仅展开一层）。',
    schema: z.object({
      directoryPath: z
        .string()
        .describe('要列出的目录路径，默认为当前工作目录'),
      recursive: z
        .boolean()
        .optional()
        .describe('是否递归列出子目录内容（仅展开一层），默认 false'),
    }),
  },
);

// ============================================================
// 命令执行工具
// ============================================================

export const runCommandTool = tool(
  async ({ command, cwd }) => {
    const workingDirectory = cwd ? resolveFilePath(cwd) : process.cwd();
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: workingDirectory,
        timeout: 30000,
        maxBuffer: 1024 * 1024,
      });

      let result = '';
      if (stdout) result += `stdout:\n${stdout}\n`;
      if (stderr) result += `stderr:\n${stderr}\n`;
      return result || '命令执行成功（无输出）';
    } catch (error) {
      const execError = error as {
        stdout?: string;
        stderr?: string;
        message: string;
      };
      return `命令执行失败:\n${execError.stderr || execError.message}${execError.stdout ? `\nstdout:\n${execError.stdout}` : ''}`;
    }
  },
  {
    name: 'run_command',
    description:
      '在 shell 中执行命令。可用于运行构建、测试、lint、git 等命令。超时时间为 30 秒。',
    schema: z.object({
      command: z.string().describe('要执行的 shell 命令'),
      cwd: z
        .string()
        .optional()
        .describe('命令执行的工作目录，默认为当前工作目录'),
    }),
  },
);

// ============================================================
// 代码审核工具
// ============================================================

export const codeReviewTool = tool(
  async ({ filePath, reviewFocus }) => {
    const absolutePath = resolveFilePath(filePath);
    try {
      const content = await fs.readFile(absolutePath, 'utf-8');
      const lines = content.split('\n');
      const extension = path.extname(filePath);

      const reviewReport: string[] = [
        `## 代码审核报告`,
        `- **文件**: ${absolutePath}`,
        `- **行数**: ${lines.length}`,
        `- **类型**: ${extension}`,
        `- **审核重点**: ${reviewFocus || '全面审核'}`,
        '',
        '请基于以下代码内容进行审核：',
        '',
        '```' + extension.slice(1),
        content,
        '```',
        '',
        '请从以下维度进行审核：',
        '1. **代码质量**: 命名规范、代码结构、可读性',
        '2. **潜在 Bug**: 空指针、边界条件、异常处理',
        '3. **性能**: 不必要的计算、内存泄漏风险',
        '4. **安全性**: 注入风险、敏感信息暴露',
        '5. **最佳实践**: 是否遵循语言/框架的最佳实践',
      ];

      return reviewReport.join('\n');
    } catch (error) {
      return `代码审核失败: ${(error as Error).message}`;
    }
  },
  {
    name: 'code_review',
    description:
      '对指定文件进行代码审核。读取文件内容并生成审核报告模板，包含代码质量、潜在 Bug、性能、安全性等维度的分析。',
    schema: z.object({
      filePath: z.string().describe('要审核的文件路径'),
      reviewFocus: z
        .string()
        .optional()
        .describe(
          '审核重点，如 "性能优化"、"安全性"、"代码规范" 等，不填则全面审核',
        ),
    }),
  },
);

// ============================================================
// Skill 调用工具
// ============================================================

export const callSkillTool = tool(
  async ({ skillName, skillFilePath }) => {
    try {
      const absolutePath = resolveFilePath(skillFilePath);
      const content = await fs.readFile(absolutePath, 'utf-8');
      return `Skill "${skillName}" 的内容:\n\n${content}`;
    } catch (error) {
      return `读取 Skill 失败: ${(error as Error).message}`;
    }
  },
  {
    name: 'call_skill',
    description:
      '读取并加载指定的 Skill 文档。Skill 是预定义的能力描述文件，包含特定任务的执行指南和最佳实践。加载后可以根据 Skill 的指导来执行任务。',
    schema: z.object({
      skillName: z.string().describe('Skill 的名称，如 react-best-practices'),
      skillFilePath: z
        .string()
        .describe(
          'Skill 文件的路径，如 /Users/xxx/.agents/skills/xxx/SKILL.md',
        ),
    }),
  },
);

// ============================================================
// 导出所有工具
// ============================================================

export const localTools = [
  readFileTool,
  writeFileTool,
  listFilesTool,
  runCommandTool,
  codeReviewTool,
  callSkillTool,
];
