import axios from 'axios';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface WebToMarkdownOptions {
  url: string;
  outputPath?: string;
  turndownOptions?: any;
}

class WebToMarkdownConverter {
  private turndownService: TurndownService;

  constructor(options: any = {}) {
    this.turndownService = new TurndownService(options);
    this.addCustomRules();
  }

  private addCustomRules() {
    // 添加自定义转换规则
    this.turndownService.addRule('pre', {
      filter: 'pre',
      replacement: (content: string, node: any) => {
        const lang = node.getAttribute('data-lang') || '';
        return `\n\`\`\`${lang}\n${content}\n\`\`\`\n`;
      },
    });

    this.turndownService.addRule('images', {
      filter: 'img',
      replacement: (content: string, node: any) => {
        const alt = node.alt || '';
        const src = node.src || '';
        return `![${alt}](${src})`;
      },
    });
  }

  public async convert(options: WebToMarkdownOptions): Promise<string> {
    try {
      // 1. 获取网页内容
      const response = await axios.get(options.url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      // 2. 解析HTML
      const dom = new JSDOM(response.data);
      const document = dom.window.document;

      // 3. 提取主要内容（可根据需要调整选择器）
      const article = document.body;

      // 4. 转换为Markdown
      const markdown = this.turndownService.turndown(article.innerHTML);

      // 5. 保存到文件（如果指定了输出路径）
      if (options.outputPath) {
        const outputFile = join(process.cwd(), options.outputPath);
        writeFileSync(outputFile, markdown);
        console.log(`Markdown saved to ${outputFile}`);
      }

      return markdown;
    } catch (error) {
      console.error('Error converting web page to markdown:', error);
      throw error;
    }
  }
}

// 使用示例
async function main() {
  const converter = new WebToMarkdownConverter({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
    strongDelimiter: '**',
    linkStyle: 'inlined',
    linkReferenceStyle: 'full',
  });

  const markdown = await converter.convert({
    url: 'https://grow.alibaba-inc.com/course/4810000000001421/section/1830000000002486', // 替换为你想抓取的网页
    outputPath: '3.1.md', // 可选：输出文件路径
  });

  console.log(markdown);
}

main().catch(console.error);
