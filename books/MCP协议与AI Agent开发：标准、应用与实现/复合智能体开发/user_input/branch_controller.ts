class InputRouter {
  private validCommands: Record<string, (content: string) => string>;

  constructor() {
    this.validCommands = {
      '切换情绪': this.routeEmotionSwitch.bind(this),
      '注入剧情': this.routeStoryInjection.bind(this),
      '查看状态': this.routeStatusView.bind(this),
    };
  }

  route(command: string, content: string): string {
    for (const [keyword, handler] of Object.entries(this.validCommands)) {
      if (command.startsWith(keyword)) {
        return handler(content);
      }
    }
    return '【系统】未知指令，请重新输入';
  }

  private routeEmotionSwitch(emotion: string): string {
    return `【系统】角色情绪已设定为: ${emotion}`;
  }

  private routeStoryInjection(plot: string): string {
    return `【系统】已注入新剧情片段: ${plot}`;
  }

  private routeStatusView(_content: string): string {
    return '【系统】当前状态，阶段-相遇，情绪-平静，角色-艾琳/诺亚';
  }
}

export { InputRouter };
