import { ChatCompletionMessageParam } from 'openai/resources/index';

class Memory {
  records: Record<string, string>[] = [];

  /**
   *
   * 初始化一个列表
   * @param recordType
   * @param content
   */
  addRecord(recordType: string, content: string) {
    const record = {
      type: recordType,
      content,
    };

    this.records.push(record);
    console.log(`📝 记忆已更新，新增一条 '${recordType}' 记录。`);
  }

  getTrajectory(str: string) {}
}

export { Memory };
