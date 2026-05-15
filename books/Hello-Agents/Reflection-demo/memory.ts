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

  /**
   * 将所有记忆记录格式转化为一个连贯的字符串文本，用于构件提示词
   * @param str
   */
  getTrajectory(str: string) {
    const trajectoryParts = [];

    for (const record of this.records) {
      if (record?.type === 'execution') {
        trajectoryParts.push(`--- 上一轮尝试（代码）--- \n ${record?.content}`);
      }

      if (record?.type === 'reflection') {
        trajectoryParts.push(`--- 评审员反馈--- \n ${record?.content}`);
      }
    }

    return trajectoryParts.join('\n\n');
  }

  /**
   * 获取最近一次的执行结果
   * 如果不存在，则返回null
   */
  getLastExecution() {
    const newRecords = [...this.records].reverse();

    for (const record of newRecords) {
      if (record?.type === 'execution') {
        return record?.content;
      }
    }

    return null;
  }
}

export { Memory };
