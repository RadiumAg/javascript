import OpenAI from 'openai';

interface ImageAnalysisResult {
  tags: string[];
  description: string;
  confidence: number;
}

export class AIService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * 分析图片并生成标签
   */
  async analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的图片分析师。请分析图片并返回JSON格式的结果。
            
            返回格式：
            {
              "tags": ["标签1", "标签2", "标签3"],
              "description": "图片的简要描述",
              "confidence": 0.95
            }
            
            要求：
            1. 标签应该是名词或形容词，简洁准确
            2. 标签数量控制在3-8个之间
            3. 描述在50字以内
            4. confidence表示分析结果的置信度(0-1)
            5. 只返回JSON，不要其他文字`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '请分析这张图片并生成标签',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0.1,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('AI服务返回空内容');
      }

      // 尝试解析JSON响应
      const result = JSON.parse(content) as ImageAnalysisResult;
      
      // 验证和清理结果
      return {
        tags: this.cleanTags(result.tags || []),
        description: result.description || '无法生成描述',
        confidence: Math.min(1, Math.max(0, result.confidence || 0.5)),
      };
    } catch (error) {
      console.error('AI分析失败:', error);
      // 返回默认结果
      return {
        tags: ['未分类'],
        description: 'AI分析失败',
        confidence: 0,
      };
    }
  }

  /**
   * 清理和标准化标签
   */
  private cleanTags(tags: string[]): string[] {
    return tags
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0 && tag.length <= 20)
      .slice(0, 8) // 最多8个标签
      .filter((tag, index, arr) => arr.indexOf(tag) === index); // 去重
  }

  /**
   * 批量分析图片
   */
  async analyzeBatchImages(imageUrls: string[]): Promise<ImageAnalysisResult[]> {
    const results = await Promise.allSettled(
      imageUrls.map(url => this.analyzeImage(url))
    );

    return results.map(result => 
      result.status === 'fulfilled' ? result.value : {
        tags: ['分析失败'],
        description: '分析失败',
        confidence: 0,
      }
    );
  }
}