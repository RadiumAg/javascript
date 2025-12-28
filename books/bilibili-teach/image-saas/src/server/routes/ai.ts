import z from 'zod';
import { protectedProcedure, router } from '../trpc-middlewares/trpc';
import { AIService } from '../services/ai-service';
import { TRPCError } from '@trpc/server';

// AI服务实例
let aiService: AIService | null = null;

function getAIService(): AIService {
  if (!aiService) {
    try {
      aiService = new AIService();
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'AI服务初始化失败，请检查配置',
      });
    }
  }
  return aiService;
}

export const aiRouter = router({
  // 分析单张图片
  analyzeImage: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string().url('请提供有效的图片URL'),
      })
    )
    .query(async ({ input }) => {
      try {
        const service = getAIService();
        const result = await service.analyzeImage(input.imageUrl);
        
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        console.error('图片分析失败:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '图片分析失败，请稍后重试',
        });
      }
    }),

  // 批量分析图片
  analyzeBatchImages: protectedProcedure
    .input(
      z.object({
        imageUrls: z
          .array(z.string().url('请提供有效的图片URL'))
          .min(1, '至少需要一张图片')
          .max(10, '一次最多分析10张图片'),
      })
    )
    .query(async ({ input }) => {
      try {
        const service = getAIService();
        const results = await service.analyzeBatchImages(input.imageUrls);
        
        return {
          success: true,
          data: results,
        };
      } catch (error) {
        console.error('批量图片分析失败:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '批量图片分析失败，请稍后重试',
        });
      }
    }),

  // 检查AI服务状态
  checkStatus: protectedProcedure.query(async () => {
    try {
      // 尝试初始化AI服务来检查状态
      getAIService();
      
      return {
        success: true,
        data: {
          status: 'available',
          message: 'AI服务正常可用',
        },
      };
    } catch (error) {
      return {
        success: false,
        data: {
          status: 'unavailable',
          message: 'AI服务不可用，请检查配置',
        },
      };
    }
  }),
});