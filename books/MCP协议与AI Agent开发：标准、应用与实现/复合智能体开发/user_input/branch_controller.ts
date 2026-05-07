interface LLMClient {
  generate(prompt: string): string;
}

interface BranchOption {
  description: string;
  impact_analysis: string;
}

interface BranchResult {
  selected_option: number;
  reason: string;
  score: number;
}

interface PlayerPreferences {
  style?: string;
  exploration_rate?: number;
}

class BranchController {
  private llm: LLMClient;
  private playerPreferences: PlayerPreferences;

  constructor(llm: LLMClient) {
    this.llm = llm;
    this.playerPreferences = {};
  }

  forward(
    context: string,
    currentStoryText: string,
    branchOptions: BranchOption[],
  ): BranchResult {
    const playerStyle = this.playerPreferences.style ?? 'balanced';
    const explorationRate = this.playerPreferences.exploration_rate ?? 0.3;

    const optionsText = this.formatOptions(branchOptions);

    const prompt = `
当前剧情：${currentStoryText}

场景上下文：${context}

可选分支：
${optionsText}

玩家风格倾向：${playerStyle}
探索倾向度：${explorationRate}

请分析每个分支的利弊，并选择最适合当前情境的分支。
返回JSON格式：
- selected_option: 选择的分支序号（从1开始）
- reason: 选择理由
- score: 置信度（0.0到1.0）
`;

    const response = this.llm.generate(prompt);
    const result: BranchResult = JSON.parse(response);
    this.applyExplorationBias(result, playerStyle, explorationRate);
    return result;
  }

  private formatOptions(options: BranchOption[]): string {
    return options
      .map(
        (opt, index) =>
          `${index + 1}. ${opt.description}\n   影响分析：${opt.impact_analysis}`,
      )
      .join('\n');
  }

  private applyExplorationBias(
    result: BranchResult,
    style: string,
    explorationRate: number,
  ): void {
    if (style === 'conservative') {
      result.score *= 1 - explorationRate * 0.5;
    } else if (style === 'adventurous') {
      result.score *= 1 + explorationRate * 0.5;
    }
  }
}

export { BranchController };
export type { LLMClient, BranchOption, BranchResult, PlayerPreferences };
