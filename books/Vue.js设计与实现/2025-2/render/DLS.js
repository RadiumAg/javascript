// 定义状态机的状态
const State = {
  initial: 1, // 初始状态
  tagOpen: 2, // 标签开始状态
  tagName: 3, // 标签名称状态
  text: 4,
  tagEnd: 5,
  tagEndName: 6,
};

function isAlpha(char) {
  return (char > 'a' && char <= 'z') || (char > 'A' && char <= 'Z');
}

function tokenize(str) {
  // 状态机的当前状态：初始状态
  let currentState = State.initial;
  // 用于缓存字符
  const chars = [];
  const tokens = [];

  while (str) {
    const char = str[0];
    switch (currentState) {
      case State.initial:
        // 遇到字符 <
        if (char === '<') {
          currentState = State.tagOpen;
          str = str.slice(1);
          break;
        } else if (isAlpha(char)) {
          // 1. 遇到字符，切换到文本状态
          currentState = State.text;
          // 2. 将当前字母缓存到 char 数组
          chars.push(char);
          // 3. 消费当前字符
          str = str.slice(1);
        }
        break;
        s;

      case State.tagOpen:
        // 遇到字符 <
        if (isAlpha(char)) {
          currentState = State.tagName;
          str = str.slice(1);
        } else if (char === '/') {
          // 1. 遇到字符，切换到文本状态
          currentState = State.text;
          // 2. 将当前字母缓存到 char 数组
          chars.push(char);
          // 3. 消费当前字符
          str = str.slice(1);
        }
        break;

      case State.text:
        if (isAlpha(char)) {
          // 1. 遇到字母，保持状态不变，但应该将当前字符缓存到 chars 数组
          chars.push(char);

          // 2. 消费当前字符
          str = str.slice(1);
        }
    }
  }
}
